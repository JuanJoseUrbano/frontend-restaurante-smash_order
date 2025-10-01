<template>
  <div>
    <HeaderAuthenticated 
      :username="username" 
      :roles="roles" 
      :active-role="activeRole" 
    />

    <div v-if="isEmployee" class="dashboard-container">
      <aside class="dashboard-sidebar">
        <nav>
          <ul>
            <li>
              <router-link to="/dashboard-employee/products">
                <i class="fas fa-box-open me-2"></i> Productos
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-employee/orders">
                <i class="fas fa-clipboard-list me-2"></i> Pedidos
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-employee/tables">
                <i class="fas fa-table me-2"></i> Mesas
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard-employee/reservations">
                <i class="fas fa-calendar-check me-2"></i> Reservas
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
            <div class="summary-card card-products">
              <i class="fas fa-box-open card-icon"></i>
              <div class="card-info">
                <h3>78</h3>
                <p>Productos activos</p>
              </div>
            </div>
            <div class="summary-card card-tables">
              <i class="fas fa-table card-icon"></i>
              <div class="card-info">
                <h3>24</h3>
                <p>Mesas disponibles</p>
              </div>
            </div>
            <div class="summary-card card-orders">
              <i class="fas fa-clipboard-list card-icon"></i>
              <div class="card-info">
                <h3>125</h3>
                <p>Pedidos registrados</p>
              </div>
            </div>
            <div class="summary-card card-reservations">
              <i class="fas fa-calendar-check card-icon"></i>
              <div class="card-info">
                <h3>30</h3>
                <p>Reservas activas</p>
              </div>
            </div>
          </div>
          <router-view />
        </section>
      </main>
    </div>

    <div v-else class="no-access">
      <h2>No tienes permisos para acceder al panel de empleado.</h2>
      <router-link to="/">Volver al inicio</router-link>
    </div>
  </div>
</template>

<script>
import HeaderAuthenticated from '@/components/HeaderAuthenticated.vue';

export default {
  name: "EmployeeDashboardLayout",
  components: { HeaderAuthenticated },
  data() {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return {
      username: user.userName || "Empleado",
      roles: user.roles || []
    };
  },
  computed: {
    activeRole() {
      return localStorage.getItem("activeRole") || "ROLE_CUSTOMER";
    },
    isEmployee() {
      return this.activeRole === "ROLE_EMPLOYEE";
    }
  },
  methods: {
    cambiarRol() {
      localStorage.removeItem("activeRole");
      this.$router.push("/select-role");
    }
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
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.card-icon {
  font-size: 2.5rem;
  margin-right: 1rem;
}

.card-products { background: #FF8C00; }
.card-tables { background: #2ECC71; }
.card-orders { background: #FF6B35; }
.card-reservations { background: #3498DB; color: white; }
.card-pos { background: #8e44ad; cursor: pointer; }

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
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
}

/* POS modal */
.pos-modal {
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background: rgba(0,0,0,0.5);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index: 1000;
}

.pos-content {
  background:white;
  padding:2rem;
  border-radius:12px;
  width:400px;
  max-width:90%;
}

.pos-products {
  display:flex;
  flex-direction:column;
  margin-bottom:1rem;
}

.pos-actions {
  display:flex;
  gap:1rem;
  justify-content:flex-end;
  align-items:center;
}

.btn-create-order {
  background:#2ECC71;
  border:none;
  color:white;
  padding:0.5rem 1rem;
  border-radius:8px;
  cursor:pointer;
}

.btn-cancel {
  background:#e74c3c;
  border:none;
  color:white;
  padding:0.5rem 1rem;
  border-radius:8px;
  cursor:pointer;
}
</style>
