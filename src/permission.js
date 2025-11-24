import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/', '/login', '/auth-redirect']

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()

  // 🔥 FORZAR LANDING PAGE SIEMPRE AL INICIAR (eliminar esta parte después de testing)
  if (to.path === '/' && from.path === '/') {
    // Limpiar token solo para testing
    const token = getToken()
    if (token) {
      console.log('🔍 Token encontrado, forzando landing page para testing...')
      // Si quieres forzar la landing, comenta esta línea:
      // await store.dispatch('user/resetToken')
    }
  }

  if (hasToken) {
    if (to.path === '/login' || to.path === '/') {
      next({ path: '/dashboard' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const { roles } = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next('/')
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
