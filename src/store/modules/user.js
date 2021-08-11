import { login, getInfo, activation } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { Message } from 'element-ui'

const state = {
  token: getToken(),
  name: '',
  sex: '',
  username: '',
  password: '',
  phone: '',
  email: '',
  academy: '',
  class_num: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_SEX: (state, sex) => {
    state.sex = sex
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_PASSWORD: (state, password) => {
    state.password = password
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_ACADEMY: (state, academy) => {
    state.academy = academy
  },
  SET_CLASS_NUM: (state, class_num) => {
    state.class_num = class_num
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
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const token = response.data.token
        commit('SET_TOKEN', token)
        commit('SET_PASSWORD', password)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  tmpTest({ commit }) {
    console.log('tmpTesting...')
    commit('SET_TOKEN', 'hello')
    commit('SET_ROLES', ['administrator'])
    setToken('hello')
  },

  tmpGetInfo({ commit, state }) {
    return { roles: ['administrator'] }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { name, sex, username, phone, email, academy, class_num, avatar, roles } = response.data

        if (!username) {
          reject('认证失败，请重新登陆！')
        }

        console.log('头像:', avatar)

        // roles must be in list
        if (['inactive_user', 'active_user', 'administrator'].indexOf(roles) === -1) {
          reject('roles不合法!')
        }

        commit('SET_NAME', name)
        commit('SET_SEX', sex)
        commit('SET_USERNAME', username)
        commit('SET_PHONE', phone)
        commit('SET_EMAIL', email)
        commit('SET_ACADEMY', academy)
        commit('SET_CLASS_NUM', class_num)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLES', [roles])

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

  activation({ commit, state }, activationInfo) {
    return new Promise((resolve, reject) => {
      const { phone, email } = activationInfo
      activation({ phone: phone, email: email, password: state.password }).then(response => {
        Message({
          message: '成功激活用户！',
          type: 'success',
          duration: 5 * 1000
        })
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
