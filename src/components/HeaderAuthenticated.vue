<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-custom py-3">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <!-- NOMBRE DEL SISTEMA -->
        <div class="brand-section d-flex flex-column align-items-start">
          <span class="brand-main">SmashOrder</span>
          <br>
          <span class="brand-sub">{{ subtitle }}</span>
        </div>

        <!-- BOTÓN RESPONSIVE -->
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

        <!-- MENÚ DERECHA -->
        <div class="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul class="navbar-nav align-items-center">
            <!-- USUARIO -->
            <li class="nav-item me-4 text-end">
              <div class="username">{{ username }}</div>
              <div class="role">{{ formattedRole }}</div>
            </li>

            <!-- NOTIFICACIONES -->
            <li class="nav-item me-4 position-relative">
              <i class="fas fa-bell notification-icon" @click="toggleNotifications"></i>
              <span v-if="notifications.length" class="notification-badge">{{ notifications.length }}</span>

              <div v-if="showNotifications" class="notifications-dropdown shadow">
                <div v-if="notifications.length">
                  <div
                    v-for="(notif, index) in notifications"
                    :key="index"
                    class="notification-item"
                  >
                    <i :class="notif.icon"></i>
                    <span>{{ notif.message }}</span>
                  </div>
                </div>
                <div v-else class="notification-empty">No hay notificaciones</div>
              </div>
            </li>

            <!-- BOTONES -->
            <li class="nav-item d-flex gap-3">
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
  </header>
</template>

<script>
import { confirmar } from "@/functions";
import { logout } from "@/services/authService";

export default {
  name: "HeaderAuthenticated",
  props: {
    username: { type: String, default: "Usuario" },
    roles: { type: Array, default: () => [] },
    activeRole: { type: String, default: "ROLE_CUSTOMER" },
  },
  data() {
    return {
      showNotifications: false,
      notifications: [],
    };
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
      const confirmed = await confirmar("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?");
      if (confirmed) logout();
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    async loadNotifications() {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        this.notifications = data;
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      }
    },
  },
  mounted() {
    this.loadNotifications();
    setInterval(() => this.loadNotifications(), 30000);
  },
};
</script>

<style scoped>
/* =============================== */
/* NAVBAR PRINCIPAL */
/* =============================== */
.navbar-custom {
  background: linear-gradient(90deg, #580e00, #6d1b0c);
  color: white;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
  height: 100px;
  padding: 0 2rem;
  transition: all 0.3s ease;
}

/* =============================== */
/* NOMBRE DEL SISTEMA */
/* =============================== */
.brand-section {
  line-height: 1.1;
}

.brand-main {
  font-weight: 800;
  font-size: 1.9rem;
  color: #fff;
  letter-spacing: 0.5px;
}

.brand-sub {
  font-size: 1rem;
  color: #ffd8cc;
  font-weight: 500;
}

/* =============================== */
/* USUARIO */
/* =============================== */
.username {
  font-weight: 600;
  font-size: 1rem;
  color: #fff;
}

.role {
  font-size: 0.85rem;
  color: #ffd8cc;
}

/* =============================== */
/* BOTONES */
/* =============================== */
.btn-profile {
  background: #fff;
  color: #580e00;
  border: none;
  border-radius: 25px;
  padding: 0.6rem 1.3rem;
  font-weight: 600;
  transition: 0.2s ease;
}

.btn-profile:hover {
  background: #ffd8cc;
}

.btn-logout {
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.6rem 1.3rem;
  font-weight: 600;
  transition: 0.2s ease;
}

.btn-logout:hover {
  background: #c0392b;
}

/* =============================== */
/* NOTIFICACIONES */
/* =============================== */
.notification-icon {
  font-size: 1.8rem;
  color: white;
  cursor: pointer;
  transition: 0.2s ease;
}

.notification-icon:hover {
  color: #ffd8cc;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 3px 7px;
  font-size: 0.7rem;
  font-weight: bold;
}

/* Dropdown */
.notifications-dropdown {
  position: absolute;
  top: 45px;
  right: 0;
  background: white;
  color: #333;
  border-radius: 10px;
  width: 260px;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem 0;
  z-index: 999;
  animation: fadeIn 0.2s ease-in-out;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: #ffeae4;
}

.notification-item i {
  color: #580e00;
}

.notification-empty {
  text-align: center;
  padding: 1rem;
  color: #999;
  font-size: 0.85rem;
}

/* =============================== */
/* ANIMACIÓN SUAVE */
/* =============================== */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =============================== */
/* RESPONSIVE FIXES */
/* =============================== */
@media (max-width: 992px) {
  .navbar-custom {
    height: auto; /* Evita que el menú se monte */
    padding: 1rem;
    flex-wrap: wrap;
  }

  .brand-section {
    margin-bottom: 0.5rem;
  }

  .navbar-toggler {
    border: none;
    background-color: #ffffff33;
  }

  .navbar-toggler-icon {
    background-image: none;
  }

  .navbar-toggler-icon::before {
    content: "\2630"; /* icono hamburguesa */
    font-size: 1.6rem;
    color: #fff;
  }

  .navbar-collapse {
    background: #580e00;
    border-radius: 10px;
    padding: 1rem;
    margin-top: 1rem;
    transition: all 0.3s ease;
  }

  .navbar-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .nav-item {
    width: 100%;
  }

  .btn-profile,
  .btn-logout {
    width: 100%;
    text-align: center;
  }

  .notification-icon {
    font-size: 1.6rem;
  }

  .notifications-dropdown {
    position: static;
    width: 100%;
    max-height: 200px;
  }
}
</style>

