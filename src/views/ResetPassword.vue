<template>
  <div class="usuarios-container">
    <div class="usuarios-table-container shadow-sm">
      <h1 class="usuarios-title">Restablecer Contraseña</h1>
      <p class="usuarios-subtitle">
        Ingresa tu nueva contraseña para completar el proceso.
      </p>

      <!-- SPINNER -->
      <div v-if="cargando" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <!-- FORMULARIO -->
      <div v-else>
        <div class="card-body">
          <!-- Nueva contraseña -->
          <div class="form-floating mb-3 position-relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              class="form-control"
              placeholder="Nueva contraseña"
              required
            />
            <label for="password">Nueva contraseña</label>
            <button
              type="button"
              class="btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
              @click="togglePasswordVisibility"
            >
              <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
            </button>
          </div>

          <!-- Confirmar contraseña -->
          <div class="form-floating mb-3 position-relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              v-model="confirmPassword"
              class="form-control"
              placeholder="Confirmar contraseña"
              required
            />
            <label for="confirmPassword">Confirmar contraseña</label>
            <button
              type="button"
              class="btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
              @click="toggleConfirmPasswordVisibility"
            >
              <i :class="showConfirmPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
            </button>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <button class="btn-guardar" @click="restablecerPassword">
              <i class="fas fa-key me-1"></i> Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mostrarAlerta } from "@/functions.js";
import { resetPassword } from "@/services/password";

export default {
  name: "ResetPassword",
  data() {
    return {
      password: "",
      confirmPassword: "",
      token: "",
      cargando: false,
      showPassword: false,
      showConfirmPassword: false,
    };
  },
  mounted() {
    // ✅ Obtener token desde la URL (por parámetro dinámico)
    this.token = this.$route.params.token;

    if (!this.token) {
      mostrarAlerta("Token no válido o expirado", "warning", "Intenta solicitar uno nuevo.");
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    async restablecerPassword() {
      if (!this.password || !this.confirmPassword) {
        await mostrarAlerta("Por favor completa todos los campos", "info");
        return;
      }

      if (this.password !== this.confirmPassword) {
        await mostrarAlerta("Las contraseñas no coinciden", "warning");
        return;
      }

      this.cargando = true;
      try {
        await resetPassword(this.token, this.password);

        // ✅ Ocultamos el spinner antes de mostrar el mensaje
        this.cargando = false;

        await mostrarAlerta(
          "Contraseña restablecida correctamente",
          "success",
          "Ahora puedes iniciar sesión con tu nueva contraseña."
        );

        setTimeout(() => {
          this.$router.push("/login");
        }, 1500);
      } catch (error) {
        console.error("❌ Error al restablecer contraseña:", error);

        // ✅ Ocultamos el spinner antes del mensaje de error
        this.cargando = false;

        await mostrarAlerta(
          "Error al restablecer la contraseña",
          "danger",
          "El token no es válido o ha expirado."
        );
      }
    },
  },
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(139, 0, 0, 0.2);
  border-top: 3px solid #8b0000;
  border-radius: 50%;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.usuarios-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.usuarios-title {
  color: var(--primary-color, #8B0000);
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
}

.usuarios-subtitle {
  color: var(--text-light, #6c757d);
  font-size: 1.1rem;
}

.usuarios-table-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.btn-guardar {
  background-color: var(--primary-color, #8B0000) !important;
  border-color: var(--primary-color, #8B0000) !important;
  color: #fff !important;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s ease;
}

.btn-guardar:hover {
  background-color: var(--primary-dark, #5e0000) !important;
  border-color: var(--primary-dark, #5e0000) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.2);
}
</style>
