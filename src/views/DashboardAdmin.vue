<template>
  <div>
    <HeaderAuthenticatedAdmin 
      :username="username" 
      :roles="roles" 
      :active-role="activeRole" 
    />

    <div v-if="isAdminOrEmployee" class="dashboard-container">
      <aside class="dashboard-sidebar">
        <div class="sidebar-logo">
          <img src="../assets/logo_smash_order.png" alt="Logo del Restaurante" class="logo-img" />
        </div>

        <nav>
          <ul>
            <li>
              <router-link to="/dashboard-admin/users">
                <i class="fas fa-users me-2"></i> Usuarios
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-admin/orders">
                <i class="fas fa-clipboard-list me-2"></i> Pedidos
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-admin/reservations">
                <i class="fas fa-calendar-check me-2"></i> Reservas
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-admin/products">
                <i class="fas fa-box-open me-2"></i> Productos
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-admin/categories">
                <i class="fas fa-tags me-2"></i> Categorías
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-admin/tables">
                <i class="fas fa-table me-2"></i> Mesas
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-admin/payments">
                <i class="fas fa-credit-card me-2"></i> Pagos
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

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
          <div class="cards-container">
            <div class="summary-card card-users">
              <i class="fas fa-users card-icon"></i>
              <div class="card-info">
                <h3>{{ usersCount }}</h3>
                <p>Usuarios registrados</p>
              </div>
            </div>
            <div class="summary-card card-products">
              <i class="fas fa-box-open card-icon"></i>
              <div class="card-info">
                <h3>{{ productosCount }}</h3>
                <p>Productos activos</p>
              </div>
            </div>
            <div class="summary-card card-categories">
              <i class="fas fa-tags card-icon"></i>
              <div class="card-info">
                <h3>{{ categoriesCount }}</h3>
                <p>Categorías</p>
              </div>
            </div>
            <div class="summary-card card-tables">
              <i class="fas fa-table card-icon"></i>
              <div class="card-info">
                <h3>{{ mesasCount }}</h3>
                <p>Mesas disponibles</p>
              </div>
            </div>
          </div>
          <router-view />
        </section>
      </main>
    </div>

    <div v-else class="no-access">
      <h2>No tienes permisos para acceder al panel de administración.</h2>
      <router-link to="/">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script>
import HeaderAuthenticatedAdmin from '@/components/HeaderAuthenticated.vue';
import { countAllProducts } from "@/services/products";
import { countAvailableTables } from "@/services/tables";
import { countAllUsers } from "@/services/users";
import { countAllCategories } from "@/services/categories";

export default {
  name: "DashboardLayout",
  components: { HeaderAuthenticatedAdmin },
  data() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return {
      username: user.userName || "Usuario",
      roles: user.roles || [],
      productosCount: 0,
      mesasCount: 0,
      usersCount: 0,
      categoriesCount: 0,
      intervalId: null
    };
  },
  computed: {
    activeRole() {
      return localStorage.getItem("activeRole") || "ROLE_ADMIN";
    },
    isAdminOrEmployee() {
      return this.activeRole === "ROLE_ADMIN" || this.activeRole === "ROLE_EMPLOYEE";
    }
  },
  methods: {
    cambiarRol() {
      localStorage.removeItem("activeRole");
      this.$router.push("/select-role");
    },

    async cargarProductosCount() {
      try { this.productosCount = await countAllProducts(); } 
      catch (error) { console.error("Error al cargar productos:", error); }
    },

    async cargarMesasCount() {
      try { this.mesasCount = await countAvailableTables(); } 
      catch (error) { console.error("Error al cargar mesas:", error); }
    },

    async cargarUsersCount() {
      try { this.usersCount = await countAllUsers(); }
      catch (error) { console.error("Error al cargar usuarios:", error); }
    },

    async cargarCategoriesCount() {
      try { this.categoriesCount = await countAllCategories(); }
      catch (error) { console.error("Error al cargar categorías:", error); }
    },

    async cargarDatos() {
      await Promise.all([
        this.cargarProductosCount(),
        this.cargarMesasCount(),
        this.cargarUsersCount(),
        this.cargarCategoriesCount()
      ]);
    },

    iniciarAutoRefresh() {
      this.intervalId = setInterval(this.cargarDatos, 5000);
    }
  },
  mounted() {
    if (!this.isAdminOrEmployee) return;
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
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
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
  width: 110px; /* antes 70px */
  height: 110px; /* antes 70px */
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


.logo-title {
  margin-top: 0.6rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
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
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dashboard-sidebar a:hover,
.dashboard-sidebar a.router-link-active {
  background: rgba(255, 255, 255, 0.15);
  font-weight: 700;
  text-decoration: none;
}

/* --- CONTENIDO --- */
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

/* --- TARJETAS --- */
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

.card-users {
  background: #FF6B35;
}

.card-products {
  background: #FF8C00;
}

.card-categories {
  background: #FFD700;
  color: #333;
}

.card-tables {
  background: #2ECC71;
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

/* --- BOTÓN CAMBIO DE ROL --- */
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

  .sidebar-logo {
    display: none;
  }

  .dashboard-sidebar ul {
    display: flex;
    gap: 1rem;
  }
}
</style>
