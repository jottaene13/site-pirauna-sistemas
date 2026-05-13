// Webhook ASAAS → ativa/desativa usuário no Ploutos.
// Variáveis de ambiente necessárias (Vercel):
//   ASAAS_WEBHOOK_TOKEN     — token configurado no painel ASAAS (webhook > autenticação)
//   PLOUTOS_API_URL         — ex: https://api.seuservidor.com/api/v1
//   PLOUTOS_ACTIVATE_SECRET — mesmo valor do PLOUTOS_ACTIVATE_SECRET no backend Ploutos

const PLAN_MAP = {
  ESSENCIAL: 'BASIC',
  PRO:       'PREMIUM',
};

const ACTIVATE_EVENTS   = ['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'];
const DEACTIVATE_EVENTS = ['PAYMENT_OVERDUE', 'PAYMENT_DELETED'];

function extractExternalRef(event) {
  return event?.payment?.externalReference
    ?? event?.subscription?.externalReference
    ?? '';
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN;
  if (WEBHOOK_TOKEN) {
    const received = req.headers['asaas-access-token'];
    if (received !== WEBHOOK_TOKEN) {
      console.warn('[webhook-asaas] Token inválido recebido:', received);
      return res.status(401).end();
    }
  }

  const event = req.body;
  const eventType = event?.event;
  console.log('[webhook-asaas] Evento:', eventType, '| Payment:', event?.payment?.id);

  const PLOUTOS_API_URL = process.env.PLOUTOS_API_URL;
  const PLOUTOS_SECRET  = process.env.PLOUTOS_ACTIVATE_SECRET;

  if (!PLOUTOS_API_URL || !PLOUTOS_SECRET) {
    console.warn('[webhook-asaas] PLOUTOS_API_URL ou PLOUTOS_ACTIVATE_SECRET não configurados');
    return res.status(200).json({ received: true, ignored: true, reason: 'ploutos_not_configured' });
  }

  // ── ATIVAÇÃO ──────────────────────────────────────────────────────────────
  if (ACTIVATE_EVENTS.includes(eventType)) {
    const payment     = event.payment;
    const externalRef = extractExternalRef(event);
    const [planKey, phone] = externalRef.split(':');
    const plan = PLAN_MAP[planKey?.toUpperCase()];

    if (!plan || !phone) {
      console.warn('[webhook-asaas] externalReference inválido:', externalRef);
      return res.status(200).json({ received: true, ignored: true, reason: 'missing_external_reference' });
    }

    try {
      const apiRes = await fetch(`${PLOUTOS_API_URL}/users/activate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${PLOUTOS_SECRET}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          plan,
          asaasCustomerId:     payment?.customer,
          asaasSubscriptionId: payment?.subscription,
          asaasPaymentId:      payment?.id,
        }),
      });

      if (!apiRes.ok) throw new Error(`Ploutos API retornou ${apiRes.status}: ${await apiRes.text()}`);
      console.log('[webhook-asaas] Usuário ativado:', { phone, plan });
      return res.status(200).json({ received: true });
    } catch (err) {
      console.error('[webhook-asaas] Erro ao ativar:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // ── DESATIVAÇÃO ───────────────────────────────────────────────────────────
  if (DEACTIVATE_EVENTS.includes(eventType)) {
    const externalRef = extractExternalRef(event);
    const [, phone] = externalRef.split(':');

    if (!phone) {
      console.warn('[webhook-asaas] externalReference ausente para desativação:', externalRef);
      return res.status(200).json({ received: true, ignored: true, reason: 'missing_external_reference' });
    }

    const status = eventType === 'PAYMENT_OVERDUE' ? 'PAUSED' : 'CANCELLED';
    // PAYMENT_DELETED: disparado quando assinatura é cancelada (pagamentos pendentes são deletados)

    try {
      const apiRes = await fetch(`${PLOUTOS_API_URL}/users/deactivate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${PLOUTOS_SECRET}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, status }),
      });

      if (!apiRes.ok) throw new Error(`Ploutos API retornou ${apiRes.status}: ${await apiRes.text()}`);
      console.log('[webhook-asaas] Usuário desativado:', { phone, status });
      return res.status(200).json({ received: true });
    } catch (err) {
      console.error('[webhook-asaas] Erro ao desativar:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(200).json({ received: true, ignored: true });
};
