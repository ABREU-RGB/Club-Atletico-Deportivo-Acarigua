<template>
  <section class="banner">
    <div class="banner-background">
      <div class="banner-overlay"></div>
      <div class="banner-pattern"></div>
    </div>

    <div class="banner-content">
      <div class="banner-text">
        <div class="badge">
          <span class="badge-text">Fundado 1985</span>
        </div>

        <h1 class="banner-title">
          <span class="title-line">Club Atlético</span>
          <span class="title-line highlight">Deportivo Acarigua</span>
        </h1>

        <p class="banner-description">
          Más de 35 años formando atletas de élite y construyendo comunidad
          a través del deporte. Pasión, disciplina y excelencia deportiva.
        </p>

        <div class="banner-stats">
          <div class="stat-item">
            <div class="stat-number">35+</div>
            <div class="stat-label">Años de Historia</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">15+</div>
            <div class="stat-label">Disciplinas</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">500+</div>
            <div class="stat-label">Atletas Activos</div>
          </div>
        </div>

        <div class="banner-actions">
          <el-button
            type="primary"
            size="large"
            class="primary-action"
            @click="goToLogin"
          >
            <i class="el-icon-user"></i>
            Acceder al Sistema
          </el-button>

          <el-button
            size="large"
            class="secondary-action"
            @click="scrollToSection('nosotros')"
          >
            <i class="el-icon-info"></i>
            Conocer Más
          </el-button>
        </div>
      </div>

      <div class="banner-visual">
        <div class="sports-showcase">
          <div class="sport-card football">
            <div class="sport-icon">⚽</div>
            <span class="sport-name">Fútbol</span>
          </div>
          <div class="sport-card basketball">
            <div class="sport-icon">🏀</div>
            <span class="sport-name">Baloncesto</span>
          </div>
          <div class="sport-card baseball">
            <div class="sport-icon">⚾</div>
            <span class="sport-name">Béisbol</span>
          </div>
          <div class="sport-card tennis">
            <div class="sport-icon">🎾</div>
            <span class="sport-name">Tenis</span>
          </div>
        </div>

        <div class="floating-elements">
          <div class="floating-element trophy">
            <div class="trophy-icon">🏆</div>
          </div>
          <div class="floating-element medal">
            <div class="medal-icon">🥇</div>
          </div>
          <div class="floating-element stadium">
            <div class="stadium-icon">🏟️</div>
          </div>
        </div>
      </div>
    </div>

    <div class="scroll-indicator">
      <div class="scroll-text">Desplázate para descubrir</div>
      <div class="scroll-arrow"></div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LandingBanner',
  methods: {
    goToLogin() {
      this.$router.push('/login')
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  },
  mounted() {
    this.startAnimations()
  }
}
</script>

<style scoped>
.banner {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #4a5568 100%);
}

.banner-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(247, 147, 30, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(26, 54, 93, 0.2) 0%, transparent 50%);
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(26, 54, 93, 0.9) 0%, rgba(45, 55, 72, 0.7) 100%);
}

.banner-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.1) 1px, transparent 0);
  background-size: 20px 20px;
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 2rem 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

/* Texto del Banner */
.banner-text {
  color: white;
}

.badge {
  display: inline-block;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  margin-bottom: 2rem;
}

.badge-text {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.banner-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.title-line {
  display: block;
}

.highlight {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.banner-description {
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  font-weight: 300;
}

/* Estadísticas */
.banner-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #ff6b35;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  font-weight: 500;
}

/* Botones de Acción */
.banner-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.primary-action {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border: none;
  padding: 15px 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.primary-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.secondary-action {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 15px 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.secondary-action:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* Visual del Banner */
.banner-visual {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.sports-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.sport-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.sport-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.sport-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.sport-name {
  font-weight: 600;
  color: white;
}

/* Elementos Flotantes */
.floating-elements {
  position: relative;
  height: 200px;
  width: 100%;
}

.floating-element {
  position: absolute;
  animation: float 3s ease-in-out infinite;
  opacity: 0;
  animation-fill-mode: forwards;
}

.floating-element.trophy {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-element.medal {
  top: 10%;
  right: 20%;
  animation-delay: 0.5s;
}

.floating-element.stadium {
  bottom: 20%;
  left: 30%;
  animation-delay: 1s;
}

.trophy-icon,
.medal-icon,
.stadium-icon {
  font-size: 3rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Indicador de Scroll */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  text-align: center;
  z-index: 2;
}

.scroll-text {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  opacity: 0.7;
  font-weight: 500;
}

.scroll-arrow {
  width: 20px;
  height: 20px;
  border-right: 2px solid white;
  border-bottom: 2px solid white;
  transform: rotate(45deg);
  margin: 0 auto;
  animation: bounce 2s infinite;
  opacity: 0.7;
}

/* Animaciones */
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
  from {
    opacity: 0;
    transform: translateY(30px);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: rotate(45deg) translateY(0);
  }
  40% {
    transform: rotate(45deg) translateY(-10px);
  }
  60% {
    transform: rotate(45deg) translateY(-5px);
  }
}

/* Responsive */
@media (max-width: 968px) {
  .banner-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }

  .banner-title {
    font-size: 2.8rem;
  }

  .banner-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .banner-content {
    padding: 100px 1rem 60px;
  }

  .banner-title {
    font-size: 2.2rem;
  }

  .banner-description {
    font-size: 1.1rem;
  }

  .banner-stats {
    gap: 1.5rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .sports-showcase {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .banner-actions {
    justify-content: center;
  }

  .banner-actions .el-button {
    width: 100%;
    max-width: 250px;
  }
}

@media (max-width: 480px) {
  .banner-title {
    font-size: 1.8rem;
  }

  .banner-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .floating-elements {
    height: 150px;
  }

  .trophy-icon,
  .medal-icon,
  .stadium-icon {
    font-size: 2rem;
  }
}
</style>
