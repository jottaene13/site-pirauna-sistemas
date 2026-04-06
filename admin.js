(function initAdminPanel() {
  const cms = window.PIRAUNA_CMS;
  const loginForm = document.getElementById("admin-login-form");
  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");
  const editor = document.getElementById("admin-editor");
  const fieldsRoot = document.getElementById("admin-fields");
  const statusEl = document.getElementById("admin-status");
  const userEl = document.getElementById("admin-user");
  const saveButton = document.getElementById("admin-save");
  const logoutButton = document.getElementById("admin-logout");
  const notConfigured = document.getElementById("cms-not-configured");

  let currentValues = {};
  const fields = cms ? cms.getFields() : [];

  function setStatus(message, kind) {
    statusEl.textContent = message || "";
    statusEl.classList.remove("error", "success");
    if (kind) statusEl.classList.add(kind);
  }

  function groupFieldsBySection() {
    return fields.reduce((acc, field) => {
      if (!acc[field.group]) acc[field.group] = [];
      acc[field.group].push(field);
      return acc;
    }, {});
  }

  function createInput(field, value) {
    if (field.type === "textarea") {
      const textarea = document.createElement("textarea");
      textarea.value = value || "";
      textarea.dataset.key = field.key;
      return textarea;
    }

    const input = document.createElement("input");
    input.type = field.type || "text";
    input.value = value || "";
    input.dataset.key = field.key;
    return input;
  }

  function renderFields(values) {
    fieldsRoot.innerHTML = "";
    const grouped = groupFieldsBySection();

    Object.keys(grouped).forEach((groupName) => {
      const wrapper = document.createElement("section");
      wrapper.className = "admin-group";

      const heading = document.createElement("h2");
      heading.textContent = groupName;
      wrapper.appendChild(heading);

      const grid = document.createElement("div");
      grid.className = "admin-grid";

      grouped[groupName].forEach((field) => {
        const row = document.createElement("div");
        row.className = "admin-field";
        if (field.type === "textarea") {
          row.classList.add("admin-field-wide");
        }

        const label = document.createElement("label");
        label.textContent = field.label;
        row.appendChild(label);

        const input = createInput(field, values[field.key]);
        row.appendChild(input);

        grid.appendChild(row);
      });

      wrapper.appendChild(grid);
      fieldsRoot.appendChild(wrapper);
    });
  }

  function collectValues() {
    const merged = Object.assign({}, cms.getDefaultValues(), currentValues);
    fieldsRoot.querySelectorAll("[data-key]").forEach((element) => {
      merged[element.dataset.key] = element.value;
    });
    return merged;
  }

  function enterEditor(email) {
    loginForm.classList.add("is-hidden");
    editor.classList.remove("is-hidden");
    userEl.textContent = email || "usuario autenticado";
  }

  function leaveEditor() {
    loginForm.classList.remove("is-hidden");
    editor.classList.add("is-hidden");
    userEl.textContent = "-";
    passwordInput.value = "";
  }

  async function loadAndRender() {
    currentValues = await cms.fetchContent();
    renderFields(currentValues);
  }

  async function tryRestoreSession() {
    try {
      const session = await cms.getSession();
      if (!session) return;
      enterEditor(session.user.email);
      await loadAndRender();
      setStatus("Conteudo carregado.", "success");
    } catch (error) {
      setStatus(error.message || "Nao foi possivel restaurar a sessao.", "error");
    }
  }

  if (!cms) {
    setStatus("CMS indisponivel no frontend.", "error");
    loginForm.classList.add("is-hidden");
    return;
  }

  if (!cms.isConfigured()) {
    notConfigured.classList.remove("is-hidden");
    loginForm.classList.add("is-hidden");
    return;
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("Autenticando...");

    try {
      await cms.signIn(emailInput.value.trim(), passwordInput.value);
      const session = await cms.getSession();
      enterEditor(session && session.user ? session.user.email : emailInput.value.trim());
      await loadAndRender();
      setStatus("Login realizado com sucesso.", "success");
    } catch (error) {
      setStatus(error.message || "Falha no login.", "error");
    }
  });

  saveButton.addEventListener("click", async () => {
    setStatus("Salvando alteracoes...");

    try {
      const nextValues = collectValues();
      const saved = await cms.saveContent(nextValues);
      currentValues = saved;
      setStatus("Alteracoes salvas com sucesso.", "success");
    } catch (error) {
      setStatus(error.message || "Falha ao salvar dados.", "error");
    }
  });

  logoutButton.addEventListener("click", async () => {
    await cms.signOut();
    leaveEditor();
    setStatus("Sessao encerrada.");
  });

  tryRestoreSession();
})();
