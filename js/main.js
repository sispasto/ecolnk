// js/main.js
import { initServiceWorker } from "./sw-register.js";

/* ==========================================
   UTILIDADES DE UI GLOBALES
========================================== */
export function crearLoader() {
  eliminarLoader();
  let containerloader = document.createElement("div");
  containerloader.id = "containerloader";
  let loader = document.createElement("div");
  loader.id = "loader";
  for (let i = 0; i < 4; i++) {
    loader.appendChild(document.createElement("div"));
  }
  loader.classList.add("lds-roller");
  containerloader.appendChild(loader);
  document.body.appendChild(containerloader);
}

export function eliminarLoader() {
  let loader = document.getElementById("containerloader");
  if (loader) loader.remove();
}

export function cerrarModalesActivos() {
  const allModals = document.querySelectorAll(".modal.show");
  allModals.forEach((modal) => {
    const instance = bootstrap.Modal.getInstance(modal);
    if (instance) instance.hide();
  });
}

export function alertSMS(texto) {
  const myToast = document.getElementById("liveToast");
  if (!myToast) return;
  const smsToast = myToast.querySelector(".toast-body");

  smsToast.innerHTML = texto;
  const container = myToast.closest(".position-fixed");
  if (container) {
    container.style.zIndex = "1090";
  }

  const toast = new bootstrap.Toast(myToast);
  toast.show();
}

/* ==========================================
   SISTEMA DE RUTAS (100% ALPINE.JS)
========================================== */

export async function cargarRaiz(nombreVista, props = {}) {
  const rootContainer = document.getElementById("app-root");
  if (!rootContainer) return;

  try {
    const responseHtml = await fetch(`views/${nombreVista}.html`);
    if (!responseHtml.ok)
      throw new Error(`No se pudo cargar views/${nombreVista}.html`);

    const html = await responseHtml.text();

    // 1. Cargar e importar el archivo JS usando la ruta desde la raíz (/)
    try {
      await import(`/components/${nombreVista}.js?v=${Date.now()}`);
    } catch (errJs) {
      console.warn(
        `Vista ${nombreVista} es estática o falló la carga del JS:`,
        errJs,
      );
    }

    // 2. Inyectar el HTML SOLO DESPUÉS de haber cargado el script en window
    rootContainer.innerHTML = html;

    // 3. Inicializar el árbol de Alpine
    if (window.Alpine) {
      window.Alpine.initTree(rootContainer);
    } else {
      document.addEventListener("alpine:init", () => {
        window.Alpine.initTree(rootContainer);
      });
    }
  } catch (error) {
    console.error("Error al cargar la raíz:", error);
  }
}

export async function cargarSubVista(nombreVista, props = {}) {
  const container = document.getElementById("App");
  if (!container) return;

  try {
    const responseHtml = await fetch(`views/${nombreVista}.html`);
    if (!responseHtml.ok)
      throw new Error(`No se pudo cargar views/${nombreVista}.html`);

    const html = await responseHtml.text();

    try {
      await import(`/components/${nombreVista}.js?v=${Date.now()}`);
    } catch (errJs) {
      console.warn(`Subvista ${nombreVista} es estática o no requiere JS.`);
    }

    container.innerHTML = html;

    if (window.Alpine) {
      window.Alpine.initTree(container);
    } else {
      document.addEventListener("alpine:init", () => {
        window.Alpine.initTree(container);
      });
    }
  } catch (error) {
    console.error("Error al cargar la subvista:", error);
    container.innerHTML = `<div class="alert alert-danger p-3">Error al cargar la vista.</div>`;
  }
}

export function inicializarRouter() {
  const userProfile = sessionStorage.getItem("ecolnk_user_profile");

  if (!userProfile) {
    cargarRaiz("login");
  } else {
    cargarRaiz("dashboard");
  }
}

export function getHome() {
  const currentVersion = localStorage.getItem("app_version") || "1.0";
  cargarSubVista("bienvenida", { versionApp: currentVersion });
}

/* ==========================================
   INICIALIZACIÓN DE LA APLICACIÓN
========================================== */
document.addEventListener("DOMContentLoaded", function () {
  initServiceWorker();
  inicializarRouter();
});
