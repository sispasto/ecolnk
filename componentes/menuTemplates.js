export const MENUS = {
  // MENU POR DEFECTO (INVITADO)
  DEFAULT: `
    <ul class="navbar-nav flex-grow-1 pe-3">
      <li class="nav-item">
        <a class="nav-link active" href="#" onclick="PpalMenu.ejecutarAccion(getHome)">
          <i class="bi bi-house"></i> Inicio
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" onclick="showLoginModal()">
          <i class="bi bi-person-lock"></i> Login
        </a>
      </li>
    </ul>`,

  // ROL EMPRESA (Corregido y optimizado)
  EMPRESA: `
    <ul class="navbar-nav flex-grow-1 pe-3 custom-menu">
      <li class="nav-item mb-2">
        <a class="nav-link active d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(getHome)">
          <i class="bi bi-house-door text-primary"></i> <span>Inicio</span>
        </a>
      </li>

      <!-- SECCIÓN COTIZACIONES -->
      <li class="nav-item menu-section">
        <a class="nav-link section-header d-flex justify-content-between align-items-center" 
          href="javascript:void(0)" onclick="PpalMenu.toggleSubMenu('catFinanzas', event)">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-wallet2 text-success"></i> COTIZACIONES
          </span>
          <i class="bi bi-chevron-right chevron-icon" style="font-size: 0.7rem;"></i>
        </a>
        <div class="collapse show" id="catFinanzas">
          <ul class="list-unstyled submenu-list ms-3 border-start border-secondary-subtle">
            <li>
              <a class="nav-link d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(gestionarCotizaciones)">
                <i class="bi bi-file-earmark-text"></i> Crear Cotización
              </a>
            </li>
            <li>
              <a class="nav-link d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(consultarCotizaciones)">
                <i class="bi bi-file-earmark-text"></i> Consultar Cotizaciones
              </a>
            </li>                      
          </ul>
        </div>
      </li>

      <!-- SECCIÓN FACTURAS (Corregido ID a 'catFacturas' y funciones correspondientes) -->
      <li class="nav-item menu-section">
        <a class="nav-link section-header d-flex justify-content-between align-items-center" 
          href="javascript:void(0)" onclick="PpalMenu.toggleSubMenu('catFacturas', event)">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-receipt text-info"></i> FACTURAS
          </span>
          <i class="bi bi-chevron-right chevron-icon" style="font-size: 0.7rem;"></i>
        </a>
        <div class="collapse show" id="catFacturas">
          <ul class="list-unstyled submenu-list ms-3 border-start border-secondary-subtle">
            <li>
              <a class="nav-link d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(gestionarFacturas)">
                <i class="bi bi-file-earmark-plus"></i> Crear Factura
              </a>
            </li>
            <li>
              <a class="nav-link d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(consultarFacturas)">
                <i class="bi bi-file-earmark-spreadsheet"></i> Consultar Facturas
              </a>
            </li>    
            <li>
              <a class="nav-link d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(abonaraFactura)">
                <i class="bi bi-file-earmark-spreadsheet"></i> Abonar a factura
              </a>
            </li>                  
          </ul>
        </div>
      </li>

      <li class="nav-item mt-4 border-top border-secondary pt-3">
        <a class="nav-link d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(showChangePasswordModal)">
          <i class="bi bi-shield-lock"></i> Seguridad
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-danger d-flex align-items-center gap-2" href="#" onclick="logout()">
          <i class="bi bi-power"></i> <span>Finalizar Sesión</span>
        </a>
      </li>
    </ul>`,

  // ROL MENSAJERO
  MENSAJERO: `
    <ul class="navbar-nav flex-grow-1 pe-3 custom-menu">
      <li class="nav-item mb-2">
        <a class="nav-link active d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(getHome)">
          <i class="bi bi-house-door"></i> <span>Inicio</span>
        </a>
      </li>
      <li class="nav-item mb-2">
        <a class="nav-link d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(getPlanillasMensajero)">
          <i class="bi bi-search"></i> <span>Consultar Planillas</span>
        </a>
      </li>
      <li class="nav-item mb-2">
        <a class="nav-link d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(efectividadMensajero)">
          <i class="bi bi-bar-chart-line"></i> <span>Efectividad reparto</span>
        </a>
      </li>
      <li class="nav-item mb-2">
        <a class="nav-link d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(geolocalizar)">
          <i class="bi bi-pin-map"></i> <span>Geolocalizar barrios</span>
        </a>
      </li>
      <li class="nav-item mt-4 border-top border-secondary pt-3">
        <a class="nav-link d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(showChangePasswordModal)">
          <i class="bi bi-key"></i> <span>Cambiar Clave</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-danger d-flex align-items-center gap-2" href="#" onclick="logout()">
          <i class="bi bi-box-arrow-right"></i> <span>Salir</span>
        </a>
      </li>
    </ul>`,

  // ROL ADMINISTRADOR
  ADMIN: `
    <ul class="navbar-nav flex-grow-1 pe-3 custom-menu">
      <li class="nav-item mb-2">
        <a class="nav-link active d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(getHome)">
          <i class="bi bi-shield-check text-success"></i> <span>Inicio (Panel Admin)</span>
        </a>
      </li>
      <li class="nav-item menu-section">
        <a class="nav-link section-header d-flex justify-content-between align-items-center" 
           href="javascript:void(0)" onclick="PpalMenu.toggleSubMenu('catAdminConfig', event)">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-gear-fill"></i> Configuración
          </span>
          <i class="bi bi-chevron-right chevron-icon" style="font-size: 0.7rem;"></i>
        </a>
        <div class="collapse" id="catAdminConfig">
          <ul class="list-unstyled submenu-list ms-3 border-start border-secondary-subtle">
            <li><a class="nav-link" href="#" onclick="PpalMenu.ejecutarAccion(gestionarEmpresas)">Gestionar Empresas</a></li>
            <li><a class="nav-link" href="#" onclick="PpalMenu.ejecutarAccion(configurarTarifas)">Maestro de Tarifas</a></li>
            <li><a class="nav-link" href="#" onclick="PpalMenu.ejecutarAccion(gestionarZonas)">Zonas y Cobertura</a></li>
          </ul>
        </div>
      </li>
      <li class="nav-item menu-section mt-2">
        <a class="nav-link section-header d-flex justify-content-between align-items-center" 
           href="javascript:void(0)" onclick="PpalMenu.toggleSubMenu('catAdminAudit', event)">
          <span class="d-flex align-items-center gap-2">
            <i class="bi bi-journal-text"></i> Auditoría Global
          </span>
          <i class="bi bi-chevron-right chevron-icon" style="font-size: 0.7rem;"></i>
        </a>
        <div class="collapse" id="catAdminAudit">
          <ul class="list-unstyled submenu-list ms-3 border-start border-secondary-subtle">
            <li><a class="nav-link" href="#" onclick="PpalMenu.ejecutarAccion(verLogsSistema)">Logs del Sistema</a></li>
            <li><a class="nav-link" href="#" onclick="PpalMenu.ejecutarAccion(reporteGeneralVentas)">Reporte Consolidado</a></li>
          </ul>
        </div>
      </li>
      <li class="nav-item mt-4 border-top border-secondary pt-3">
        <a class="nav-link d-flex align-items-center gap-2" href="#" onclick="PpalMenu.ejecutarAccion(showChangePasswordModal)">
          <i class="bi bi-lock"></i> Seguridad Admin
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link text-danger d-flex align-items-center gap-2" href="#" onclick="logout()">
          <i class="bi bi-power"></i> <span>Cerrar Sesión</span>
        </a>
      </li>
    </ul>`,
};

