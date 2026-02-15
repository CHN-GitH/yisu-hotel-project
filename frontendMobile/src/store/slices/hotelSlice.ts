import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { hotelApi, HotelItem, HotelDetail, SearchParams } from '../../services/api'

// 异步获取酒店列表
export const fetchHotels = createAsyncThunk(
  'hotel/fetchList',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const res = await hotelApi.search(params)
      return res
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

// 异步获取酒店详情
export const fetchHotelDetail = createAsyncThunk(
  'hotel/fetchDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await hotelApi.getDetail(id)
      return res
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

interface HotelState {
  list: HotelItem[]
  currentHotel: HotelDetail | null
  loading: boolean
  hasMore: boolean
  total: number
  error: string | null
}

const initialState: HotelState = {
  list: [],
  currentHotel: null,
  loading: false,
  hasMore: true,
  total: 0,
  error: null
}

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    clearList: (state) => {
      state.list = []
      state.hasMore = true
    }
  },
  extraReducers: (builder) => {
    builder
      // 列表加载
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false
        if (action.meta.arg.page === 1) {
          state.list = action.payload.list
        } else {
          state.list.push(...action.payload.list)
        }
        state.hasMore = action.payload.hasMore
        state.total = action.payload.total
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // 详情加载
      .addCase(fetchHotelDetail.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchHotelDetail.fulfilled, (state, action) => {
        state.loading = false
        state.currentHotel = action.payload
      })
  }
})

export const { clearList } = hotelSlice.actions
export default hotelSlice.reducer