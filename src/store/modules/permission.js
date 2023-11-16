import { constantRoutes } from '@/router'

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, route) {
    return new Promise(resolve => {
      const dtRoutes = [
        ...route,
        {
          path: '/404',
          component: (resolve) => require(['@/views/error-page/404'], resolve),
          hidden: true
        },
        {
          path: '*',
          redirect: '/404',
          hidden: true
        }
      ]
      commit('SET_ROUTES', dtRoutes)
      resolve(dtRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
