import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store';
import getDetail, { HouseDetail } from '../../services/modules/detail';

// 定义 State 类型
interface DetailState {
  detaildata: HouseDetail | {}; // 房源详情类型，初始为空对象
}

// 初始状态
const initialState: DetailState = {
  detaildata: {}
};

const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {
    setDetailData: (state, action: PayloadAction<HouseDetail>) => {
      state.detaildata = action.payload;
    }
  }
});

// 异步 Action（入参指定类型）
export const getDetailData = (houseId: string) => async (dispatch: AppDispatch) => {
  const res = await getDetail(houseId);
  dispatch(setDetailData(res));
};

export const { setDetailData } = detailSlice.actions;
export default detailSlice.reducer;