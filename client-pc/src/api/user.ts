import request from './request'

// 获取当前用户信息
export function getUserInfo() {
  return request.get('/user/info')
}

// 更新用户信息
export function updateUserInfo(data: any) {
  return request.put('/user/info', data)
}

// 修改密码
export function changePassword(data: any) {
  return request.put('/user/password', data)
}
