import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const PasswordKey = 'Admin-Password'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getPassword() {
  return Cookies.get(PasswordKey)
}

export function setPassword(password) {
  return Cookies.set(PasswordKey, password)
}

export function removePassword() {
  return Cookies.remove(PasswordKey)
}
