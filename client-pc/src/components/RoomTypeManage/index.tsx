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
  Col,
  Upload,
  Image
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons'
import type { UploadFile } from 'antd'
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
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

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
    setFileList([])
    setModalVisible(true)
  }

  // 关闭弹窗
  const handleCloseModal = () => {
    setModalVisible(false)
    form.resetFields()
    setFileList([])
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!hotelId) return

    try {
      const values = await form.validateFields()

      // 提取图片URL
      console.log('fileList:', fileList);
      const images = fileList
        .filter(file => file.status === 'done')
        .map(file => {
          console.log('file:', file);
          let url = '';
          if (file.response && file.response.data && typeof file.response.data === 'object') {
            // 处理单文件上传的情况
            console.log('file.response.data:', file.response.data);
            url = file.response.data.url;
          } else {
            url = file.url || '';
          }
          // 确保只保存相对路径
          if (url && url.startsWith('http')) {
            return url.replace('http://localhost:3000', '');
          }
          return url;
        })
        .filter(Boolean)
      console.log('images:', images);

      // 构建后端期望的数据结构
      const data = {
        hotelId: parseInt(hotelId),
        name: values.name,
        price: values.price,
        area: values.area,
        bedType: values.bedCount === 1 ? '单床' : values.bedCount === 2 ? '双床' : '多床',
        capacity: values.bedCount,
        floor: values.floor,
        facilities: values.facilities,
        description: values.description,
        images: images
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
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image: string) => (
        image ? <img src={image.startsWith('http') ? image : `http://localhost:3000${image}`} width={60} height={40} style={{ objectFit: 'cover' }} /> : '-'
      ),
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

          <Form.Item
            label="房型图片"
            name="images"
          >
            <Upload
              name="files"
              listType="picture-card"
              fileList={fileList}
              customRequest={async (options) => {
                console.log('Upload customRequest options:', options);
                if (!options) {
                  console.error('Upload customRequest options is undefined');
                  return;
                }
                const { file, onSuccess, onError } = options;
                if (!file || typeof onSuccess !== 'function' || typeof onError !== 'function') {
                  console.error('Upload customRequest missing required parameters');
                  return;
                }
                const formData = new FormData();
                formData.append('file', file);

                try {
                  const response = await fetch('http://localhost:3000/api/upload/single', {
                    method: 'POST',
                    body: formData,
                  });

                  const result = await response.json();
                  console.log('Upload customRequest result:', result);

                  if (result.code === 0 && result.data) {
                    // 正确的用法：第一个参数是响应数据，第二个参数是文件对象
                    onSuccess(result, file);
                  } else {
                    onError(new Error('上传失败'));
                  }
                } catch (error) {
                  console.error('Upload customRequest error:', error);
                  onError(new Error(typeof error === 'string' ? error : error instanceof Error ? error.message : '上传失败'));
                }
              }}
              onChange={(info) => {
                console.log('Upload onChange info:', info);
                const { fileList: newFileList } = info;
                const processedFileList = newFileList.map(file => {
                  if (file.status === 'done' && file.response) {
                    console.log('Upload file response:', file.response);
                    // 检查响应是否成功
                    if (file.response.code === 0 && file.response.data) {
                      // 处理单文件上传的响应
                      return {
                        ...file,
                        url: file.response.data.url
                      };
                    }
                  }
                  // 处理上传错误
                  if (file.status === 'error') {
                    console.error('上传错误:', file.error);
                    message.error('上传失败，请重试');
                  }
                  return file;
                });
                setFileList(processedFileList);
              }}
              onPreview={(file) => {
                console.log('Upload onPreview file:', file);
                setPreviewImage(file.url || file.preview || '')
                setPreviewOpen(true)
              }}
            >
              {fileList.length < 5 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
            <div style={{ marginTop: 8, color: '#999' }}>
              最多上传5张图片，支持 JPG、PNG 格式
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 图片预览 */}
      <Modal
        open={previewOpen}
        title="图片预览"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <Image alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

export default RoomTypeManage
