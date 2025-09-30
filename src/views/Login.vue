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
import { loginUser } from "@/services/users"; // asegúrate cómo devuelve loginUser

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

        // 1) Llamada al servicio (puede devolver axios response o ya data)
        const resp = await loginUser(payload);
        // Manejo robusto: si es axios response -> extrae .data, si ya es data -> úsalo
        const userData = resp?.data ?? resp;

        console.log("login response:", resp);
        console.log("userData:", userData);

        if (!userData || !userData.id) {
          throw new Error("Respuesta de login inválida");
        }

        // 2) Guardar usuario completo
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(userData));

        // 3) Extraer roles (soporta que roles venga como array de objetos o strings)
        let roles = [];
        if (Array.isArray(userData.roles)) {
          if (userData.roles.length > 0 && typeof userData.roles[0] === "object") {
            roles = userData.roles.map(r => r.name);
          } else {
            roles = userData.roles;
          }
        }
        localStorage.setItem("roles", JSON.stringify(roles));

        // 4) Guardar token si viene (opcional)
        if (userData.token) {
          localStorage.setItem("token", userData.token);
        } else if (userData.accessToken) {
          localStorage.setItem("token", userData.accessToken);
        }

        mostrarAlerta("Inicio de sesión exitoso", "success");

        // 5) Si tiene 0 roles --> error (opcional)
        if (roles.length === 0) {
          mostrarAlerta("Error", "warning", "Usuario sin roles asignados");
          this.isSubmitting = false;
          return;
        }

        // 6) Si tiene 1 rol → set activeRole y redirige según rol
        if (roles.length === 1) {
          const onlyRole = roles[0];
          localStorage.setItem("activeRole", onlyRole);

          // opcional: guardar también una versión legible para compatibilidad
          localStorage.setItem("role", this.humanRole(onlyRole));

          this.redirectByRole(onlyRole);
        } else {
          // >1 rol → ir a la pantalla de selección
          this.$router.push("/select-role");
        }

      } catch (error) {
        console.error("Error en login:", error);
        // Si error viene de axios
        if (error.response?.status === 401) {
          mostrarAlerta("Error al iniciar sesión", "warning", "Usuario o contraseña incorrectos");
        } else if (error.response) {
          mostrarAlerta("Error inesperado", "error", `Código ${error.response.status}`);
        } else {
          mostrarAlerta("Error inesperado", "error", "Servidor no disponible");
        }
      } finally {
        this.isSubmitting = false;
      }
    },

    redirectByRole(role) {
      if (role === "ROLE_ADMIN") {
        this.$router.push("/dashboard-admin");
      } else if (role === "ROLE_EMPLOYEE") {
        this.$router.push("/dashboard-employee");
      } else if (role === "ROLE_CUSTOMER") {
        this.$router.push("/dashboard-customer");
      } else {
        this.$router.push("/");
      }
    },

    humanRole(role) {
      switch (role) {
        case "ROLE_ADMIN": return "Administrador";
        case "ROLE_EMPLOYEE": return "Empleado";
        case "ROLE_CUSTOMER": return "Cliente";
        default: return role;
      }
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
