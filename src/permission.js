import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import common from './utils/common.js'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 不会重定向的白名单

router.beforeEach(async(to, from, next) => {
  store.commit('user/SET_LISTTOTAL', 0)

  // 开始切换页面进度条
  NProgress.start()

  // 设置页面title
  document.title = getPageTitle(to.meta.title)

  // 是否登录
  const hasToken = getToken()
  if (hasToken && !store.state.news.hasSocket) {
    common.initSocket()
  }

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登录并且跳往登陆页，重定向到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          let { role } = await store.dispatch('user/getInfo')

          // 获取角色菜单，把角色菜单添加至路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', role)
          router.addRoutes(accessRoutes)
          
          next(to)
        } catch (error) {
          // 清除token并重定向到登录页，重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 白名单下继续跳转
      next()
    } else {
      // 其他页面重置到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 结束切换页面进度条
  NProgress.done()
})
