import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { message, Spin } from 'antd'
import type { RootState } from '@/store'
import { logout, updateActivity } from '@/store/userSlice'

// 用户活动监听组件
function UserActivityTracker() {
  const dispatch = useDispatch()
  const { isLogin } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (!isLogin) return

    // 用户活动事件列表
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'click',
      'touchstart'
    ]

    // 更新最后活动时间
    const updateActivityTime = () => {
      dispatch(updateActivity())
    }

    // 添加事件监听
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivityTime)
    })

    // 清理事件监听
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivityTime)
      })
    }
  }, [isLogin, dispatch])

  return null
}

// 路由守卫组件
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLogin, isRestoring, isManualLogout } = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const hasShownWarning = useRef(false)

  useEffect(() => {
    // 正在恢复中，不执行任何操作
    if (isRestoring) return

    // 不需要登录的页面
    const publicPaths = ['/login', '/register']
    
    // 如果已经在登录页，不需要提示
    if (publicPaths.includes(location.pathname)) {
      hasShownWarning.current = false
      return
    }
    
    // 如果是主动退出登录，不显示提示
    if (isManualLogout) {
      hasShownWarning.current = false
      return
    }
    
    if (!isLogin && !publicPaths.includes(location.pathname)) {
      // 只在第一次需要登录时显示提示，避免路由跳转时重复提示
      if (!hasShownWarning.current) {
        message.warning('请先登录')
        hasShownWarning.current = true
      }
      navigate('/login')
    } else if (isLogin) {
      // 登录成功后重置标志
      hasShownWarning.current = false
    }
  }, [isLogin, isRestoring, isManualLogout, navigate, location.pathname])

  // 正在恢复用户信息，显示加载状态
  if (isRestoring) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <>
      <UserActivityTracker />
      {children}
    </>
  )
}

export default AuthGuard
