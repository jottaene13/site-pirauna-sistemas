// ASAAS → Ploutos webhook
// Recebe eventos de pagamento do ASAAS e ativa/desativa assinaturas no Ploutos.
// externalReference enviado no checkout: "ESSENCIAL:11987654321" | "PRO:..." | "EMPRESARIAL:..."

const PLOUTOS_API_URL = process.env.PLOUTOS_API_URL;        // ex: https://api.piraunasistemas.com.br
const PLOUTOS_ACTIVATE_SECRET = process.env.PLOUTOS_ACTIVATE_SECRET;
const ASAAS_WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN; // token configurado no painel ASAAS

const PLAN_MAP = {
  ESSENCIAL: 'BASIC',
  PRO: 'PREMIUM',
  EMPRESARIAL: 'EMPRESARIAL',
};

function parseRef(ref) {
  if (!ref || typeof ref !== 'string') return null;
  const sep = ref.lastIndexOf(':');
  if (sep === -1) return null;
  const planKey = ref.slice(0, sep);
  const phone = ref.slice(sep + 1);
  const plan = PLAN_MAP[planKey];
  if (!plan || !phone) return null;
  return { plan, phone };
}

async function callPloutos(path, body) {
  const res = await fetch(`${PLOUTOS_API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PLOUTOS_ACTIVATE_SECRET}`,
    },
    body: JSON.stringify(body),
  });
  return res;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  // Valida token do ASAAS (cabeçalho asaas-access-token)
  if (ASAAS_WEBHOOK_TOKEN) {
    const token = req.headers['asaas-access-token'];
    if (token !== ASAAS_WEBHOOK_TOKEN) {
      console.warn('[asaas-webhook] Token inválido recebido');
      return res.status(401).json({ ok: false });
    }
  }

  const { event, payment, subscription } = req.body || {};
  console.log('[asaas-webhook] evento:', event);

  try {
    // ── ATIVAR ───────────────────────────────────────────────────────────────
    if (event === 'PAYMENT_CONFIRMED' || event === 'PAYMENT_RECEIVED') {
      const ref = payment?.externalReference;
      const parsed = parseRef(ref);
      if (!parsed) {
        console.log('[asaas-webhook] sem externalReference válido, ignorando');
        return res.status(200).json({ ok: true, skipped: 'no_ref' });
      }

      await callPloutos('/api/v1/users/activate', {
        phone: parsed.phone,
        plan: parsed.plan,
        asaasCustomerId: payment.customer,
        asaasSubscriptionId: payment.subscription,
        asaasPaymentId: payment.id,
      });

      console.log('[asaas-webhook] ativado:', parsed.phone, parsed.plan);
      return res.status(200).json({ ok: true });
    }

    // ── DESATIVAR (cancelamento) ──────────────────────────────────────────────
    if (event === 'SUBSCRIPTION_DELETED' || event === 'PAYMENT_DELETED' || event === 'PAYMENT_REFUNDED' || event === 'PAYMENT_CHARGEBACK_REQUESTED') {
      const source = subscription ?? payment;
      const ref = source?.externalReference;
      const parsed = parseRef(ref);
      if (!parsed) return res.status(200).json({ ok: true, skipped: 'no_ref' });

      await callPloutos('/api/v1/users/deactivate', {
        phone: parsed.phone,
        status: 'CANCELLED',
      });

      console.log('[asaas-webhook] cancelado:', parsed.phone);
      return res.status(200).json({ ok: true });
    }

    // ── DESATIVAR (inadimplência) ─────────────────────────────────────────────
    if (event === 'PAYMENT_OVERDUE') {
      const ref = payment?.externalReference;
      const parsed = parseRef(ref);
      if (!parsed) return res.status(200).json({ ok: true, skipped: 'no_ref' });

      await callPloutos('/api/v1/users/deactivate', {
        phone: parsed.phone,
        status: 'PAUSED',
      });

      console.log('[asaas-webhook] pausado por inadimplência:', parsed.phone);
      return res.status(200).json({ ok: true });
    }

    // Evento não tratado — responder 200 para o ASAAS não retentar
    return res.status(200).json({ ok: true, skipped: 'unhandled_event', event });

  } catch (err) {
    console.error('[asaas-webhook] erro:', err.message);
    // Retorna 500 para o ASAAS retentar automaticamente
    return res.status(500).json({ ok: false, error: err.message });
  }
};
