<template>
  <footer class="footer">
    <div class="footer-background">
      <div class="footer-pattern"></div>
    </div>

    <div class="footer-content">
      <!-- Sección Principal -->
      <div class="footer-main">
        <div class="footer-brand">
          <div class="footer-logo">
            <div class="logo-icon">⚽</div>
            <div class="logo-text">
              <span class="club-name">Club Atlético</span>
              <span class="club-subname">Deportivo Acarigua</span>
            </div>
          </div>
          <p class="footer-description">
            Más de 35 años formando atletas de élite y construyendo comunidad
            a través del deporte en Acarigua y toda Venezuela.
          </p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook">
              <i class="el-icon-facebook"></i>
            </a>
            <a href="#" class="social-link" aria-label="Instagram">
              <i class="el-icon-instagram"></i>
            </a>
            <a href="#" class="social-link" aria-label="Twitter">
              <i class="el-icon-twitter"></i>
            </a>
            <a href="#" class="social-link" aria-label="YouTube">
              <i class="el-icon-video-play"></i>
            </a>
          </div>
        </div>

        <!-- Enlaces Rápidos -->
        <div class="footer-links">
          <div class="link-group">
            <h3 class="link-group-title">El Club</h3>
            <ul class="link-list">
              <li><a href="#nosotros" class="footer-link">Nosotros</a></li>
              <li><a href="#historia" class="footer-link">Nuestra Historia</a></li>
              <li><a href="#directiva" class="footer-link">Directiva</a></li>
              <li><a href="#instalaciones" class="footer-link">Instalaciones</a></li>
              <li><a href="#logros" class="footer-link">Logros</a></li>
            </ul>
          </div>

          <div class="link-group">
            <h3 class="link-group-title">Deportes</h3>
            <ul class="link-list">
              <li><a href="#futbol" class="footer-link">Fútbol</a></li>
              <li><a href="#baloncesto" class="footer-link">Baloncesto</a></li>
              <li><a href="#beisbol" class="footer-link">Béisbol</a></li>
              <li><a href="#tenis" class="footer-link">Tenis</a></li>
              <li><a href="#atletismo" class="footer-link">Atletismo</a></li>
            </ul>
          </div>

          <div class="link-group">
            <h3 class="link-group-title">Programas</h3>
            <ul class="link-list">
              <li><a href="#escuelas" class="footer-link">Escuelas Deportivas</a></li>
              <li><a href="#competencias" class="footer-link">Competencias</a></li>
              <li><a href="#torneos" class="footer-link">Torneos Internos</a></li>
              <li><a href="#clinicas" class="footer-link">Clínicas Deportivas</a></li>
              <li><a href="#becas" class="footer-link">Programa de Becas</a></li>
            </ul>
          </div>

          <div class="link-group">
            <h3 class="link-group-title">Contacto</h3>
            <ul class="link-list">
              <li class="contact-item">
                <i class="el-icon-location-information"></i>
                <span>Av. Libertador, Acarigua 3301, Portuguesa</span>
              </li>
              <li class="contact-item">
                <i class="el-icon-phone"></i>
                <span>+58 255-123-4567</span>
              </li>
              <li class="contact-item">
                <i class="el-icon-message"></i>
                <span>info@clubdeportivoacarigua.com</span>
              </li>
              <li class="contact-item">
                <i class="el-icon-time"></i>
                <span>Lun-Vie: 6:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Newsletter -->
      <div class="newsletter-section">
        <div class="newsletter-content">
          <div class="newsletter-text">
            <h3 class="newsletter-title">Mantente Informado</h3>
            <p class="newsletter-description">
              Suscríbete para recibir noticias, resultados y eventos del club.
            </p>
          </div>
          <div class="newsletter-form">
            <el-input
              v-model="email"
              placeholder="Tu correo electrónico"
              class="newsletter-input"
            >
              <template #append>
                <el-button
                  type="primary"
                  class="subscribe-btn"
                  @click="subscribeNewsletter"
                >
                  Suscribirse
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
      </div>

      <!-- Línea Separadora -->
      <div class="footer-divider"></div>

      <!-- Pie Inferior -->
      <div class="footer-bottom">
        <div class="footer-copyright">
          <p>&copy; 2024 Club Atlético Deportivo Acarigua. Todos los derechos reservados.</p>
        </div>

        <div class="footer-legal">
          <a href="#privacidad" class="legal-link">Política de Privacidad</a>
          <a href="#terminos" class="legal-link">Términos de Servicio</a>
          <a href="#cookies" class="legal-link">Política de Cookies</a>
        </div>

        <div class="footer-badges">
          <div class="badge certified">
            <i class="el-icon-medal"></i>
            <span>Club Certificado</span>
          </div>
          <div class="badge members">
            <i class="el-icon-user-solid"></i>
            <span>500+ Miembros</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón Flotante para Ir Arriba -->
    <div
      class="scroll-to-top"
      :class="{ visible: showScrollTop }"
      @click="scrollToTop"
    >
      <i class="el-icon-arrow-up"></i>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'LandingFooter',
  data() {
    return {
      email: '',
      showScrollTop: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    subscribeNewsletter() {
      if (this.email) {
        this.$message({
          message: '¡Gracias por suscribirte! Te hemos enviado un email de confirmación.',
          type: 'success'
        })
        this.email = ''
      } else {
        this.$message({
          message: 'Por favor ingresa tu correo electrónico.',
          type: 'warning'
        })
      }
    },
    handleScroll() {
      this.showScrollTop = window.scrollY > 500
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped>
.footer {
  position: relative;
  background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
  color: white;
  overflow: hidden;
}

.footer-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.footer-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(247, 147, 30, 0.1) 0%, transparent 50%);
}

.footer-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem 2rem;
}

