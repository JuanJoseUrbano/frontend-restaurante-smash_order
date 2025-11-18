<template>
  <div>
    <HeaderAuthenticated :username="username" :roles="roles" :active-role="activeRole" :user-id="userId" />

    <div v-if="isCustomer" class="dashboard-container">
      <!-- Sidebar -->
      <aside class="dashboard-sidebar">
        <!-- Logo del restaurante -->
        <div class="sidebar-logo">
          <img src="../assets/logo_smash_order.png" alt="Logo del Restaurante" class="logo-img" />
        </div>

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
            <div class="summary-card card-products">
              <i class="fas fa-box-open card-icon"></i>
              <div class="card-info">
                <h3>{{ productosCount }}</h3>
                <p>Productos disponibles</p>
              </div>
            </div>

            <div class="summary-card card-orders">
              <i class="fas fa-clipboard-list card-icon"></i>
              <div class="card-info">
                <h3>{{ pedidosCount }}</h3>
                <p>Pedidos realizados</p>
              </div>
            </div>

            <div class="summary-card card-reservations">
              <i class="fas fa-calendar-check card-icon"></i>
              <div class="card-info">
                <h3>{{ reservasCount }}</h3>
                <p>Reservas activas</p>
              </div>
            </div>
          </div>

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
import { countActiveReservationsByCustomer } from "@/services/reservation";

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
    async cargarDatos() {
      try {
        this.productosCount = await countAllProducts();
        if (this.userId) {
          this.pedidosCount = await countOrdersByCustomer(this.userId);
          this.reservasCount = await countActiveReservationsByCustomer(this.userId);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
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
  width: 200px;
  background: #580e00;
  color: white;
  padding: 1rem;
  flex-shrink: 0;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Logo */
.sidebar-logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-img {
  width: 110px;
  height: 110px;
  object-fit: contain;
  border-radius: 50%;
  background: white;
  padding: 6px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.logo-img:hover {
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
}

.dashboard-sidebar ul {
  list-style: none;
  padding: 0;
  width: 100%;
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
  padding: 0.8rem 1rem;
  border-radius: 8px 0 0 8px;
  transition: all 0.25s ease;
}

.dashboard-sidebar a:hover,
.dashboard-sidebar a.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  font-weight: 600;
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
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.1);
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
  padding: 1rem 1.2rem;
  border-radius: 18px;
  color: white;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.18);
}

.card-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
}

.card-products {
  background: linear-gradient(135deg, #FF8C00, #FFB347);
}

.card-orders {
  background: linear-gradient(135deg, #FF6B35, #FF8C42);
}

.card-reservations {
  background: linear-gradient(135deg, #C0392B, #E74C3C);
}

.card-info h3 {
  margin: 0;
  font-size: 1.5rem;
}

.card-info p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.85;
}

/* --- BOTÓN CAMBIO DE ROL --- */
.btn-role-switch {
  background: linear-gradient(135deg, #580e00, #7a2615);
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
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
    align-items: center;
  }

  .sidebar-logo {
    display: none;
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
    font-size: 1.3rem;
  }

  .card-info p {
    font-size: 0.85rem;
  }
}
</style>
