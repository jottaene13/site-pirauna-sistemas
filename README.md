# Piraúna Sistemas - Site Corporativo (Multipágina)

Site institucional em HTML, CSS e JavaScript puro, com identidade visual aplicada a partir do logo da marca.

## Estrutura

- `index.html` - página inicial
- `sobre.html` - sobre a empresa
- `produtos.html` - produtos e serviços
- `portfolio.html` - portfólio
- `contato.html` - contato com formulário para WhatsApp
- `404.html` - página de erro
- `styles.css` - estilo global responsivo
- `script.js` - lógica de navegação, links dinâmicos e formulário
- `assets/images/logo-pirauna.jpg` - logo aplicado no site

## Configuração dos canais oficiais

Edite o objeto `COMPANY_CONFIG` em `script.js`:

- `whatsappNumber` (formato internacional, ex.: `5511999999999`)
- `email`
- `socials.instagram`
- `socials.linkedin`
- `socials.facebook`
- `socials.youtube`

Se uma rede social estiver vazia, o link é ocultado automaticamente.

## Rodar localmente

Você pode abrir qualquer `.html` direto no navegador ou subir um servidor local:

```powershell
python -m http.server 5500
```

Depois acesse:

- `http://localhost:5500/`
- `http://localhost:5500/sobre.html`
- `http://localhost:5500/produtos.html`
- `http://localhost:5500/portfolio.html`
- `http://localhost:5500/contato.html`

## Publicação

### Vercel

O arquivo `vercel.json` já está pronto com rotas limpas:

- `/`
- `/sobre`
- `/produtos`
- `/portfolio`
- `/contato`

### Netlify

O arquivo `netlify.toml` já está incluído com os redirects equivalentes.

### Host compartilhado (cPanel/Hostinger)

Suba todos os arquivos para a raiz pública (`public_html`).
As páginas podem ser acessadas por `*.html`, ou você pode configurar redirects no painel para URLs limpas.

## SEO básico incluído

- `robots.txt`
- `sitemap.xml`
- metatags de descrição e Open Graph nas páginas principais

Antes de publicar em domínio final, ajuste as URLs canônicas e do sitemap para o domínio oficial.
