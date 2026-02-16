import { Provider } from 'react-redux'
import { useEffect } from 'react'
import store from '@/store'
import { restoreUser } from '@/store/userSlice'

// 初始化组件：页面刷新时恢复登录状态
function InitUser() {
  useEffect(() => {
    store.dispatch(restoreUser())
  }, [])
  return null
}

// Redux Provider 包装组件
function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitUser />
      {children}
    </Provider>
  )
}

export default ReduxProvider
