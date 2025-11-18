<template>
  <div class="notifications-container">
    <!-- Header -->
    <div class="notifications-header shadow-sm">
      <h1 class="notifications-title">Mis Notificaciones</h1>
      <p class="notifications-subtitle">
        Consulta las alertas y actualizaciones más recientes.
      </p>
    </div>

    <!-- Loader mejorado -->
    <div v-if="loading" class="loading-wrapper">
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status"></div>
        <p>Cargando notificaciones...</p>
      </div>
    </div>

    <!-- Contenido -->
    <div v-else>
      <!-- Estado vacío -->
      <div v-if="notifications.length === 0" class="empty-state">
        <i class="fas fa-bell-slash empty-icon"></i>
        <h4>No tienes notificaciones</h4>
        <p>Cuando haya una actualización, aparecerá aquí.</p>
      </div>

      <!-- Lista de notificaciones -->
      <div v-else>
        <div class="notifications-list">
          <div
            v-for="notification in visibleNotifications"
            :key="notification.id"
            class="notification-card"
          >
            <div class="notification-header">
              <i class="notification-icon fas fa-bell"></i>
              <div>
                <h3 class="notification-title">
                  {{ notification.type }}
                </h3>
                <p class="notification-date">
                  {{ formatDate(notification.createdAt || notification.order?.date) }}
                </p>
              </div>
            </div>

            <p class="notification-message">{{ notification.message }}</p>
          </div>
        </div>

        <!-- Botón "Ver más" -->
        <div v-if="showLoadMore" class="load-more-container">
          <button class="btn-ver-mas" @click="loadMoreNotifications">
            Ver más notificaciones
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNotificationsByCustomer } from "@/services/notifications";

export default {
  name: "NotificationsView",
  data() {
    return {
      notifications: [],
      loading: true,
      customerId: null,
      visibleCount: 6,
      refreshInterval: null,
    };
  },
  computed: {
    visibleNotifications() {
      return this.notifications.slice(0, this.visibleCount);
    },
    showLoadMore() {
      return this.visibleCount < this.notifications.length;
    },
  },
  methods: {
    async fetchNotifications() {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          this.customerId = user.id;
        }

        // Si no hay cliente, no mostrar alerta — solo detener carga
        if (!this.customerId) {
          this.loading = false;
          return;
        }

        const data = await getNotificationsByCustomer(this.customerId);

        // Solo actualizar si hay cambios reales
        if (Array.isArray(data) && JSON.stringify(this.notifications) !== JSON.stringify(data)) {
          this.notifications = data;
        }

        this.loading = false;
      } catch (error) {
        console.warn("⚠️ Error al obtener notificaciones:", error.message);
        this.loading = false;
      }
    },
    loadMoreNotifications() {
      this.visibleCount += 4;
    },
    formatDate(date) {
      if (!date) return "Fecha no disponible";
      const d = new Date(date);
      return d.toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  async mounted() {
    await this.fetchNotifications();

    this.refreshInterval = setInterval(async () => {
      await this.fetchNotifications();
    }, 5000);
  },
  beforeUnmount() {
    clearInterval(this.refreshInterval);
  },
};
</script>


<style scoped>
.notifications-container {
  padding: 1.5rem;
}

.notifications-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.notifications-title {
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
}

.notifications-subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
}

.notifications-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.notification-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid var(--primary-color);
}

.notification-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(88, 14, 0, 0.15);
}

.notification-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.notification-icon {
  font-size: 1.8rem;
  color: var(--primary-color);
}

.notification-title {
  font-size: 1.2rem;
  color: var(--text-dark);
  font-weight: 600;
}

.notification-date {
  font-size: 0.9rem;
  color: var(--text-light);
}

.notification-message {
  color: var(--text-dark);
  margin-bottom: 1rem;
}

.notification-details {
  font-size: 0.9rem;
  color: var(--text-light);
  margin-bottom: 1rem;
}

/* === COLORES DE TEXTO SEGÚN ESTADO === */
.status-text {
  font-weight: 700;
  margin-left: 6px;
}

.status-pending {
  color: #f0ad4e;
}

.status-progress {
  color: #0d6efd;
}

.status-completed {
  color: #28a745;
}

.status-cancelled {
  color: #dc3545;
}

.notification-type {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  background-color: #d4edda;
  color: #155724;
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn-ver-mas {
  background-color: var(--primary-color);
  color: white;
  border: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-ver-mas:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.2);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
}

.empty-icon {
  font-size: 4rem;
  color: #dee2e6;
  margin-bottom: 1rem;
}

.empty-state h4 {
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

/* === LOADER MEJORADO === */
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  text-align: center;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: fadeIn 0.6s ease-in-out;
}

.loading-content .spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3rem;
  color: var(--primary-color);
}

.loading-content p {
  font-size: 1.2rem;
  color: var(--primary-color);
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Animación sutil de entrada */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
