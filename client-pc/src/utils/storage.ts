/**
 * 本地存储工具类
 */

const STORAGE_PREFIX = 'yisu-hotel'

/**
 * 设置存储项
 */
export function setStorage<T>(key: string, value: T): void {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(`${STORAGE_PREFIX}-${key}`, serializedValue)
  } catch (error) {
    console.error('设置存储项失败', error)
  }

}

/**
 * 获取存储项
 */
export function getStorage<T>(key: string, defaultValue?: T): T | undefined {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}-${key}`)
    if (item === null) return defaultValue
    return JSON.parse(item) as T
  } catch (error) {
    console.error('获取存储项失败', error)
    return defaultValue
  }
}

/**
 * 移除存储项
 */

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}-${key}`)
  } catch (error) {
    console.error('移除存储项失败', error)
  }
}

/**
 * 清除所有存储项
 */
export function clearStorage(): void {
  try {
    //只清除本项目前缀的存储项
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('清除所有存储项失败', error)
  }
}
