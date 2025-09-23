<template>
  <nav class="navbar navbar-expand-lg navbar-custom">
    <div class="container-fluid">
      <!-- Logo y marca -->
      <router-link to="/menu" class="navbar-brand d-flex align-items-center">
        <img class="logo-img" src="../assets/logo_smash_order.png" alt="Logo Smash Order" />
        <div class="brand-text ms-2">
          <span class="brand-main">SmashOrder</span>
          <span class="brand-sub">Menú del Cliente</span>
        </div>
      </router-link>

      <!-- Botón hamburguesa para móviles -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menú usuario -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarContent">
        <ul class="navbar-nav align-items-lg-center ms-auto">
          <!-- Usuario -->
          <li class="nav-item d-flex align-items-center me-lg-3 mb-2 mb-lg-0">
            <i class="fas fa-user-circle me-2" style="font-size: 1.5rem; color: white;"></i>
            <div class="text-white">
              <div class="username">{{ username }}</div>
              <div class="role">{{ role }}</div>
            </div>
          </li>

          <!-- Botones de acción -->
          <li class="nav-item d-flex flex-column flex-lg-row gap-2">
            <router-link to="/perfil" class="btn btn-profile">
              <i class="fas fa-user me-1"></i> Perfil
            </router-link>
            <button @click="logout" class="btn btn-logout">
              <i class="fas fa-sign-out-alt me-1"></i> Salir
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "CustomerHeader",
  data() {
    return {
      username: localStorage.getItem("username") || "Cliente",
      role: localStorage.getItem("role") || "Cliente",
    };
  },
  methods: {
    logout() {
      if (confirm("¿Deseas cerrar sesión?")) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped>
.navbar-custom {
  background-color: #580e00; /* Igual que el footer */
  color: #ffffff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); /* sombra hacia abajo */
}


.navbar-brand {
  color: white !important;
  text-decoration: none;
}

.logo-img {
  width: 45px;
  height: 45px;
  object-fit: contain;
}

.brand-main {
  font-weight: 800;
  font-size: 1.3rem;
  display: block;
  color: white;
}

.brand-sub {
  font-size: 0.75rem;
  color: #ffd8cc;
}

.username {
  font-weight: 600;
  font-size: 0.9rem;
}

.role {
  font-size: 0.75rem;
  color: #ffd8cc;
  opacity: 0.9;
}

/* Botones con estilo del header admin */
.btn-profile {
  background: white;
  color: #580e00;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-weight: 600;
}

.btn-profile:hover {
  background: #ffd8cc;
}

.btn-logout {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-weight: 600;
}

.btn-logout:hover {
  background: #c0392b;
}
</style>

