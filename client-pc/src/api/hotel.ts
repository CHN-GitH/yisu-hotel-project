import request from './request'

// 获取酒店列表
export function getHotelList(params?: {
  page?: number
  pageSize?: number
}) {
  return request.get('/hotel/list', { params })
}
//获取酒店详情
export function getHotelDetail(id: string) {
  return request.get(`/hotel/detail/${id}`)
}
//创建酒店
export function createHotel(data: any) {
  return request.post('/hotel/create', data)
}
//更新酒店
export function updateHotel(id: string, data: any) {
  return request.put(`/hotel/update/${id}`, data)
}
//发布酒店
export function publishHotel(id: string) {
  return request.post(`/hotel/publish/${id}/publish`)
}
//下线酒店
export function offlineHotel(id: string) {
  return request.post(`/hotel/publish/${id}/offline`)
}
//删除酒店
export function deleteHotel(id: string) {
  return request.delete(`/hotel/delete/${id}`)
}

