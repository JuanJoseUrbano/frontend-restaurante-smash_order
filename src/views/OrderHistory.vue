<template>
  <div class="order-history-container">

    <div class="order-history-header shadow-sm">
      <h1 class="order-history-title">Historial de pedidos</h1>
      <p class="order-history-subtitle">Consulta tus consumos anteriores</p>
    </div>

    <div v-if="loading" class="loading-spinner">
      <div class="spinner-border text-primary" role="status"></div>
      <p>Cargando historial...</p>
    </div>

    <div v-else>
      <div v-if="orders.length === 0" class="empty-state">
        <i class="fas fa-box-open empty-icon"></i>
        <h4>No tienes pedidos registrados</h4>
        <p>Cuando realices un pedido, aparecerá aquí.</p>
      </div>

      <div v-else>
        <div class="orders-list">
          <div
            v-for="order in visibleOrders"
            :key="order.id"
            class="order-card"
          >
            <div class="order-header">
              <h2>Pedido #{{ order.id }}</h2>
              <span class="order-status" :class="getStatusClass(order.status)">
                {{ translateStatus(order.status) }}
              </span>
            </div>

            <p><strong>Fecha:</strong> {{ formatDate(order.date) }}</p>
            <p><strong>Mesa:</strong> {{ order.table.number }}</p>
            <p><strong>Total:</strong> {{ formatCurrency(order.total) }}</p>

            <h3 class="order-details-title">Detalles:</h3>
            <ul class="order-details-list">
              <li
                v-for="detail in order.orderDetails"
                :key="detail.id"
              >
                {{ detail.product.name }} (x{{ detail.quantity }}) —
                {{ formatCurrency(detail.subtotal) }}
              </li>
            </ul>
          </div>
        </div>

        <div v-if="showLoadMore" class="load-more-container">
          <button class="btn-ver-mas" @click="loadMoreOrders">
            Ver más pedidos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrdersByCustomer } from "@/services/orders";
import { mostrarAlerta } from "@/functions.js";

export default {
  name: "OrderHistory",
  data() {
    return {
      orders: [],
      loading: true,
      customerId: null,
      visibleCount: 3, 
    };
  },
  computed: {
    visibleOrders() {
      return this.orders.slice(0, this.visibleCount);
    },
    showLoadMore() {
      return this.visibleCount < this.orders.length;
    },
  },
  methods: {
    async fetchOrders() {
      try {
        this.loading = true;

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          this.customerId = user.id;
        }

        if (!this.customerId) {
          mostrarAlerta(
            "Cliente no encontrado",
            "warning",
            "No se encontró el ID del cliente autenticado."
          );
          this.loading = false;
          return;
        }

        const data = await getOrdersByCustomer(this.customerId);
        this.orders = data;

      } catch (error) {
        mostrarAlerta(
          "Error",
          "error",
          "Ocurrió un problema al obtener el historial de pedidos."
        );
      } finally {
        this.loading = false;
      }
    },
    loadMoreOrders() {
      this.visibleCount += 5;
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
    formatCurrency(value) {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(value);
    },
    translateStatus(status) {
      switch (status) {
        case "PENDING":
          return "Pendiente";
        case "IN_PROGRESS":
          return "En proceso";
        case "COMPLETED":
          return "Completado";
        case "CANCELLED":
          return "Cancelado";
        default:
          return status;
      }
    },
    getStatusClass(status) {
      switch (status) {
        case "PENDING":
          return "status-pending";
        case "IN_PROGRESS":
          return "status-progress";
        case "COMPLETED":
          return "status-completed";
        case "CANCELLED":
          return "status-cancelled";
        default:
          return "";
      }
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>


<style scoped>
.order-history-container {
  padding: 1.5rem;
}

.order-history-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
}

.order-history-title {
  color: var(--primary-color);
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 2.2rem;
}

.order-history-subtitle {
  color: var(--text-light);
  font-size: 1.1rem;
}

.loading-spinner {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
}

.loading-spinner .spinner-border {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
}

.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(88, 14, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid var(--primary-color);
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(88, 14, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.order-header h2 {
  font-size: 1.25rem;
  color: var(--text-dark);
  font-weight: 600;
}

.order-status {
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
}

/* ESTILOS POR ESTADO */
.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-progress {
  background-color: #cce5ff;
  color: #004085;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.order-details-title {
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--text-dark);
}

.order-details-list {
  padding-left: 1.2rem;
  list-style: disc;
  color: var(--text-dark);
}

/* BOTÓN "VER MÁS" */
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

@media (max-width: 768px) {
  .order-history-container {
    padding: 1rem;
  }
}
</style>
