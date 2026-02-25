import axios from 'axios'
import { message } from 'antd'
import store from '@/store'
import { logout } from '@/store/userSlice'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
})

// 请求拦截器：每次请求前自动加上 token
request.interceptors.request.use(
  (config) => {
    const { user } = store.getState()
    if (user.userInfo?.token) {
      config.headers.Authorization = `Bearer ${user.userInfo.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器：处理错误
request.interceptors.response.use(
  (response) => {
    // 如果后端返回的 code 不是 0，说明业务错误
    if (response.data.code !== 0) {
      message.error(response.data.msg || '请求失败')
      return Promise.reject(new Error(response.data.msg))
    }
    // 返回数据部分
    return response.data.data
  },
  (error) => {
    // 401 表示登录过期
    if (error.response?.status === 401) {
      message.error('登录已过期，请重新登录')
      store.dispatch(logout())
      window.location.href = '/login'
    } else {
      message.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default request

