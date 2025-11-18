<template>
  <div class="usuarios-container">
    <div class="usuarios-table-container shadow-sm">
      <h1 class="usuarios-title">Recuperar Contraseña</h1>
      <p class="usuarios-subtitle">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </p>

      <!-- SPINNER -->
      <div v-if="cargando" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <!-- FORMULARIO -->
      <div v-else>
        <div class="card-body">
          <div class="form-floating mb-3">
            <input
              v-model="email"
              type="email"
              id="email"
              class="form-control"
              placeholder="correo@ejemplo.com"
              required
            />
            <label for="email">Correo electrónico</label>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <button class="btn-guardar" @click="enviarSolicitud">
              <i class="fas fa-paper-plane me-1"></i> Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mostrarAlerta } from "@/functions.js";
import { forgotPassword } from "@/services/password";

export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "",
      cargando: false,
    };
  },
  methods: {
    async enviarSolicitud() {
      if (!this.email.trim()) {
        await mostrarAlerta("Por favor ingresa tu correo electrónico", "warning");
        return;
      }

      this.cargando = true;
      try {
        await forgotPassword(this.email);

        this.cargando = false;

        await mostrarAlerta(
          "Solicitud enviada",
          "success",
          "Si el correo está registrado, se enviará un enlace de recuperación. Verifica tu bandeja de entrada."
        );

        this.email = "";
      } catch (error) {
        console.error("❌ Error al enviar solicitud:", error);

        // ✅ También ocultamos el spinner si ocurre un error
        this.cargando = false;

        await mostrarAlerta(
          "Error",
          "danger",
          "No se pudo procesar la solicitud. Inténtalo más tarde."
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
  max-width: 600px;
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
