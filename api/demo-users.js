// Proxy seguro para gerenciar contas demo do Ploutos.
// Variáveis de ambiente necessárias (Vercel):
//   DEMO_ADMIN_PASSWORD    — senha que você define para acessar a página admin
//   PLOUTOS_API_URL        — ex: https://api.piraunasistemas.com.br/api/v1
//   PLOUTOS_ACTIVATE_SECRET — mesmo valor configurado no backend Ploutos

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const ADMIN_PASSWORD  = process.env.DEMO_ADMIN_PASSWORD;
  const PLOUTOS_API_URL = process.env.PLOUTOS_API_URL;
  const PLOUTOS_SECRET  = process.env.PLOUTOS_ACTIVATE_SECRET;

  const { password, phone, action } = req.body ?? {};

  if (!ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, error: 'Senha incorreta.' });
  }

  if (!phone || !['add', 'remove'].includes(action)) {
    return res.status(400).json({ ok: false, error: 'Dados inválidos.' });
  }

  if (!PLOUTOS_API_URL || !PLOUTOS_SECRET) {
    return res.status(500).json({ ok: false, error: 'Servidor não configurado.' });
  }

  try {
    const apiRes = await fetch(`${PLOUTOS_API_URL}/admin/demo-users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PLOUTOS_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, action }),
    });

    const data = await apiRes.json().catch(() => ({}));
    return res.status(apiRes.ok ? 200 : apiRes.status).json(data);
  } catch (err) {
    console.error('[demo-users] Erro:', err.message);
    return res.status(500).json({ ok: false, error: 'Falha ao conectar ao servidor Ploutos.' });
  }
};
