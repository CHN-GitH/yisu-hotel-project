import { get, post } from './request'

// 酒店相关接口
export const hotelApi = {
  // 搜索酒店
  search: (params: SearchParams) => 
    get<HotelListRes>('/hotels/search', params),
  
  // 获取酒店详情
  getDetail: (id: string) => 
    get<HotelDetail>(`/hotels/${id}`),
  
  // 获取热门城市
  getHotCities: () => 
    get<string[]>('/cities/hot'),
}

// 类型定义
export interface SearchParams {
  city: string
  checkIn: string
  checkOut: string
  keyword?: string
  starLevel?: number[]
  minPrice?: number
  maxPrice?: number
  page?: number
  pageSize?: number
}

export interface HotelListRes {
  list: HotelItem[]
  total: number
  hasMore: boolean
}

export interface HotelItem {
  id: string
  name: string
  nameEn?: string
  address: string
  starLevel: number
  rating: number
  reviewCount: number
  minPrice: number
  coverImage: string
  tags: string[]
  distance?: string
}

export interface HotelDetail extends HotelItem {
  images: string[]
  facilities: string[]
  description: string
  rooms: RoomType[]
  nearbyAttractions: Attraction[]
}

export interface RoomType {
  id: string
  name: string
  bedType: string
  area: number
  capacity: number
  price: number
  breakfast: boolean
  cancelPolicy: string
  image: string
}

export interface Attraction {
  name: string
  distance: string
  type: 'sight' | 'transport' | 'shopping'
}