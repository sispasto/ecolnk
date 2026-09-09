// components/login.js
import { cargarRaiz } from "../js/main.js";
import {
  supabaseClient,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} from "../js/config.js";

// Registro del componente en window para Alpine.js
window.loginComponent = function () {
  return {
    email: "",
    password: "",
    rememberMe: false,
    showPassword: false,
    loading: false,
    errorMessage: "",

    // Alternar visibilidad de contraseña
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    // Manejo del submit del formulario
    async handleSubmit() {
      this.errorMessage = "";
      this.loading = true;

      try {
        // 1. Autenticación con Supabase
        const { data: authData, error: authError } =
          await supabaseClient.auth.signInWithPassword({
            email: this.email,
            password: this.password,
          });

        if (authError || !authData.session) {
          throw new Error("Usuario o contraseña incorrectos.");
        }

        // 2. Consulta de perfil de usuario
        const response = await fetch(
          `${SUPABASE_URL}/functions/v1/ecolnk_authuser`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authData.session.access_token}`,
              apikey: SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({ action: "get_profile" }),
          },
        );

        const result = await response.json();

        if (!response.ok || result.status !== "success") {
          throw new Error(
            result.message || "Error al recuperar perfil del usuario.",
          );
        }

        // 3. Guardado de estado de sesión
        sessionStorage.setItem("ecolnk_user_profile", JSON.stringify(result));

        if (!this.rememberMe) {
          sessionStorage.setItem("inactivity_timer_enabled", "true");
        } else {
          sessionStorage.removeItem("inactivity_timer_enabled");
        }

        // 4. Redirección al Dashboard
        cargarRaiz("dashboard");
      } catch (error) {
        this.errorMessage = error.message || "Error de autenticación.";
      } finally {
        this.loading = false;
      }
    },
  };
};
