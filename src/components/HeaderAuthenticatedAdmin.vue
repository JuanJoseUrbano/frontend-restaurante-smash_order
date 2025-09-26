<template>
  <nav class="navbar navbar-expand-lg navbar-custom">
    <div class="container-fluid">
      <!-- Logo y marca -->
      <router-link to="/dashboard" class="navbar-brand d-flex align-items-center">
        <img class="logo-img" src="../assets/logo_smash_order.png" alt="Logo Smash Order" />
        <div class="brand-text ms-2">
          <span class="brand-main">SmashOrder</span>
          <span class="brand-sub">Panel de Control</span>
        </div>
      </router-link>

      <!-- Menú usuario -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarContent">
        <ul class="navbar-nav align-items-center">
          <!-- Usuario -->
          <li class="nav-item d-flex align-items-center me-3">
            <i class="fas fa-user-circle me-2" style="font-size: 1.5rem; color: white;"></i>
            <div class="text-white">
              <div class="username">{{ username }}</div>
              <div class="role">{{ role }}</div>
            </div>
          </li>

          <!-- Botones -->
          <li class="nav-item d-flex gap-2">
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
  name: "HeaderAuthenticatedAdmin",
  props: {
    username: {
      type: String,
      default: "Usuario"
    },
    roles: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    role() {
      if (this.roles.length > 0) {
        if (this.roles[0].name === "ROLE_ADMIN") return "Administrador";
        if (this.roles[0].name === "ROLE_EMPLOYEE") return "Empleado";
        if (this.roles[0].name === "ROLE_CUSTOMER") return "Cliente";
      }
      return "Sin rol";
    }
  },
  methods: {
    logout() {
      if (confirm("¿Deseas cerrar sesión?")) {
        localStorage.clear();
        this.$router.push("/login");
      }
    }
  }
};
</script>


<style scoped>
.navbar-custom {
  background-color: #580e00;
  /* Igual que el footer */
  color: #ffffff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  /* Inverso del footer (sombra hacia abajo) */
  padding: 0.5rem 1rem;
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
