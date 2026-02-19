import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import getHomeList, { HouseListResponse, HouseItem } from '../../services/modules/homelist';

// 定义 State 类型
interface HomeListState {
  homelistdata: HouseItem[]; // 房源列表项数组
  currentpage: number;
}

// 初始状态
const initialState: HomeListState = {
  homelistdata: [],
  currentpage: 1
};

const homeListSlice = createSlice({
  name: 'homelist',
  initialState,
  reducers: {
    appendHomeListData: (state, action: PayloadAction<HouseItem[]>) => {
      state.homelistdata.push(...action.payload);
    },
    incrementPage: (state) => {
      state.currentpage++;
    }
  }
});

// 异步 Action（依赖 RootState 获取当前页码）
export const fetchHomeList = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const currentPage = getState().homelist.currentpage;
  const res = await getHomeList(currentPage);
  // 接口返回的是 HouseListResponse，取 list 字段
  dispatch(appendHomeListData(res.list));
  dispatch(incrementPage());
};

export const { appendHomeListData, incrementPage } = homeListSlice.actions;
export default homeListSlice.reducer;