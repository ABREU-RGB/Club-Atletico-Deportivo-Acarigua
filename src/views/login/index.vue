<template>
  <div class="login-container">
    <!-- Fondo optimizado para móvil -->
    <div class="login-background">
      <div class="background-shapes">
        <div class="shape shape-1" />
        <div class="shape shape-2" />
        <div class="shape shape-3" />
      </div>
      <div class="gradient-overlay" />
    </div>

    <!-- Contenedor principal optimizado para móvil -->
    <div class="login-center-wrapper">
      <!-- Tarjeta de login móvil-first -->
      <div class="login-card">
        <!-- Header compacto para móvil -->
        <div class="login-header">
          <div class="logo-section">
            <div class="logo-icon">
              <i class="el-icon-trophy" />
            </div>
            <div class="logo-text">
              <h1>Club Atlético</h1>
              <p>Deportivo Acarigua</p>
            </div>
          </div>
          <div class="welcome-section">
            <h2>Bienvenido</h2>
            <p>Ingresa a tu cuenta</p>
          </div>
        </div>

        <!-- Formulario optimizado para touch -->
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          @submit.native.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <div class="input-group">
              <span class="input-icon">
                <i class="el-icon-user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="Usuario"
                size="large"
                class="mobile-input"
              />
            </div>
          </el-form-item>

          <el-form-item prop="password">
            <div class="input-group">
              <span class="input-icon">
                <i class="el-icon-lock" />
              </span>
              <el-input
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="Contraseña"
                size="large"
                class="mobile-input"
                @keyup.enter.native="handleLogin"
              />
              <button type="button" class="password-toggle" @click="showPwd">
                <i :class="passwordType === 'password' ? 'el-icon-view' : 'el-icon-hide'" />
              </button>
            </div>
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="rememberMe" class="mobile-checkbox">
              Recordarme
            </el-checkbox>
            <a href="#forgot" class="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>

          <el-button
            :loading="loading"
            type="primary"
            size="large"
            class="login-button mobile-button"
            native-type="submit"
          >
            <span v-if="!loading">Iniciar Sesión</span>
            <span v-else>Accediendo...</span>
          </el-button>
        </el-form>

        <!-- Demo accounts optimizado para móvil -->
        <div class="demo-section">
          <div class="demo-header">
            <span class="demo-title">Accesos de Prueba</span>
          </div>
          <div class="demo-buttons">
            <button
              class="demo-btn mobile-demo-btn admin"
              @click="fillDemo('admin')"
              @touchstart="handleTouchStart"
              @touchend="handleTouchEnd"
            >
              <i class="el-icon-user" />
              <span>Admin</span>
            </button>
            <button
              class="demo-btn mobile-demo-btn editor"
              @click="fillDemo('editor')"
              @touchstart="handleTouchStart"
              @touchend="handleTouchEnd"
            >
              <i class="el-icon-edit" />
              <span>Editor</span>
            </button>
          </div>
        </div>

        <!-- Footer móvil -->
        <div class="login-footer">
          <p>¿Primera vez?
            <a href="#register" class="register-link">Solicitar acceso</a>
          </p>
        </div>
      </div>
    </div>

    <!-- Botón de volver optimizado para móvil -->
    <div class="back-to-home">
      <button
        class="back-button mobile-back-button"
        @click="goToLanding"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <i class="el-icon-arrow-left" />
        <span>Volver</span>
      </button>
    </div>

    <!-- Copyright móvil -->
    <div class="login-copyright">
      <p>&copy; 2024 Club Atlético Deportivo Acarigua</p>
    </div>

    <!-- Teclado virtual detector (solo móvil) -->
    <div v-if="isMobile" class="keyboard-space" />
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value || value.trim() === '') {
        callback(new Error('Ingresa tu usuario'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value || value.length < 6) {
        callback(new Error('Mínimo 6 caracteres'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      rememberMe: false,
      isMobile: false
    }
  },
  mounted() {
    this.detectMobile()
    this.$nextTick(() => {
      this.$refs.username.focus()
    })

    // Escuchar cambios de orientación y resize
    window.addEventListener('resize', this.detectMobile)
    window.addEventListener('orientationchange', this.detectMobile)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.detectMobile)
    window.removeEventListener('orientationchange', this.detectMobile)
  },
  methods: {
    detectMobile() {
      this.isMobile = window.innerWidth <= 768
      // Ajustar viewport para móviles
      if (this.isMobile) {
        document.querySelector('meta[name="viewport"]')?.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
      }
    },
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.$route.query.redirect || '/dashboard' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    fillDemo(role) {
      if (role === 'admin') {
        this.loginForm.username = 'admin'
        this.loginForm.password = '111111'
      } else if (role === 'editor') {
        this.loginForm.username = 'editor'
        this.loginForm.password = '111111'
      }
      this.$refs.password.focus()
    },
    goToLanding() {
      this.$router.push('/')
    },
    handleTouchStart(event) {
      // Efecto táctil para botones
      event.currentTarget.style.transform = 'scale(0.95)'
    },
    handleTouchEnd(event) {
      event.currentTarget.style.transform = 'scale(1)'
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  min-height: 100dvh; /* Nueva unidad para móviles */
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 60px;
  height: 60px;
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 65%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 40px;
  height: 40px;
  bottom: 25%;
  left: 20%;
  animation-delay: 4s;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(ellipse at top right, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at bottom left, rgba(255, 119, 198, 0.2) 0%, transparent 50%);
}

.login-center-wrapper {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;
  padding: 1rem;
  margin: 0 auto;
}

.login-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2rem 1.5rem;
  width: 100%;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  flex-shrink: 0;
}

.logo-text h1 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a365d;
  margin: 0;
  line-height: 1.2;
}

.logo-text p {
  font-size: 0.85rem;
  color: #718096;
  margin: 0;
  font-weight: 500;
}

.welcome-section h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a365d;
  margin: 0 0 0.25rem 0;
}

