import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store';
import getDetail, { HouseDetailData } from '../../services/modules/detail';

interface DetailState {
  detaildata: HouseDetailData | Record<string, never>;
  loading: boolean;
  error: string | null;
}

const initialState: DetailState = {
  detaildata: {},
  loading: false,
  error: null
};

const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {
    setDetailData: (state, action: PayloadAction<HouseDetailData>) => {
      state.detaildata = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearDetailData: (state) => {
      state.detaildata = {};
      state.loading = false;
      state.error = null;
    }
  }
});

export const getDetailData = (houseId: string) => async (dispatch: AppDispatch) => {
  if (!houseId) {
    dispatch(detailSlice.actions.setError('房屋ID不能为空'));
    return;
  }
  dispatch(detailSlice.actions.setLoading(true));
  try {
    const res = await getDetail(houseId);
    dispatch(setDetailData(res));
  } catch (error) {
    console.error('获取详情失败:', error);
    dispatch(detailSlice.actions.setError(error instanceof Error ? error.message : '获取详情失败'));
  }
};

export const { setDetailData, clearDetailData } = detailSlice.actions;
export default detailSlice.reducer;