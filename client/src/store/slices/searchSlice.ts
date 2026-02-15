import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

interface SearchState {
  city: string
  checkIn: string
  checkOut: string
  nights: number
  keyword: string
  filters: {
    starLevels: number[]
    priceRange: [number, number] | null
    tags: string[]
  }
}

const today = dayjs().format('YYYY-MM-DD')
const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

const initialState: SearchState = {
  city: '上海',
  checkIn: today,
  checkOut: tomorrow,
  nights: 1,
  keyword: '',
  filters: {
    starLevels: [],
    priceRange: null,
    tags: []
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
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload
    },
    setFilters: (state, action: PayloadAction<Partial<SearchState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetSearch: () => initialState
  }
})

export const { setCity, setDates, setKeyword, setFilters, resetSearch } = searchSlice.actions
export default searchSlice.reducer