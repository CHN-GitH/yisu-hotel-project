import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { UserInfo } from '@/types/user'

interface UserState {
  userInfo: UserInfo | null,
  isLogin: boolean,
}

const initialState: UserState = {
  userInfo: null,
  isLogin: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    //设置用户信息，登录成功时
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload
      state.isLogin = true
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
    },
    //退出登录
    logout: (state) => {
      state.userInfo = null
      state.isLogin = false
      localStorage.removeItem('userInfo')
    },
    //从 localStorage 中获取用户信息
    restoreUser: (state) => {
      try {
        const userInfoStr = localStorage.getItem('userInfo')
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr)
          state.userInfo = userInfo
          state.isLogin = !!userInfo && !!userInfo.id
        } else {
          state.userInfo = null
          state.isLogin = false
        }
      } catch (error) {
        console.error('恢复用户信息失败', error)
        state.userInfo = null
        state.isLogin = false
      }
    }
  }
})

export const { setUserInfo, logout, restoreUser } = userSlice.actions
export default userSlice.reducer