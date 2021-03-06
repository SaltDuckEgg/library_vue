import {
  login,
  getInfo,
  activate,
  password,
  modify,
  deleteUser,
  currentUserEmail,
  currentUserPhone,
  loginByPhone
} from '@/api/user'
import { getToken, setToken, removeToken, getPassword, setPassword, removePassword } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { Message } from 'element-ui'
import js_sha256 from 'js-sha256'

const state = {
  token: getToken(),
  id: 0,
  name: '',
  sex: '',
  username: '',
  password: getPassword() || '',
  phone: '',
  email: '',
  academy: '',
  class_num: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_ID: (state, id) => {
    state.id = id
  },
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
      login({ username: username.trim(), password: js_sha256.sha256(password) }).then(response => {
        const { roles, token } = response.data
        commit('SET_ROLES', [roles])
        commit('SET_TOKEN', token)
        commit('SET_PASSWORD', js_sha256.sha256(password))
        setToken(token)
        setPassword(js_sha256.sha256(password))
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },

  loginViaToken({ commit }, token) {
    commit('SET_TOKEN', token)
    setToken(token)
  },

  resetRoles({ commit }) {
    commit('SET_ROLES', [])
  },

  loginByPhone({ commit }, userInfo) {
    const { uid, sms_code } = userInfo
    return new Promise((resolve, reject) => {
      loginByPhone({ uid: uid.trim(), sms_code: sms_code }).then(response => {
        const { roles, token } = response.data
        commit('SET_ROLES', [roles])
        commit('SET_TOKEN', token)
        setToken(token)
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { id, name, sex, username, phone, email, academy, class_num, avatar, roles } = response.data

        if (!username) {
          reject('?????????????????????????????????')
        }

        console.log('??????:', avatar)

        // roles must be in list
        if (['inactive_user', 'active_user', 'administrator'].indexOf(roles) === -1) {
          reject('roles?????????!')
        }

        commit('SET_ID', id)
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
      removePassword()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  activate({ commit, state }, activationInfo) {
    return new Promise((resolve, reject) => {
      const { newPassword, uid, sms_code } = activationInfo
      activate({
        password: js_sha256.sha256(newPassword),
        uid: uid,
        sms_code: sms_code
      }).then(response => {
        Message({
          message: '?????????????????????',
          type: 'success',
          duration: 5 * 1000
        })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  password({ commit }, passwordInfo) {
    return new Promise((resolve, reject) => {
      const { newPassword } = passwordInfo
      password({ password: js_sha256.sha256(newPassword) }).then(response => {
        setPassword(js_sha256.sha256(newPassword))
        Message({
          message: '?????????????????????',
          type: 'success',
          duration: 5 * 1000
        })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  currentUserPhone({ commit }, modifyInfo) {
    const { uid, sms_code } = modifyInfo
    return new Promise((resolve, reject) => {
      currentUserPhone({ uid: uid, sms_code: sms_code }).then(response => {
        Message({
          message: '???????????????????????????',
          type: 'success',
          duration: 5 * 1000
        })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  currentUserEmail({ commit }, modifyInfo) {
    const { email } = modifyInfo
    return new Promise((resolve, reject) => {
      currentUserEmail({ email: email }).then(response => {
        Message({
          message: '?????????????????????????????????',
          type: 'success',
          duration: 5 * 1000
        })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  modify({ commit }, modifyInfo) {
    return new Promise((resolve, reject) => {
      const { id, username, roles, name, sex, academy, class_num, phone, email, in_lib } = modifyInfo
      modify(id,
        {
          username: username,
          roles: roles,
          name: name,
          sex: sex,
          academy: academy,
          class_num: class_num,
          phone: phone,
          email: email,
          in_lib: in_lib
        }).then(response => {
        Message({
          message: '???????????????',
          type: 'success',
          duration: 5 * 1000
        })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  modifyAvatar({ commit }, avatar) {
    commit('SET_AVATAR', avatar)
  },

  delete({ commit }, id) {
    return new Promise((resolve, reject) => {
      deleteUser(id).then(response => {
        Message({
          message: '???????????????',
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
