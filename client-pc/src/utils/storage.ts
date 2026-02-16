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
export function getStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}-${key}`)
    if (item === null) {
      return null
    }
    return JSON.parse(item) as T
  } catch (error) {
    console.error('获取存储项失败', error)
    return null
  }
}

/**
 * 删除存储项
 */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}-${key}`)
  } catch (error) {
    console.error('删除存储项失败', error)
  }
}

/**
 * 清除所有相关存储项
 */
export function clearAllStorage(): void {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('清除存储项失败', error)
  }
}