.welcome-section p {
  color: #718096;
  margin: 0;
  font-size: 0.85rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.input-icon {
  position: absolute;
  left: 12px;
  z-index: 3;
  color: #a0aec0;
  font-size: 1.1rem;
  pointer-events: none;
}

.password-toggle {
  position: absolute;
  right: 12px;
  z-index: 3;
  color: #a0aec0;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  padding: 8px;
  border-radius: 6px;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover,
.password-toggle:active {
  color: #ff6b35;
  background: rgba(255, 107, 53, 0.1);
}

:deep(.mobile-input .el-input__inner) {
  padding-left: 40px !important;
  padding-right: 50px !important;
  height: 52px !important; /* Más alto para touch */
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  font-size: 16px !important; /* Previene zoom en iOS */
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 52px;
}

:deep(.mobile-input .el-input__inner:hover) {
  border-color: #cbd5e0;
}

:deep(.mobile-input .el-input__inner:focus) {
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.25rem 0 1.5rem 0;
  flex-wrap: wrap;
  gap: 0.5rem;
}

:deep(.mobile-checkbox .el-checkbox__label) {
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 500;
}

:deep(.mobile-checkbox .el-checkbox__inner) {
  width: 18px;
  height: 18px;
}

.forgot-link {
  font-size: 0.85rem;
  color: #ff6b35;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;
}

.forgot-link:hover,
.forgot-link:active {
  color: #e55a2b;
  background: rgba(255, 107, 53, 0.05);
}

.login-button.mobile-button {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  min-height: 52px;
}

.login-button.mobile-button:hover,
.login-button.mobile-button:active {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.demo-section {
  margin: 1.5rem 0;
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.demo-header {
  text-align: center;
  margin-bottom: 1rem;
}

.demo-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.demo-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.demo-btn.mobile-demo-btn {
  flex: 1;
  min-width: 120px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #4a5568;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 12px 16px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  min-height: 48px;
  cursor: pointer;
  touch-action: manipulation;
}

.demo-btn.mobile-demo-btn:hover,
.demo-btn.mobile-demo-btn:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.demo-btn.mobile-demo-btn.admin:hover,
.demo-btn.mobile-demo-btn.admin:active {
  border-color: #ff6b35;
  color: #ff6b35;
}

.demo-btn.mobile-demo-btn.editor:hover,
.demo-btn.mobile-demo-btn.editor:active {
  border-color: #4299e1;
  color: #4299e1;
}

.login-footer {
  text-align: center;
  padding-top: 1.25rem;
  border-top: 1px solid #e2e8f0;
}

.login-footer p {
  color: #718096;
  margin: 0;
  font-size: 0.85rem;
}

.register-link {
  color: #ff6b35;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
  padding: 2px 4px;
  border-radius: 4px;
}

.register-link:hover,
.register-link:active {
  color: #e55a2b;
  text-decoration: underline;
  background: rgba(255, 107, 53, 0.05);
}

.back-to-home {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 3;
}

.back-button.mobile-back-button {
  color: white;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  touch-action: manipulation;
}

.back-button.mobile-back-button:hover,
.back-button.mobile-back-button:active {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  transform: scale(0.98);
}

.login-copyright {
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 2;
  padding: 0 1rem;
}

.login-copyright p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  margin: 0;
}

.keyboard-space {
  height: 0px;
  transition: height 0.3s ease;
}

/* Animaciones optimizadas para móvil */
@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.02);
  }
}

