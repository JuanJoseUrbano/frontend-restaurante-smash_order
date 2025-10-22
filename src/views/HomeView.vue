<template>
  <PublicHeader/>
  <main class="container main-section">
    <div class="row w-100 align-items-center">
      <!-- Imagen -->
      <div class="col-md-6 text-center mb-4 mb-md-0">
        <img
          src="@/assets/logo_smash_order.png"
          alt="Logo SmashOrder"
          class="brand-image"
        />
      </div>
      <!-- Descripción -->
      <div class="col-md-6 text-center">
        <h2 class="title-text fw-bold">El sabor rápido que estabas esperando</h2>
        <p class="desc-text mt-3">
          Sitio web de comidas rápidas, principalmente hamburguesas, con un estilo moderno, llamativo y
          apetitoso, resaltando frescura y rapidez en el servicio.
        </p>
        <router-link to="/catalogo" class="btn-order mt-3">Pedir ahora</router-link>
      </div>
    </div>
  </main>
</template>

<script>
import PublicHeader from '@/components/PublicHeader.vue';

export default {
  name: "HomeView",
   components: {
    PublicHeader
  }
};
</script>

<style scoped>
.main-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.brand-image {
  max-width: 95%;
  height: auto;
}

.title-text {
  font-size: 2.5rem; /* Mucho más grande */
  color: #580e00;
}

.desc-text {
  font-size: 1.3rem; /* Texto descriptivo más grande */
  line-height: 1.6;
  color: #580e00;
}

.btn-order {
  display: inline-block;
  background-color: #4b0d0d;
  color: white !important;
  text-decoration: none;
  padding: 14px 30px;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: 0.3s;
}

.btn-order:hover {
  background-color: #330909;
}
</style>
