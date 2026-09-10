// components/dashboard.js
import { cargarSubVista, getHome, cargarRaiz } from "../js/main.js";
import { supabaseClient } from "../js/config.js";

window.dashboardComponent = function () {
  return {
    isCollapsed: false,
    activeVista: "bienvenida",

    init() {
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

      if (window.innerWidth < 992) {
        const sidebarEl = document.getElementById("mainSidebar");
        if (sidebarEl) {
          const bsOffcanvas = bootstrap.Offcanvas.getInstance(sidebarEl);
          if (bsOffcanvas) bsOffcanvas.hide();
        }
      }
    },

    async logout() {
      // 1. Limpieza instantánea del almacenamiento local
      sessionStorage.removeItem("ecolnk_user_profile");
      sessionStorage.removeItem("inactivity_timer_enabled");
      localStorage.clear(); // Opcional: elimina tokens residuales

      // 2. Disparar revocación de Supabase en segundo plano (sin await)
      supabaseClient.auth.signOut().catch((err) => {
        console.warn("Advertencia al revocar sesión en servidor:", err);
      });

      // 3. Redirección/Recarga instantánea para el usuario
      cargarRaiz("login");
    },
  };
};
