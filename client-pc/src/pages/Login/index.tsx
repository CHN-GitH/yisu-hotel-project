import { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '@/store/userSlice'
import { login } from '@/api/auth'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  // 提交登录
  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const res = await login(values)
      dispatch(setUserInfo(res))
      message.success('登录成功')
      navigate('/hotel/manage')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card style={{
        width: 420,
        borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        border: 'none',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{
            fontSize: 28,
            marginBottom: 8,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            易宿酒店
          </h1>
          <p style={{ color: '#999', fontSize: 14 }}>商户管理系统</p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 44,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              登 录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#999' }}>还没有账号？</span>
            <Button
              type="link"
              onClick={() => navigate('/register')}
              style={{ padding: 0 }}
            >
              立即注册
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login
