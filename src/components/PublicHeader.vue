<template>
  <nav class="navbar navbar-expand-lg navbar-custom">
    <div class="container-fluid">
      <!-- Marca -->
      <router-link to="/" class="navbar-brand">
        <span class="brand-main">SmashOrder</span>
      </router-link>

      <button
        class="navbar-toggler custom-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Opciones -->
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav ms-auto nav-buttons">
          <li class="nav-item">
            <router-link to="/signin" class="nav-link btn btn-light d-flex align-items-center">
              <i class="fas fa-user-plus me-2"></i>
              Registrar
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link btn btn-light d-flex align-items-center">
              <i class="fas fa-sign-in-alt me-2"></i>
              Entrar
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "PublicHeader",
};
</script>

<style scoped>
/* Navbar general */
.navbar-custom {
  background-color: #580e00;
  padding: 0.5rem 1rem;
}

/* Marca */
.navbar-brand {
  font-weight: 800;
  font-size: 2rem;
  color: white !important;
  text-decoration: none;
}

.brand-main {
  color: white;
  font-size: 2rem;
}

/* Links / botones */
.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 6px;
  padding: 0.4rem 0.9rem;
  transition: 0.3s ease;
}

.btn-light {
  background-color: white;
  color: #580e00 !important;
  border: none;
}

.btn-light:hover {
  background-color: #f5f5f5;
  color: #580e00 !important;
}

/* Íconos */
.nav-link i {
  font-size: 1rem;
}

/* En desktop: botones separados */
.nav-buttons {
  display: flex;
  gap: 1rem;
}

/* BOTÓN HAMBURGUESA PERSONALIZADO */
.custom-toggler {
  border: none;
  background-color: white; /* Fondo blanco */
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
}

/* Cambiar color del ícono (rayitas) */
.custom-toggler .navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba(88,14,0, 1)' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

/* RESPONSIVO */
@media (max-width: 991.98px) {
  .navbar-collapse {
    margin-top: 0.8rem;
  }

  /* Botones ocupan todo el ancho */
  .nav-buttons {
    flex-direction: column;
    gap: 0.8rem;
    width: 100%;
  }

  .nav-item .nav-link {
    width: 100%;
    text-align: center;
  }
}
</style>
