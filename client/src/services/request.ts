import Taro from '@tarojs/taro'

const BASE_URL = 'http://localhost:3000/api'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
}

export const request = <T>(options: RequestOptions): Promise<T> => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data as T)
        } else {
          Taro.showToast({ title: res.data.message || '请求失败', icon: 'none' })
          reject(res.data)
        }
      },
      fail: (err) => {
        Taro.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      }
    })
  })
}

// 便捷方法
export const get = <T>(url: string, data?: any) => 
  request<T>({ url, method: 'GET', data })

export const post = <T>(url: string, data?: any) => 
  request<T>({ url, method: 'POST', data })