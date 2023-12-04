import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import md5 from 'js-md5'
import Layout from '@/layout'

const state = {
  token: getToken(),
  menuList: [],
  permissionList: [],
  userInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_MENULIST: (state, menuList) => {
    state.menuList = menuList
  },
  SET_PERMISSION_LIST: (state, permissionList) => {
    state.permissionList = permissionList
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_USERINFO_USERNAME: (state, userName) => {
    state.userInfo.userName = userName
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: account.trim(), password: md5(password) }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) reject('验证失败，请重新登录。')

        const { menuList, userInfo, permissionList } = data

        // roles must be a non-empty array
        if (!menuList.length) {
          reject('您的权限不足，请联系管理员')
          return false
        }

        const routerList = []

        function setData(list, childrenList) {
          for (let i = 0; i < list.length; i++) {
            const e = list[i]

            if (e.type === 1) {
              const newObj = {
                path: '/' + e.entityCode,
                component: Layout,
                name: e.entityCode,
                alwaysShow: true,
                meta: {
                  title: e.fullName,
                  icon: e.icon,
                  menuId: e.id
                }
              }
              if (e.children && e.children.length) {
                const children = []
                setData(e.children, children)
                newObj.children = children
              }
              routerList.push(newObj)
            }
            if (e.type === 2) {
              childrenList.push(
                {
                  path: e.entityCode,
                  component: (resolve) => require([`@/views/${e.urlAddress}`], resolve),
                  name: e.entityCode,
                  meta: {
                    title: e.fullName,
                    icon: e.icon,
                    menuId: e.id
                  }
                }
              )
            }
          }
        }

        setData(menuList)
        commit('SET_MENULIST', menuList)
        commit('SET_USERINFO', userInfo)
        commit('SET_PERMISSION_LIST', permissionList)
        resolve(routerList)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_MENULIST', [])
        commit('SET_USERINFO', {})
        commit('SET_PERMISSION_LIST', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_MENULIST', [])
      commit('SET_USERINFO', {})
      commit('SET_PERMISSION_LIST', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
