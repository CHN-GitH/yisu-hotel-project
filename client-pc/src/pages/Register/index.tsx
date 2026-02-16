import { useState } from 'react'
import { Form, Input, Button, Card, Radio, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { register } from '@/api/auth'

function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  // 提交注册
  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      await register({
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role,
      })
      message.success('注册成功，请登录')
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  // 确认密码验证
  const validateConfirmPassword = (_: any, value: string) => {
    const password = form.getFieldValue('password')
    if (value && value !== password) {
      return Promise.reject('两次输入的密码不一致')
    }
    return Promise.resolve()
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
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>用户注册</h1>
          <p style={{ color: '#999', fontSize: 14 }}>创建您的商户账号</p>
        </div>

        <Form
          form={form}
          name="register"
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
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认密码' },
              { validator: validateConfirmPassword },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
            />
          </Form.Item>

          <Form.Item
            name="role"
            initialValue="merchant"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Radio.Group style={{ width: '100%', textAlign: 'center' }}>
              <Radio.Button value="merchant" style={{ width: '50%' }}>
                商户
              </Radio.Button>
              <Radio.Button value="admin" style={{ width: '50%' }}>
                管理员
              </Radio.Button>
            </Radio.Group>
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
              注 册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <span style={{ color: '#999' }}>已有账号？</span>
            <Button
              type="link"
              onClick={() => navigate('/login')}
              style={{ padding: 0 }}
            >
              去登录
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register
