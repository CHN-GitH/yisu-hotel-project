/**
 * 用户角色类型
 * merchant：商户：上传/编辑酒店信息
 * admin:管理：审核/发布酒店信息
 */
export type UserRole = 'merchant' | 'admin'

/**
 * 用户信息接口
 */
export interface UserInfo {
  //用户ID
  id: number
  //用户名
  username: string
  //用户角色
  role: UserRole
  //JWT Token
  token: string
}

/**
 * 登录表单数据
 */

export interface LoginForm {
  //用户名
  username: string
  //密码
  password: string
}

/**
 * 注册表单数据
 */

export interface RegisterForm {
  //用户名
  username: string
  //密码
  password: string
  //确认密码
  confirmPassword: string
  //角色
  role: UserRole
}