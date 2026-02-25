import request from './request'

// 获取房型列表
export function getRoomTypes(hotelId: string) {
  return request.get(`/room-types/${hotelId}`)
}

// 创建房型
export function createRoomType(data: any) {
  return request.post('/room-types', data)
}

// 更新房型
export function updateRoomType(id: string, data: any) {
  return request.put(`/room-types/${id}`, data)
}

// 删除房型
export function deleteRoomType(id: string) {
  return request.delete(`/room-types/${id}`)
}
