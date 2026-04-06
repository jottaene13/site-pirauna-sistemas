# Pirauna Sistemas - Site Corporativo com CMS

Site institucional multipagina em HTML/CSS/JS com painel administrativo em `/admin`.
O painel usa Supabase (Auth + Postgres) para editar textos e contatos sem mexer no codigo.

## Estrutura principal

- `index.html`, `sobre.html`, `produtos.html`, `portfolio.html`, `contato.html`
- `admin.html` - painel CMS com login
- `admin.js` - logica do painel
- `cms.js` - schema de campos, leitura/escrita no banco e render no frontend
- `cms-config.js` - configuracao do Supabase (URL e ANON KEY)
- `supabase-cms.sql` - script SQL para criar tabela e politicas
- `script.js` - funcionalidades do site (menu, WhatsApp, formularios)

## Como ativar o CMS (passo a passo)

1. Crie um projeto no Supabase.
2. No Supabase, abra o SQL Editor e execute o arquivo `supabase-cms.sql`.
3. Em `Authentication > Users`, crie o usuario admin (email + senha).
4. Copie do Supabase:
   - Project URL
   - anon public key
5. Preencha `cms-config.js`:

```js
window.PIRAUNA_CMS_SETTINGS = {
  supabaseUrl: "https://SEU-PROJETO.supabase.co",
  supabaseAnonKey: "SUA_ANON_KEY",
  table: "site_content",
  recordId: "main-site"
};
```

6. Publique no Vercel (`git push`).
7. Acesse `https://SEU-DOMINIO/admin` e entre com o usuario admin criado no Supabase.
8. Edite os campos e clique em **Salvar alteracoes**.

## Rodar localmente

```powershell
python -m http.server 5500
```

Rotas locais:

- `http://localhost:5500/`
- `http://localhost:5500/sobre.html`
- `http://localhost:5500/produtos.html`
- `http://localhost:5500/portfolio.html`
- `http://localhost:5500/contato.html`
- `http://localhost:5500/admin.html`

## Publicacao

### Vercel

Configuracao pronta em `vercel.json` com rotas limpas:

- `/`
- `/sobre`
- `/produtos`
- `/portfolio`
- `/contato`
- `/admin`

### Netlify

Configuracao pronta em `netlify.toml`.

## Observacoes de seguranca

- Nunca use a `service_role` no frontend.
- Use apenas `anon key` em `cms-config.js`.
- O acesso de edicao depende de login no Supabase Auth.
