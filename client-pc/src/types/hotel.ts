/**
 * 酒店星级
 */
export type HotelStar = 2 | 3 | 4 | 5

/**
 * 酒店审核状态
 * pending：待审核
 * approved：已审核
 * rejected：审核拒绝
 * online：已上线
 * offline：已下线
 */
export type HotelStatus = 'pending' | 'approved' | 'rejected' | 'offline' | 'online'

/**
 * 房型信息
 */
export interface RoomType {
  //房型名称
  name: string
  //房型价格  元/晚
  price: number
  //房间数量
  count: number
  //床型
  bedType: string
  //可住人数
  capacity: number
}

/**
 * 酒店信息接口
 */

export interface HotelInfo {
  //酒店ID
  id: number
  //酒店中文名
  nameCn: string
  //酒店英文名
  nameEn?: string
  //酒店地址
  address: string
  //酒店星级
  star: HotelStar
  //最低价格
  minPrice: number
  //开业时间
  openDate: string
  //酒店设施
  facilities: string[]
  //优惠信息
  discountInfo?: string
  //审核状态
  status: HotelStatus
  //审核失败原因
  rejectReason?: string
  //创建时间
  createdAt?: string
  //更新时间
  updatedAt?: string
  //创建者ID
  createdBy?: string
}
