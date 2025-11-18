<template>
  <PublicHeader />
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2 class="register-title">Crear Cuenta</h2>
        <p class="register-subtitle">
          Únete a SmashOrder y disfruta de nuestras deliciosas hamburguesas
        </p>
      </div>

      <form @submit.prevent="completarRegistro()" class="register-form">
        <!-- Sección de Información Personal -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="fas fa-user"></i> Información Personal
          </h3>
          <div class="form-row">
            <div class="form-group">
              <label for="nombres">Nombres*</label>
              <input type="text" id="nombres" v-model="user.name" required placeholder="Ej: Lucía Fernanda"
                class="form-input" />
            </div>
          </div>
        </div>

        <!-- Sección de Credenciales -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="fas fa-key"></i> Credenciales de Acceso
          </h3>
          <div class="form-row">
            <div class="form-group">
              <label for="usuario">Nombre de Usuario*</label>
              <input type="text" id="usuario" v-model="user.userName" required placeholder="Ej: lmartinez"
                class="form-input" />
              <small class="input-hint">
                Mínimo 6 caracteres, sin espacios
              </small>
            </div>
            <div class="form-group">
              <label for="contrasenia">Contraseña*</label>
              <div class="password-input">
                <input :type="showPassword ? 'text' : 'password'" id="contrasenia" v-model="user.password" required
                  placeholder="Segura123!" class="form-input"
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
                  title="Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial" />
                <button type="button" class="toggle-password" @click="togglePasswordVisibility"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                  <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
                </button>
              </div>
              <small class="input-hint">
                Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 carácter especial
              </small>
            </div>

          </div>
        </div>

        <!-- Sección de Contacto -->
        <div class="form-section">
          <h3 class="section-title">
            <i class="fas fa-address-card"></i> Información de Contacto
          </h3>
          <div class="form-row">
            <div class="form-group">
              <label for="correo">Correo Electrónico*</label>
              <input type="email" id="correo" v-model="user.email" required placeholder="Ej: ejemplo@mail.com"
                class="form-input" />
            </div>
          </div>
        </div>

        <!-- Botón de Registro -->
        <button type="submit" class="register-button" :disabled="!isFormValid || isSubmitting"
          :style="{ backgroundColor: isFormValid ? '#580e00' : '#95a5a6' }">
          <span v-if="!isSubmitting">
            <i class="fas fa-user-plus"></i> Crear Cuenta
          </span>
          <div v-else class="loading-spinner"></div>
        </button>

        <!-- Enlace a Login -->
        <p class="login-link">
          ¿Ya tienes una cuenta?
          <router-link to="/login" class="login-redirect">
            Inicia Sesión
          </router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { mostrarAlerta } from "@/functions";
import { registerUser } from "@/services/users";
import PublicHeader from "@/components/PublicHeader.vue";

export default {
  name: "RegisterPage",
  components: {
    PublicHeader
  },
  data() {
    return {
      user: {
        id: "",
        name: "",
        userName: "",
        email: "",
        password: "",
      },
      showPassword: false,
      isSubmitting: false,
    };
  },
  computed: {
    isFormValid() {
      return (
        this.user.name.trim() &&
        this.user.userName.trim() &&
        this.user.email.trim() &&
        this.user.password.trim()
      );
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async completarRegistro() {
      try {
        this.isSubmitting = true;
        await registerUser(this.user);
        mostrarAlerta("Usuario registrado exitosamente", "success");
        this.$router.push("/login");
      } catch (error) {
        mostrarAlerta("Error en el registro. Intenta nuevamente.", "danger");
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>



<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

:root {
  --primary-color: #580e00;
  --primary-light: #7a2c1a;
  --primary-dark: #3d0900;
  --accent-color: #ff8c00;
  --text-dark: #2c3e50;
  --text-light: #7f8c8d;
  --background-light: #ffffff;
}

* {
  font-family: "Poppins", sans-serif;
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-light);
  padding: 2rem;
}

.register-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(88, 14, 0, 0.15);
  width: 100%;
  max-width: 800px;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
}

.register-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-title {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.register-subtitle {
  color: var(--text-light);
  font-size: 1rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eaeaea;
}

.section-title {
  color: var(--primary-color);
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title i {
  color: var(--primary-color);
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  position: relative;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-dark);
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: white;
  box-shadow: 0 0 0 3px rgba(88, 14, 0, 0.1);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
}

.toggle-password:hover {
  background-color: rgba(88, 14, 0, 0.1);
  color: var(--primary-color);
}

.input-hint {
  color: var(--text-light);
  font-size: 0.75rem;
  margin-top: 0.4rem;
  display: block;
}

.form-check {
  display: flex;
  align-items: flex-start;
  margin: 1.5rem 0;
  gap: 0.5rem;
}

.check-input {
  margin-top: 0.2rem;
}

.check-label {
  font-size: 0.9rem;
  color: var(--text-dark);
  line-height: 1.4;
}

.terms-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  color: var(--accent-color);
  text-decoration: underline;
}

.register-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg,
      var(--primary-color),
      var(--primary-dark));
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.25);
}

.register-button:hover:not(:disabled) {
  background: linear-gradient(135deg,
      var(--primary-dark),
      var(--primary-color));
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(88, 14, 0, 0.35);
}

.register-button:active:not(:disabled) {
  transform: translateY(0);
}

.register-button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  box-shadow: none;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-link {
  text-align: center;
  margin-top: 2rem;
  color: var(--text-light);
  font-size: 0.95rem;
}

.login-redirect {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.login-redirect:hover {
  color: var(--accent-color);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .register-card {
    padding: 1.8rem 1.5rem;
    margin: 1rem;
  }

  .register-title {
    font-size: 1.8rem;
  }
}
</style>
