// componentes/login.js
import { cargarRaiz } from "../js/main.js";
import {
  supabaseClient,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
} from "../js/config.js";

export function init(container) {
  // Ya NO reinicializas Supabase aquí, usas la instancia importada

  const togglePassword = container.querySelector("#togglePassword");
  const passwordInput = container.querySelector("#passwordInput");
  const toggleIcon = container.querySelector("#toggleIcon");
  const loginForm = container.querySelector("#loginForm");
  const btnSubmit = container.querySelector("#btnSubmit");
  const loginAlert = container.querySelector("#loginAlert");
  const loginAlertText = container.querySelector("#loginAlertText");
  const rememberMe = container.querySelector("#rememberMe");

  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.getAttribute("type") === "password";
    passwordInput.setAttribute("type", isPassword ? "text" : "password");
    toggleIcon.classList.toggle("bi-eye");
    toggleIcon.classList.toggle("bi-eye-slash");
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = container.querySelector("#userInput").value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      loginAlertText.textContent = "Por favor, ingresa usuario y contraseña.";
      loginAlert.classList.remove("d-none");
      return;
    }

    loginAlert.classList.add("d-none");
    btnSubmit.disabled = true;
    const originalBtnContent = btnSubmit.innerHTML;
    btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Autenticando...`;

    try {
      // Usar directamente el cliente global
      const { data: authData, error: authError } =
        await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

      if (authError || !authData.session) {
        throw new Error("Usuario o contraseña incorrectos.");
      }

      const accessToken = authData.session.access_token;

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/ecolnk_authuser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
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

      sessionStorage.setItem("ecolnk_user_profile", JSON.stringify(result));

      if (!rememberMe.checked) {
        sessionStorage.setItem("inactivity_timer_enabled", "true");
      } else {
        sessionStorage.removeItem("inactivity_timer_enabled");
      }

      cargarRaiz("dashboard");
    } catch (error) {
      loginAlertText.textContent = error.message || "Error de autenticación.";
      loginAlert.classList.remove("d-none");

      btnSubmit.disabled = false;
      btnSubmit.innerHTML = originalBtnContent;
    }
  });
}