/* Media Queries específicas para móvil */
@media (max-width: 768px) {
  .login-container {
    align-items: flex-start;
    padding-top: 2rem;
  }

  .login-center-wrapper {
    padding: 0.5rem;
    max-width: 100%;
    margin: 0 0.5rem;
  }

  .login-card {
    padding: 1.5rem 1.25rem;
    border-radius: 14px;
  }

  .logo-section {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .logo-icon {
    width: 50px;
    height: 50px;
    font-size: 1.4rem;
  }

  .logo-text h1 {
    font-size: 1.3rem;
  }

  .welcome-section h2 {
    font-size: 1.4rem;
  }

  .demo-buttons {
    flex-direction: column;
  }

  .demo-btn.mobile-demo-btn {
    min-width: 100%;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .back-to-home {
    top: 0.5rem;
    left: 0.5rem;
  }

  .back-button.mobile-back-button {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
  }

  .login-copyright {
    bottom: 0.5rem;
  }
}

@media (max-width: 480px) and (max-height: 700px) {
  .login-container {
    padding-top: 1rem;
    align-items: flex-start;
  }

  .login-card {
    padding: 1.25rem 1rem;
  }

  .login-header {
    margin-bottom: 1rem;
  }

  .login-form {
    margin-bottom: 1rem;
  }

  .demo-section {
    margin: 1rem 0;
    padding: 1rem;
  }
}

/* Soporte para dispositivos muy pequeños */
@media (max-width: 360px) {
  .login-card {
    padding: 1rem 0.75rem;
  }

  .logo-text h1 {
    font-size: 1.1rem;
  }

  .welcome-section h2 {
    font-size: 1.2rem;
  }

  :deep(.mobile-input .el-input__inner) {
    font-size: 14px !important;
  }
}

/* Soporte para modo landscape en móviles */
@media (max-height: 500px) and (orientation: landscape) {
  .login-container {
    align-items: flex-start;
    padding-top: 1rem;
    min-height: auto;
  }

  .login-card {
    padding: 1rem 1.5rem;
    margin: 1rem 0;
  }

  .login-header {
    margin-bottom: 1rem;
  }

  .logo-section {
    flex-direction: row;
    gap: 0.75rem;
  }

  .input-group {
    margin-bottom: 0.75rem;
  }
}

/* Mejoras de accesibilidad para touch */
@media (hover: none) and (pointer: coarse) {
  .password-toggle,
  .demo-btn.mobile-demo-btn,
  .back-button.mobile-back-button {
    cursor: none;
  }

  :deep(.mobile-input .el-input__inner) {
    font-size: 16px !important; /* Previene zoom en iOS */
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .login-card {
    background: rgba(45, 55, 72, 0.95);
    color: white;
  }

  .logo-text h1,
  .welcome-section h2 {
    color: white;
  }

  .logo-text p,
  .welcome-section p {
    color: #a0aec0;
  }

  :deep(.mobile-input .el-input__inner) {
    background: #2d3748;
    border-color: #4a5568;
    color: white;
  }

  .demo-section {
    background: #1a202c;
    border-color: #2d3748;
  }
}
</style>
