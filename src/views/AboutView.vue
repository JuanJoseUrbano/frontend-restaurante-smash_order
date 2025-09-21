<template>
  <div class="container py-5 about-view">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <!-- Título principal -->
        <h1 class="about-title mb-4 text-center">Sobre SmashOrder</h1>
        
        <!-- Introducción -->
        <div class="about-section mb-5">
          <p class="about-text lead">
            En <strong>SmashOrder</strong> nos apasiona la comida rápida con un toque único. 
            Nacimos en 2018 con la idea de reinventar el concepto de comida rápida, ofreciendo 
            hamburguesas, papas y bebidas preparadas con ingredientes frescos y de calidad, 
            servidas en un ambiente moderno y amigable.
          </p>
        </div>

        <!-- Historia y Misión -->
        <div class="row mb-5">
          <div class="col-md-6">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <h3 class="card-title about-subtitle">Nuestra Historia</h3>
                <p class="card-text">
                  Todo comenzó cuando nuestros fundadores, Carlos y Elena, notaron que faltaban 
                  opciones de comida rápida que no sacrificaran calidad por velocidad. Con una 
                  pequeña cocina en el centro de la ciudad y mucha determinación, desarrollaron 
                  las recetas que hoy son la base de nuestro éxito.
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body">
                <h3 class="card-title about-subtitle">Nuestra Misión</h3>
                <p class="card-text">
                  Proporcionar experiencias culinarias excepcionales que combinan ingredientes 
                  frescos, sabores auténticos y servicio rápido, manteniendo siempre nuestro 
                  compromiso con la calidad y satisfacción del cliente.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Valores -->
        <div class="about-section mb-5">
          <h2 class="about-subtitle text-center mb-4">Nuestros Valores</h2>
          <div class="row text-center">
            <div class="col-md-4 mb-4">
              <div class="value-item p-3">
                <div class="value-icon mb-3">
                  <i class="fas fa-heart"></i>
                </div>
                <h4>Calidad</h4>
                <p>Utilizamos solo ingredientes frescos y seleccionados cuidadosamente.</p>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="value-item p-3">
                <div class="value-icon mb-3">
                  <i class="fas fa-bolt"></i>
                </div>
                <h4>Rapidez</h4>
                <p>Servicio eficiente sin comprometer la excelencia en cada preparación.</p>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="value-item p-3">
                <div class="value-icon mb-3">
                  <i class="fas fa-users"></i>
                </div>
                <h4>Comunidad</h4>
                <p>Creemos en construir relaciones duraderas con nuestros clientes y comunidad.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Compromiso con ingredientes -->
        <div class="about-section mb-5">
          <h2 class="about-subtitle text-center mb-4">Nuestro Compromiso</h2>
          <div class="commitment-content p-4 rounded">
            <p class="about-text">
              En SmashOrder, seleccionamos personalmente cada ingrediente. Nuestras carnes 
              provienen de granjas locales que practican la cría sostenible, nuestros panes 
              son horneados diariamente y nuestras salsas son preparadas con recetas exclusivas 
              desarrolladas por nuestro chef.
            </p>
            <p class="about-text">
              Rechazamos los conservantes artificiales y los aditivos innecesarios, porque 
              creemos que la buena comida debe ser tan natural como deliciosa.
            </p>
          </div>
        </div>

        <!-- Equipo -->
        <div class="about-section mb-5">
          <h2 class="about-subtitle text-center mb-4">Conoce a Nuestro Equipo</h2>
          <div class="row">
            <div class="col-md-6 mb-4">
              <div class="team-member text-center">
                <div class="member-photo mb-3">
                  <i class="fas fa-user-circle fa-4x"></i>
                </div>
                <h4>Carlos Méndez</h4>
                <p class="text-muted">Co-Fundador & Chef Ejecutivo</p>
                <p>Con más de 15 años de experiencia en gastronomía, es el artífice de nuestras recetas.</p>
              </div>
            </div>
            <div class="col-md-6 mb-4">
              <div class="team-member text-center">
                <div class="member-photo mb-3">
                  <i class="fas fa-user-circle fa-4x"></i>
                </div>
                <h4>Elena Rojas</h4>
                <p class="text-muted">Co-Fundadora & Gerente de Operaciones</p>
                <p>Elena se asegura de que cada aspecto de tu experiencia SmashOrder sea excepcional.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Llamada a la acción -->
        <div class="text-center mt-5">
          <p class="about-text mb-4">
            ¡Gracias por confiar en nosotros! Queremos seguir creciendo y siendo tu primera opción en comidas rápidas.
          </p>
          <router-link to="/" class="btn btn-outline-primary btn-lg">
            Volver al inicio
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutView",
};
</script>

<style scoped>
.about-title {
  color: #580E00;
  font-size: 2.8rem;
  font-weight: 800;
  text-align: center;
  position: relative;
  padding-bottom: 15px;
}

.about-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background-color: #FF8C00;
  border-radius: 2px;
}

.about-subtitle {
  color: #580E00;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.about-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1rem;
}

.value-item {
  transition: transform 0.3s ease;
}

.value-item:hover {
  transform: translateY(-5px);
}

.value-icon {
  color: #FF8C00;
  font-size: 2.5rem;
}

.commitment-content {
  background-color: #FFF5E6;
  border-left: 4px solid #FF8C00;
}

.team-member {
  padding: 20px;
  border-radius: 10px;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.team-member:hover {
  background-color: #FFF5E6;
  transform: translateY(-3px);
}

.member-photo {
  color: #580E00;
}

.btn-primary {
  background-color: #580E00;
  border-color: #580E00;
  padding: 10px 25px;
}

.btn-primary:hover {
  background-color: #FF8C00;
  border-color: #FF8C00;
}

.btn-outline-primary {
  color: #580E00;
  border-color: #580E00;
  padding: 10px 25px;
}

.btn-outline-primary:hover {
  background-color: #580E00;
  border-color: #580E00;
  color: white;
}

@media (max-width: 768px) {
  .about-title {
    font-size: 2.2rem;
  }
  
  .about-text {
    font-size: 1rem;
  }
}
</style>