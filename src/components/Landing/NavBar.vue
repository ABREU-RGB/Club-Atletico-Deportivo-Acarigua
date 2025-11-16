<template>
  <div class="navbar">
    <div class="navbar-container">
      <!-- Logo y nombre del club -->
      <div class="navbar-brand">
        <div class="logo">
          <!-- Puedes reemplazar esto con tu logo real -->
          <div class="logo-icon">⚽</div>
          <div class="logo-text">
            <span class="club-name">Club Atlético</span>
            <span class="club-subname">Deportivo Acarigua</span>
          </div>
        </div>
      </div>

      <!-- Menú de navegación -->
      <div class="navbar-menu">
        <nav class="nav-links">
          <a href="#inicio" class="nav-link">Inicio</a>
          <a href="#nosotros" class="nav-link">Nosotros</a>
          <a href="#equipos" class="nav-link">Equipos</a>
          <a href="#noticias" class="nav-link">Noticias</a>
          <a href="#contacto" class="nav-link">Contacto</a>
        </nav>
      </div>

      <!-- Botones de acción -->
      <div class="navbar-actions">
        <el-button class="login-btn" @click="goToLogin">Acceder</el-button>
        <el-button type="primary" class="register-btn" @click="goToRegister">
          Registrarse
        </el-button>

        <!-- Menú móvil -->
        <div class="mobile-menu" @click="toggleMobileMenu">
          <i class="el-icon-menu"></i>
        </div>
      </div>
    </div>

    <!-- Menú móvil desplegable -->
    <div v-show="mobileMenuOpen" class="mobile-nav">
      <a href="#inicio" class="mobile-nav-link" @click="closeMobileMenu">Inicio</a>
      <a href="#nosotros" class="mobile-nav-link" @click="closeMobileMenu">Nosotros</a>
      <a href="#equipos" class="mobile-nav-link" @click="closeMobileMenu">Equipos</a>
      <a href="#noticias" class="mobile-nav-link" @click="closeMobileMenu">Noticias</a>
      <a href="#contacto" class="mobile-nav-link" @click="closeMobileMenu">Contacto</a>
      <div class="mobile-actions">
        <el-button class="mobile-login-btn" @click="goToLogin">Acceder</el-button>
        <el-button type="primary" class="mobile-register-btn" @click="goToRegister">
          Registrarse
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LandingNavBar',
  data() {
    return {
      mobileMenuOpen: false
    }
  },
  methods: {
    goToLogin() {
      this.$router.push('/login')
    },
    goToRegister() {
      // Puedes crear una ruta de registro o redirigir al login
      this.$router.push('/login?action=register')
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false
    }
  },
  mounted() {
    // Cerrar menú móvil al hacer resize
    window.addEventListener('resize', this.closeMobileMenu)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.closeMobileMenu)
  }
}
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e8e8e8;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}

/* Logo y marca */
.navbar-brand {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  font-size: 2rem;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 8px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.club-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a365d;
}

.club-subname {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2d3748;
}

/* Menú de navegación */
.navbar-menu {
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #2d3748;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #ff6b35;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #ff6b35;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

/* Botones de acción */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.login-btn {
  border-color: #ff6b35;
  color: #ff6b35;
  font-weight: 500;
}

.login-btn:hover {
  background-color: #fff5f0;
  border-color: #f7931e;
  color: #f7931e;
}

.register-btn {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border: none;
  font-weight: 500;
}

.register-btn:hover {
  background: linear-gradient(135deg, #e55a2b, #e5841a);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

/* Menú móvil */
.mobile-menu {
  display: none;
  font-size: 1.5rem;
  color: #2d3748;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-nav {
  display: none;
  background: white;
  border-top: 1px solid #e8e8e8;
  padding: 1rem 2rem;
  flex-direction: column;
  gap: 1rem;
}

.mobile-nav-link {
  color: #2d3748;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f7f7f7;
  transition: color 0.3s ease;
}

.mobile-nav-link:hover {
  color: #ff6b35;
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e8e8e8;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-container {
    padding: 1rem;
  }

  .navbar-menu {
    display: none;
  }

  .navbar-actions .login-btn,
  .navbar-actions .register-btn {
    display: none;
  }

  .mobile-menu {
    display: block;
  }

  .mobile-nav {
    display: flex;
  }

  .logo-text {
    display: none;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0.75rem 1rem;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
}

/* Efecto de scroll */
.navbar.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}
</style>
