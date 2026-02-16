import { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Card,
  InputNumber,
  Select,
  DatePicker,
  message,
  Space,
  Row,
  Col
} from 'antd'
import {
  SaveOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { createHotel, updateHotel, getHotelDetail } from '@/api/hotel'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Option } = Select

// 设施选项
const facilityOptions = [
  '免费WiFi', '停车场', '游泳池', '健身房',
  '餐厅', '会议室', '洗衣服务', '接送服务'
]

function HotelEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // 编辑时获取详情
  useEffect(() => {
    if (id) {
      setLoading(true)
      getHotelDetail(id).then((res: any) => {
        form.setFieldsValue({
          ...res,
          openDate: res.openDate ? dayjs(res.openDate) : null,
        })
      }).catch((error) => {
        console.error('获取酒店详情失败', error)
        message.error('获取酒店详情失败')
      }).finally(() => setLoading(false))
    }
  }, [id, form])

  // 提交表单
  const onFinish = async (values: any) => {
    setSaving(true)
    try {
      const data = {
        ...values,
        openDate: values.openDate?.format('YYYY-MM-DD'),
      }

      if (isEdit) {
        await updateHotel(id!, data)
        message.success('更新成功')
      } else {
        await createHotel(data)
        message.success('创建成功')
      }
      navigate('/hotel/manage')
    } catch (error) {
      console.error('保存酒店失败', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Space style={{ marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          返回
        </Button>
        <h2 style={{ margin: 0 }}>{isEdit ? '编辑酒店' : '录入酒店'}</h2>
      </Space>

      <Card loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="酒店中文名"
                name="nameCn"
                rules={[{ required: true, message: '请输入酒店中文名' }]}
              >
                <Input placeholder="请输入酒店中文名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="酒店英文名"
                name="nameEn"
              >
                <Input placeholder="请输入酒店英文名（选填）" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="酒店地址"
            name="address"
            rules={[{ required: true, message: '请输入酒店地址' }]}
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>

          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="酒店星级"
                name="star"
                initialValue={3}
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value={2}>二星级</Option>
                  <Option value={3}>三星级</Option>
                  <Option value={4}>四星级</Option>
                  <Option value={5}>五星级</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="最低价格（元/晚）"
                name="minPrice"
                rules={[{ required: true, message: '请输入价格' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="请输入价格"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="开业时间"
                name="openDate"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="酒店设施"
            name="facilities"
          >
            <Select mode="multiple" placeholder="选择酒店设施">
              {facilityOptions.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="优惠信息"
            name="discountInfo"
          >
            <TextArea
              rows={3}
              placeholder="请输入优惠信息，如：节日8折优惠"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              icon={<SaveOutlined />}
              size="large"
            >
              {isEdit ? '保存修改' : '创建酒店'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default HotelEdit
