import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css
import animate from 'animate.css'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import $ from 'jquery'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

import moment from 'moment'
Vue.prototype.$moment = moment

import common from './utils/common.js'
Vue.prototype.common = common

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

// 全局注册分页组件
import GdPagination from '@/components/Pagination'
Vue.component('GdPagination', GdPagination)

import GdUpload from '@/components/Upload'
Vue.component('GdUpload', GdUpload)

import GdImage from '@/components/Image'
Vue.component('GdImage', GdImage)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