const MenuManager = {
  toggleSubMenu: (id, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const elemento = document.getElementById(id);
    if (elemento) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(elemento);
      bsCollapse.toggle();
    }
  },

  ejecutarAccion: (callback) => {
    if (typeof callback === "function") callback();
    const el = document.getElementById("offcanvasDarkNavbar");
    const instance = bootstrap.Offcanvas.getInstance(el);
    if (instance) instance.hide();
  },

  mostrarMenuPorRol: (rol, nombreUsuario = "") => {
    const contenedor = document.querySelector(
      "#offcanvasDarkNavbar .offcanvas-body",
    );
    const tituloMenu = document.getElementById("offcanvasDarkNavbarLabel");
    const textUser = document.getElementById("textUser");

    if (!contenedor) return;

    if (textUser) {
      textUser.innerHTML = `<i class="bi bi-person-circle me-2"></i> ${nombreUsuario.toUpperCase()}`;
      textUser.style.fontSize = "1.1rem";
      textUser.style.letterSpacing = "1px";
    }

    if (tituloMenu) {
      tituloMenu.innerHTML = `<i class="bi bi-person-circle me-2"></i> ${nombreUsuario.toUpperCase()}`;
      tituloMenu.style.fontSize = "1.1rem";
      tituloMenu.style.letterSpacing = "1px";
    }

    const r = Number(rol);
    if (r === 1) contenedor.innerHTML = MENUS.EMPRESA;
    else if (r === 2) contenedor.innerHTML = MENUS.MENSAJERO;
    else if (r === 3) contenedor.innerHTML = MENUS.ADMIN;
    else window.PpalMenu.mostrarMenuInvitado();
  },

  mostrarMenuInvitado: () => {
    const contenedor = document.querySelector(
      "#offcanvasDarkNavbar .offcanvas-body",
    );
    const tituloMenu = document.getElementById("offcanvasDarkNavbarLabel");
    const textUser = document.getElementById("textUser");

    if (tituloMenu) {
      tituloMenu.innerHTML = `<i class="bi bi-building-fill me-2"></i> TALLY`;
      tituloMenu.style.fontSize = "1.1rem";
      tituloMenu.style.letterSpacing = "1px";
    }

    if (contenedor) contenedor.innerHTML = MENUS.DEFAULT;

    if (textUser) {
      textUser.innerHTML = `<i class="bi bi-building-fill me-2"></i> TALLY`;
      textUser.style.fontSize = "1.1rem";
      textUser.style.letterSpacing = "1px";
    }
  },
};

// EXPOSICIÓN GLOBAL UNIFICADA
window.PpalMenu = MenuManager;
