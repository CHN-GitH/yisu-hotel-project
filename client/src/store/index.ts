import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './slices/searchSlice'
import hotelReducer from './slices/hotelSlice'

export const store = configureStore({
  reducer: {
    search: searchReducer,
    hotel: hotelReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch