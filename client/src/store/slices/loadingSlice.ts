import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义 State 类型
interface LoadingState {
  isLoading: boolean;
}

// 初始状态
const initialState: LoadingState = {
  isLoading: false
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;