<template>
  <nav class="navbar navbar-expand-lg navbar-custom">
    <div class="container-fluid">
      <!-- Logo y marca -->
      <router-link :to="dashboardRoute" class="navbar-brand d-flex align-items-center">
        <img class="logo-img" src="../assets/logo_smash_order.png" alt="Logo Smash Order" />
        <div class="brand-text ms-2">
          <span class="brand-main">SmashOrder</span>
          <span class="brand-sub">{{ subtitle }}</span>
        </div>
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
        aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menú usuario -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarContent">
        <ul class="navbar-nav align-items-center">
          <!-- Usuario -->
          <li class="nav-item d-flex align-items-center me-3">
            <i class="fas fa-user-circle me-2" style="font-size: 1.5rem; color: white;"></i>
            <div class="text-white">
              <div class="username">{{ username }}</div>
              <div class="role">{{ formattedRole }}</div>
            </div>
          </li>

          <!-- Botones -->
          <li class="nav-item d-flex gap-2">
            <router-link :to="profileRoute" class="btn btn-profile">
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
import { confirmar } from "@/functions";
import { logout } from "@/services/authService";

export default {
  name: "HeaderAuthenticated",
  props: {
    username: {
      type: String,
      default: "Usuario",
    },
    roles: {
      type: Array,
      default: () => [],
    },
    activeRole: {
      type: String,
      default: "ROLE_CUSTOMER",
    },
  },
  computed: {
    formattedRole() {
      switch (this.activeRole) {
        case "ROLE_ADMIN":
          return "Administrador";
        case "ROLE_EMPLOYEE":
          return "Empleado";
        case "ROLE_CUSTOMER":
          return "Cliente";
        default:
          return "Sin rol";
      }
    },
    dashboardRoute() {
      switch (this.activeRole) {
        case "ROLE_ADMIN":
          return "/dashboard-admin";
        case "ROLE_EMPLOYEE":
          return "/dashboard-employee";
        case "ROLE_CUSTOMER":
          return "/dashboard-customer";
        default:
          return "/";
      }
    },
    subtitle() {
      switch (this.activeRole) {
        case "ROLE_ADMIN":
        case "ROLE_EMPLOYEE":
          return "Panel de Control";
        case "ROLE_CUSTOMER":
          return "Menú del Cliente";
        default:
          return "";
      }
    },
    profileRoute() {
      switch (this.activeRole) {
        case "ROLE_ADMIN":
          return "/dashboard-admin/profile";
        case "ROLE_EMPLOYEE":
          return "/dashboard-employee/profile";
        case "ROLE_CUSTOMER":
          return "/dashboard-customer/profile";
        default:
          return "/";
      }
    },
  },
  methods: {
    async logout() {
      const confirmed = await confirmar(
        "Cerrar sesión",
        "¿Estás seguro de que deseas cerrar sesión?"
      );
      if (confirmed) {
        logout();
      }
    },
  },
};
</script>


<style scoped>
.navbar-custom {
  background-color: #580e00;
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
