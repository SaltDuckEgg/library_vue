import request from '@/utils/request'

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
