import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SearchState {
  city: string
  selectedCityData: {
    cityName: string
    cityId: string | number
    country?: string
    region?: string
  } | null
}

const initialState: SearchState = {
  city: '',
  selectedCityData: null,
}

const searchCitySlice = createSlice({
  name: 'searchCity',
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload
    },
    setSelectedCityData: (state, action: PayloadAction<SearchState['selectedCityData']>) => {
      state.selectedCityData = action.payload
    },
    clearCityData: (state) => {
      state.city = ''
      state.selectedCityData = null
    }
  },
})

export const { setCity, setSelectedCityData, clearCityData } = searchCitySlice.actions
export default searchCitySlice.reducer