<template>
  <div id="app">
    <!-- Header -->
    <PublicHeader />

    <!-- Contenido principal -->
    <main class="main-content">
     <router-view />
    </main>

    <!-- Footer -->
    <FooterComponent />
  </div>
</template>

<script>
import FooterComponent from './components/FooterComponent.vue';
import PublicHeader from './components/PublicHeader.vue';

export default {
  name: 'App',
  components: {
    PublicHeader,
    FooterComponent
  }
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* El contenido crece para empujar el footer al fondo */
.main-content {
  flex: 1;
  padding: 1rem 1rem; /* espacio para que no quede pegado */
}
</style>
