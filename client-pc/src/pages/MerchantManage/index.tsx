import { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Space, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Merchant {
  id: number
  username: string
  name: string
  hotelCount: number
  status: string
}

function MerchantManage() {
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null)
  const [form] = Form.useForm()

  // 获取商户列表
  const fetchMerchants = async () => {
    setLoading(true)
    try {
      const res: any = await fetch('http://localhost:3000/api/admin/merchants').then(r => r.json())
      if (res.code === 0) {
        setMerchants(res.data)
      }
    } catch (error) {
      console.error('获取商户列表失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMerchants()
  }, [])

  // 打开新增商户弹窗
  const handleAdd = () => {
    setEditingMerchant(null)
    form.resetFields()
    setModalVisible(true)
  }

  // 打开编辑商户弹窗
  const handleEdit = (merchant: Merchant) => {
    setEditingMerchant(merchant)
    form.setFieldsValue(merchant)
    setModalVisible(true)
  }

  // 删除商户
  const handleDelete = async (id: number) => {
    try {
      const res: any = await fetch(`http://localhost:3000/api/admin/merchants/${id}`, {
        method: 'DELETE'
      }).then(r => r.json())
      if (res.code === 0) {
        message.success('删除成功')
        fetchMerchants()
      } else {
        message.error(res.msg || '删除失败')
      }
    } catch (error) {
      console.error('删除失败', error)
      message.error('删除失败')
    }
  }

  // 保存商户
  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const url = editingMerchant
        ? `http://localhost:3000/api/admin/merchants/${editingMerchant.id}`
        : 'http://localhost:3000/api/admin/merchants'
      const method = editingMerchant ? 'PUT' : 'POST'

      const res: any = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      }).then(r => r.json())

      if (res.code === 0) {
        message.success(editingMerchant ? '更新成功' : '创建成功')
        setModalVisible(false)
        fetchMerchants()
      } else {
        message.error(res.msg || '保存失败')
      }
    } catch (error) {
      console.error('保存失败', error)
      message.error('保存失败')
    }
  }

  const columns: ColumnsType<Merchant> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '酒店数量',
      dataIndex: 'hotelCount',
      key: 'hotelCount',
      render: (count: number) => <span>{count} 家</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? 'green' : 'red'
        const text = status === 'active' ? '正常' : '禁用'
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>商户管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增商户
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={merchants}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingMerchant ? '编辑商户' : '新增商户'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
            initialValue="active"
          >
            <Select placeholder="请选择状态">
              <Select.Option value="active">正常</Select.Option>
              <Select.Option value="inactive">禁用</Select.Option>
            </Select>
          </Form.Item>
          {!editingMerchant && (
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default MerchantManage
