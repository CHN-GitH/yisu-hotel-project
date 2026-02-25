import { useState, useEffect } from 'react'
import { Table, Switch, message, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface Permission {
  id: number
  roleName: string
  userCount: number
  permissions: {
    userManage: boolean
    merchantManage: boolean
    hotelManage: boolean
    roomTypeManage: boolean
    operationLog: boolean
    permissionManage: boolean
  }
}

function PermissionManage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(false)

  // 获取权限列表
  const fetchPermissions = async () => {
    setLoading(true)
    try {
      const res: any = await fetch('http://localhost:3000/api/admin/permissions').then(r => r.json())
      if (res.code === 0) {
        setPermissions(res.data)
      }
    } catch (error) {
      console.error('获取权限列表失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  // 更新权限
  const handlePermissionChange = async (
    roleId: number,
    permissionKey: string,
    value: boolean
  ) => {
    try {
      const res: any = await fetch(`http://localhost:3000/api/admin/permissions/${roleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [permissionKey]: value })
      }).then(r => r.json())

      if (res.code === 0) {
        message.success('权限更新成功')
        fetchPermissions()
      } else {
        message.error(res.msg || '更新失败')
      }
    } catch (error) {
      console.error('更新权限失败', error)
      message.error('更新失败')
    }
  }

  const columns: ColumnsType<Permission> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (roleName: string, record: Permission) => {
        const color = record.id === 1 ? 'blue' : 'green'
        return <Tag color={color}>{roleName}</Tag>
      },
    },
    {
      title: '用户数量',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => <span>{count} 人</span>,
    },
    {
      title: '用户管理',
      dataIndex: ['permissions', 'userManage'],
      key: 'userManage',
      render: (value: boolean, record: Permission) => (
        <Switch
          checked={value}
          onChange={(checked) => handlePermissionChange(record.id, 'userManage', checked)}
          disabled={record.id === 1}
        />
      ),
    },
    {
      title: '商户管理',
      dataIndex: ['permissions', 'merchantManage'],
      key: 'merchantManage',
      render: (value: boolean, record: Permission) => (
        <Switch
          checked={value}
          onChange={(checked) => handlePermissionChange(record.id, 'merchantManage', checked)}
          disabled={record.id === 1}
        />
      ),
    },
    {
      title: '酒店管理',
      dataIndex: ['permissions', 'hotelManage'],
      key: 'hotelManage',
      render: (value: boolean, record: Permission) => (
        <Switch
          checked={value}
          onChange={(checked) => handlePermissionChange(record.id, 'hotelManage', checked)}
        />
      ),
    },
    {
      title: '房型管理',
      dataIndex: ['permissions', 'roomTypeManage'],
      key: 'roomTypeManage',
      render: (value: boolean, record: Permission) => (
        <Switch
          checked={value}
          onChange={(checked) => handlePermissionChange(record.id, 'roomTypeManage', checked)}
        />
      ),
    },
    {
      title: '操作日志',
      dataIndex: ['permissions', 'operationLog'],
      key: 'operationLog',
      render: (value: boolean, record: Permission) => (
        <Switch
          checked={value}
          onChange={(checked) => handlePermissionChange(record.id, 'operationLog', checked)}
          disabled={record.id === 1}
        />
      ),
    },
    {
      title: '权限管理',
      dataIndex: ['permissions', 'permissionManage'],
      key: 'permissionManage',
      render: (value: boolean, record: Permission) => (
        <Switch
          checked={value}
          onChange={(checked) => handlePermissionChange(record.id, 'permissionManage', checked)}
          disabled={record.id === 1}
        />
      ),
    },
  ]

  return (
    <div>
      <h2>权限管理</h2>
      <Table
        columns={columns}
        dataSource={permissions}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  )
}

export default PermissionManage
