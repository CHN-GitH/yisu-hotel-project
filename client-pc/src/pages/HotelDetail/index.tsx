import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Descriptions, Space, message } from 'antd'
import {
  ArrowLeftOutlined
} from '@ant-design/icons'
import { getHotelDetail } from '@/api/hotel'
import RoomTypeManage from '@/components/RoomTypeManage'

// 酒店详情页
function HotelDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [hotel, setHotel] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // 获取酒店详情
  useEffect(() => {
    if (id) {
      setLoading(true)
      getHotelDetail(id)
        .then((res: any) => {
          setHotel(res)
        })
        .catch((error) => {
          console.error('获取酒店详情失败', error)
          message.error('获取酒店详情失败')
        })
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return <div>加载中...</div>
  }

  if (!hotel) {
    return <div>酒店不存在</div>
  }

  return (
    <div>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          返回
        </Button>
      </Space>

      <Card title="酒店信息" style={{ marginBottom: 24 }}>
        <Descriptions column={2} bordered>
          <Descriptions.Item label="酒店名称">
            {hotel.nameCn}
            {hotel.nameEn && (
              <span style={{ marginLeft: 8, color: '#999' }}>({hotel.nameEn})</span>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="星级">
            {'⭐'.repeat(hotel.star)}
          </Descriptions.Item>
          <Descriptions.Item label="地址">
            {hotel.address}
          </Descriptions.Item>
          <Descriptions.Item label="最低价格">
            ¥{hotel.minPrice}
          </Descriptions.Item>
          <Descriptions.Item label="开业时间">
            {hotel.openDate}
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            {hotel.status === 'online' ? '已上线' :
              hotel.status === 'pending' ? '审核中' :
                hotel.status === 'offline' ? '已下线' :
                  hotel.status === 'draft' ? '草稿' : hotel.status}
          </Descriptions.Item>
          <Descriptions.Item label="设施" span={2}>
            <Space wrap>
              {hotel.facilities?.map((fac: string) => (
                <span key={fac} style={{ marginRight: 8 }}>
                  {fac}
                </span>
              ))}
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <RoomTypeManage hotelId={id} />
    </div>
  )
}

export default HotelDetail
