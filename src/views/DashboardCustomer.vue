<template>
  <div>
    <!-- Header -->
    <HeaderAuthenticated 
      :username="username" 
      :roles="roles" 
      :active-role="activeRole" 
    />

    <div v-if="isCustomer" class="dashboard-container">
      <!-- Sidebar -->
      <aside class="dashboard-sidebar">
        <nav>
          <ul>
            <li>
              <router-link to="/dashboard-customer/notifications">
                <i class="fas fa-bell me-2"></i> Notificaciones
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-customer/menu">
                <i class="fas fa-box-open me-2"></i> Menú
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-customer/tables">
                <i class="fas fa-chair me-2"></i> Mesas
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-customer/history-orders">
                <i class="fas fa-clipboard-list me-2"></i> Mis Pedidos
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-customer/reservations">
                <i class="fas fa-calendar-check me-2"></i> Mis Reservas
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Contenido principal -->
      <main class="dashboard-content">
        <header class="dashboard-header d-flex justify-content-between align-items-center">
          <h1>Bienvenido, {{ username }}</h1>
          <div v-if="roles.length > 1">
            <button class="btn-role-switch" @click="cambiarRol">
              <i class="fas fa-exchange-alt"></i> Cambiar Rol
            </button>
          </div>
        </header>

        <section class="dashboard-main">
          <!-- Cards resumen -->
          <div class="cards-container">
            <!-- Productos -->
            <div class="summary-card card-products">
              <i class="fas fa-box-open card-icon"></i>
              <div class="card-info">
                <h3>{{ productosCount }}</h3>
                <p>Productos disponibles</p>
              </div>
            </div>

            <!-- Pedidos -->
            <div class="summary-card card-orders">
              <i class="fas fa-clipboard-list card-icon"></i>
              <div class="card-info">
                <h3>{{ pedidosCount }}</h3>
                <p>Pedidos realizados</p>
              </div>
            </div>

            <!-- Reservas -->
            <div class="summary-card card-reservations">
              <i class="fas fa-calendar-check card-icon"></i>
              <div class="card-info">
                <h3>{{ reservasCount }}</h3>
                <p>Reservas activas</p>
              </div>
            </div>
          </div>

          <!-- Router view -->
          <router-view />
        </section>
      </main>
    </div>

    <div v-else class="no-access">
      <h2>No tienes permisos para acceder al panel de cliente.</h2>
      <router-link to="/">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script>
import HeaderAuthenticated from '@/components/HeaderAuthenticated.vue';
import { countAllProducts } from "@/services/products";
import { countOrdersByCustomer } from "@/services/orders";
import { countActiveReservationsByCustome } from "@/services/reservation";

export default {
  name: "CustomerDashboardLayout",
  components: { HeaderAuthenticated },
  data() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return {
      username: user.userName || "Cliente",
      userId: user.id || null,
      roles: user.roles || [],
      productosCount: 0,
      pedidosCount: 0,
      reservasCount: 0,
      intervalId: null
    };
  },
  computed: {
    activeRole() {
      return localStorage.getItem("activeRole") || "ROLE_CUSTOMER";
    },
    isCustomer() {
      return this.activeRole === "ROLE_CUSTOMER";
    }
  },
  methods: {
    cambiarRol() {
      localStorage.removeItem("activeRole");
      this.$router.push("/select-role");
    },
    async cargarProductos() {
      try {
        this.productosCount = await countAllProducts();
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    },
    async cargarPedidos() {
      try {
        if (this.userId) {
          this.pedidosCount = await countOrdersByCustomer(this.userId);
        }
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      }
    },
    async cargarReservas() {
      try {
        if (this.userId) {
          this.reservasCount = await countActiveReservationsByCustome(this.userId);
        }
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      }
    },
    async cargarDatos() {
      await Promise.all([
        this.cargarProductos(),
        this.cargarPedidos(),
        this.cargarReservas()
      ]);
    },
    iniciarAutoRefresh() {
      this.intervalId = setInterval(this.cargarDatos, 5000);
    }
  },
  mounted() {
    if (!this.isCustomer) {
      this.$router.push("/select-role");
      return;
    }
    this.cargarDatos();
    this.iniciarAutoRefresh();
  },
  beforeUnmount() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

/* --- SIDEBAR --- */
.dashboard-sidebar {
  width: 180px;
  background: #580e00;
  color: white;
  padding: 1rem;
  flex-shrink: 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
}

.dashboard-sidebar ul {
  list-style: none;
  padding: 0;
}

.dashboard-sidebar li {
  margin-bottom: 1rem;
}

.dashboard-sidebar a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 8px 0 0 8px;
  transition: all 0.2s ease;
}

.dashboard-sidebar a:hover,
.dashboard-sidebar a.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  font-weight: 700;
}

/* --- CONTENIDO PRINCIPAL --- */
.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.dashboard-main {
  flex: 1;
  padding: 2rem;
}

/* --- CARDS --- */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 16px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
}

.card-products {
  background: #FF8C00;
}

.card-orders {
  background: #FF6B35;
}

.card-reservations {
  background: #3498DB;
}

.card-info h3 {
  margin: 0;
  font-size: 1.5rem;
}

.card-info p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* --- BOTÓN CAMBIAR ROL --- */
.btn-role-switch {
  background: linear-gradient(135deg, #580e00, #7a2615);
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}
.btn-role-switch:hover {
  background: linear-gradient(135deg, #7a2615, #a8321e);
  transform: translateY(-2px);
}

/* --- RESPONSIVE --- */
@media (max-width: 1024px) {
  .dashboard-container {
    flex-direction: column;
  }

  .dashboard-sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding: 0.5rem;
  }

  .dashboard-sidebar ul {
    display: flex;
    gap: 1rem;
  }

  .dashboard-sidebar li {
    margin-bottom: 0;
  }

  .dashboard-main {
    padding: 1rem;
  }

  .cards-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .card-info h3 {
    font-size: 1.2rem;
  }

  .card-info p {
    font-size: 0.8rem;
  }
}
</style>
