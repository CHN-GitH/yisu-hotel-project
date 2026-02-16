import request from './request'
import type { LoginForm, RegisterForm } from '@/types/user'
import type { UserInfo } from '@/types/user'

// 登录
export function login(data: LoginForm): Promise<UserInfo> {
  return request.post('/auth/login', data)
}

// 注册
export function register(data: RegisterForm) {
  return request.post('/auth/register', data)
}
