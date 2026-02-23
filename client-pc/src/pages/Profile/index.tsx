import { useState, useEffect } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  message,
  Descriptions,
  Divider,
  Modal
} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { setUserInfo } from '@/store/userSlice'
import { getUserInfo, updateUserInfo, changePassword } from '@/api/user'

// 个人资料页面
function Profile() {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: RootState) => state.user.userInfo)
  
  const [profileForm] = Form.useForm()
  const [passwordForm] = Form.useForm()
  
  const [loading, setLoading] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  
  // 页面加载时获取用户信息
  useEffect(() => {
    fetchUserInfo()
  }, [])
  
  // 获取用户信息
  const fetchUserInfo = async () => {
    setLoading(true)
    try {
      const res: any = await getUserInfo()
      if (res) {
        profileForm.setFieldsValue(res)
        // 更新 Redux 中的用户信息
        dispatch(setUserInfo(res))
      }
    } catch (error) {
      console.error('获取用户信息失败', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 保存个人资料
  const handleSaveProfile = async () => {
    try {
      const values = await profileForm.validateFields()
      setSavingProfile(true)
      const res: any = await updateUserInfo(values)
      if (res) {
        message.success('保存成功')
        // 更新 Redux 中的用户信息
        dispatch(setUserInfo(res))
      }
    } catch (error) {
      console.error('保存失败', error)
    } finally {
      setSavingProfile(false)
    }
  }
  
  // 打开修改密码弹窗
  const handleOpenPasswordModal = () => {
    passwordForm.resetFields()
    setPasswordModalVisible(true)
  }
  
  // 修改密码
  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields()
      if (values.newPassword !== values.confirmPassword) {
        message.error('两次输入的密码不一致')
        return
      }
      setChangingPassword(true)
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      })
      message.success('密码修改成功')
      setPasswordModalVisible(false)
    } catch (error) {
      console.error('修改密码失败', error)
    } finally {
      setChangingPassword(false)
    }
  }
  
  return (
    <div style={{ maxWidth: 800 }}>
      <Card
        title="个人资料"
        extra={
          <Button type="primary" onClick={handleSaveProfile} loading={savingProfile}>
            保存
          </Button>
        }
      >
        <Descriptions column={2} bordered loading={loading}>
          <Descriptions.Item label="用户名" span={2}>
            {userInfo?.username}
          </Descriptions.Item>
          <Descriptions.Item label="角色" span={2}>
            {userInfo?.role === 'admin' ? '管理员' : '商户'}
          </Descriptions.Item>
        </Descriptions>
        
        <Divider />
        
        <Form form={profileForm} layout="vertical">
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
          </Form.Item>
        </Form>
      </Card>
      
      <Card title="修改密码" style={{ marginTop: 24 }}>
        <Space>
          <Button type="primary" icon={<LockOutlined />} onClick={handleOpenPasswordModal}>
            修改密码
          </Button>
        </Space>
      </Card>
      
      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onOk={handleChangePassword}
        onCancel={() => setPasswordModalVisible(false)}
        okText="确定"
        cancelText="取消"
        confirmLoading={changingPassword}
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>
          
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能少于6位' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            rules={[{ required: true, message: '请再次输入新密码' }]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Profile
