<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-custom py-3">
      <div class="container-fluid d-flex justify-content-between align-items-center">
        <!-- NOMBRE DEL SISTEMA -->
        <div class="brand-section d-flex flex-column align-items-start">
          <span class="brand-main">SmashOrder</span>
          <br />
          <span class="brand-sub">{{ subtitle }}</span>
        </div>

        <!-- BOTÓN RESPONSIVE -->
        <button
          class="navbar-toggler text-white border-0"
          type="button"
          @click="toggleMenu"
        >
          <i :class="menuOpen ? 'fas fa-times' : 'fas fa-bars'" class="fs-3"></i>
        </button>

        <!-- MENÚ DERECHA -->
        <div :class="['collapse', 'navbar-collapse', { show: menuOpen }]" id="navbarContent">
          <ul class="navbar-nav align-items-center ms-auto text-center text-lg-start">
            <!-- USUARIO -->
            <li class="nav-item me-lg-4 mb-3 mb-lg-0 text-end text-lg-start">
              <div class="username">{{ username }}</div>
              <div class="role">{{ formattedRole }}</div>
            </li>

            <!-- NOTIFICACIONES -->
            <li v-if="isCustomer" class="nav-item me-lg-4 mb-3 mb-lg-0 position-relative">
              <i class="fas fa-bell notification-icon" @click="toggleNotifications"></i>
              <span v-if="notifications && notifications.length > 0" class="notification-badge">
                {{ notifications.length }}
              </span>

              <div v-if="showNotifications" class="notifications-dropdown shadow">
                <div v-if="notifications && notifications.length">
                  <div
                    v-for="notif in notifications"
                    :key="notif.id"
                    class="notification-item"
                    @click="markAsRead(notif.id)"
                  >
                    <i class="fas fa-info-circle"></i>
                    <span>{{ notif.message }}</span>
                  </div>
                </div>
                <div v-else class="notification-empty">No hay notificaciones</div>
              </div>
            </li>

            <!-- BOTONES -->
            <li class="nav-item d-flex flex-column flex-lg-row gap-2 gap-lg-3">
              <router-link
                :to="profileRoute"
                class="btn btn-profile"
                @click="closeMenu"
              >
                <i class="fas fa-user me-1"></i> Perfil
              </router-link>

              <button @click="logoutAndClose" class="btn btn-logout">
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
import { getNotificationsUnreadByCustomer, markNotificationAsRead } from "@/services/notifications";

export default {
  name: "HeaderAuthenticated",
  props: {
    username: { type: String, default: "Usuario" },
    roles: { type: Array, default: () => [] },
    activeRole: { type: String, default: "ROLE_CUSTOMER" },
    userId: { type: Number, default: null },
  },
  data() {
    return {
      showNotifications: false,
      notifications: [],
      notificationsInterval: null,
      menuOpen: false, // 👈 control del menú responsive
    };
  },
  computed: {
    formattedRole() {
      switch (this.activeRole) {
        case "ROLE_ADMIN": return "Administrador";
        case "ROLE_EMPLOYEE": return "Empleado";
        case "ROLE_CUSTOMER": return "Cliente";
        default: return "Sin rol";
      }
    },
    subtitle() {
      switch (this.activeRole) {
        case "ROLE_ADMIN":
        case "ROLE_EMPLOYEE": return "Panel de Control";
        case "ROLE_CUSTOMER": return "Menú del Cliente";
        default: return "";
      }
    },
    profileRoute() {
      switch (this.activeRole) {
        case "ROLE_ADMIN": return "/dashboard-admin/profile";
        case "ROLE_EMPLOYEE": return "/dashboard-employee/profile";
        case "ROLE_CUSTOMER": return "/dashboard-customer/profile";
        default: return "/";
      }
    },
    isCustomer() {
      return this.activeRole === "ROLE_CUSTOMER";
    },
    effectiveUserId() {
      return this.userId || 6;
    },
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    async logoutAndClose() {
      this.closeMenu();
      const confirmed = await confirmar("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?");
      if (confirmed) logout();
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    async fetchNotifications() {
      if (!this.effectiveUserId || !this.isCustomer) return;
      try {
        const data = await getNotificationsUnreadByCustomer(this.effectiveUserId);
        this.notifications = Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    },
    async markAsRead(id) {
      try {
        await markNotificationAsRead(id);
        this.notifications = this.notifications.filter(n => n.id !== id);
      } catch (error) {
        console.error("Error al marcar como leída:", error);
      }
    },
    startNotificationsInterval() {
      if (!this.notificationsInterval) {
        this.notificationsInterval = setInterval(() => this.fetchNotifications(), 5000);
      }
    },
    stopNotificationsInterval() {
      clearInterval(this.notificationsInterval);
      this.notificationsInterval = null;
    },
  },
  mounted() {
    this.fetchNotifications();
    this.startNotificationsInterval();
  },
  beforeUnmount() {
    this.stopNotificationsInterval();
  },
};
</script>

<style scoped>
.navbar-custom {
  background: linear-gradient(90deg, #580e00, #6d1b0c);
  color: white;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  padding: 0 1rem;
}
.brand-section { line-height: 1.1; }
.brand-main { font-weight: 800; font-size: 1.9rem; color: #fff; letter-spacing: 0.5px; }
.brand-sub { font-size: 1rem; color: #ffd8cc; font-weight: 500; }
.username { font-weight: 600; font-size: 1rem; color: #fff; }
.role { font-size: 0.85rem; color: #ffd8cc; }
.btn-profile {
  background: #fff; color: #580e00; border: none; border-radius: 25px;
  padding: 0.6rem 1.3rem; font-weight: 600; transition: 0.2s ease;
}
.btn-profile:hover { background: #ffd8cc; }
.btn-logout {
  background: #e74c3c; color: white; border: none; border-radius: 25px;
  padding: 0.6rem 1.3rem; font-weight: 600; transition: 0.2s ease;
}
.btn-logout:hover { background: #c0392b; }
.notification-icon {
  font-size: 1.8rem; color: white; cursor: pointer; transition: 0.2s ease;
}
.notification-icon:hover { color: #ffd8cc; }
.notification-badge {
  position: absolute; top: -4px; right: -6px;
  background: #e74c3c; color: white; border-radius: 50%;
  padding: 3px 7px; font-size: 0.7rem; font-weight: bold;
}
.notifications-dropdown {
  position: absolute; top: 45px; right: 0;
  background: white; color: #333; border-radius: 10px;
  width: 260px; max-height: 300px; overflow-y: auto;
  padding: 0.5rem 0; z-index: 999; animation: fadeIn 0.2s ease-in-out;
}
.notification-item {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.6rem 1rem; font-size: 0.9rem; cursor: pointer;
  transition: background 0.2s ease;
}
.notification-item:hover { background: #ffeae4; }
.notification-item i { color: #580e00; }
.notification-empty { text-align: center; padding: 1rem; color: #999; font-size: 0.85rem; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

/* 🔹 Ajustes responsive */
@media (max-width: 991px) {
  .navbar-custom { height: auto; padding: 1rem; }
  .navbar-collapse {
    background: #6d1b0c;
    border-radius: 10px;
    padding: 1rem;
    margin-top: 0.5rem;
  }
  .btn-profile, .btn-logout {
    width: 100%;
  }
  .nav-item {
    width: 100%;
  }
}
</style>
