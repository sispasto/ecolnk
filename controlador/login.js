class LoginComponent extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const containerSelector = this.getAttribute("container");
    const container = document.querySelector(containerSelector);

    if (!container) {
      console.error(`Contenedor no encontrado: ${containerSelector}`);
      return;
    }

    try {
      // 1. Cargar la vista de login
      const response = await fetch("authentication/login.html");
      const htmlText = await response.text();

      const template = document.createElement("template");
      template.innerHTML = htmlText;

      // 2. Extraer scripts
      const scripts = template.content.querySelectorAll("script");
      scripts.forEach((script) => script.remove());

      // 3. Renderizar contenido dentro del Custom Element
      this.innerHTML = "";
      this.appendChild(template.content.cloneNode(true));

      // 4. Inyectar scripts dinámicos
      container
        .querySelectorAll('script[data-dynamic="true"]')
        .forEach((s) => s.remove());

      scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        newScript.setAttribute("data-dynamic", "true");
        container.appendChild(newScript);
      });
    } catch (error) {
      console.error("Error al cargar login.html:", error);
    }
  }
}

customElements.define("login-component", LoginComponent);
