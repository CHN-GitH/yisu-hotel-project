import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Button, Avatar } from 'antd'
import {
  HomeOutlined,
  PlusOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { logout } from '@/store/userSlice'

const { Header, Sider, Content } = AntLayout

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // 从 Redux 获取登录状态
  const { isLogin, userInfo } = useSelector((state: RootState) => state.user)

  // 未登录跳转到登录页
  if (!isLogin) {
    return <Navigate to="/login" replace />
  }

  // 菜单项
  const menuItems = [
    {
      key: '/hotel/manage',
      icon: <HomeOutlined />,
      label: '酒店管理',
    },
    {
      key: '/hotel/edit',
      icon: <PlusOutlined />,
      label: '录入酒店',
    },
  ]

  // 处理菜单点击
  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key)
  }

  // 退出登录
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider theme="light">
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 'bold',
          borderBottom: '1px solid #f0f0f0'
        }}>
          易宿商户端
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <AntLayout>
        {/* 顶部 Header */}
        <Header style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>酒店管理系统</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar icon={<UserOutlined />} />
            <span>{userInfo?.username}</span>
            <span style={{ color: '#999' }}>
              ({userInfo?.role === 'admin' ? '管理员' : '商户'})
            </span>
            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              size="small"
            >
              退出
            </Button>
          </div>
        </Header>

        {/* 内容区域 */}
        <Content style={{ margin: 24, padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout


