import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { UserInfo } from '@/types/user'

// Token过期时间：10分钟（毫秒）
const TOKEN_TIMEOUT = 10 * 60 * 1000

interface UserState {
  userInfo: UserInfo | null,
  isLogin: boolean,
  lastActivityTime: number,
  isRestoring: boolean,
}

const initialState: UserState = {
  userInfo: null,
  isLogin: false,
  lastActivityTime: Date.now(),
  isRestoring: true,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    //设置用户信息，登录成功时
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload
      state.isLogin = true
      state.isRestoring = false
      state.lastActivityTime = Date.now()
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
      localStorage.setItem('lastActivityTime', String(Date.now()))
    },
    //退出登录
    logout: (state) => {
      state.userInfo = null
      state.isLogin = false
      state.isRestoring = false
      state.lastActivityTime = 0
      localStorage.removeItem('userInfo')
      localStorage.removeItem('lastActivityTime')
    },
    //从 localStorage 中获取用户信息
    restoreUser: (state) => {
      try {
        const userInfoStr = localStorage.getItem('userInfo')
        const lastActivityTimeStr = localStorage.getItem('lastActivityTime')

        if (userInfoStr && lastActivityTimeStr) {
          const userInfo = JSON.parse(userInfoStr)
          const lastActivityTime = parseInt(lastActivityTimeStr)
          const now = Date.now()

          // 检查是否超时（超过10分钟未操作）
          if (now - lastActivityTime > TOKEN_TIMEOUT) {
            // 超时，清除登录信息
            state.userInfo = null
            state.isLogin = false
            state.lastActivityTime = 0
            localStorage.removeItem('userInfo')
            localStorage.removeItem('lastActivityTime')
          } else {
            // 未超时，恢复登录状态
            state.userInfo = userInfo
            state.isLogin = !!userInfo && !!userInfo.id
            state.lastActivityTime = lastActivityTime
          }
        } else {
          state.userInfo = null
          state.isLogin = false
          state.lastActivityTime = 0
        }
      } catch (error) {
        console.error('恢复用户信息失败', error)
        state.userInfo = null
        state.isLogin = false
        state.lastActivityTime = 0
      }
      state.isRestoring = false
    },
    // 更新最后活动时间
    updateActivity: (state) => {
      state.lastActivityTime = Date.now()
      localStorage.setItem('lastActivityTime', String(Date.now()))
    }
  }
})

export const { setUserInfo, logout, restoreUser, updateActivity } = userSlice.actions
export default userSlice.reducer