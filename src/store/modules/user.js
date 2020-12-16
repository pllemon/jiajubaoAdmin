import { login } from '@/api/user'
import { getDetails } from '@/api/account'
import { getToken, setToken, removeToken, setLoginStorage, removeLoginStorage, setAccountId, getAccountId, removeAccountId } from '@/utils/auth'
import { resetRouter } from '@/router'

let globalSearch = sessionStorage.getItem('globalSearch')
if (globalSearch) {
  globalSearch = JSON.parse(globalSearch)
} else {
  globalSearch = {
    year: '',
    month: '',
    network_id: '',
    areaCode: []
  }
}

const state = {
  listTotal: 0,
  token: getToken(),
  roles: null,
  userInfo: null,
  globalSearch: globalSearch
}

const mutations = {
  SET_LISTTOTAL: (state, data) => {
    state.listTotal = data
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERINFO: (state, info) => {
    state.userInfo = info
  },
  SET_SEARCH: (state, data) => {
    console.log('-------------全局搜索------------------')
    console.log(data)
    console.log('---------------------------------------')
    sessionStorage.setItem('globalSearch', JSON.stringify(data))
    state.globalSearch = data
  }
}

const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password, remember } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        // 记住密码
        if (remember) {
          setLoginStorage(userInfo)
        } else {
          removeLoginStorage()
        }

        // 保存token和账号id
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setAccountId(data.admininfo.id)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 个人信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getDetails({
        admin_id: getAccountId()
      }).then(response => {
        const { data } = response
        console.log(data)

        if (!data) {
          reject('登录已过期，请重新登录')
        }

        commit('SET_ROLES', data.role)
        commit('SET_USERINFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', null)
      removeToken()
      removeAccountId()
      resetRouter()
      resolve()
    })
  },

  // 清除token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', null)
      removeToken()
      removeAccountId()
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

