class CrearCotizacionComponent extends HTMLElement {
  async connectedCallback() {
    const containerSelector = this.getAttribute("container");
    const container = document.querySelector(containerSelector);

    if (!container) {
      console.error("Contenedor de cotizaciones no encontrado");
      return;
    }

    try {
      // 1. Cargar el HTML de la vista que creamos con estilo Treinta/Tally
      const res = await fetch("view/crearCotizacion.html");
      const html = await res.text();

      const template = document.createElement("template");
      template.innerHTML = html;

      // 2. Extraer y remover los scripts del template para procesarlos después
      const scripts = template.content.querySelectorAll("script");
      scripts.forEach((s) => s.remove());

      // 3. Inyectar el HTML limpio dentro del componente de la cotización
      this.innerHTML = "";
      this.appendChild(template.content.cloneNode(true));

      // 4. Limpiar cualquier script dinámico residual previo en el contenedor principal
      container
        .querySelectorAll("script[data-dynamic]")
        .forEach((s) => s.remove());

      // 5. Volver a inyectar y ejecutar los scripts en el contexto global de la app
      scripts.forEach((old) => {
        const s = document.createElement("script");
        s.textContent = old.textContent;
        s.setAttribute("data-dynamic", "true");
        container.appendChild(s);
      });

      // 6. Inicializar y limpiar el formulario para arrancar desde ceros
      setTimeout(() => {
        if (typeof nsCrearCotizacion !== "undefined") {
          nsCrearCotizacion.limpiarFormulario();
        }
      }, 50);
    } catch (e) {
      console.error("Error cargando crearCotizacion", e);
    }
  }
}

// Registro del Custom Element en el DOM global
customElements.define("crear-cotizacion", CrearCotizacionComponent);
