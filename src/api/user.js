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
