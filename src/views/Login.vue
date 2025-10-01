<template>
  <PublicHeader />
  <div class="login-page">
    <div class="login-box">
      <img class="logo" src="@/assets/logo_smash_order.png" alt="SmashOrder Logo" />
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Usuario:</label>
          <input type="text" id="username" v-model="usuario" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" class="btn-login" :disabled="isSubmitting">
          <span v-if="!isSubmitting">Ingresar</span>
          <span v-else>Cargando...</span>
        </button>
      </form>
      <p class="register-text">
        ¿No tienes cuenta?
        <router-link to="/signin" class="register-link">Regístrate aquí</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import PublicHeader from "@/components/PublicHeader.vue";
import { mostrarAlerta } from "@/functions";
import { loginUser } from "@/services/users";

export default {
  name: "LoginPage",
  components: { PublicHeader },
  data() {
    return {
      usuario: "",
      password: "",
      isSubmitting: false,
    };
  },
  methods: {
    async login() {
      this.isSubmitting = true;
      try {
        const payload = {
          usuario: this.usuario,
          password: this.password,
        };

        await loginUser(payload);

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", this.usuario);

        let role = "Administrador"; // <-- por defecto admin
        //let role = "Cliente";
        localStorage.setItem("role", role);

        mostrarAlerta("Inicio de sesión exitoso", "success");

        // Redirige según rol
        if (role === "Administrador") {
          this.$router.push("/dashboard");
        } else if (role === "Cliente") {
          this.$router.push("/menu");
        }

      } catch (error) {
        if (error.response?.status === 401) {
          mostrarAlerta(
            "Error al iniciar sesión",
            "warning",
            "Usuario o contraseña incorrectos"
          );
        } else {
          mostrarAlerta(
            "Error inesperado",
            "error",
            "Servidor no disponible"
          );
        }
        console.error("Error en login:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-light);
  padding: 2rem;
}

.login-box {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(88, 14, 0, 0.15);
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  position: relative;
  text-align: center;
}

.logo {
  width: 140px;
  margin-bottom: 1.5rem;
}

h2 {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 700;
}

.form-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
  font-size: 0.95rem;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  color: var(--text-dark);
}

input[type="text"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--background-light);
  box-shadow: 0 0 0 3px rgba(88, 14, 0, 0.1);
}

.btn-login {
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
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.25);
}

.btn-login:hover {
  background: linear-gradient(135deg,
      var(--primary-dark),
      var(--primary-color));
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(88, 14, 0, 0.35);
}

.btn-login:active {
  transform: translateY(0);
}

.register-text {
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: var(--text-light);
}

.register-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.register-link:hover {
  text-decoration: underline;
  color: var(--accent-color);
}

@media (max-width: 480px) {
  .login-box {
    padding: 2rem 1.5rem;
    width: 85%;
  }

  h2 {
    font-size: 1.8rem;
  }
}
</style>
