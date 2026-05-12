const ASAAS_BASE =
  process.env.ASAAS_ENVIRONMENT === 'production'
    ? 'https://www.asaas.com/api/v3'
    : 'https://sandbox.asaas.com/api/v3';

const PLANS = {
  essencial: {
    mensal: { value: 24.90,  cycle: 'MONTHLY', description: 'Ploutos Essencial - Mensal' },
    anual:  { value: 249.00, cycle: 'YEARLY',  description: 'Ploutos Essencial - Anual'  },
  },
  pro: {
    mensal: { value: 44.90,  cycle: 'MONTHLY', description: 'Ploutos Pro com IA - Mensal' },
    anual:  { value: 449.00, cycle: 'YEARLY',  description: 'Ploutos Pro com IA - Anual'  },
  },
};

async function asaas(method, path, body) {
  const res = await fetch(`${ASAAS_BASE}${path}`, {
    method,
    headers: {
      'access_token': process.env.ASAAS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.errors?.[0]?.description || `ASAAS erro ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function digits(str) {
  return str.replace(/\D/g, '');
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function findOrCreateCustomer({ name, email, cpfCnpj, mobilePhone }) {
  const search = await asaas('GET', `/customers?cpfCnpj=${cpfCnpj}&limit=1`);
  if (search.data?.length > 0) return search.data[0];
  return asaas('POST', '/customers', { name, email, cpfCnpj, mobilePhone });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nome, email, cpf, whatsapp, plano, metodo, periodo } = req.body || {};

  if (!nome || !email || !cpf || !whatsapp || !plano || !metodo || !periodo) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const planGroup = PLANS[plano];
  if (!planGroup) return res.status(400).json({ error: 'Plano inválido.' });
  const plan = planGroup[periodo];
  if (!plan) return res.status(400).json({ error: 'Período inválido.' });
  if (!['PIX', 'CREDIT_CARD'].includes(metodo)) {
    return res.status(400).json({ error: 'Método de pagamento inválido.' });
  }

  const cpfDigits   = digits(cpf);
  const phoneDigits = digits(whatsapp);

  if (cpfDigits.length !== 11) {
    return res.status(400).json({ error: 'CPF deve ter 11 dígitos.' });
  }
  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    return res.status(400).json({ error: 'WhatsApp inválido (DDD + número).' });
  }

  try {
    const customer = await findOrCreateCustomer({
      name: nome,
      email,
      cpfCnpj:     cpfDigits,
      mobilePhone: phoneDigits,
    });

    const subscription = await asaas('POST', '/subscriptions', {
      customer:         customer.id,
      billingType:      metodo,
      value:            plan.value,
      nextDueDate:      todayISO(),
      cycle:            plan.cycle,
      description:      plan.description,
      externalReference: `${plano.toUpperCase()}:${phoneDigits}`,
    });

    const paymentsRes = await asaas('GET', `/subscriptions/${subscription.id}/payments`);
    const firstPayment = paymentsRes.data?.[0];
    if (!firstPayment) throw new Error('Pagamento não gerado. Tente novamente.');

    if (metodo === 'PIX') {
      const pix = await asaas('GET', `/payments/${firstPayment.id}/pixQrCode`);
      return res.json({
        type:          'pix',
        qrCodeImage:   pix.encodedImage,
        qrCodeText:    pix.payload,
        paymentId:     firstPayment.id,
        subscriptionId: subscription.id,
      });
    } else {
      return res.json({
        type:          'credit_card',
        invoiceUrl:    firstPayment.invoiceUrl,
        subscriptionId: subscription.id,
      });
    }
  } catch (err) {
    console.error('[create-checkout]', err.message);
    return res.status(500).json({ error: err.message || 'Erro ao processar. Tente novamente.' });
  }
};
