import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Spin } from 'antd'
import Layout from '@/components/Layout'

// 懒加载页面
const Login = lazy(() => import('@/pages/Login/index.tsx'))
const Register = lazy(() => import('@/pages/Register/index.tsx'))
const HotelEdit = lazy(() => import('@/pages/HotelEdit/index.tsx'))
const HotelManage = lazy(() => import('@/pages/HotelManage/index.tsx'))

// 加载中组件
function Loading() {
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

// 路由配置
const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<Loading />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/hotel/manage" replace />,
      },
      {
        path: 'hotel/manage',
        element: (
          <Suspense fallback={<Loading />}>
            <HotelManage />
          </Suspense>
        ),
      },
      {
        path: 'hotel/edit',
        element: (
          <Suspense fallback={<Loading />}>
            <HotelEdit />
          </Suspense>
        ),
      },
      {
        path: 'hotel/edit/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <HotelEdit />
          </Suspense>
        ),
      },
    ],
  },
])

export default router