/* Sección Principal */
.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

/* Brand Section */
.footer-brand {
  max-width: 300px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.footer-logo .logo-icon {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 8px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-logo .logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.footer-logo .club-name {
  font-size: 1.2rem;
  font-weight: 700;
}

.footer-logo .club-subname {
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
}

.footer-description {
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  transform: translateY(-2px);
}

/* Links Section */
.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.link-group-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #ff6b35;
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-list li {
  margin-bottom: 0.75rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.footer-link:hover {
  color: #ff6b35;
  padding-left: 5px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.contact-item i {
  color: #ff6b35;
  margin-top: 0.2rem;
  flex-shrink: 0;
}

/* Newsletter */
.newsletter-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.newsletter-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.newsletter-text {
  flex: 1;
}

.newsletter-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ff6b35;
}

.newsletter-description {
  opacity: 0.8;
  margin: 0;
}

.newsletter-form {
  flex: 1;
  max-width: 400px;
}

.newsletter-input {
  border-radius: 25px;
  overflow: hidden;
}

.newsletter-input :deep(.el-input__inner) {
  border: none;
  padding-left: 20px;
}

.subscribe-btn {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border: none;
  border-radius: 0 25px 25px 0;
  padding: 12px 25px;
  font-weight: 600;
}

.subscribe-btn:hover {
  background: linear-gradient(135deg, #e55a2b, #e5841a);
}

/* Footer Bottom */
.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  margin: 2rem 0;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.footer-copyright {
  opacity: 0.7;
  font-size: 0.9rem;
}

.footer-legal {
  display: flex;
  gap: 2rem;
}

.legal-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.legal-link:hover {
  color: #ff6b35;
}

.footer-badges {
  display: flex;
  gap: 1rem;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge i {
  color: #ff6b35;
}

/* Scroll to Top */
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  z-index: 1000;
}

.scroll-to-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.scroll-to-top:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(255, 107, 53, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-brand {
    max-width: 100%;
    text-align: center;
  }

  .footer-logo {
    justify-content: center;
  }

  .social-links {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .footer-content {
    padding: 3rem 1rem 1.5rem;
  }

  .newsletter-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .newsletter-form {
    max-width: 100%;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  .footer-legal {
    flex-direction: column;
    gap: 1rem;
  }

  .footer-badges {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .footer-links {
    grid-template-columns: 1fr;
  }

  .newsletter-section {
    padding: 1.5rem;
  }

  .scroll-to-top {
    bottom: 1rem;
    right: 1rem;
    width: 45px;
    height: 45px;
  }
}
</style>
