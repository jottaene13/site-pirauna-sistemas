(function bootstrapPiraunaCms() {
  const settings = Object.assign(
    {
      supabaseUrl: "",
      supabaseAnonKey: "",
      table: "site_content",
      recordId: "main-site"
    },
    window.PIRAUNA_CMS_SETTINGS || {}
  );

  function field(key, label, group, type, defaultValue, bindings) {
    return { key, label, group, type, defaultValue, bindings };
  }

  const FIELDS = [
    field("global.brand_name", "Nome da marca", "Global", "text", "Pirauna Sistemas", [
      { selector: ".site-header .brand-text strong", prop: "text" },
      { selector: ".site-footer .brand-text strong", prop: "text" }
    ]),
    field("global.slogan", "Slogan", "Global", "text", "Automacao e desenvolvimento que transformam", [
      { selector: ".site-header .brand-text small", prop: "text" },
      { selector: ".site-footer .brand-text small", prop: "text" }
    ]),
    field(
      "global.footer_copy",
      "Texto do rodape",
      "Global",
      "textarea",
      "Da estrategia ao codigo, entregamos tecnologia com impacto real no negocio.",
      [{ selector: ".site-footer .footer-copy", prop: "text" }]
    ),
    field("global.footer_social_title", "Titulo redes sociais", "Global", "text", "Redes sociais", [
      { selector: ".site-footer .footer-title", prop: "text" }
    ]),

    field("contact.whatsapp_number", "WhatsApp (55DDDNUMERO)", "Contato e Redes", "text", "5591982937521", []),
    field(
      "contact.whatsapp_message",
      "Mensagem padrao do WhatsApp",
      "Contato e Redes",
      "textarea",
      "Ola, equipe da Pirauna Sistemas! Gostaria de conversar sobre um projeto para minha empresa.",
      []
    ),
    field("contact.email", "E-mail comercial", "Contato e Redes", "email", "contato@piraunasistemas.com.br", []),
    field(
      "contact.instagram",
      "Instagram",
      "Contato e Redes",
      "url",
      "https://www.instagram.com/piraunasistemas/",
      []
    ),
    field("contact.linkedin", "LinkedIn", "Contato e Redes", "url", "", []),
    field("contact.facebook", "Facebook", "Contato e Redes", "url", "", []),
    field("contact.youtube", "YouTube", "Contato e Redes", "url", "", []),
    field(
      "contact.service_hours",
      "Horario de atendimento",
      "Contato e Redes",
      "text",
      "Atendimento de segunda a sexta, das 09h as 18h (horario de Brasilia).",
      [{ selector: "#contact-main .note", prop: "text" }]
    ),

    field("home.hero_eyebrow", "Home - selo topo", "Home", "text", "Sistemas, sites e automacoes", [
      { selector: "#home-hero .eyebrow", prop: "text" }
    ]),
    field(
      "home.hero_title",
      "Home - titulo principal",
      "Home",
      "textarea",
      "Transformamos operacoes complexas em processos digitais simples e escalaveis.",
      [{ selector: "#home-hero h1", prop: "text" }]
    ),
    field(
      "home.hero_lead",
      "Home - descricao principal",
      "Home",
      "textarea",
      "A Pirauna Sistemas atua ao lado da sua empresa para desenhar, desenvolver e evoluir solucoes digitais sob medida. Entregamos tecnologia com foco em eficiencia operacional, crescimento comercial e previsibilidade.",
      [{ selector: "#home-hero .lead", prop: "text" }]
    ),
    field("home.hero_cta_primary", "Home - botao principal", "Home", "text", "Solicitar proposta", [
      { selector: "#home-hero .hero-actions .btn-primary", prop: "text" }
    ]),
    field("home.hero_cta_secondary", "Home - botao secundario", "Home", "text", "Conhecer portfolio", [
      { selector: "#home-hero .hero-actions .btn-ghost", prop: "text" }
    ]),
    field("home.metric_1_value", "Home - metrica 1 valor", "Home", "text", "+50", [
      { selector: "#home-hero .hero-metrics li:nth-child(1) strong", prop: "text" }
    ]),
    field("home.metric_1_label", "Home - metrica 1 texto", "Home", "text", "projetos entregues", [
      { selector: "#home-hero .hero-metrics li:nth-child(1) span", prop: "text" }
    ]),
    field("home.metric_2_value", "Home - metrica 2 valor", "Home", "text", "98%", [
      { selector: "#home-hero .hero-metrics li:nth-child(2) strong", prop: "text" }
    ]),
    field("home.metric_2_label", "Home - metrica 2 texto", "Home", "text", "clientes recorrentes", [
      { selector: "#home-hero .hero-metrics li:nth-child(2) span", prop: "text" }
    ]),
    field("home.metric_3_value", "Home - metrica 3 valor", "Home", "text", "7 dias", [
      { selector: "#home-hero .hero-metrics li:nth-child(3) strong", prop: "text" }
    ]),
    field("home.metric_3_label", "Home - metrica 3 texto", "Home", "text", "para MVP funcional", [
      { selector: "#home-hero .hero-metrics li:nth-child(3) span", prop: "text" }
    ]),
    field("home.panel_title", "Home - titulo lateral", "Home", "text", "O que voce ganha com a Pirauna", [
      { selector: "#home-hero .hero-panel h2", prop: "text" }
    ]),
    field(
      "home.panel_item_1",
      "Home - item lateral 1",
      "Home",
      "text",
      "Estrutura: fluxos claros e gestao mais organizada.",
      [{ selector: "#home-hero .hero-panel li:nth-child(1)", prop: "text" }]
    ),
    field(
      "home.panel_item_2",
      "Home - item lateral 2",
      "Home",
      "text",
      "Velocidade: entregas rapidas com validacao continua.",
      [{ selector: "#home-hero .hero-panel li:nth-child(2)", prop: "text" }]
    ),
    field(
      "home.panel_item_3",
      "Home - item lateral 3",
      "Home",
      "text",
      "Integracao: sistemas conectados com seus processos atuais.",
      [{ selector: "#home-hero .hero-panel li:nth-child(3)", prop: "text" }]
    ),
    field(
      "home.panel_item_4",
      "Home - item lateral 4",
      "Home",
      "text",
      "Escala: base tecnologica pronta para crescer com o negocio.",
      [{ selector: "#home-hero .hero-panel li:nth-child(4)", prop: "text" }]
    ),
    field("home.services_eyebrow", "Home - selo servicos", "Home", "text", "Atuacao", [
      { selector: "#home-services .section-head .eyebrow", prop: "text" }
    ]),
    field(
      "home.services_title",
      "Home - titulo servicos",
      "Home",
      "textarea",
      "Solucoes para presenca digital e eficiencia interna",
      [{ selector: "#home-services .section-head h2", prop: "text" }]
    ),
    field("home.service_1_title", "Home - servico 1 titulo", "Home", "text", "Sites Corporativos", [
      { selector: "#home-services .card:nth-child(1) h3", prop: "text" }
    ]),
    field(
      "home.service_1_desc",
      "Home - servico 1 descricao",
      "Home",
      "textarea",
      "Projetos institucionais com design profissional, performance e foco comercial.",
      [{ selector: "#home-services .card:nth-child(1) p", prop: "text" }]
    ),
    field("home.service_2_title", "Home - servico 2 titulo", "Home", "text", "Sistemas Sob Medida", [
      { selector: "#home-services .card:nth-child(2) h3", prop: "text" }
    ]),
    field(
      "home.service_2_desc",
      "Home - servico 2 descricao",
      "Home",
      "textarea",
      "Plataformas de gestao personalizadas para atendimento, vendas e operacoes.",
      [{ selector: "#home-services .card:nth-child(2) p", prop: "text" }]
    ),
    field("home.service_3_title", "Home - servico 3 titulo", "Home", "text", "Automacao de Processos", [
      { selector: "#home-services .card:nth-child(3) h3", prop: "text" }
    ]),
    field(
      "home.service_3_desc",
      "Home - servico 3 descricao",
      "Home",
      "textarea",
      "Conectamos ferramentas e eliminamos tarefas repetitivas para sua equipe ganhar tempo.",
      [{ selector: "#home-services .card:nth-child(3) p", prop: "text" }]
    ),
    field("home.projects_eyebrow", "Home - selo projetos", "Home", "text", "Projetos recentes", [
      { selector: "#home-projects .section-head .eyebrow", prop: "text" }
    ]),
    field(
      "home.projects_title",
      "Home - titulo projetos",
      "Home",
      "textarea",
      "Resultados construidos em parceria com nossos clientes",
      [{ selector: "#home-projects .section-head h2", prop: "text" }]
    ),
    field("home.cta_eyebrow", "Home - selo CTA final", "Home", "text", "Proximo passo", [
      { selector: "#home-cta .eyebrow", prop: "text" }
    ]),
    field(
      "home.cta_title",
      "Home - titulo CTA final",
      "Home",
      "textarea",
      "Vamos construir a proxima solucao da sua empresa?",
      [{ selector: "#home-cta h2", prop: "text" }]
    ),
    field(
      "home.cta_desc",
      "Home - descricao CTA final",
      "Home",
      "textarea",
      "Converse com a Pirauna Sistemas e receba um plano inicial para seu projeto.",
      [{ selector: "#home-cta p:not(.eyebrow)", prop: "text" }]
    ),
    field("home.cta_primary", "Home - botao CTA final 1", "Home", "text", "Falar no WhatsApp", [
      { selector: "#home-cta .cta-actions .btn-primary", prop: "text" }
    ]),
    field("home.cta_secondary", "Home - botao CTA final 2", "Home", "text", "Ir para contato", [
      { selector: "#home-cta .cta-actions .btn-ghost", prop: "text" }
    ]),

    field("about.hero_eyebrow", "Sobre - selo", "Sobre", "text", "Sobre a Pirauna", [
      { selector: "#about-hero .eyebrow", prop: "text" }
    ]),
    field(
      "about.hero_title",
      "Sobre - titulo",
      "Sobre",
      "textarea",
      "Somos uma parceira estrategica para empresas que precisam transformar tecnologia em resultado.",
      [{ selector: "#about-hero h1", prop: "text" }]
    ),
    field(
      "about.hero_lead",
      "Sobre - descricao",
      "Sobre",
      "textarea",
      "Combinamos visao de negocio, execucao tecnica e acompanhamento proximo para entregar solucoes digitais com impacto mensuravel na operacao e na performance comercial.",
      [{ selector: "#about-hero .lead", prop: "text" }]
    ),
    field("about.story_title", "Sobre - historia titulo", "Sobre", "text", "Nossa historia e o nome Pirauna", [
      { selector: "#about-story .panel:nth-child(1) h2", prop: "text" }
    ]),
    field("about.story_p1", "Sobre - historia paragrafo 1", "Sobre", "textarea", "", [
      { selector: "#about-story .panel:nth-child(1) p:nth-of-type(1)", prop: "text" }
    ]),
    field("about.story_p2", "Sobre - historia paragrafo 2", "Sobre", "textarea", "", [
      { selector: "#about-story .panel:nth-child(1) p:nth-of-type(2)", prop: "text" }
    ]),
    field("about.story_p3", "Sobre - historia paragrafo 3", "Sobre", "textarea", "", [
      { selector: "#about-story .panel:nth-child(1) p:nth-of-type(3)", prop: "text" }
    ]),
    field("about.position_title", "Sobre - posicionamento titulo", "Sobre", "text", "Nosso posicionamento", [
      { selector: "#about-story .panel:nth-child(2) h2", prop: "text" }
    ]),
    field("about.position_p1", "Sobre - posicionamento paragrafo 1", "Sobre", "textarea", "", [
      { selector: "#about-story .panel:nth-child(2) p:nth-of-type(1)", prop: "text" }
    ]),
    field("about.position_p2", "Sobre - posicionamento paragrafo 2", "Sobre", "textarea", "", [
      { selector: "#about-story .panel:nth-child(2) p:nth-of-type(2)", prop: "text" }
    ]),
    field("about.method_eyebrow", "Sobre - metodologia selo", "Sobre", "text", "Metodologia", [
      { selector: "#about-method .eyebrow", prop: "text" }
    ]),
    field("about.method_title", "Sobre - metodologia titulo", "Sobre", "text", "Como conduzimos cada projeto", [
      { selector: "#about-method h2", prop: "text" }
    ]),
    field("about.cta_eyebrow", "Sobre - CTA selo", "Sobre", "text", "Vamos conversar", [
      { selector: "#about-cta .eyebrow", prop: "text" }
    ]),
    field("about.cta_title", "Sobre - CTA titulo", "Sobre", "textarea", "Quer conhecer a Pirauna na pratica?", [
      { selector: "#about-cta h2", prop: "text" }
    ]),
    field(
      "about.cta_desc",
      "Sobre - CTA descricao",
      "Sobre",
      "textarea",
      "Nos conte seu cenario e montamos um plano inicial para o seu projeto.",
      [{ selector: "#about-cta p:not(.eyebrow)", prop: "text" }]
    ),
    field("about.cta_primary", "Sobre - CTA botao 1", "Sobre", "text", "Falar no WhatsApp", [
      { selector: "#about-cta .btn-primary", prop: "text" }
    ]),
    field("about.cta_secondary", "Sobre - CTA botao 2", "Sobre", "text", "Formulario de contato", [
      { selector: "#about-cta .btn-ghost", prop: "text" }
    ]),

    field("products.hero_eyebrow", "Produtos - selo", "Produtos", "text", "Produtos e servicos", [
      { selector: "#products-hero .eyebrow", prop: "text" }
    ]),
    field(
      "products.hero_title",
      "Produtos - titulo",
      "Produtos",
      "textarea",
      "Solucoes digitais para cada etapa da jornada de crescimento da sua empresa.",
      [{ selector: "#products-hero h1", prop: "text" }]
    ),
    field(
      "products.hero_lead",
      "Produtos - descricao",
      "Produtos",
      "textarea",
      "Da presenca digital a gestao operacional, estruturamos tecnologia para gerar produtividade, controle e escala.",
      [{ selector: "#products-hero .lead", prop: "text" }]
    ),
    field("products.services_eyebrow", "Produtos - selo entregas", "Produtos", "text", "Nossas entregas", [
      { selector: "#products-services .section-head .eyebrow", prop: "text" }
    ]),
    field(
      "products.services_title",
      "Produtos - titulo entregas",
      "Produtos",
      "textarea",
      "O que a Pirauna Sistemas pode construir para o seu negocio",
      [{ selector: "#products-services .section-head h2", prop: "text" }
      ]
    ),
    field("products.cta_eyebrow", "Produtos - selo CTA", "Produtos", "text", "Consultoria inicial", [
      { selector: "#products-cta .eyebrow", prop: "text" }
    ]),
    field("products.cta_title", "Produtos - titulo CTA", "Produtos", "textarea", "Precisa decidir por onde comecar?", [
      { selector: "#products-cta h2", prop: "text" }
    ]),
    field(
      "products.cta_desc",
      "Produtos - descricao CTA",
      "Produtos",
      "textarea",
      "Mapeamos seu cenario atual e indicamos a melhor solucao para gerar resultado no curto e medio prazo.",
      [{ selector: "#products-cta p:not(.eyebrow)", prop: "text" }]
    ),
    field("products.cta_primary", "Produtos - botao CTA 1", "Produtos", "text", "Solicitar diagnostico", [
      { selector: "#products-cta .btn-primary", prop: "text" }
    ]),
    field("products.cta_secondary", "Produtos - botao CTA 2", "Produtos", "text", "Falar com especialista", [
      { selector: "#products-cta .btn-ghost", prop: "text" }
    ]),

    field("portfolio.hero_eyebrow", "Portfolio - selo", "Portfolio", "text", "Portfolio", [
      { selector: "#portfolio-hero .eyebrow", prop: "text" }
    ]),
    field(
      "portfolio.hero_title",
      "Portfolio - titulo",
      "Portfolio",
      "textarea",
      "Projetos construidos para resolver desafios reais de operacao e crescimento.",
      [{ selector: "#portfolio-hero h1", prop: "text" }]
    ),
    field(
      "portfolio.hero_lead",
      "Portfolio - descricao",
      "Portfolio",
      "textarea",
      "Cada case da Pirauna Sistemas combina diagnostico estrategico, execucao tecnica e evolucao continua.",
      [{ selector: "#portfolio-hero .lead", prop: "text" }]
    ),
    field("portfolio.cta_eyebrow", "Portfolio - selo CTA", "Portfolio", "text", "Seu proximo case", [
      { selector: "#portfolio-cta .eyebrow", prop: "text" }
    ]),
    field(
      "portfolio.cta_title",
      "Portfolio - titulo CTA",
      "Portfolio",
      "textarea",
      "Vamos estruturar um projeto com foco em resultado?",
      [{ selector: "#portfolio-cta h2", prop: "text" }]
    ),
    field(
      "portfolio.cta_desc",
      "Portfolio - descricao CTA",
      "Portfolio",
      "textarea",
      "Fale com a equipe da Pirauna e receba uma proposta alinhada ao seu cenario.",
      [{ selector: "#portfolio-cta p:not(.eyebrow)", prop: "text" }]
    ),
    field("portfolio.cta_primary", "Portfolio - botao CTA 1", "Portfolio", "text", "Iniciar conversa", [
      { selector: "#portfolio-cta .btn-primary", prop: "text" }
    ]),
    field("portfolio.cta_secondary", "Portfolio - botao CTA 2", "Portfolio", "text", "Enviar briefing", [
      { selector: "#portfolio-cta .btn-ghost", prop: "text" }
    ]),

    field("contact.hero_eyebrow", "Contato - selo", "Contato", "text", "Contato", [
      { selector: "#contact-hero .eyebrow", prop: "text" }
    ]),
    field(
      "contact.hero_title",
      "Contato - titulo",
      "Contato",
      "textarea",
      "Fale com a Pirauna Sistemas e acelere seu projeto digital.",
      [{ selector: "#contact-hero h1", prop: "text" }]
    ),
    field(
      "contact.hero_lead",
      "Contato - descricao",
      "Contato",
      "textarea",
      "Compartilhe seu objetivo e retornamos com um direcionamento tecnico e estrategico para o proximo passo.",
      [{ selector: "#contact-hero .lead", prop: "text" }]
    ),
    field("contact.channels_title", "Contato - titulo canais", "Contato", "text", "Canais de atendimento", [
      { selector: "#contact-main .panel h2", prop: "text" }
    ]),
    field(
      "contact.channels_desc",
      "Contato - descricao canais",
      "Contato",
      "textarea",
      "Escolha o canal que preferir para comecar a conversa com nosso time.",
      [{ selector: "#contact-main .panel > p:first-of-type", prop: "text" }]
    ),
    field("contact.form_title", "Contato - titulo formulario", "Contato", "text", "Envie seu briefing", [
      { selector: "#contact-main .contact-form h2", prop: "text" }
    ]),
    field(
      "contact.form_desc",
      "Contato - descricao formulario",
      "Contato",
      "textarea",
      "Ao enviar, abrimos uma conversa no WhatsApp com sua mensagem ja estruturada.",
      [{ selector: "#contact-main .contact-form > p:first-of-type", prop: "text" }]
    ),
    field("contact.form_label_name", "Contato - label nome", "Contato", "text", "Nome", [
      { selector: "#contact-main label[for=\"nome\"]", prop: "text" }
    ]),
    field("contact.form_placeholder_name", "Contato - placeholder nome", "Contato", "text", "Seu nome", [
      { selector: "#contact-main #nome", prop: "attr:placeholder" }
    ]),
    field("contact.form_label_company", "Contato - label empresa", "Contato", "text", "Empresa", [
      { selector: "#contact-main label[for=\"empresa\"]", prop: "text" }
    ]),
    field("contact.form_placeholder_company", "Contato - placeholder empresa", "Contato", "text", "Nome da empresa", [
      { selector: "#contact-main #empresa", prop: "attr:placeholder" }
    ]),
    field("contact.form_label_goal", "Contato - label objetivo", "Contato", "text", "Objetivo do projeto", [
      { selector: "#contact-main label[for=\"objetivo\"]", prop: "text" }
    ]),
    field(
      "contact.form_placeholder_goal",
      "Contato - placeholder objetivo",
      "Contato",
      "text",
      "Ex.: novo site, sistema interno, automacao",
      [{ selector: "#contact-main #objetivo", prop: "attr:placeholder" }]
    ),
    field("contact.form_label_budget", "Contato - label investimento", "Contato", "text", "Faixa de investimento", [
      { selector: "#contact-main label[for=\"orcamento\"]", prop: "text" }
    ]),
    field("contact.form_budget_option_0", "Contato - opcao investimento 0", "Contato", "text", "Selecione", [
      { selector: "#contact-main #orcamento option:nth-child(1)", prop: "text" }
    ]),
    field("contact.form_budget_option_1", "Contato - opcao investimento 1", "Contato", "text", "Ate R$ 5.000", [
      { selector: "#contact-main #orcamento option:nth-child(2)", prop: "text" }
    ]),
    field("contact.form_budget_option_2", "Contato - opcao investimento 2", "Contato", "text", "R$ 5.000 a R$ 15.000", [
      { selector: "#contact-main #orcamento option:nth-child(3)", prop: "text" }
    ]),
    field("contact.form_budget_option_3", "Contato - opcao investimento 3", "Contato", "text", "R$ 15.000 a R$ 30.000", [
      { selector: "#contact-main #orcamento option:nth-child(4)", prop: "text" }
    ]),
    field("contact.form_budget_option_4", "Contato - opcao investimento 4", "Contato", "text", "Acima de R$ 30.000", [
      { selector: "#contact-main #orcamento option:nth-child(5)", prop: "text" }
    ]),
    field("contact.form_label_details", "Contato - label detalhes", "Contato", "text", "Detalhes", [
      { selector: "#contact-main label[for=\"mensagem\"]", prop: "text" }
    ]),
    field(
      "contact.form_placeholder_details",
      "Contato - placeholder detalhes",
      "Contato",
      "text",
      "Conte mais sobre seu cenario e prazo",
      [{ selector: "#contact-main #mensagem", prop: "attr:placeholder" }]
    ),
    field("contact.form_submit", "Contato - texto botao enviar", "Contato", "text", "Enviar para WhatsApp", [
      { selector: "#contact-main .contact-form button[type=\"submit\"]", prop: "text" }
    ]),

    field("global.nav_home", "Menu - Inicio", "Global", "text", "Inicio", [
      { selector: ".site-nav a[data-nav=\"home\"]", prop: "text" }
    ]),
    field("global.nav_about", "Menu - Sobre", "Global", "text", "Sobre nos", [
      { selector: ".site-nav a[data-nav=\"about\"]", prop: "text" },
      { selector: ".footer-nav a:nth-child(1)", prop: "text" }
    ]),
    field("global.nav_products", "Menu - Produtos", "Global", "text", "Produtos", [
      { selector: ".site-nav a[data-nav=\"services\"]", prop: "text" },
      { selector: ".footer-nav a:nth-child(2)", prop: "text" }
    ]),
    field("global.nav_portfolio", "Menu - Portfolio", "Global", "text", "Portfolio", [
      { selector: ".site-nav a[data-nav=\"portfolio\"]", prop: "text" },
      { selector: ".footer-nav a:nth-child(3)", prop: "text" }
    ]),
    field("global.nav_contact", "Menu - Contato", "Global", "text", "Contato", [
      { selector: ".site-nav a[data-nav=\"contact\"]", prop: "text" },
      { selector: ".footer-nav a:nth-child(4)", prop: "text" }
    ]),
    field("global.nav_whatsapp", "Menu - Botao WhatsApp", "Global", "text", "WhatsApp", [
      { selector: ".site-nav .js-whatsapp", prop: "text" }
    ]),
    field("global.fab_whatsapp", "Botao flutuante WhatsApp", "Global", "text", "WhatsApp", [
      { selector: ".whatsapp-fab", prop: "text" }
    ]),

    field("home.project_1_tag", "Home - case 1 selo", "Home", "text", "Atendimento", [
      { selector: "#home-projects .portfolio-card:nth-child(1) .tag", prop: "text" }
    ]),
    field("home.project_1_title", "Home - case 1 titulo", "Home", "text", "Central de atendimento omnichannel", [
      { selector: "#home-projects .portfolio-card:nth-child(1) h3", prop: "text" }
    ]),
    field(
      "home.project_1_desc",
      "Home - case 1 descricao",
      "Home",
      "textarea",
      "Integracao de canais, organizacao de fila e reducao de tempo de resposta.",
      [{ selector: "#home-projects .portfolio-card:nth-child(1) p", prop: "text" }]
    ),
    field("home.project_2_tag", "Home - case 2 selo", "Home", "text", "Institucional", [
      { selector: "#home-projects .portfolio-card:nth-child(2) .tag", prop: "text" }
    ]),
    field("home.project_2_title", "Home - case 2 titulo", "Home", "text", "Reestruturacao digital para industria", [
      { selector: "#home-projects .portfolio-card:nth-child(2) h3", prop: "text" }
    ]),
    field(
      "home.project_2_desc",
      "Home - case 2 descricao",
      "Home",
      "textarea",
      "Novo posicionamento online, paginas tecnicas e aumento de leads qualificados.",
      [{ selector: "#home-projects .portfolio-card:nth-child(2) p", prop: "text" }]
    ),
    field("home.project_3_tag", "Home - case 3 selo", "Home", "text", "Comercial", [
      { selector: "#home-projects .portfolio-card:nth-child(3) .tag", prop: "text" }
    ]),
    field("home.project_3_title", "Home - case 3 titulo", "Home", "text", "Pipeline automatizado de propostas", [
      { selector: "#home-projects .portfolio-card:nth-child(3) h3", prop: "text" }
    ]),
    field(
      "home.project_3_desc",
      "Home - case 3 descricao",
      "Home",
      "textarea",
      "Mais rastreabilidade da jornada comercial e maior velocidade no fechamento.",
      [{ selector: "#home-projects .portfolio-card:nth-child(3) p", prop: "text" }]
    ),

    field("about.culture_eyebrow", "Sobre - cultura selo", "Sobre", "text", "Cultura", [
      { selector: "#about-culture .section-head .eyebrow", prop: "text" }
    ]),
    field("about.culture_title", "Sobre - cultura titulo", "Sobre", "text", "Principios que guiam nosso trabalho", [
      { selector: "#about-culture .section-head h2", prop: "text" }
    ]),
    field("about.culture_1_title", "Sobre - cultura card 1 titulo", "Sobre", "text", "Visao de negocio", [
      { selector: "#about-culture .card:nth-child(1) h3", prop: "text" }
    ]),
    field(
      "about.culture_1_desc",
      "Sobre - cultura card 1 descricao",
      "Sobre",
      "textarea",
      "Cada decisao tecnica e tomada com foco em eficiencia, crescimento e retorno para a empresa.",
      [{ selector: "#about-culture .card:nth-child(1) p", prop: "text" }]
    ),
    field("about.culture_2_title", "Sobre - cultura card 2 titulo", "Sobre", "text", "Entrega com previsibilidade", [
      { selector: "#about-culture .card:nth-child(2) h3", prop: "text" }
    ]),
    field(
      "about.culture_2_desc",
      "Sobre - cultura card 2 descricao",
      "Sobre",
      "textarea",
      "Planejamento claro, sprints curtas e comunicacao continua durante todo o projeto.",
      [{ selector: "#about-culture .card:nth-child(2) p", prop: "text" }]
    ),
    field("about.culture_3_title", "Sobre - cultura card 3 titulo", "Sobre", "text", "Parceria de longo prazo", [
      { selector: "#about-culture .card:nth-child(3) h3", prop: "text" }
    ]),
    field(
      "about.culture_3_desc",
      "Sobre - cultura card 3 descricao",
      "Sobre",
      "textarea",
      "Continuamos proximos apos o go-live, evoluindo a solucao conforme o negocio evolui.",
      [{ selector: "#about-culture .card:nth-child(3) p", prop: "text" }]
    ),
    field("about.step_1_title", "Sobre - passo 1 titulo", "Sobre", "text", "Imersao", [
      { selector: "#about-method .process-list li:nth-child(1) h3", prop: "text" }
    ]),
    field("about.step_1_desc", "Sobre - passo 1 descricao", "Sobre", "textarea", "", [
      { selector: "#about-method .process-list li:nth-child(1) p", prop: "text" }
    ]),
    field("about.step_2_title", "Sobre - passo 2 titulo", "Sobre", "text", "Estrategia", [
      { selector: "#about-method .process-list li:nth-child(2) h3", prop: "text" }
    ]),
    field("about.step_2_desc", "Sobre - passo 2 descricao", "Sobre", "textarea", "", [
      { selector: "#about-method .process-list li:nth-child(2) p", prop: "text" }
    ]),
    field("about.step_3_title", "Sobre - passo 3 titulo", "Sobre", "text", "Construcao", [
      { selector: "#about-method .process-list li:nth-child(3) h3", prop: "text" }
    ]),
    field("about.step_3_desc", "Sobre - passo 3 descricao", "Sobre", "textarea", "", [
      { selector: "#about-method .process-list li:nth-child(3) p", prop: "text" }
    ]),
    field("about.step_4_title", "Sobre - passo 4 titulo", "Sobre", "text", "Evolucao", [
      { selector: "#about-method .process-list li:nth-child(4) h3", prop: "text" }
    ]),
    field("about.step_4_desc", "Sobre - passo 4 descricao", "Sobre", "textarea", "", [
      { selector: "#about-method .process-list li:nth-child(4) p", prop: "text" }
    ]),

    field("products.card_1_title", "Produtos - card 1 titulo", "Produtos", "text", "Site Institucional Profissional", [
      { selector: "#products-services .card:nth-child(1) h3", prop: "text" }
    ]),
    field("products.card_1_desc", "Produtos - card 1 descricao", "Produtos", "textarea", "", [
      { selector: "#products-services .card:nth-child(1) p", prop: "text" }
    ]),
    field("products.card_2_title", "Produtos - card 2 titulo", "Produtos", "text", "Landing Pages Comerciais", [
      { selector: "#products-services .card:nth-child(2) h3", prop: "text" }
    ]),
    field("products.card_2_desc", "Produtos - card 2 descricao", "Produtos", "textarea", "", [
      { selector: "#products-services .card:nth-child(2) p", prop: "text" }
    ]),
    field("products.card_3_title", "Produtos - card 3 titulo", "Produtos", "text", "Sistema Web Sob Medida", [
      { selector: "#products-services .card:nth-child(3) h3", prop: "text" }
    ]),
    field("products.card_3_desc", "Produtos - card 3 descricao", "Produtos", "textarea", "", [
      { selector: "#products-services .card:nth-child(3) p", prop: "text" }
    ]),
    field("products.card_4_title", "Produtos - card 4 titulo", "Produtos", "text", "Automacao de Processos", [
      { selector: "#products-services .card:nth-child(4) h3", prop: "text" }
    ]),
    field("products.card_4_desc", "Produtos - card 4 descricao", "Produtos", "textarea", "", [
      { selector: "#products-services .card:nth-child(4) p", prop: "text" }
    ]),
    field("products.card_5_title", "Produtos - card 5 titulo", "Produtos", "text", "Dashboards e Inteligencia", [
      { selector: "#products-services .card:nth-child(5) h3", prop: "text" }
    ]),
    field("products.card_5_desc", "Produtos - card 5 descricao", "Produtos", "textarea", "", [
      { selector: "#products-services .card:nth-child(5) p", prop: "text" }
    ]),
    field("products.card_6_title", "Produtos - card 6 titulo", "Produtos", "text", "Suporte e Evolucao Continua", [
      { selector: "#products-services .card:nth-child(6) h3", prop: "text" }
    ]),
    field("products.card_6_desc", "Produtos - card 6 descricao", "Produtos", "textarea", "", [
      { selector: "#products-services .card:nth-child(6) p", prop: "text" }
    ]),
    field("products.model_title", "Produtos - painel modelo titulo", "Produtos", "text", "Modelo de atuacao", [
      { selector: "#products-model .panel:nth-child(1) h2", prop: "text" }
    ]),
    field("products.model_item_1", "Produtos - modelo item 1", "Produtos", "text", "Diagnostico tecnico e de negocio.", [
      { selector: "#products-model .panel:nth-child(1) li:nth-child(1)", prop: "text" }
    ]),
    field("products.model_item_2", "Produtos - modelo item 2", "Produtos", "text", "Roadmap com escopo e prioridades.", [
      { selector: "#products-model .panel:nth-child(1) li:nth-child(2)", prop: "text" }
    ]),
    field(
      "products.model_item_3",
      "Produtos - modelo item 3",
      "Produtos",
      "text",
      "Entrega incremental com validacao continua.",
      [{ selector: "#products-model .panel:nth-child(1) li:nth-child(3)", prop: "text" }]
    ),
    field(
      "products.model_item_4",
      "Produtos - modelo item 4",
      "Produtos",
      "text",
      "Acompanhamento pos-implantacao.",
      [{ selector: "#products-model .panel:nth-child(1) li:nth-child(4)", prop: "text" }]
    ),
    field("products.benefits_title", "Produtos - painel beneficios titulo", "Produtos", "text", "Beneficios para sua empresa", [
      { selector: "#products-model .panel:nth-child(2) h2", prop: "text" }
    ]),
    field("products.benefits_item_1", "Produtos - beneficio item 1", "Produtos", "text", "Reducao de retrabalho operacional.", [
      { selector: "#products-model .panel:nth-child(2) li:nth-child(1)", prop: "text" }
    ]),
    field("products.benefits_item_2", "Produtos - beneficio item 2", "Produtos", "text", "Maior rastreabilidade de dados e processos.", [
      { selector: "#products-model .panel:nth-child(2) li:nth-child(2)", prop: "text" }
    ]),
    field("products.benefits_item_3", "Produtos - beneficio item 3", "Produtos", "text", "Ganhos de produtividade em equipes-chave.", [
      { selector: "#products-model .panel:nth-child(2) li:nth-child(3)", prop: "text" }
    ]),
    field("products.benefits_item_4", "Produtos - beneficio item 4", "Produtos", "text", "Escalabilidade tecnologica com seguranca.", [
      { selector: "#products-model .panel:nth-child(2) li:nth-child(4)", prop: "text" }
    ]),

    field("portfolio.case_1_tag", "Portfolio - case 1 selo", "Portfolio", "text", "Sistema Interno", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(1) .tag", prop: "text" }
    ]),
    field("portfolio.case_1_title", "Portfolio - case 1 titulo", "Portfolio", "text", "Gestao de Atendimento Omnichannel", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(1) h3", prop: "text" }
    ]),
    field("portfolio.case_1_challenge", "Portfolio - case 1 desafio", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(1) p:nth-of-type(1)", prop: "text" }
    ]),
    field("portfolio.case_1_solution", "Portfolio - case 1 solucao", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(1) p:nth-of-type(2)", prop: "text" }
    ]),
    field("portfolio.case_1_impact", "Portfolio - case 1 impacto", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(1) p:nth-of-type(3)", prop: "text" }
    ]),
    field("portfolio.case_2_tag", "Portfolio - case 2 selo", "Portfolio", "text", "Site Corporativo", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(2) .tag", prop: "text" }
    ]),
    field("portfolio.case_2_title", "Portfolio - case 2 titulo", "Portfolio", "text", "Reposicionamento Digital para Industria", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(2) h3", prop: "text" }
    ]),
    field("portfolio.case_2_challenge", "Portfolio - case 2 desafio", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(2) p:nth-of-type(1)", prop: "text" }
    ]),
    field("portfolio.case_2_solution", "Portfolio - case 2 solucao", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(2) p:nth-of-type(2)", prop: "text" }
    ]),
    field("portfolio.case_2_impact", "Portfolio - case 2 impacto", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(2) p:nth-of-type(3)", prop: "text" }
    ]),
    field("portfolio.case_3_tag", "Portfolio - case 3 selo", "Portfolio", "text", "Automacao", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(3) .tag", prop: "text" }
    ]),
    field("portfolio.case_3_title", "Portfolio - case 3 titulo", "Portfolio", "text", "Pipeline de Propostas e Contratos", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(3) h3", prop: "text" }
    ]),
    field("portfolio.case_3_challenge", "Portfolio - case 3 desafio", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(3) p:nth-of-type(1)", prop: "text" }
    ]),
    field("portfolio.case_3_solution", "Portfolio - case 3 solucao", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(3) p:nth-of-type(2)", prop: "text" }
    ]),
    field("portfolio.case_3_impact", "Portfolio - case 3 impacto", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(3) p:nth-of-type(3)", prop: "text" }
    ]),
    field("portfolio.case_4_tag", "Portfolio - case 4 selo", "Portfolio", "text", "Dashboard", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(4) .tag", prop: "text" }
    ]),
    field("portfolio.case_4_title", "Portfolio - case 4 titulo", "Portfolio", "text", "Painel Executivo de Performance", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(4) h3", prop: "text" }
    ]),
    field("portfolio.case_4_challenge", "Portfolio - case 4 desafio", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(4) p:nth-of-type(1)", prop: "text" }
    ]),
    field("portfolio.case_4_solution", "Portfolio - case 4 solucao", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(4) p:nth-of-type(2)", prop: "text" }
    ]),
    field("portfolio.case_4_impact", "Portfolio - case 4 impacto", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(4) p:nth-of-type(3)", prop: "text" }
    ]),
    field("portfolio.case_5_tag", "Portfolio - case 5 selo", "Portfolio", "text", "Integracao", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(5) .tag", prop: "text" }
    ]),
    field("portfolio.case_5_title", "Portfolio - case 5 titulo", "Portfolio", "text", "Conector entre ERP e CRM", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(5) h3", prop: "text" }
    ]),
    field("portfolio.case_5_challenge", "Portfolio - case 5 desafio", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(5) p:nth-of-type(1)", prop: "text" }
    ]),
    field("portfolio.case_5_solution", "Portfolio - case 5 solucao", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(5) p:nth-of-type(2)", prop: "text" }
    ]),
    field("portfolio.case_5_impact", "Portfolio - case 5 impacto", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(5) p:nth-of-type(3)", prop: "text" }
    ]),
    field("portfolio.case_6_tag", "Portfolio - case 6 selo", "Portfolio", "text", "Portal B2B", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(6) .tag", prop: "text" }
    ]),
    field("portfolio.case_6_title", "Portfolio - case 6 titulo", "Portfolio", "text", "Area do Cliente para Distribuidores", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(6) h3", prop: "text" }
    ]),
    field("portfolio.case_6_challenge", "Portfolio - case 6 desafio", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(6) p:nth-of-type(1)", prop: "text" }
    ]),
    field("portfolio.case_6_solution", "Portfolio - case 6 solucao", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(6) p:nth-of-type(2)", prop: "text" }
    ]),
    field("portfolio.case_6_impact", "Portfolio - case 6 impacto", "Portfolio", "textarea", "", [
      { selector: "#portfolio-cases .portfolio-card:nth-child(6) p:nth-of-type(3)", prop: "text" }
    ]),

    field("contact.link_whatsapp", "Contato - link WhatsApp", "Contato", "text", "WhatsApp Comercial", [
      { selector: "#contact-main .contact-links li:nth-child(1) a", prop: "text" }
    ]),
    field("contact.link_instagram", "Contato - link Instagram", "Contato", "text", "Instagram", [
      { selector: "#contact-main .contact-links li:nth-child(2) a", prop: "text" }
    ]),
    field("contact.link_linkedin", "Contato - link LinkedIn", "Contato", "text", "LinkedIn", [
      { selector: "#contact-main .contact-links li:nth-child(3) a", prop: "text" }
    ]),
    field("contact.link_email", "Contato - link Email", "Contato", "text", "E-mail comercial", [
      { selector: "#contact-main .contact-links li:nth-child(4) a", prop: "text" }
    ])
  ];

  let supabaseClient = null;

  function isConfigured() {
    return Boolean(settings.supabaseUrl && settings.supabaseAnonKey);
  }

  function ensureClient() {
    if (!isConfigured()) return null;
    if (!window.supabase || !window.supabase.createClient) return null;
    if (supabaseClient) return supabaseClient;
    supabaseClient = window.supabase.createClient(settings.supabaseUrl, settings.supabaseAnonKey);
    return supabaseClient;
  }

  function getDefaultValues() {
    return FIELDS.reduce((acc, current) => {
      acc[current.key] = current.defaultValue;
      return acc;
    }, {});
  }

  function normalizeValues(input) {
    const defaults = getDefaultValues();
    const output = Object.assign({}, defaults);
    if (!input || typeof input !== "object") return output;
    FIELDS.forEach((fieldDef) => {
      if (Object.prototype.hasOwnProperty.call(input, fieldDef.key)) {
        output[fieldDef.key] = input[fieldDef.key];
      }
    });
    return output;
  }

  function applyBindingValue(element, prop, value) {
    if (value === null || value === undefined) return;
    if (prop === "text") {
      element.textContent = value;
      return;
    }
    if (prop === "html") {
      element.innerHTML = value;
      return;
    }
    if (prop.startsWith("attr:")) {
      element.setAttribute(prop.slice(5), value);
    }
  }

  function applyContent(values) {
    FIELDS.forEach((fieldDef) => {
      const currentValue = values[fieldDef.key];
      if (currentValue === null || currentValue === undefined || currentValue === "") return;
      fieldDef.bindings.forEach((binding) => {
        document.querySelectorAll(binding.selector).forEach((node) => {
          applyBindingValue(node, binding.prop || "text", currentValue);
        });
      });
    });
  }

  async function fetchContent() {
    const defaults = getDefaultValues();
    const client = ensureClient();
    if (!client) return defaults;

    const { data, error } = await client
      .from(settings.table)
      .select("content")
      .eq("id", settings.recordId)
      .maybeSingle();

    if (error) {
      console.warn("CMS: erro ao carregar conteudo", error.message);
      return defaults;
    }

    if (!data || !data.content) {
      return defaults;
    }

    return normalizeValues(data.content);
  }

  async function signIn(email, password) {
    const client = ensureClient();
    if (!client) throw new Error("CMS nao configurado.");
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signOut() {
    const client = ensureClient();
    if (!client) return;
    await client.auth.signOut();
  }

  async function getSession() {
    const client = ensureClient();
    if (!client) return null;
    const { data, error } = await client.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async function saveContent(values) {
    const client = ensureClient();
    if (!client) throw new Error("CMS nao configurado.");

    const payload = {
      id: settings.recordId,
      content: normalizeValues(values)
    };

    const { error } = await client.from(settings.table).upsert(payload, { onConflict: "id" });
    if (error) throw error;
    return payload.content;
  }

  function getFields() {
    return FIELDS.slice();
  }

  window.PIRAUNA_CMS = {
    settings,
    isConfigured,
    getFields,
    getDefaultValues,
    normalizeValues,
    fetchContent,
    applyContent,
    signIn,
    signOut,
    getSession,
    saveContent
  };
})();
