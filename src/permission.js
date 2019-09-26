import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 不会重定向的白名单
const defineView = ['/login'] // 没有头部的普通页面

router.beforeEach(async(to, from, next) => {
  console.log(to, from)
  // 开始切换页面进度条
  NProgress.start()

  // 设置页面title
  document.title = getPageTitle(to.meta.title)

  // 设置是否显示页面header
  // if (defineView.indexOf(to.path) !== -1) {
  //   await store.dispatch('permission/setHeader', false)
  // } else {
  //   await store.dispatch('permission/setHeader', true)
  // }

  // 获取全部字典
  // await store.dispatch('dist/getAllDict');

  // 是否登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登录并且跳往登陆页，重定向到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 获取用户信息
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          let { roles } = await store.dispatch('user/getInfo')
          // 角色举例，删
          roles = ['admin']

          // 获取角色菜单, 改
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // const menuList = await store.dispatch('permission/getAuthMenu', roles)
          // console.log(menuList)

          // 把角色菜单添加至路由
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record

          // next({ ...to, replace: true })
          next()
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
