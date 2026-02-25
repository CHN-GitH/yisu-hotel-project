// utils/format.ts
import dayjs from 'dayjs'

// ==================== 价格格式化 ====================

/**
 * 格式化价格显示
 * @param price 价格（分或元）
 * @param options 配置项
 */
export const formatPrice = (
  price: number | string | undefined,
  options: {
    unit?: 'yuan' | 'fen'  // 输入单位，默认 yuan
    prefix?: string         // 前缀，默认 ¥
    decimals?: number       // 小数位数，默认 0
    showZero?: boolean      // 价格为0时是否显示，默认 true
  } = {}
): string => {
  const {
    unit = 'yuan',
    prefix = '¥',
    decimals = 0,
    showZero = true
  } = options

  if (price === undefined || price === null) return ''
  
  let num = Number(price)
  if (isNaN(num)) return ''

  // 分转元
  if (unit === 'fen') {
    num = num / 100
  }

  if (num === 0 && !showZero) return ''

  // 格式化小数
  const fixed = num.toFixed(decimals)
  // 去除末尾的0
  const formatted = decimals > 0 ? parseFloat(fixed).toString() : fixed

  return `${prefix}${formatted}`
}

/**
 * 格式化价格区间
 */
export const formatPriceRange = (
  min?: number,
  max?: number,
  unit: 'yuan' | 'fen' = 'yuan'
): string => {
  const minStr = min !== undefined ? formatPrice(min, { unit }) : ''
  const maxStr = max !== undefined ? formatPrice(max, { unit }) : ''

  if (minStr && maxStr) {
    return `${minStr} - ${maxStr}`
  }
  return minStr || maxStr || '价格面议'
}

// ==================== 日期时间格式化 ====================

/**
 * 格式化日期显示
 */
export const formatDate = (
  date: string | Date | number,
  format: string = 'YYYY-MM-DD'
): string => {
  if (!date) return ''
  return dayjs(date).format(format)
}

/**
 * 格式化日期为中文显示（如：1月9日 周四）
 */
export const formatDateCN = (date: string | Date): string => {
  const d = dayjs(date)
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.format('M月D日')} ${weekDays[d.day()]}`
}

/**
 * 格式化日期范围（如：01.09 - 01.10 共1晚）
 */
export const formatDateRange = (
  checkIn: string,
  checkOut: string
): string => {
  const start = dayjs(checkIn)
  const end = dayjs(checkOut)
  const nights = end.diff(start, 'day')
  
  return `${start.format('MM.DD')} - ${end.format('MM.DD')} 共${nights}晚`
}

/**
 * 获取相对时间描述（如：今天、明天、3天后）
 */
export const getRelativeDate = (date: string | Date): string => {
  const target = dayjs(date).startOf('day')
  const today = dayjs().startOf('day')
  const diff = target.diff(today, 'day')

  const map: Record<number, string> = {
    0: '今天',
    1: '明天',
    2: '后天'
  }

  return map[diff] || target.format('M月D日')
}

/**
 * 格式化时间戳为相对时间（如：刚刚、5分钟前、2小时前）
 */
export const formatTimeAgo = (timestamp: number | string | Date): string => {
  const now = dayjs()
  const past = dayjs(timestamp)
  const diffSeconds = now.diff(past, 'second')
  const diffMinutes = now.diff(past, 'minute')
  const diffHours = now.diff(past, 'hour')
  const diffDays = now.diff(past, 'day')

  if (diffSeconds < 60) return '刚刚'
  if (diffMinutes < 60) return `${diffMinutes}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 30) return `${diffDays}天前`
  if (diffDays < 365) return past.format('M月D日')
  return past.format('YYYY年M月D日')
}

// ==================== 数字格式化 ====================

/**
 * 格式化数字（千分位、大数简化）
 */
export const formatNumber = (
  num: number | string,
  options: {
    compact?: boolean    // 是否简化显示（如：1.2万）
    decimals?: number    // 小数位数
    padZero?: boolean    // 是否补零
  } = {}
): string => {
  const { compact = false, decimals = 0, padZero = false } = options
  let n = Number(num)
  if (isNaN(n)) return '0'

  // 大数简化
  if (compact) {
    if (n >= 100000000) return (n / 100000000).toFixed(decimals) + '亿'
    if (n >= 10000) return (n / 10000).toFixed(decimals) + '万'
    if (n >= 1000) return (n / 1000).toFixed(decimals) + 'k'
  }

  // 千分位
  const parts = n.toFixed(decimals).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  let result = parts.join('.')
  
  // 补零处理
  if (padZero && decimals > 0) {
    const currentDecimals = parts[1]?.length || 0
    if (currentDecimals < decimals) {
      result += '0'.repeat(decimals - currentDecimals)
    }
  }

  return result
}

/**
 * 格式化评分（保留一位小数，如：4.8）
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1)
}

// ==================== 文本格式化 ====================

/**
 * 截断文本
 */
export const truncateText = (
  text: string,
  maxLength: number,
  suffix: string = '...'
): string => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + suffix
}

/**
 * 高亮匹配文本
 */
export const highlightText = (
  text: string,
  keyword: string,
  highlightClass: string = 'highlight'
): string => {
  if (!keyword) return text
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`)
}

/**
 * 格式化手机号（138****8888）
 */
export const maskPhone = (phone: string): string => {
  if (!phone || phone.length !== 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化身份证号（显示前4位和后4位）
 */
export const maskIdCard = (idCard: string): string => {
  if (!idCard || idCard.length < 8) return idCard
  return idCard.replace(/(.{4}).*(.{4})/, '$1********$2')
}

// ==================== 酒店业务专用 ====================

/**
 * 格式化酒店星级（5 -> 五星级）
 */
export const formatStarLevel = (level: number): string => {
  const stars = ['', '一', '二', '三', '四', '五']
  return level >= 1 && level <= 5 ? `${stars[level]}星级` : '其他'
}

/**
 * 格式化距离（500 -> 500m，1500 -> 1.5km）
 */
export const formatDistance = (distance: number | string): string => {
  const d = Number(distance)
  if (isNaN(d)) return ''
  
  if (d < 1000) {
    return `${Math.round(d)}m`
  }
  return `${(d / 1000).toFixed(1)}km`
}

/**
 * 格式化设施标签（截断并添加计数）
 */
export const formatFacilities = (
  facilities: string[],
  maxShow: number = 4
): { shown: string[]; more: number } => {
  const shown = facilities.slice(0, maxShow)
  const more = Math.max(0, facilities.length - maxShow)
  return { shown, more }
}

// ==================== 文件/图片格式化 ====================

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 获取图片缩略图 URL（假设 CDN 支持尺寸参数）
 */
export const getThumbnailUrl = (
  url: string,
  width: number,
  height?: number
): string => {
  if (!url) return ''
  // 根据实际 CDN 规则调整
  const h = height || width
  return `${url}?imageView2/1/w/${width}/h/${h}/q/75`
}