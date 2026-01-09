<template>
  <footer id="footer" class="footer">
    <div class="footer-content">
      <div class="footer-grid">
        <!-- Columna 1: Marca -->
        <div class="footer-column brand-column">
          <div class="footer-logo">
            <img src="../../assets/icons/logo.png" class="logo-icon">
            <div class="logo-text">
              <span class="club-name">Club Atlético</span>
              <span class="club-subname">Deportivo Acarigua</span>
              <span class="club-motto">"La Armadura de Dios"</span>
            </div>
          </div>
          <p class="brand-info">
            Asociación Civil - RIF: J-503114630<br>
            Afiliada a la Asociación de Fútbol de Portuguesa
          </p>
        </div>

        <!-- Columna 2: Contacto -->
        <div class="footer-column">
          <h3 class="column-title">Contacto</h3>
          <ul class="contact-list">
            <li>
              <div class="contact-item">
                <a href="https://wa.me/5841215562442" target="_blank" rel="noopener" class="icon-link">
                  <img src="../../assets/icons/whatsapp-icon.png" alt="Whatsapp" class="contact-icon">
                </a>
                <span class="static-text">+58 412-15562442</span>
              </div>
            </li>
            <li>
              <div class="contact-item">
                <a href="mailto:clubatleticodeportivoacarigua@gmail.com" class="icon-link">
                  <img src="../../assets/icons/email-icon.png" alt="Email" class="contact-icon">
                </a>
                <span class="static-text">Clubatleticodeportivoacarigua@gmail.com</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Columna 3: Ubicación -->
        <div class="footer-column">
          <h3 class="column-title">Ubicación</h3>
          <div class="contact-item">
            <a
              href="https://www.google.com/maps/place/Universidad+Polit%C3%A9cnica+Territorial+de+Puerto+Cabello/@10.4578943,-68.0537897,17z/data=!4m6!3m5!1s0x8e8054018566d7a3:0x70a7d25b77dc46ff!8m2!3d10.4577097!4d-68.0527812!16s%2Fg%2F1hc63v0bq?entry=ttu&g_ep=EgoyMDI1MTExMi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener"
              class="icon-link"
            >
              <img src="../../assets/icons/maps-icon.png" alt="Ubicación" class="contact-icon">
            </a>
            <span class="static-text">U.P.T.P Juan de Jesús Montilla<br>Acarigua, Portuguesa</span>
          </div>
        </div>

        <!-- Columna 4: Redes -->
        <div class="footer-column">
          <h3 class="column-title">Redes</h3>
          <ul class="contact-list">
            <li>
              <div class="contact-item">
                <a href="https://www.facebook.com/profile.php?id=100086449924024" target="_blank" rel="noopener" class="icon-link">
                  <img src="../../assets/icons/facebook-icon.png" alt="Facebook" class="contact-icon">
                </a>
                <span class="static-text">CLUB atlético Deportivo acarigua</span>
              </div>
            </li>
            <li>
              <div class="contact-item">
                <a href="https://instagram.com/Deportivoacarigua_oficial" target="_blank" rel="noopener" class="icon-link">
                  <img src="../../assets/icons/instagram-icon.png" alt="Instagram" class="contact-icon">
                </a>
                <span class="static-text">deportivoacarigua_oficial</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-divider" />

      <div class="footer-bottom">
        <p>&copy; 2024 Club Atlético Deportivo Acarigua. Todos los derechos reservados.</p>
        <p class="ministerio-info">Inscrito en el Ministerio del Poder Popular del Deporte</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'LandingFooter'
}
</script>

<style scoped>
.footer {
  background: var(--color-text-dark);
  color: var(--color-background);
  padding: 4rem 0 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Grid Layout */
.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 0.8fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

/* Marca */
.footer-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  height: 55px;
  width: auto;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.club-name {
  font-size: 1.3rem;
  font-weight: 700;
}

.club-subname {
  font-size: 0.95rem;
  font-weight: 500;
  opacity: 0.9;
}

.brand-info {
  line-height: 1.6;
  opacity: 0.8;
  font-size: 0.95rem;
}

.club-motto {
  font-size: 0.75rem;
  color: var(--color-primary);
  font-style: italic;
  font-weight: 500;
}

/* Columnas Comunes */
.column-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 2.2rem; /* Ajustado para que el contenido empiece en "La Armadura de Dios" */
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  line-height: 28px; /* Altura igual al logo para alineación perfecta */
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-list li {
  margin-bottom: 1.25rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
}

.icon-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.contact-icon {
  width: 33px;
  height: 33px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.9;
  transition: all 0.3s ease;
}

.icon-link:hover {
  background: var(--color-primary);
  transform: scale(1.1);
}

.icon-link:hover .contact-icon {
  opacity: 1;
  filter: brightness(0) invert(1);
}

.static-text {
  line-height: 1.4;
  opacity: 0.85;
}

/* Footer Bottom */
.footer-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.9rem;
  opacity: 0.7;
}

.ministerio-info {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1.5fr 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 3rem 0 1.5rem;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }

  .footer-logo {
    justify-content: center;
  }

  .contact-link {
    justify-content: center;
  }

  .social-grid {
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .club-name {
    font-size: 1.1rem;
  }

  .column-title {
    font-size: 1rem;
  }
}
</style>
