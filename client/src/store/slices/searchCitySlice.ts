// src\store\slices\searchCitySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  city: string
  selectedCityData: {
    cityName: string
    cityId: string | number
    country?: string
    region?: string
  } | null
  selectedHotel: {
    hotelName: string
    hotelId: string | number
    pinyin?: string
  } | null
}

const initialState: SearchState = {
  city: '',
  selectedCityData: null,
  selectedHotel: null
}

const searchCitySlice = createSlice({
  name: 'searchCity',
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload
      // 切换城市时清空酒店选择
      state.selectedHotel = null
    },
    setSelectedCityData: (state, action: PayloadAction<SearchState['selectedCityData']>) => {
      state.selectedCityData = action.payload
    },
    setSelectedHotel: (state, action: PayloadAction<SearchState['selectedHotel']>) => {
      state.selectedHotel = action.payload
    },
    clearCityData: (state) => {
      state.city = ''
      state.selectedCityData = null
      state.selectedHotel = null
    },
    clearHotel: (state) => {
      state.selectedHotel = null
    }
  },
})

export const { 
  setCity, 
  setSelectedCityData, 
  setSelectedHotel,
  clearCityData,
  clearHotel
} = searchCitySlice.actions
export default searchCitySlice.reducer