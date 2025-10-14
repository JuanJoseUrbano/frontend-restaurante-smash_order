<template>
  <PublicHeader />
  <div class="login-page">
    <div class="login-box">
      <img class="logo" src="@/assets/logo_smash_order.png" alt="SmashOrder Logo" />
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Usuario:</label>
          <input type="text" id="username" v-model="userName" required />
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
import { loginUser } from "@/services/authService";

export default {
  name: "LoginPage",
  components: { PublicHeader },
  data() {
    return {
      userName: "",
      password: "",
      isSubmitting: false,
    };
  },
  methods: {
    async login() {
      this.isSubmitting = true;

      try {
        const payload = {
          userName: this.userName.trim(),
          password: this.password,
        };

        const resp = await loginUser(payload);
        const { accessToken, tokenType, user } = resp;

        if (!user || !accessToken) throw new Error("Respuesta de login inválida");

        // Guardar token completo
        const fullToken = `${tokenType.trim()} ${accessToken}`;
        localStorage.setItem("token", fullToken);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(user));

        // Guardar roles
        const roles = (user.roles ?? []).map((r) => r.name);
        localStorage.setItem("roles", JSON.stringify(roles));

        // Si tiene un único rol, guardarlo y mostrar alerta antes de redirigir
        if (roles.length === 1) {
          const onlyRole = roles[0];
          localStorage.setItem("activeRole", onlyRole);
          localStorage.setItem("role", this.humanRole(onlyRole));

          // Mostrar alerta y luego redirigir
          await mostrarAlerta("Inicio de sesión exitoso", "success", "Bienvenido a Smash Order");
          this.redirectByRole(onlyRole);

        } else {
          // Si tiene varios roles, mostrar alerta y redirigir a selección de rol
          await mostrarAlerta("Inicio de sesión exitoso", "success", "Bienvenido a Smash Order");
          this.$router.push("/select-role");
        }

      } catch (error) {
        console.error("Error en login:", error);

        if (error.response?.status === 401) {
          await mostrarAlerta("Credenciales inválidas", "warning", "Usuario o contraseña incorrectos");
        } else if (error.message.includes("incompleta")) {
          await mostrarAlerta("Error", "warning", "Respuesta del servidor incompleta.");
        } else if (error.request) {
          await mostrarAlerta("Sin conexión", "warning", "No se pudo contactar con el servidor.");
        } else {
          await mostrarAlerta("Error al iniciar sesión", "error", "Ocurrió un error inesperado, intente nuevamente.");
        }

      } finally {
        this.isSubmitting = false;
      }
    },

    redirectByRole(role) {
      const routes = {
        "ROLE_ADMIN": "/dashboard-admin",
        "ROLE_EMPLOYEE": "/dashboard-employee",
        "ROLE_CUSTOMER": "/dashboard-customer"
      };
      this.$router.push(routes[role] || "/");
    },

    humanRole(role) {
      const roleNames = {
        "ROLE_ADMIN": "Administrador",
        "ROLE_EMPLOYEE": "Empleado",
        "ROLE_CUSTOMER": "Cliente"
      };
      return roleNames[role] || role;
    }
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
