<template>
  <div class="reservation-history-container">
    <!-- Header -->
    <div class="reservation-header shadow-sm">
      <h1 class="reservation-title">Historial de Reservas</h1>
      <p class="reservation-subtitle">Consulta tus reservas realizadas</p>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="loading-wrapper">
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status"></div>
        <p>Cargando historial de reservas...</p>
      </div>
    </div>

    <!-- Contenido -->
    <div v-else>
      <!-- Estado vacío -->
      <div v-if="reservations.length === 0" class="empty-state">
        <i class="fas fa-calendar-times empty-icon"></i>
        <h4>No tienes reservas registradas</h4>
        <p>Cuando realices una reserva, aparecerá aquí.</p>
      </div>

      <!-- Lista de reservas -->
      <div v-else>
        <div class="reservations-list">
          <div
            v-for="reserva in visibleReservations"
            :key="reserva.id"
            class="reservation-card"
          >
            <div class="reservation-header-item">
              <h2>Reserva #{{ reserva.id }}</h2>
              <span class="reservation-status" :class="getStatusClass(reserva.status)">
                {{ translateStatus(reserva.status) }}
              </span>
            </div>

            <p><strong>Fecha y hora:</strong> {{ formatDate(reserva.date) }}</p>
            <p><strong>Mesa:</strong> {{ reserva.table?.number || '—' }}</p>
            <p><strong>Capacidad:</strong> {{ reserva.table?.capacity || '—' }} personas</p>
            <p><strong>Estado:</strong> {{ reserva.status ? "Activa" : "Finalizada" }}</p>
          </div>
        </div>

        <!-- Botón "Ver más" -->
        <div v-if="showLoadMore" class="load-more-container">
          <button class="btn-ver-mas" @click="loadMoreReservations">
            Ver más reservas
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getReservations } from "@/services/reservation";

export default {
  name: "ReservationHistory",
  data() {
    return {
      reservations: [],
      loading: true,
      visibleCount: 4,
      user: JSON.parse(localStorage.getItem("user")) || {},
      refreshInterval: null,
    };
  },
  computed: {
    visibleReservations() {
      return this.reservations.slice(0, this.visibleCount);
    },
    showLoadMore() {
      return this.visibleCount < this.reservations.length;
    },
  },
  methods: {
    async fetchReservations() {
      try {
        if (!this.user?.id) {
          this.loading = false;
          return;
        }

        const allReservations = await getReservations();

        if (!Array.isArray(allReservations)) {
          this.loading = false;
          return;
        }

        // Filtra por cliente y ordena de la más reciente a la más antigua
        const filtered = allReservations
          .filter((r) => r.customer?.id === this.user.id)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        // Solo actualizar si hay cambios reales
        if (JSON.stringify(this.reservations) !== JSON.stringify(filtered)) {
          this.reservations = filtered;
        }
      } catch (error) {
        // No mostrar alertas si el backend está caído — solo log silencioso
        console.warn("⚠️ No se pudo obtener el historial de reservas:", error.message);
      } finally {
        this.loading = false;
      }
    },

    loadMoreReservations() {
      this.visibleCount += 4;
    },

    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },

    translateStatus(status) {
      return status ? "Activa" : "Finalizada";
    },

    getStatusClass(status) {
      return status ? "status-active" : "status-ended";
    },
  },

  async mounted() {
    await this.fetchReservations();

    // Refrescar automáticamente cada 5 segundos
    this.refreshInterval = setInterval(async () => {
      await this.fetchReservations();
    }, 5000);
  },

  beforeUnmount() {
    clearInterval(this.refreshInterval);
  },
};
</script>


<style scoped>
.reservation-history-container {
  padding: 1.5rem;
}

.reservation-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.reservation-title {
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
}

.reservation-subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
}

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
}

.loading-content .spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3rem;
}

.reservations-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.reservation-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid var(--primary-color);
}

.reservation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(88, 14, 0, 0.15);
}

.reservation-header-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.reservation-status {
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active {
  background-color: #cce5ff;
  color: #004085;
}

.status-ended {
  background-color: #f8d7da;
  color: #721c24;
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
</style>
