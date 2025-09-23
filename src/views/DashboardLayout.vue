<template>
  <HeaderAuthenticatedAdmin />

  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="dashboard-sidebar">
      <h2 class="sidebar-title"><i class="fas fa-tools me-2"></i>Admin Dashboard</h2>
      <nav>
        <ul>
          <li>
            <router-link to="/dashboard/users">
              <i class="fas fa-users me-2"></i> Usuarios
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/products">
              <i class="fas fa-box-open me-2"></i> Productos
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/categories">
              <i class="fas fa-tags me-2"></i> Categorías
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/tables">
              <i class="fas fa-table me-2"></i> Mesas
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Contenido principal -->
    <main class="dashboard-content">
      <header class="dashboard-header">
        <h1>Bienvenido, {{ username }}</h1>
      </header>

      <section class="dashboard-main">
        <!-- Cards resumen -->
        <div class="cards-container">
          <div class="summary-card card-users">
            <i class="fas fa-users card-icon"></i>
            <div class="card-info">
              <h3>125</h3>
              <p>Usuarios registrados</p>
            </div>
          </div>
          <div class="summary-card card-products">
            <i class="fas fa-box-open card-icon"></i>
            <div class="card-info">
              <h3>78</h3>
              <p>Productos activos</p>
            </div>
          </div>
          <div class="summary-card card-categories">
            <i class="fas fa-tags card-icon"></i>
            <div class="card-info">
              <h3>12</h3>
              <p>Categorías</p>
            </div>
          </div>
          <div class="summary-card card-tables">
            <i class="fas fa-table card-icon"></i>
            <div class="card-info">
              <h3>24</h3>
              <p>Mesas disponibles</p>
            </div>
          </div>
        </div>

        <!-- Contenido de rutas hijas -->
        <router-view />
      </section>
    </main>
  </div>
</template>

<script>
import HeaderAuthenticatedAdmin from '@/components/HeaderAuthenticatedAdmin.vue';

export default {
  name: "DashboardLayout",
  components: { HeaderAuthenticatedAdmin },
  data() {
    return {
      username: localStorage.getItem("username") || "Administrador",
    };
  }
};
</script>

<style scoped>
/* Layout general */
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

.sidebar-title {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
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

/* Contenido principal */
.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

/* Colores por tipo de card */
.card-users { background: #FF6B35; }
.card-products { background: #FF8C00; }
.card-categories { background: #FFD700; color: #333; }
.card-tables { background: #2ECC71; }

/* Info dentro de card */
.card-info h3 {
  margin: 0;
  font-size: 1.5rem;
}

.card-info p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-container { flex-direction: column; }
  .dashboard-sidebar { width: 100%; flex-direction: row; overflow-x: auto; margin-right: 0; border-radius: 0; padding: 0.5rem; }
  .dashboard-sidebar ul { display: flex; gap: 1rem; }
  .dashboard-sidebar li { margin-bottom: 0; }
  .dashboard-main { padding: 1rem; }
  .cards-container { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
  .card-info h3 { font-size: 1.2rem; }
  .card-info p { font-size: 0.8rem; }
}

@media (max-width: 480px) {
  .cards-container { grid-template-columns: 1fr; }
  .dashboard-sidebar a { padding: 0.5rem; font-size: 0.8rem; }
}
</style>
