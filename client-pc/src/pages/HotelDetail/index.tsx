import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Descriptions, Space, message, Statistic, Row, Col, Table, Progress, DatePicker } from 'antd'
import {
  ArrowLeftOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { getHotelDetail } from '@/api/hotel'
import RoomTypeManage from '@/components/RoomTypeManage'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface DashboardData {
  overview: {
    todayOrders: number
    todayRevenue: number
    totalOrders: number
    totalRevenue: number
    occupancyRate: number
  }
  salesData: Array<{
    date: string
    revenue: number
    orders: number
  }>
  occupancyData: Array<{
    date: string
    rate: number
  }>
  popularRoomTypes: Array<{
    name: string
    orders: number
    revenue: number
    rate: number
  }>
}

// 酒店详情页
function HotelDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [hotel, setHotel] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)

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

  // 获取酒店数据统计
  const fetchDashboardData = async () => {
    if (!id) return

    // 如果已经显示数据，则隐藏
    if (showDashboard) {
      setShowDashboard(false)
      return
    }

    setDashboardLoading(true)
    try {
      const res: any = await fetch(`http://localhost:3000/api/hotel/${id}/dashboard`).then(r => r.json())
      if (res.code === 0) {
        setDashboardData(res.data)
        setShowDashboard(true)
      }
    } catch (error) {
      console.error('获取数据统计失败', error)
      message.error('获取数据统计失败')
    } finally {
      setDashboardLoading(false)
    }
  }

  // 热门房型表格列
  const popularColumns: ColumnsType<any> = [
    {
      title: '排名',
      key: 'rank',
      render: (_: any, __: any, index: number) => (
        <span style={{
          display: 'inline-block',
          width: 24,
          height: 24,
          lineHeight: '24px',
          textAlign: 'center',
          borderRadius: '50%',
          backgroundColor: index < 3 ? '#1890ff' : '#f0f0f0',
          color: index < 3 ? '#fff' : '#999',
        }}>
          {index + 1}
        </span>
      ),
    },
    {
      title: '房型名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '订单数',
      dataIndex: 'orders',
      key: 'orders',
      sorter: (a: any, b: any) => a.orders - b.orders,
    },
    {
      title: '收入',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `¥${revenue.toLocaleString()}`,
      sorter: (a: any, b: any) => a.revenue - b.revenue,
    },
    {
      title: '占比',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          format={(percent) => `${percent}%`}
          strokeColor={rate > 20 ? '#52c41a' : '#faad14'}
        />
      ),
    },
  ]

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
        <Button
          type="primary"
          icon={<BarChartOutlined />}
          onClick={fetchDashboardData}
          loading={dashboardLoading}
        >
          数据统计
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

      {showDashboard && dashboardData && (
        <>
          <Card title="数据统计" style={{ marginBottom: 24 }} loading={dashboardLoading}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="今日订单数"
                  value={dashboardData.overview.todayOrders}
                  styles={{ content: { color: '#1890ff' } }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="今日收入"
                  value={dashboardData.overview.todayRevenue}
                  precision={2}
                  styles={{ content: { color: '#52c41a' } }}
                  prefix="¥"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="累计订单数"
                  value={dashboardData.overview.totalOrders}
                  styles={{ content: { color: '#722ed1' } }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="累计收入"
                  value={dashboardData.overview.totalRevenue}
                  precision={2}
                  styles={{ content: { color: '#fa8c16' } }}
                  prefix="¥"
                />
              </Col>
            </Row>
          </Card>

          <Card title="当前入住率" style={{ marginBottom: 24 }} loading={dashboardLoading}>
            <Progress
              type="circle"
              percent={dashboardData.overview.occupancyRate}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              format={(percent) => `${percent}%`}
              width={120}
            />
          </Card>

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card title="销售趋势（收入）" loading={dashboardLoading}>
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                    ¥{dashboardData.salesData?.[dashboardData.salesData.length - 1]?.revenue.toLocaleString() || '0'}
                  </div>
                  <div style={{ color: '#666' }}>
                    {dashboardData.salesData?.[dashboardData.salesData.length - 1]?.date || ''} 收入
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="订单量趋势" loading={dashboardLoading}>
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                    {dashboardData.salesData?.[dashboardData.salesData.length - 1]?.orders || 0} 单
                  </div>
                  <div style={{ color: '#666' }}>
                    {dashboardData.salesData?.[dashboardData.salesData.length - 1]?.date || ''} 订单量
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Card title="入住率分析" style={{ marginBottom: 24 }} loading={dashboardLoading}>
            <div style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                {dashboardData.occupancyData?.[dashboardData.occupancyData.length - 1]?.rate || 0}%
              </div>
              <div style={{ color: '#666' }}>
                {dashboardData.occupancyData?.[dashboardData.occupancyData.length - 1]?.date || ''} 入住率
              </div>
            </div>
          </Card>

          <Card title="热门房型排行" loading={dashboardLoading}>
            <Table
              columns={popularColumns}
              dataSource={dashboardData.popularRoomTypes || []}
              rowKey="name"
              pagination={false}
            />
          </Card>
        </>
      )}

      <RoomTypeManage hotelId={id} />
    </div>
  )
}

export default HotelDetail
