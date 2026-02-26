import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout as AntLayout, Menu, Button, Avatar, message, Dropdown, Breadcrumb, Badge, Space, Divider } from 'antd'
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
  SafetyOutlined,
  BarChartOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  StarOutlined,
  BellOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { logout } from '@/store/userSlice'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { getHotelList } from '@/api/hotel'
import { HotelProvider, useHotel } from '@/contexts/HotelContext'
import SidebarContent from './SidebarContent'

const { Header, Sider, Content } = AntLayout

// Token过期时间：10分钟（毫秒）
const TOKEN_TIMEOUT = 10 * 60 * 1000

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // 从 Redux 获取登录状态
  const { userInfo, lastActivityTime, isLogin } = useSelector((state: RootState) => state.user)

  // 当前选中的酒店
  const [selectedHotel, setSelectedHotel] = useState('1')

  // 酒店列表
  const [hotelList, setHotelList] = useState<Array<{ id: string; name: string }>>([])

  // 获取酒店列表
  const fetchHotels = useCallback(async () => {
    try {
      const res: any = await getHotelList()
      if (res) {
        const hotels = res.map((hotel: any) => ({
          id: String(hotel.id),
          name: hotel.nameCn || hotel.name
        }))
        setHotelList(hotels)

        // 如果当前选中的酒店不在列表中，选择第一个酒店
        if (hotels.length > 0 && !hotels.find(h => h.id === selectedHotel)) {
          setSelectedHotel(hotels[0].id)
        }
        
        // 检查是否有新的审核结果
        const newlyApproved = res.filter((hotel: any) => {
          // 检查酒店是否刚通过审核（状态为 online 或 offline，且没有待审核操作）
          return (hotel.status === 'online' || hotel.status === 'offline') && 
                 (hotel.pendingAction === null || hotel.pendingAction === undefined) && 
                 hotel.status !== 'draft' && 
                 !localStorage.getItem(`hotel_approved_${hotel.id}`)
        })
        
        // 显示审核通过通知
        newlyApproved.forEach((hotel: any) => {
          message.success(`您的酒店 "${hotel.nameCn || hotel.name}" 审核已通过！`)
          // 标记为已通知，避免重复通知
          localStorage.setItem(`hotel_approved_${hotel.id}`, 'true')
        })
        
        // 检查是否有新的审核拒绝
        const newlyRejected = res.filter((hotel: any) => {
          return hotel.status === 'rejected' && !localStorage.getItem(`hotel_rejected_${hotel.id}`)
        })
        
        // 显示审核拒绝通知
        newlyRejected.forEach((hotel: any) => {
          message.error(`您的酒店 "${hotel.nameCn || hotel.name}" 审核未通过：${hotel.rejectReason || '请联系管理员了解详情'}`)
          // 标记为已通知，避免重复通知
          localStorage.setItem(`hotel_rejected_${hotel.id}`, 'true')
        })
      }
    } catch (error) {
      console.error('获取酒店列表失败', error)
    }
  }, [selectedHotel])

  // 初始化时获取酒店列表
  useEffect(() => {
    if (isLogin) {
      fetchHotels()
    }
  }, [isLogin])

  // 监听路由变化，当从酒店编辑页面返回时重新获取酒店列表
  useEffect(() => {
    if (isLogin && (location.pathname === '/hotel/manage' || location.pathname === '/dashboard')) {
      fetchHotels()
    }
  }, [location.pathname, isLogin])

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
        key: '/dashboard',
        icon: <BarChartOutlined />,
        label: '数据概览',
      },
      {
        key: '/hotel/manage',
        icon: <ApartmentOutlined />,
        label: '酒店管理',
      },
      {
        key: '/orders',
        icon: <CalendarOutlined />,
        label: '订单中心',
      },
      {
        key: '/finance',
        icon: <DollarOutlined />,
        label: '财务结算',
      },
      {
        key: '/reviews',
        icon: <StarOutlined />,
        label: '评价管理',
      },
      {
        type: 'divider',
      },
      {
        key: '/settings',
        icon: <SettingOutlined />,
        label: '设置中心',
      },
    ]

    const adminMenu = [
      {
        key: '/hotel/manage',
        icon: <ApartmentOutlined />,
        label: '酒店管理',
      },
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

  // 酒店下拉菜单项
  const hotelMenuItems: MenuProps['items'] = hotelList.map(hotel => ({
    key: hotel.id,
    label: hotel.name,
    onClick: () => setSelectedHotel(hotel.id)
  }))

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

  // 面包屑配置
  const breadcrumbItems = useMemo(() => {
    const pathMap: Record<string, string> = {
      '/dashboard': '数据概览',
      '/hotel/manage': '酒店管理',
      '/hotel/edit': '录入酒店',
      '/hotel/detail': '酒店详情',
      '/orders': '订单中心',
      '/finance': '财务结算',
      '/reviews': '评价管理',
      '/settings': '设置中心',
      '/admin/users': '用户管理',
      '/admin/merchants': '商户管理',
      '/admin/logs': '操作日志',
      '/admin/permissions': '权限管理',
    }

    const items = [
      { title: '首页' },
    ]

    const currentPath = location.pathname
    if (pathMap[currentPath]) {
      items.push({ title: pathMap[currentPath] })
    }

    return items
  }, [location.pathname])

  return (
    <HotelProvider>
      <AntLayout style={{ minHeight: '100vh' }}>
        {/* 侧边栏 */}
        <Sider
          theme="light"
          width={240}
          style={{
            borderRight: '1px solid #f0f0f0',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <SidebarContent
            hotelList={hotelList}
            menuItems={menuItems}
            selectedKey={location.pathname}
            onMenuClick={handleMenuClick}
          />
        </Sider>

        <AntLayout>
          {/* 顶部 Header */}
          <Header
            style={{
              background: '#fff',
              padding: '0 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f0f0f0',
              height: 64
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#1890ff',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <ApartmentOutlined />
                易宿酒店
              </div>
            </div>

            {/* 右侧操作区 */}
            <Space size={24}>
              {/* 消息通知 */}
              <Badge count={5} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  style={{ fontSize: 18 }}
                />
              </Badge>

              {/* 帮助 */}
              <Button
                type="text"
                icon={<QuestionCircleOutlined />}
                style={{ fontSize: 18 }}
              >
                帮助
              </Button>

              {/* 用户信息 */}
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 4,
                  transition: 'background 0.3s'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Avatar icon={<UserOutlined />} />
                  <span>{userInfo?.username || '商户'}</span>
                  <span style={{ color: '#999' }}>▼</span>
                </div>
              </Dropdown>
            </Space>
          </Header>

          {/* 内容区域 */}
          <Content style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
            {/* 面包屑 + 页面标题 */}
            <div style={{
              background: '#fff',
              padding: '16px 24px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* 主内容 */}
            <div style={{ padding: 24 }}>
              <Outlet />
            </div>
          </Content>
        </AntLayout>
      </AntLayout>
    </HotelProvider>
  )
}

export default Layout
