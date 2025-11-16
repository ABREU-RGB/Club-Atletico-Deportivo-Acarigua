<template>
  <div class="landing-container">
    <!-- NavBar Component -->
    <NavBar/>

    <!-- Banner Component -->
    <Banner/>

    <!-- Secciones de contenido -->
    <main class="main-content">
      <!-- Aquí irán las demás secciones -->
      <section id="nosotros" class="content-section">
        <div class="section-content">
          <h2>Sobre Nosotros</h2>
          <p>Contenido sobre el club...</p>
        </div>
      </section>

      <section id="deportes" class="content-section">
        <div class="section-content">
          <h2>Nuestros Deportes</h2>
          <p>Contenido sobre deportes...</p>
        </div>
      </section>

      <!-- Más secciones... -->
    </main>

    <!-- Footer Component -->
    <Footer/>
  </div>
</template>

<script>
import NavBar from '@/components/Landing/NavBar.vue';
import Banner from '@/components/Landing/Banner.vue';
import Footer from '@/components/Landing/Footer.vue';
export default {
  name: 'LandingPage',
  components: {
    NavBar,
    Banner,
    Footer
  }
}
</script>

<style scoped>
.landing-container {
  min-height: 100vh;
}

.main-content {
  min-height: 100vh;
}

.content-section {
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.content-section:nth-child(even) {
  background: #f7fafc;
}

.section-content {
  text-align: center;
}

.section-content h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #1a365d;
}

.section-content p {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .content-section {
    padding: 3rem 1rem;
  }

  .section-content h2 {
    font-size: 2rem;
  }
}
</style>
