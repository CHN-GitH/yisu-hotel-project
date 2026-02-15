// 环境配置
const ENV = process.env.NODE_ENV || 'development'

const config = {
  development: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 10000,
    mock: true
  },
  production: {
    baseUrl: 'https://api.easyhotel.com/api',
    timeout: 10000,
    mock: false
  }
}

export default config[ENV as keyof typeof config]

// 分页配置
export const PAGE_CONFIG = {
  defaultSize: 10,
  maxSize: 50
}

// 缓存配置
export const CACHE_CONFIG = {
  searchResult: 5 * 60 * 1000, // 5分钟
  hotelDetail: 10 * 60 * 1000, // 10分钟
  cities: 60 * 60 * 1000       // 1小时
}