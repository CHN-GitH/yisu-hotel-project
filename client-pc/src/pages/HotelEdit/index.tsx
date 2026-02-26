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
  Col,
  Upload,
  ConfigProvider
} from 'antd'
import {
  SaveOutlined,
  ArrowLeftOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { createHotel, updateHotel, getHotelDetail, uploadHotelImage } from '@/api/hotel'
import dayjs from 'dayjs'
import type { UploadFile, UploadProps } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

// 自定义本地化配置
const customLocale = {
  ...zhCN,
  monthFormat: 'MM',
  months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
  shortMonths: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
  monthTitle: 'MM',
  today: '今天',
  now: '现在',
  backToToday: '回到今天',
  ok: '确定',
  clear: '清除',
  prevMonth: '上个月',
  nextMonth: '下个月',
  prevYear: '去年',
  nextYear: '明年',
  yearFormat: 'YYYY',
  dayFormat: 'DD',
  dateFormat: 'YYYY-MM-DD',
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  timeFormat: 'HH:mm:ss',
  // 确保月份显示为数字
  calendarHeaderFormat: 'YYYY年MM月'
}

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
  const [hotelDetail, setHotelDetail] = useState<any>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)

  // 编辑时获取详情
  useEffect(() => {
    if (id) {
      setLoading(true)
      getHotelDetail(id).then((res: any) => {
        setHotelDetail(res)
        form.setFieldsValue({
          name: res.nameCn || res.name,
          nameEn: res.nameEn,
          address: res.address,
          star: res.star,
          minPrice: res.minPrice,
          openDate: res.openDate ? dayjs(res.openDate) : null,
          facilities: res.facilities,
          discountInfo: res.description
        })
        // 设置图片列表
        if (res.images && res.images.length > 0) {
          const imageList = res.images.map((url: string, index: number) => ({
            uid: `${index}`,
            name: `image-${index}`,
            status: 'done' as const,
            url: `http://localhost:3000${url}`
          }))
          setFileList(imageList)
        }
        // 如果在审核中，显示提示
        if (res.status === 'pending' || res.pendingAction) {
          message.warning('该酒店正在审核中，暂不可修改')
        }
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
      // 上传所有新图片
      const imageUrls: string[] = []
      for (const file of fileList) {
        if (file.originFileObj && file.status !== 'done') {
          const res: any = await uploadHotelImage(file.originFileObj)
          imageUrls.push(res.url)
        } else if (file.url) {
          // 已存在的图片，提取URL
          imageUrls.push(file.url.replace('http://localhost:3000', ''))
        }
      }

      const data = {
        name: values.name,
        nameEn: values.nameEn,
        address: values.address,
        star: values.star,
        minPrice: values.minPrice,
        openDate: values.openDate?.format('YYYY-MM-DD'),
        facilities: values.facilities,
        discountInfo: values.discountInfo,
        images: imageUrls
      }

      if (isEdit) {
        await updateHotel(id!, data)
        message.success('已提交审核，请等待管理员审核')
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
    <ConfigProvider locale={customLocale}>
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
                  name="name"
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
                  <DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    locale={customLocale}
                  />
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

            <Form.Item label="酒店图片">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList: newFileList }) => {
                  setFileList(newFileList)
                }}
                beforeUpload={() => false}
                multiple
              >
                <Button icon={<PlusOutlined />}>上传图片</Button>
              </Upload>
              <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
                支持上传多张酒店图片，建议尺寸 800x600
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                icon={<SaveOutlined />}
                size="large"
                disabled={isEdit && (hotelDetail?.status === 'pending' || hotelDetail?.pendingAction)}
              >
                {isEdit ? '保存修改' : '创建酒店'}
              </Button>
              {isEdit && (hotelDetail?.status === 'pending' || hotelDetail?.pendingAction) && (
                <div style={{ color: '#faad14', marginTop: 8, fontSize: 14 }}>
                  该酒店正在审核中，暂不可修改
                </div>
              )}
            </Form.Item>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  )
}

export default HotelEdit
