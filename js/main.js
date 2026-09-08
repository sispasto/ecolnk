// js/main.js
import { supabaseClient } from "./config.js";

/* ==========================================
   ESTADO GLOBAL Y SERVICE WORKER
========================================== */
const templateCache = {};
var arrayGlobal = [];
var folderPathIMG = "";
var versionApp = localStorage.getItem("app_version") || "";
let swRegistration = null;
let intervalSW = null;
let newVersionAvailable = null;

let moduloRaizActivo = null;
let moduloSubVistaActivo = null;

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
   SISTEMA DE RUTAS Y CARGA DINÁMICA
========================================== */

// 1. Carga el nivel superior (#app-root): 'login' o 'dashboard'
export async function cargarRaiz(nombreVista, props = {}) {
  const rootContainer = document.getElementById("app-root");
  if (!rootContainer) return;

  try {
    if (moduloRaizActivo && typeof moduloRaizActivo.destroy === "function") {
      moduloRaizActivo.destroy(rootContainer);
    }
    moduloRaizActivo = null;

    const responseHtml = await fetch(`views/${nombreVista}.html`);
    if (!responseHtml.ok)
      throw new Error(`No se pudo cargar views/${nombreVista}.html`);

    rootContainer.innerHTML = await responseHtml.text();

    try {
      const modulo = await import(
        `../components/${nombreVista}.js?v=${Date.now()}`
      );
      if (modulo && typeof modulo.init === "function") {
        modulo.init(rootContainer, props);
        moduloRaizActivo = modulo;
      }
    } catch (errJs) {
      console.log(
        `Componente components/${nombreVista}.js es estático o no existe.`,
      );
    }
  } catch (error) {
    console.error("Error al cargar la raíz:", error);
  }
}

// 2. Carga vistas internas del menú dentro del dashboard (<main id="App">)
export async function cargarSubVista(nombreVista, props = {}) {
  const container = document.getElementById("App");
  if (!container) return;

  try {
    if (
      moduloSubVistaActivo &&
      typeof moduloSubVistaActivo.destroy === "function"
    ) {
      moduloSubVistaActivo.destroy(container);
    }
    moduloSubVistaActivo = null;

    const responseHtml = await fetch(`views/${nombreVista}.html`);
    if (!responseHtml.ok)
      throw new Error(`No se pudo cargar views/${nombreVista}.html`);

    container.innerHTML = await responseHtml.text();

    try {
      const modulo = await import(
        `../components/${nombreVista}.js?v=${Date.now()}`
      );
      if (modulo && typeof modulo.init === "function") {
        modulo.init(container, props);
        moduloSubVistaActivo = modulo;
      }
    } catch (errJs) {
      console.log(
        `Subvista components/${nombreVista}.js es estática o no existe.`,
      );
    }
  } catch (error) {
    console.error("Error al cargar la subvista:", error);
    container.innerHTML = `<div class="alert alert-danger p-3">Error al cargar la vista.</div>`;
  }
}

// 3. Evalúa si el usuario está autenticado
export function inicializarRouter() {
  const userProfile = sessionStorage.getItem("ecolnk_user_profile");

  if (!userProfile) {
    cargarRaiz("login");
  } else {
    cargarRaiz("dashboard");
  }
}

// Función expuesta para volver al home desde la navegación del Dashboard
export function getHome() {
  const currentVersion = localStorage.getItem("app_version") || "2.5";
  cargarSubVista("bienvenida", { versionApp: currentVersion });
}

/* ==========================================
   AUTO UPDATE SERVICE WORKER
========================================== */
function iniciarAutoUpdateSW() {
  if (intervalSW) return;

  intervalSW = setInterval(() => {
    if (swRegistration) {
      console.log("🔄 Buscando actualización del SW...");
      swRegistration.update();
    }
  }, 300000);
}

function mostrarBotonActualizacion() {
  let btn = document.getElementById("btn-update-app");

  if (!btn) {
    btn = document.createElement("button");
    btn.id = "btn-update-app";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = "9999";
    btn.style.padding = "10px 15px";
    btn.style.background = "#0d6efd";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "8px";

    document.body.appendChild(btn);
  }

  btn.innerText = newVersionAvailable
    ? `Actualizar a versión ${newVersionAvailable}`
    : "Nueva versión disponible";

  btn.onclick = () => {
    if (swRegistration && swRegistration.waiting) {
      if (newVersionAvailable) {
        localStorage.setItem("app_version", newVersionAvailable);
      }
      swRegistration.waiting.postMessage({ action: "SKIP_WAITING" });
    }
  };
}

/* ==========================================
   INICIALIZACIÓN DE LA APLICACIÓN
========================================== */
document.addEventListener("DOMContentLoaded", async function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js", {
        scope: "./",
        updateViaCache: "none",
      })
      .then((reg) => {
        swRegistration = reg;
        iniciarAutoUpdateSW();

        navigator.serviceWorker.ready.then((regReady) => {
          if (regReady.active && navigator.serviceWorker.controller) {
            regReady.active.postMessage("GET_VERSION");
          }
        });

        if (reg.waiting && navigator.serviceWorker.controller) {
          mostrarBotonActualizacion();
        }

        reg.onupdatefound = () => {
          const newSW = reg.installing;
          if (!newSW) return;

          newSW.onstatechange = () => {
            if (
              newSW.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              newSW.postMessage("GET_VERSION");
              if (reg.waiting) {
                mostrarBotonActualizacion();
              }
            }
          };
        };
      })
      .catch((error) => console.error("Error al registrar el SW:", error));

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data.type === "VERSION") {
        if (swRegistration && swRegistration.waiting) {
          newVersionAvailable = event.data.version;
          mostrarBotonActualizacion();
        } else {
          versionApp = event.data.version;
          localStorage.setItem("app_version", versionApp);

          const label = document.getElementById("version-label");
          if (label) {
            label.textContent = `Tally v${versionApp}`;
          }
        }
      }
    });

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && swRegistration) {
        swRegistration.update();
      }
    });
  }

  // Carga inicial: decide si mostrar Login o Dashboard
  inicializarRouter();
});
