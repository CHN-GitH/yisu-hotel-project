import { useState, useEffect } from 'react'
import { Table, Select, DatePicker, Space, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'

interface Log {
  id: number
  username: string
  name: string
  action: string
  module: string
  details: string
  ip: string
  createTime: string
}

const { RangePicker } = DatePicker

function OperationLog() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState<string>('')
  const [module, setModule] = useState<string>('')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)

  // 获取操作日志列表
  const fetchLogs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (username) params.append('username', username)
      if (module) params.append('module', module)
      if (dateRange) {
        params.append('startDate', dateRange[0].format('YYYY-MM-DD'))
        params.append('endDate', dateRange[1].format('YYYY-MM-DD'))
      }

      const res: any = await fetch(`http://localhost:3000/api/admin/logs?${params}`).then(r => r.json())
      if (res.code === 0) {
        setLogs(res.data)
      }
    } catch (error) {
      console.error('获取操作日志失败', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [username, module, dateRange])

  const columns: ColumnsType<Log> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '操作人',
      key: 'operator',
      render: (_, record) => (
        <div>
          <div>{record.name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.username}</div>
        </div>
      ),
    },
    {
      title: '操作模块',
      dataIndex: 'module',
      key: 'module',
      render: (module: string) => {
        const moduleMap: Record<string, string> = {
          user: '用户管理',
          merchant: '商户管理',
          hotel: '酒店管理',
          roomType: '房型管理',
          permission: '权限管理',
        }
        return moduleMap[module] || module
      },
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const actionMap: Record<string, { text: string; color: string }> = {
          create: { text: '新增', color: 'green' },
          update: { text: '更新', color: 'blue' },
          delete: { text: '删除', color: 'red' },
          login: { text: '登录', color: 'cyan' },
          logout: { text: '退出', color: 'orange' },
        }
        const info = actionMap[action] || { text: action, color: 'default' }
        return <Tag color={info.color}>{info.text}</Tag>
      },
    },
    {
      title: '操作详情',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  return (
    <div>
      <h2>操作日志</h2>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Space>
          <span>操作人：</span>
          <Select
            style={{ width: 150 }}
            placeholder="请选择操作人"
            allowClear
            onChange={setUsername}
            value={username || undefined}
          >
            <Select.Option value="admin1">陈审核员</Select.Option>
            <Select.Option value="merchant1">孙老板</Select.Option>
          </Select>
        </Space>
        <Space>
          <span>操作模块：</span>
          <Select
            style={{ width: 150 }}
            placeholder="请选择模块"
            allowClear
            onChange={setModule}
            value={module || undefined}
          >
            <Select.Option value="user">用户管理</Select.Option>
            <Select.Option value="merchant">商户管理</Select.Option>
            <Select.Option value="hotel">酒店管理</Select.Option>
            <Select.Option value="roomType">房型管理</Select.Option>
            <Select.Option value="permission">权限管理</Select.Option>
          </Select>
        </Space>
        <Space>
          <span>操作时间：</span>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={loading}
      />
    </div>
  )
}

export default OperationLog
