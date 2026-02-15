// 酒店星级
export const STAR_LEVELS = [
  { value: 5, label: '五星级', icon: '⭐⭐⭐⭐⭐' },
  { value: 4, label: '四星级', icon: '⭐⭐⭐⭐' },
  { value: 3, label: '三星级', icon: '⭐⭐⭐' },
  { value: 2, label: '二星级', icon: '⭐⭐' },
  { value: 1, label: '经济型', icon: '⭐' }
]

// 快捷标签
export const QUICK_TAGS = [
  '亲子',
  '豪华',
  '免费停车',
  '近地铁',
  '海景',
  '温泉',
  '网红',
  '商务'
]

// 价格区间
export const PRICE_RANGES = [
  { min: 0, max: 200, label: '¥200以下' },
  { min: 200, max: 500, label: '¥200-500' },
  { min: 500, max: 1000, label: '¥500-1000' },
  { min: 1000, max: 2000, label: '¥1000-2000' },
  { min: 2000, max: undefined, label: '¥2000以上' }
]

// 排序选项
export const SORT_OPTIONS = [
  { value: 'default', label: '综合排序' },
  { value: 'price_asc', label: '价格最低' },
  { value: 'price_desc', label: '价格最高' },
  { value: 'rating', label: '评分最高' },
  { value: 'distance', label: '距离最近' }
]

// 设施类型
export const FACILITY_TYPES = [
  '免费WiFi',
  '停车场',
  '健身房',
  '游泳池',
  '餐厅',
  '会议室',
  '行李寄存',
  '24小时前台',
  '电梯',
  '空调'
]

// 房型配置
export const ROOM_FEATURES = [
  { key: 'window', label: '有窗' },
  { key: 'breakfast', label: '含早餐' },
  { key: 'cancel', label: '免费取消' },
  { key: 'instant', label: '立即确认' }
]