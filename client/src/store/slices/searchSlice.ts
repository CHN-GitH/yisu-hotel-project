import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

interface SearchState {
  city: string
  checkIn: string
  checkOut: string
  nights: number
  keyword: string[]
  filters: {
    priceRange: [number, number] | null
    starLevels: number[]
  }
}

const initialState: SearchState = {
  city: '上海',
  checkIn: dayjs().format('YYYY-MM-DD'),
  checkOut: dayjs().add(1, 'day').format('YYYY-MM-DD'),
  nights: 1,
  keyword: [],
  filters: {
    priceRange: null,
    starLevels: []
  }
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload
    },
    setDates: (state, action: PayloadAction<{checkIn: string, checkOut: string}>) => {
      const { checkIn, checkOut } = action.payload
      state.checkIn = checkIn
      state.checkOut = checkOut
      state.nights = dayjs(checkOut).diff(dayjs(checkIn), 'day')
    },
    setFilters: (state, action: PayloadAction<Partial<SearchState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetSearch: (state) => {
      state.filters = initialState.filters
    }
  }
})

export const { setCity, setDates, setFilters, resetSearch } = searchSlice.actions
export default searchSlice.reducer