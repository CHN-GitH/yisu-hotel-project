import { useState, useEffect } from 'react'
import { Card, Row, Col, Statistic, Progress, Spin } from 'antd'
import { DollarOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons'
import { useHotel } from '@/contexts/HotelContext'

interface DashboardData {
  overview: {
    todayOrders: number
    todayRevenue: number
    totalOrders: number
    totalRevenue: number
    occupancyRate: number
  }
}

function Dashboard() {
  const { selectedHotel } = useHotel()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DashboardData | null>(null)

  // 获取酒店数据
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const res: any = await fetch(`http://localhost:3000/api/hotel/${selectedHotel}/dashboard`).then(r => r.json())
        if (res.code === 0) {
          setData(res.data)
        }
      } catch (error) {
        console.error('获取仪表盘数据失败', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [selectedHotel])

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2>数据概览</h2>
        <p style={{ color: '#666' }}>查看您的酒店运营数据统计</p>
      </div>

      <Spin spinning={loading}>
        {/* 数据概览卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="今日订单数"
                value={data?.overview.todayOrders || 0}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="今日收入"
                value={data?.overview.todayRevenue || 0}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#52c41a' }}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="累计订单数"
                value={data?.overview.totalOrders || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="累计收入"
                value={data?.overview.totalRevenue || 0}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#fa8c16' }}
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
              />
            </Card>
          </Col>
        </Row>

        {/* 入住率卡片 */}
        <Card title="当前入住率" style={{ marginBottom: 24 }}>
          <Progress
            type="circle"
            percent={data?.overview.occupancyRate || 0}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            format={(percent) => `${percent}%`}
            width={120}
          />
        </Card>

        {/* 提示信息 */}
        <Card>
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            <div style={{ fontSize: 16, marginBottom: 8 }}>💡 提示</div>
            <div>如需查看详细的数据统计，请进入【酒店管理】页面，选择具体酒店后点击【数据统计】按钮</div>
          </div>
        </Card>
      </Spin>
    </div>
  )
}

export default Dashboard
