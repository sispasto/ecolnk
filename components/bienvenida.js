// componentes/bienvenida.js

export function init(container, props) {
  if (props && props.versionApp) {
    const versionLabel = container.querySelector("#version-label");
    if (versionLabel) {
      versionLabel.textContent = `EcoLNK v${props.versionApp}`;
    }
  }
}

export function destroy(container) {
  // Limpieza si esta vista tuviera listeners en window o document
}
