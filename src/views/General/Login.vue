<template>
  <div class="login-page">
    <div class="login-box">
      <img
        class="logo"
        src="@/assets/logo_smash_order.png"
        alt="Hotel El Paraíso"
      />
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Usuario:</label>
          <input type="text" id="username" v-model="usuario" required />
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" v-model="contrasenia" required />
        </div>
        <button type="submit" class="btn-login">Ingresar</button>
      </form>
      <p class="register-text">
        ¿No tienes cuenta?
        <router-link to="/signin" class="register-link"
          >Regístrate aquí</router-link
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      usuario: "",
      contrasenia: "",
      // Datos de usuario simulados en memoria
      usuariosSimulados: [
        { usuario: "admin", contrasenia: "Admin123!" },
        { usuario: "lmartinez", contrasenia: "Segura123!" },
      ],
    };
  },
  methods: {
    login() {
      const usuarioValido = this.usuariosSimulados.find(
        (u) => u.usuario === this.usuario && u.contrasenia === this.contrasenia
      );

      if (usuarioValido) {
        // Guardamos la sesión en localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", this.usuario);
        alert(`¡Bienvenido ${this.usuario}!`);
        this.$router.push("/dashboard-products"); // Redirige al dashboard
      } else {
        alert("Usuario o contraseña incorrectos");
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
  --text-dark: #000000; /* texto negro */
  --text-light: #7f8c8d;
  --background-light: #ffffff; /* fondo blanco */
}

* {
  font-family: "Poppins", sans-serif;
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-light);
  padding: 2rem;
}

.login-box {
  background-color: var(--background-light);
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
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--primary-dark)
  );
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
  background: linear-gradient(
    135deg,
    var(--primary-dark),
    var(--primary-color)
  );
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
