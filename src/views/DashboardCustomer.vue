<template>
  <!-- Header -->
    <HeaderAuthenticated :username="username" :roles="roles" :active-role="activeRole" />
  <div>
    <div v-if="isCustomer" class="dashboard-container">
      <!-- Sidebar -->
      <aside class="dashboard-sidebar">
        <nav>
          <ul>
            <li>
              <router-link to="/dashboard-customer/menu">
                <i class="fas fa-box-open me-2"></i> Menu
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-customer/tables">
                <i class="fas fa-chair me-2"></i> Mesas
              </router-link>
            </li>

            <li>
              <router-link to="/dashboard-customer/orders">
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
                <h3>{{ productos.length }}</h3>
                <p>Productos disponibles</p>
              </div>
            </div>
            <div class="summary-card card-orders">
              <i class="fas fa-clipboard-list card-icon"></i>
              <div class="card-info">
                <h3>{{ pedidos.length }}</h3>
                <p>Pedidos realizados</p>
              </div>
            </div>
            <div class="summary-card card-reservations">
              <i class="fas fa-calendar-check card-icon"></i>
              <div class="card-info">
                <h3>{{ reservas.length }}</h3>
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

export default {
  name: "CustomerDashboardLayout",
  components: { HeaderAuthenticated },
  data() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return {
      username: user.userName || "Cliente",
      roles: user.roles || [],
      productos: [],
      pedidos: [],
      reservas: []
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
      this.productos = [{ id: 1 }, { id: 2 }, { id: 3 }];
    },
    async cargarPedidos() {
      this.pedidos = [{ id: 1 }, { id: 2 }];
    },
    async cargarReservas() {
      this.reservas = [{ id: 1 }];
    }
  },
  mounted() {
    if (!this.isCustomer) {
      this.$router.push("/select-role");
      return;
    }
    this.cargarProductos();
    this.cargarPedidos();
    this.cargarReservas();
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

.dashboard-sidebar {
  width: 200px;
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
  text-decoration: none;
}

/* Contenido */
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

/* Cards resumen */
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

/* Colores específicos */
.card-products { background: #FF8C00; }
.card-orders { background: #FF6B35; }
.card-reservations { background: #3498DB; }

.card-info h3 {
  margin: 0;
  font-size: 1.5rem;
}

.card-info p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

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
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

.btn-role-switch i {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-container {
    flex-direction: column;
  }

  .dashboard-sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    margin-right: 0;
    border-radius: 0;
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

@media (max-width: 480px) {
  .cards-container {
    grid-template-columns: 1fr;
  }

  .dashboard-sidebar a {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
