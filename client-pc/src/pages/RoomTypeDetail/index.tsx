import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Space,
  message,
  Form,
  Input,
  InputNumber,
  Select,
  Descriptions,
  Image,
  Upload,
  Modal
} from 'antd'
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { getRoomTypes, updateRoomType } from '@/api/roomType'

const { Option } = Select

// 房型详情页
function RoomTypeDetail() {
  const navigate = useNavigate()
  const { hotelId, roomTypeId } = useParams()
  const [roomType, setRoomType] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  // 获取房型详情
  useEffect(() => {
    if (hotelId && roomTypeId) {
      fetchRoomTypeDetail()
    }
  }, [hotelId, roomTypeId])

  // 获取房型详情
  const fetchRoomTypeDetail = async () => {
    setLoading(true)
    try {
      const roomTypes: any = await getRoomTypes(hotelId!)
      const roomTypeDetail = roomTypes.find((rt: any) => rt.id === parseInt(roomTypeId!))
      if (roomTypeDetail) {
        setRoomType(roomTypeDetail)
        form.setFieldsValue(roomTypeDetail)

        // 设置图片列表
        if (roomTypeDetail.images && roomTypeDetail.images.length > 0) {
          const fileList = roomTypeDetail.images.map((url: string, index: number) => ({
            uid: `-${index}`,
            name: `image-${index}.jpg`,
            status: 'done',
            url: url,
          }))
          setFileList(fileList)
        }
      }
    } catch (error) {
      console.error('获取房型详情失败', error)
      message.error('获取房型详情失败')
    } finally {
      setLoading(false)
    }
  }

  // 开始编辑
  const handleEdit = () => {
    setEditing(true)
  }

  // 取消编辑
  const handleCancel = () => {
    setEditing(false)
    form.setFieldsValue(roomType)
  }

  // 保存修改
  const handleSave = async () => {
    try {
      setSaving(true)
      const values = await form.validateFields()

      // 提取图片URL
      const images = fileList
        .filter(file => file.status === 'done')
        .map(file => file.url || (file.response?.url))

      const data = {
        ...values,
        images
      }

      await updateRoomType(roomTypeId!, data)
      message.success('保存成功')
      setEditing(false)
      fetchRoomTypeDetail()
    } catch (error) {
      console.error('保存失败', error)
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  // 图片上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList,
    listType: 'picture-card',
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList)
    },
    onPreview: (file) => {
      setPreviewImage(file.url || file.preview || '')
      setPreviewOpen(true)
    },
    customRequest: ({ onSuccess }) => {
      // 模拟上传，实际项目中应该上传到服务器
      setTimeout(() => {
        const mockUrl = `https://via.placeholder.com/400x300/1890ff/ffffff?text=Room${Date.now()}`
        onSuccess?.({ url: mockUrl })
      }, 1000)
    },
  }

  // 删除图片
  const handleRemoveImage = (file: UploadFile) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid)
    setFileList(newFileList)
  }

  if (loading) {
    return <div>加载中...</div>
  }

  if (!roomType) {
    return <div>房型不存在</div>
  }

  return (
    <div>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          返回
        </Button>
        {!editing && (
          <Button type="primary" icon={<SaveOutlined />} onClick={handleEdit}>
            编辑
          </Button>
        )}
        {editing && (
          <>
            <Button type="primary" onClick={handleSave} loading={saving}>
              保存
            </Button>
            <Button onClick={handleCancel}>
              取消
            </Button>
          </>
        )}
      </Space>

      <Card title="房型信息" style={{ marginBottom: 24 }}>
        {!editing ? (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="房型名称">
              {roomType.name}
            </Descriptions.Item>
            <Descriptions.Item label="价格（元/晚）">
              ¥{roomType.price}
            </Descriptions.Item>
            <Descriptions.Item label="面积（㎡）">
              {roomType.area}
            </Descriptions.Item>
            <Descriptions.Item label="床位数">
              {roomType.bedCount}
            </Descriptions.Item>
            <Descriptions.Item label="楼层">
              {roomType.floor}
            </Descriptions.Item>
            <Descriptions.Item label="设施" span={2}>
              <Space wrap>
                {roomType.facilities?.map((fac: string) => (
                  <span key={fac} style={{ marginRight: 8 }}>
                    {fac}
                  </span>
                ))}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="描述" span={2}>
              {roomType.description || '-'}
            </Descriptions.Item>
          </Descriptions>
        ) : (
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
        )}
      </Card>

      <Card title="房型图片">
        <Upload
          {...uploadProps}
          disabled={!editing}
          onRemove={editing ? handleRemoveImage : undefined}
        >
          {editing && fileList.length < 5 && (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
          )}
        </Upload>
        <div style={{ marginTop: 8, color: '#999' }}>
          最多上传5张图片，支持 JPG、PNG 格式
        </div>
      </Card>

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

export default RoomTypeDetail
