// components/dashboard.js
import { cargarSubVista, getHome } from "../js/main.js";
import { supabaseClient } from "../js/config.js";

window.dashboardComponent = function () {
  return {
    isCollapsed: false,
    activeVista: "bienvenida",

    init() {
      // Carga automáticamente la subvista inicial al renderizar la estructura
      getHome();
    },

    toggleSidebar() {
      if (window.innerWidth < 992) {
        const sidebarEl = document.getElementById("mainSidebar");
        if (sidebarEl) {
          const bsOffcanvas =
            bootstrap.Offcanvas.getOrCreateInstance(sidebarEl);
          bsOffcanvas.toggle();
        }
      } else {
        this.isCollapsed = !this.isCollapsed;
      }
    },

    navegarA(nombreVista) {
      this.activeVista = nombreVista;
      cargarSubVista(nombreVista);

      // Cierra el offcanvas móvil si está desplegado
      if (window.innerWidth < 992) {
        const sidebarEl = document.getElementById("mainSidebar");
        if (sidebarEl) {
          const bsOffcanvas = bootstrap.Offcanvas.getInstance(sidebarEl);
          if (bsOffcanvas) bsOffcanvas.hide();
        }
      }
    },

    async logout() {
      try {
        sessionStorage.removeItem("ecolnk_user_profile");
        sessionStorage.removeItem("inactivity_timer_enabled");
        await supabaseClient.auth.signOut();
      } catch (err) {
        console.error("Error al cerrar sesión:", err);
      } finally {
        window.location.reload();
      }
    },
  };
};
