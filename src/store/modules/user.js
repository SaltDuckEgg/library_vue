import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  academy: '',
  class_num: '',
  phone: '',
  email: '',
  avatar: '',
  // introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_INTRODUCTION: (state, introduction) => {
  //     state.introduction = introduction
  // },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ACADEMY: (state, academy) => {
    state.academy = academy
  },
  SET_CLASS_NUM: (state, class_num) => {
    state.class_num = class_num
  },
  SET_PHONE: (state, phone) => {
    state.name = phone
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  tmpTest({ commit }) {
    console.log('tmpTesting...')
    commit('SET_TOKEN', 'hello')
    commit('SET_ROLES', ['administrator'])
    setToken('hello')
  },
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const token = response.data.token
        // const roles = response.data.roles
        commit('SET_TOKEN', token)
        // commit('SET_ROLES', roles)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  tmpGetInfo({ commit, state }) {
    return { roles: ['administrator'] }
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // const { data } = response
        console.log(response)
        const { username, name, roles, academy, class_num, phone, email } = response.data
        console.log([roles])

        if (!username) {
          reject('Verification failed, please Login again.')
        }

        // // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getInfo: roles must be a non-null array!')
        // }

        commit('SET_NAME', name)
        commit('SET_ROLES', [roles])
        commit('SET_ACADEMY', academy)
        commit('SET_CLASS_NUM', class_num)
        commit('SET_PHONE', phone)
        commit('SET_EMAIL', email)

        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)
        resolve({ roles: [roles] })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
