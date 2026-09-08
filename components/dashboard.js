// componentes/dashboard.js
import { cargarSubVista, getHome } from "../js/main.js";
import { supabaseClient } from "../js/config.js";

let sidebarToggleListener = null;
let navigationListener = null;
let logoutListener = null;

/**
 * Inicializa los eventos del Dashboard y carga la subvista inicial.
 * @param {HTMLElement} container - El elemento contenedor (#app-root)
 * @param {Object} props - Datos opcionales pasados desde el router
 */
export function init(container, props = {}) {
  const sidebarToggleBtn = container.querySelector("#sidebarToggle");
  const sidebar = container.querySelector("#mainSidebar");
  const navLinks = container.querySelectorAll("[data-vista]");
  const logoutBtn = container.querySelector("#btnLogout");

  // 1. Manejo responsive del Sidebar (Móvil Offcanvas vs Escritorio Collapsed)
  if (sidebarToggleBtn && sidebar) {
    sidebarToggleListener = () => {
      if (window.innerWidth < 992) {
        const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(sidebar);
        bsOffcanvas.toggle();
      } else {
        sidebar.classList.toggle("sidebar-collapsed");
      }
    };
    sidebarToggleBtn.addEventListener("click", sidebarToggleListener);
  }

  // 2. Navegación entre subvistas usando el menú lateral
  if (navLinks.length > 0) {
    navigationListener = (event) => {
      const link = event.target.closest("[data-vista]");
      if (!link) return;

      event.preventDefault();

      // Cambiar estado activo en la UI
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");

      // Cargar la subvista correspondiente dentro de <main id="App">
      const targetVista = link.getAttribute("data-vista");
      cargarSubVista(targetVista);

      // Si está en móvil, oculta el offcanvas al hacer clic en una opción
      if (window.innerWidth < 992 && sidebar) {
        const bsOffcanvas = bootstrap.Offcanvas.getInstance(sidebar);
        if (bsOffcanvas) bsOffcanvas.hide();
      }
    };

    const navContainer = container.querySelector(".offcanvas-body nav");
    if (navContainer) {
      navContainer.addEventListener("click", navigationListener);
    }
  }

  // 3. Manejo del Cierre de Sesión (Logout)
  if (logoutBtn) {
    logoutListener = async (event) => {
      event.preventDefault();

      // Limpieza de autenticación
      sessionStorage.removeItem("ecolnk_user_profile");
      await supabaseClient.auth.signOut();

      // Redirecciona al Login reiniciando el router
      window.location.reload();
    };
    logoutBtn.addEventListener("click", logoutListener);
  }

  // 4. Carga de la vista por defecto dentro del dashboard
  getHome();
}

/**
 * Limpia los event listeners acumulados para evitar fugas de memoria.
 * @param {HTMLElement} container
 */
export function destroy(container) {
  const sidebarToggleBtn = container.querySelector("#sidebarToggle");
  const navContainer = container.querySelector(".offcanvas-body nav");
  const logoutBtn = container.querySelector("#btnLogout");

  if (sidebarToggleBtn && sidebarToggleListener) {
    sidebarToggleBtn.removeEventListener("click", sidebarToggleListener);
  }

  if (navContainer && navigationListener) {
    navContainer.removeEventListener("click", navigationListener);
  }

  if (logoutBtn && logoutListener) {
    logoutBtn.removeEventListener("click", logoutListener);
  }
}
