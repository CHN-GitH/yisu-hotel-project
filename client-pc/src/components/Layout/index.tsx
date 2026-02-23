import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Button, Avatar, message, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import {
  HomeOutlined,
  PlusOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  ShopOutlined,
  FileTextOutlined,
  SafetyOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { logout } from '@/store/userSlice'
import { useEffect, useMemo } from 'react'

const { Header, Sider, Content } = AntLayout

// Token过期时间：10分钟（毫秒）
const TOKEN_TIMEOUT = 10 * 60 * 1000

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // 从 Redux 获取登录状态
  const { userInfo, lastActivityTime, isLogin } = useSelector((state: RootState) => state.user)

  // 定期检查token是否过期
  useEffect(() => {
    if (!isLogin) return

    const checkTokenExpired = () => {
      const now = Date.now()
      if (now - lastActivityTime > TOKEN_TIMEOUT) {
        message.warning('登录已过期，请重新登录')
        dispatch(logout())
        navigate('/login')
      }
    }

    // 每分钟检查一次
    const interval = setInterval(checkTokenExpired, 60 * 1000)

    return () => clearInterval(interval)
  }, [isLogin, lastActivityTime, dispatch, navigate])

  // 菜单项
  const menuItems = useMemo(() => {
    const merchantMenu = [
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

    const adminMenu = [
      {
        key: '/admin/users',
        icon: <TeamOutlined />,
        label: '用户管理',
      },
      {
        key: '/admin/merchants',
        icon: <ShopOutlined />,
        label: '商户管理',
      },
      {
        key: '/admin/logs',
        icon: <FileTextOutlined />,
        label: '操作日志',
      },
      {
        key: '/admin/permissions',
        icon: <SafetyOutlined />,
        label: '权限管理',
      },
    ]

    return userInfo?.role === 'admin' ? adminMenu : merchantMenu
  }, [userInfo?.role])

  // 处理菜单点击
  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key)
  }

  // 退出登录
  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  // 用户下拉菜单项
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ]

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
          {userInfo?.role === 'admin' ? '易宿管理端' : '易宿商户端'}
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
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <span>{userInfo?.username}</span>
                <span style={{ color: '#999' }}>
                  ({userInfo?.role === 'admin' ? '管理员' : '商户'})
                </span>
              </div>
            </Dropdown>
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


