<template>
  <footer class="footer-custom">
    <div class="footer-content container py-4">
      <div class="footer-section text-center text-md-start">
        <!-- Marca -->
        <div class="footer-brand mb-3">
          <span class="footer-title">SmashOrder</span>
        </div>

        <!-- Información -->
        <div class="footer-links">
          <p class="footer-terms mb-2">
            © 2025 SmashOrder. Todos los derechos reservados.
          </p>
          <p class="footer-address mb-2">
            Av. Siempre Viva #123, Bogotá - Colombia
          </p>
          <p class="footer-contact mb-2">
            Contáctanos:
            <a href="mailto:pedidos@smashorder.com" class="footer-link">
              pedidos@smashorder.com
            </a>
            | Tel: +57 310 123 4567
          </p>

          <!-- Router Link agregado -->
          <router-link to="/about" class="footer-link about-link">
            Sobre Nosotros
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style scoped>
.footer-custom {
  background-color: #580e00; /* Igual al header */
  color: #ffffff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  position: relative;
  z-index: 1;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.footer-title {
  font-weight: 700;
  font-size: 1.4rem;
  color: #ffffff;
}

.footer-terms,
.footer-address,
.footer-contact {
  font-size: 0.95rem;
  margin: 0.25rem 0;
  color: #f5f5f5;
}

.footer-link {
  color: #ffcc00;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #ffd633;
  text-decoration: underline;
}

.about-link {
  display: inline-block;
  margin-top: 0.6rem;
  font-size: 1rem;
  font-weight: 600;
}

/* Responsive */
@media (min-width: 768px) {
  .footer-section {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .footer-brand {
    margin-bottom: 0;
    justify-content: flex-start;
  }

  .footer-links {
    text-align: right;
  }
}
</style>
