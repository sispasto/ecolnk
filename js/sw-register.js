// js/sw-register.js

let swRegistration = null;
let intervalSW = null;
let newVersionAvailable = null;

function iniciarAutoUpdateSW() {
  if (intervalSW) return;

  intervalSW = setInterval(() => {
    if (swRegistration) {
      console.log("🔄 Buscando actualización del SW...");
      swRegistration.update();
    }
  }, 300000); // 5 minutos
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

export function initServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

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
        const versionApp = event.data.version;
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
