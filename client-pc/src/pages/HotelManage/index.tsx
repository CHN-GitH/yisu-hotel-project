import { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Tag,
  Space,
  Popconfirm,
  message,
  Input,
  Card,
  Row,
  Col
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { getHotelList, publishHotel, offlineHotel, deleteHotel } from '@/api/hotel'

// 状态标签颜色映射
const statusMap: Record<string, { color: string; text: string }> = {
  pending: { color: 'orange', text: '审核中' },
  approved: { color: 'green', text: '已通过' },
  online: { color: 'green', text: '已上线' },
  rejected: { color: 'red', text: '未通过' },
  offline: { color: 'default', text: '已下线' },
  draft: { color: 'blue', text: '草稿' },
}

function HotelManage() {
  const navigate = useNavigate()
  const { userInfo } = useSelector((state: RootState) => state.user)
  const isAdmin = userInfo?.role === 'admin'

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [keyword, setKeyword] = useState('')

  // 获取列表数据
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getHotelList()
      setData(res || [])
    } catch (error) {
      console.error('获取酒店列表失败', error)
      message.error('获取酒店列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // 发布酒店
  const handlePublish = async (id: string) => {
    try {
      await publishHotel(id)
      message.success('发布成功')
      fetchData()
    } catch (error) {
      console.error('发布酒店失败', error)
    }
  }

  // 下线酒店
  const handleOffline = async (id: string) => {
    try {
      await offlineHotel(id)
      message.success('下线成功')
      fetchData()
    } catch (error) {
      console.error('下线酒店失败', error)
    }
  }

  // 删除酒店
  const handleDelete = async (id: string) => {
    try {
      await deleteHotel(id)
      message.success('删除成功')
      fetchData()
    } catch (error) {
      console.error('删除酒店失败', error)
    }
  }

  // 表格列定义
  const columns = [
    {
      title: '酒店名称',
      dataIndex: 'nameCn',
      key: 'nameCn',
      render: (text: string, record: any) => (
        <Space>
          <span>{text}</span>
          {record.nameEn && (
            <span style={{ color: '#999', fontSize: 12 }}>({record.nameEn})</span>
          )}
        </Space>
      ),
    },
    {
      title: '星级',
      dataIndex: 'star',
      key: 'star',
      width: 100,
      render: (star: number) => '⭐'.repeat(star),
    },
    {
      title: '最低价格',
      dataIndex: 'minPrice',
      key: 'minPrice',
      width: 120,
      render: (price: number) => `¥${price}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>
          {statusMap[status]?.text}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: any) => (
        <Space size="small">
          {/* 商户操作 */}
          {!isAdmin && (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => navigate(`/hotel/edit/${record.id}`)}
              >
                编辑
              </Button>
              {record.status === 'offline' && (
                <Popconfirm
                  title="确认发布？"
                  onConfirm={() => handlePublish(record.id)}
                >
                  <Button type="text" icon={<CheckOutlined />}>
                    发布
                  </Button>
                </Popconfirm>
              )}
              {record.status === 'approved' && (
                <Popconfirm
                  title="确认下线？"
                  onConfirm={() => handleOffline(record.id)}
                >
                  <Button type="text" danger icon={<CloseOutlined />}>
                    下线
                  </Button>
                </Popconfirm>
              )}
            </>
          )}

          {/* 管理员操作 */}
          {isAdmin && (
            <>
              <Button
                type="text"
                onClick={() => navigate(`/hotel/edit/${record.id}`)}
              >
                审核
              </Button>
              <Popconfirm
                title="确认删除？"
                description="删除后不可恢复"
                onConfirm={() => handleDelete(record.id)}
              >
                <Button type="text" danger>
                  删除
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ]

  // 过滤数据
  const filteredData = data.filter(item =>
    item.nameCn?.includes(keyword) || item.nameEn?.includes(keyword)
  )

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h2 style={{ margin: 0 }}>酒店管理</h2>
        </Col>
        <Col>
          <Space>
            <Input
              placeholder="搜索酒店"
              prefix={<SearchOutlined />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: 240 }}
              allowClear
            />
            {!isAdmin && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/hotel/edit')}
              >
                录入酒店
              </Button>
            )}
          </Space>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  )
}

export default HotelManage
