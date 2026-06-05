import Cookies from 'js-cookie'

const TokenKey = 'wcrx'

export function getToken(TokenKey) {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
  // return Cookies.set(TokenKey, token)
}
export function getPer(wcper) {
  return Cookies.get(wcper)
}

export function setPer(wcper) {
  return Cookies.set('wcper', wcper)
  // return Cookies.set(TokenKey, token)
}

export function removeToken(TokenKey) {
  return Cookies.remove(TokenKey)
}

export function setUserName(username){
  return Cookies.set('wcun',username)
}
export function setPassword(password){
  return Cookies.set('wcpx',password)
}

const LoginModeKey = 'loginMode'

export function getLoginMode() {
  return localStorage.getItem(LoginModeKey) || 'manage'
}

export function setLoginMode(mode) {
  return localStorage.setItem(LoginModeKey, mode)
}

export function removeLoginMode() {
  return localStorage.removeItem(LoginModeKey)
}
