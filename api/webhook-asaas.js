// Webhook ASAAS → ativa usuário no Ploutos.
// Variáveis de ambiente necessárias (Vercel):
//   ASAAS_WEBHOOK_TOKEN   — token configurado no painel ASAAS (webhook > autenticação)
//   PLOUTOS_API_URL       — ex: https://api.seuservidor.com/api/v1
//   PLOUTOS_ACTIVATE_SECRET — mesmo valor do PLOUTOS_ACTIVATE_SECRET no backend Ploutos

const PLAN_MAP = {
  ESSENCIAL: 'BASIC',
  PRO:       'PREMIUM',
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  // Valida token enviado pelo ASAAS no header 'asaas-access-token'
  const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN;
  if (WEBHOOK_TOKEN) {
    const received = req.headers['asaas-access-token'];
    if (received !== WEBHOOK_TOKEN) {
      console.warn('[webhook-asaas] Token inválido recebido:', received);
      return res.status(401).end();
    }
  }

  const event = req.body;
  console.log('[webhook-asaas] Evento:', event?.event, '| Payment:', event?.payment?.id);

  // Processa apenas pagamentos confirmados
  const CONFIRM_EVENTS = ['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'];
  if (!CONFIRM_EVENTS.includes(event?.event)) {
    return res.status(200).json({ received: true, ignored: true });
  }

  const payment = event.payment;
  const externalRef = payment?.externalReference ?? '';

  // externalReference formato: "ESSENCIAL:5511999999999" ou "PRO:5511999999999"
  const [planKey, phone] = externalRef.split(':');
  const plan = PLAN_MAP[planKey?.toUpperCase()];

  if (!plan || !phone) {
    console.warn('[webhook-asaas] externalReference inválido ou ausente:', externalRef);
    // Retorna 200 para evitar reenvio — ativar manualmente via painel admin
    return res.status(200).json({ received: true, ignored: true, reason: 'missing_external_reference' });
  }

  try {
    const PLOUTOS_API_URL    = process.env.PLOUTOS_API_URL;
    const PLOUTOS_SECRET     = process.env.PLOUTOS_ACTIVATE_SECRET;

    if (!PLOUTOS_API_URL || !PLOUTOS_SECRET) {
      console.warn('[webhook-asaas] PLOUTOS_API_URL ou PLOUTOS_ACTIVATE_SECRET não configurados');
      return res.status(200).json({ received: true, ignored: true, reason: 'ploutos_not_configured' });
    }

    const apiRes = await fetch(`${PLOUTOS_API_URL}/users/activate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PLOUTOS_SECRET}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        phone,
        plan,
        asaasCustomerId:     payment.customer,
        asaasSubscriptionId: payment.subscription,
        asaasPaymentId:      payment.id,
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      throw new Error(`Ploutos API retornou ${apiRes.status}: ${errText}`);
    }

    console.log('[webhook-asaas] Usuário ativado:', { phone, plan, customerId: payment.customer });
    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('[webhook-asaas] Erro:', err.message);
    // Retorna 500 para ASAAS reenviar depois
    return res.status(500).json({ error: err.message });
  }
};
