// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// 类型安全的 useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

// 类型安全的 useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// 便捷的选择器 hooks（可选，用于简化组件中的选择逻辑）
export const useSearchState = () => useAppSelector(state => state.search)
export const useHotelState = () => useAppSelector(state => state.hotel)

// 组合选择器（用于需要多个 state 的场景）
export const useBookingInfo = () => {
  const search = useSearchState()
  const hotel = useHotelState()
  
  return {
    city: search.city,
    dates: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      nights: search.nights
    },
    currentHotel: hotel.currentHotel,
    isLoading: hotel.loading
  }
}