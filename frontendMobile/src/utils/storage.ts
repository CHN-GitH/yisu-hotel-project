import Taro from '@tarojs/taro'

interface StorageData<T> {
  data: T
  expire: number | null
  timestamp: number
}

export const storage = {
  // 设置缓存
  set<T>(key: string, data: T, expireMs?: number): void {
    const payload: StorageData<T> = {
      data,
      expire: expireMs ? Date.now() + expireMs : null,
      timestamp: Date.now()
    }
    try {
      Taro.setStorageSync(key, payload)
    } catch (e) {
      console.error('Storage set error:', e)
    }
  },

  // 获取缓存
  get<T>(key: string): T | null {
    try {
      const payload = Taro.getStorageSync(key) as StorageData<T>
      if (!payload) return null

      // 检查过期
      if (payload.expire && Date.now() > payload.expire) {
        Taro.removeStorageSync(key)
        return null
      }

      return payload.data
    } catch (e) {
      console.error('Storage get error:', e)
      return null
    }
  },

  // 删除缓存
  remove(key: string): void {
    try {
      Taro.removeStorageSync(key)
    } catch (e) {
      console.error('Storage remove error:', e)
    }
  },

  // 清空缓存
  clear(): void {
    try {
      Taro.clearStorageSync()
    } catch (e) {
      console.error('Storage clear error:', e)
    }
  },

  // 获取缓存信息
  info(key: string): { size: number; expire?: Date } | null {
    try {
      const payload = Taro.getStorageSync(key) as StorageData<any>
      if (!payload) return null

      const dataStr = JSON.stringify(payload)
      return {
        size: new Blob([dataStr]).size,
        expire: payload.expire ? new Date(payload.expire) : undefined
      }
    } catch (e) {
      return null
    }
  }
}

// 业务专用缓存
export const cacheKeys = {
  searchHistory: 'search_history',
  recentCities: 'recent_cities',
  userLocation: 'user_location',
  hotelDetail: (id: string) => `hotel_${id}`,
  searchResult: (params: string) => `search_${params}`
}