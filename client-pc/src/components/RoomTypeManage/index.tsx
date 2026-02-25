import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
  Popconfirm,
  Tag,
  Card,
  Row,
  Col
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { getRoomTypes, createRoomType, deleteRoomType } from '@/api/roomType'

const { Option } = Select

// 防抖函数
function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// 房型管理组件
function RoomTypeManage({ hotelId }: { hotelId: string | undefined }) {
  const navigate = useNavigate()
  const [roomTypes, setRoomTypes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  // 搜索、筛选、排序状态
  const [searchKeyword, setSearchKeyword] = useState('')
  const [bedCountFilter, setBedCountFilter] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'createdAt' | 'price'>('createdAt')

  // 防抖搜索关键词
  const debouncedSearchKeyword = useDebounce(searchKeyword, 300)

  // 获取房型列表
  const fetchRoomTypes = async () => {
    if (!hotelId) return

    setLoading(true)
    try {
      const res: any = await getRoomTypes(hotelId)
      setRoomTypes(res || [])
    } catch (error) {
      console.error('获取房型列表失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (hotelId) {
      fetchRoomTypes()
    }
  }, [hotelId])

  // 过滤和排序房型
  const filteredRoomTypes = useMemo(() => {
    let result = [...roomTypes]

    // 搜索过滤
    if (debouncedSearchKeyword) {
      result = result.filter(rt =>
        rt.name.toLowerCase().includes(debouncedSearchKeyword.toLowerCase())
      )
    }

    // 床位数筛选
    if (bedCountFilter !== null) {
      if (bedCountFilter === 3) {
        result = result.filter(rt => rt.bedCount >= 3)
      } else {
        result = result.filter(rt => rt.bedCount === bedCountFilter)
      }
    }

    // 排序
    result.sort((a, b) => {
      switch (sortBy) {
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'price':
          return a.price - b.price
        default:
          return 0
      }
    })

    return result
  }, [roomTypes, debouncedSearchKeyword, bedCountFilter, sortBy])

  // 打开添加弹窗
  const handleOpenModal = () => {
    form.resetFields()
    setModalVisible(true)
  }

  // 关闭弹窗
  const handleCloseModal = () => {
    setModalVisible(false)
    form.resetFields()
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!hotelId) return

    try {
      const values = await form.validateFields()
      const data = {
        ...values,
        hotelId: parseInt(hotelId)
      }

      await createRoomType(data)
      message.success('创建成功')

      handleCloseModal()
      fetchRoomTypes()
    } catch (error) {
      console.error('保存房型失败', error)
    }
  }

  // 删除房型
  const handleDelete = async (id: string) => {
    try {
      await deleteRoomType(id)
      message.success('删除成功')
      fetchRoomTypes()
    } catch (error) {
      console.error('删除房型失败', error)
    }
  }

  // 重置筛选
  const handleResetFilters = () => {
    setSearchKeyword('')
    setBedCountFilter(null)
    setSortBy('createdAt')
  }

  // 表格列定义
  const columns = [
    {
      title: '房型名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => {
        if (!hotelId) {
          return text
        }
        return (
          <span
            style={{ cursor: 'pointer', color: '#1890ff' }}
            onClick={() => navigate(`/hotel/${hotelId}/room-type/${record.id}`)}
          >
            {text}
          </span>
        )
      },
    },
    {
      title: '价格（元/晚）',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => `¥${price}`,
    },
    {
      title: '面积（㎡）',
      dataIndex: 'area',
      key: 'area',
      width: 100,
    },
    {
      title: '床位数',
      dataIndex: 'bedCount',
      key: 'bedCount',
      width: 100,
    },
    {
      title: '设施',
      dataIndex: 'facilities',
      key: 'facilities',
      render: (facilities: string[]) => (
        <Space wrap>
          {(facilities || []).map(fac => (
            <Tag key={fac}>{fac}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Popconfirm
          title="确认删除？"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>房型管理</h3>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpenModal()}
        >
          添加房型
        </Button>
      </div>

      {/* 搜索、筛选、排序区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Input
              placeholder="按房型名称搜索"
              prefix={<SearchOutlined />}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="床位数"
              value={bedCountFilter}
              onChange={setBedCountFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value={1}>1张</Option>
              <Option value={2}>2张</Option>
              <Option value={3}>3张+</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="排序"
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '100%' }}
            >
              <Option value="createdAt">创建时间（新→旧）</Option>
              <Option value="price">价格（低→高）</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button onClick={handleResetFilters} block>
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredRoomTypes}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* 添加弹窗 */}
      <Modal
        title="添加房型"
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="房型名称"
            name="name"
            rules={[{ required: true, message: '请输入房型名称' }]}
          >
            <Input placeholder="如：标准大床房" />
          </Form.Item>

          <Form.Item
            label="价格（元/晚）"
            name="price"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              placeholder="请输入价格"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="面积（㎡）"
            name="area"
            rules={[{ required: true, message: '请输入面积' }]}
          >
            <InputNumber
              min={0}
              placeholder="请输入面积"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="床位数"
            name="bedCount"
            rules={[{ required: true, message: '请输入床位数' }]}
          >
            <InputNumber
              min={1}
              placeholder="请输入床位数"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="楼层"
            name="floor"
            rules={[{ required: true, message: '请输入楼层' }]}
          >
            <InputNumber
              min={1}
              placeholder="请输入楼层"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="设施"
            name="facilities"
          >
            <Select
              mode="multiple"
              placeholder="选择设施"
              style={{ width: '100%' }}
            >
              <Option value="免费WiFi">免费WiFi</Option>
              <Option value="空调">空调</Option>
              <Option value="电视">电视</Option>
              <Option value="冰箱">冰箱</Option>
              <Option value="热水器">热水器</Option>
              <Option value="洗衣机">洗衣机</Option>
              <Option value="吹风机">吹风机</Option>
              <Option value="浴缸">浴缸</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea
              rows={3}
              placeholder="请输入描述"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RoomTypeManage
