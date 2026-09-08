class EditarFacturaComponent extends HTMLElement {
  async connectedCallback() {
    const containerSelector = this.getAttribute("container");
    const container = document.querySelector(containerSelector);

    if (!container) {
      console.error("Contenedor de edición de facturas no encontrado");
      return;
    }

    try {
      // 1. Cargar el HTML de la vista de edición
      const res = await fetch("view/editarFactura.html");
      const html = await res.text();

      const template = document.createElement("template");
      template.innerHTML = html;

      // 2. Extraer y remover scripts para procesarlos
      const scripts = template.content.querySelectorAll("script");
      scripts.forEach((s) => s.remove());

      // 3. Inyectar HTML limpio
      this.innerHTML = "";
      this.appendChild(template.content.cloneNode(true));

      // 4. Limpiar scripts dinámicos previos
      container
        .querySelectorAll("script[data-dynamic]")
        .forEach((s) => s.remove());

      // 5. Inyectar y ejecutar scripts en contexto global
      scripts.forEach((old) => {
        const s = document.createElement("script");
        s.textContent = old.textContent;
        s.setAttribute("data-dynamic", "true");
        container.appendChild(s);
      });
    } catch (e) {
      console.error("Error cargando editarFactura", e);
    }
  }
}

// Registro del Custom Element
customElements.define("editar-factura", EditarFacturaComponent);
