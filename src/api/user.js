import request from '@/utils/request'
import axios from 'axios'

export function login(data) {
  return request({
    url: 'http://124.71.225.17:8000/user/login/',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'http://124.71.225.17:8000/user/detail/',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: 'http://124.71.225.17:8000/user/logout/',
    method: 'post'
  })
}

export function uploadAvatar(data) {
  axios.defaults.headers['Content-Type'] = 'multipart/form-data'
  return request({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: 'http://124.71.225.17:8000/user/avatar/',
    method: 'post',
    data: data
  })
}

export function addSaveFile(data) {
  return request({
    url: 'http://124.71.225.17:8000/user/avatar/',
    method: 'post',
    data: data
  })
}

export function activationGetUid(data) {
  return request({
    url: 'http://124.71.225.17:8000/user/activate_sendSMScode/',
    method: 'post',
    data: data
  })
}

export function activate(data) {
  return request({
    url: 'http://124.71.225.17:8000/user/activate_verifySMScode/',
    method: 'post',
    data: data
  })
}

export function loginGetUid(data) {
  return request({
    url: 'http://124.71.225.17:8000/user/login_sendSMScode/',
    method: 'post',
    data: data
  })
}

export function loginByPhone(data) {
  return request({
    url: 'http://124.71.225.17:8000/user/login_verifySMScode/',
    method: 'post',
    data: data
  })
}

export function password(data) {
  return request({
    url: 'http://124.71.225.17:8000/user/password/',
    method: 'post',
    data: data
  })
}

export function currentUserPhone(data) {
  return request({
    url: 'http://124.71.225.17:8000/user/bindPhone/',
    method: 'post',
    data: data
  })
}

export function currentUserEmail(data) {
  return request({
    url: 'http://124.71.225.17:8000/user/sendEmail/',
    method: 'post',
    data: data
  })
}

export function currentUserModify(data) {
  return request({
    url: 'http://124.71.225.17:8000/user/detail/',
    method: 'post',
    data: data
  })
}

export function fetchList(query) {
  return request({
    url: 'http://124.71.225.17:8000/user/',
    method: 'get',
    params: query
  })
}

export function fetchAcademyClass() {
  return request({
    url: 'http://124.71.225.17:8000/user/academy/',
    method: 'get'
  })
}

export function modify(id, data) {
  return request({
    url: 'http://124.71.225.17:8000/user/' + id + '/',
    method: 'put',
    data: data
  })
}

export function deleteUser(id) {
  return request({
    url: 'http://124.71.225.17:8000/user/' + id + '/',
    method: 'delete'
  })
}

// ====================
export function getTopAcademy() {
  // return request({
  //   url: 'http://124.71.225.17:8000/user/academyRatio',
  //   methos: 'get'
  // })
  return request({
    url: 'http://124.71.225.17:8000/user/academy/',
    method: 'get'
  })
}
