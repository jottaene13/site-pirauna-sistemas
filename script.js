// Configuracoes centrais da marca e canais de contato.
// Preencha whatsappNumber, email e redes assim que tiver os dados oficiais.
const COMPANY_CONFIG = {
  name: "Pirauna Sistemas",
  whatsappNumber: "5591982937521",
  whatsappDefaultMessage: "Ola, equipe da Pirauna Sistemas! Gostaria de conversar sobre um projeto para minha empresa.",
  email: "contato@piraunasistemas.com.br",
  socials: {
    instagram: "https://www.instagram.com/piraunasistemas/",
    linkedin: "",
    facebook: "",
    youtube: ""
  }
};

function createWhatsAppUrl(message) {
  const text = encodeURIComponent(message || COMPANY_CONFIG.whatsappDefaultMessage);
  return `https://wa.me/${COMPANY_CONFIG.whatsappNumber}?text=${text}`;
}

function wireMenu() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (!button || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
  };

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });
}

function wireActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll("[data-nav]").forEach((anchor) => {
    anchor.classList.toggle("is-active", anchor.dataset.nav === page);
  });
}

function wireLocalDevRoutes() {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  if (!isLocal) return;

  const map = {
    "/": "/index.html",
    "/sobre": "/sobre.html",
    "/produtos": "/produtos.html",
    "/portfolio": "/portfolio.html",
    "/contato": "/contato.html"
  };

  document.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute("href");
    if (!href || !map[href]) return;
    anchor.setAttribute("href", map[href]);
  });
}

function wireContactLinks() {
  const hasWhatsApp = /^\d{10,15}$/.test(COMPANY_CONFIG.whatsappNumber);
  const whatsappUrl = hasWhatsApp ? createWhatsAppUrl(COMPANY_CONFIG.whatsappDefaultMessage) : "/contato";

  document.querySelectorAll(".js-whatsapp").forEach((anchor) => {
    anchor.href = whatsappUrl;
    if (hasWhatsApp) {
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    } else {
      anchor.removeAttribute("target");
    }
  });

  document.querySelectorAll("[data-social]").forEach((anchor) => {
    const key = anchor.dataset.social;
    const url = COMPANY_CONFIG.socials[key];
    if (url) {
      anchor.href = url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
    } else {
      anchor.classList.add("is-hidden");
    }
  });

  document.querySelectorAll('[data-email="contact"]').forEach((anchor) => {
    if (COMPANY_CONFIG.email) {
      anchor.href = `mailto:${COMPANY_CONFIG.email}`;
      anchor.textContent = COMPANY_CONFIG.email;
    } else {
      anchor.classList.add("is-hidden");
    }
  });

  const fab = document.querySelector(".whatsapp-fab");
  if (fab && !hasWhatsApp) {
    fab.classList.add("is-hidden");
  }
}

function wireRevealAnimations() {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!revealItems.length) return;
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function wireContactForm() {
  const form = document.getElementById("whatsapp-form");
  if (!form) return;

  const canUseWhatsApp = /^\d{10,15}$/.test(COMPANY_CONFIG.whatsappNumber);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const nome = (data.get("nome") || "").toString().trim();
    const empresa = (data.get("empresa") || "").toString().trim();
    const objetivo = (data.get("objetivo") || "").toString().trim();
    const orcamento = (data.get("orcamento") || "").toString().trim();
    const mensagem = (data.get("mensagem") || "").toString().trim();

    const text = [
      "Ola, equipe da Pirauna Sistemas!",
      "",
      `Nome: ${nome}`,
      `Empresa: ${empresa}`,
      `Objetivo: ${objetivo}`,
      orcamento ? `Faixa de investimento: ${orcamento}` : null,
      mensagem ? `Detalhes: ${mensagem}` : null,
      "",
      "Podemos conversar sobre esse projeto?"
    ]
      .filter(Boolean)
      .join("\n");

    if (canUseWhatsApp) {
      window.open(createWhatsAppUrl(text), "_blank", "noopener,noreferrer");
      form.reset();
      return;
    }

    const fallback = COMPANY_CONFIG.email ? `mailto:${COMPANY_CONFIG.email}` : "/";
    window.location.href = fallback;
  });
}

function wireYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function init() {
  wireLocalDevRoutes();
  wireMenu();
  wireActiveNav();
  wireContactLinks();
  wireRevealAnimations();
  wireContactForm();
  wireYear();
}

document.addEventListener("DOMContentLoaded", init);

