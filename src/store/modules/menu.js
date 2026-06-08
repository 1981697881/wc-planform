import { getRouter } from '@/api/menu'
import { getMenuType } from '@/utils/auth'
import { StaticRouterMap } from '@/router'

const state = {
  routes: []
}

const mutations = {
  SET_ROUTER: (state, routes) => {
    state.routes = routes
  }
}

const actions = {
  setRouterList({ commit }, routerList) {
    // 进行路由拼接并存储
    commit('SET_ROUTER', StaticRouterMap.concat(routerList))
  },
  fetchMenuWY({ commit }) {
    return new Promise((resolve, reject) => {
      getRouter(getMenuType()).then(res => {
        let routes = res.data
        resolve(routes)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
