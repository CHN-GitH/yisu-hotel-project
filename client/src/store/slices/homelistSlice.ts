import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import getHomeList, { HouseListItem, HouseListResponse } from '../../services/modules/homelist';

// 定义 State 类型
interface HomeListState {
  homelistdata: HouseListItem[]; // 改为 HouseListItem 数组
  currentpage: number;
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: HomeListState = {
  homelistdata: [],
  currentpage: 1,
  loading: false,
  error: null
};

const homeListSlice = createSlice({
  name: 'homelist',
  initialState,
  reducers: {
    appendHomeListData: (state, action: PayloadAction<HouseListItem[]>) => {
      state.homelistdata.push(...action.payload);
    },
    incrementPage: (state) => {
      state.currentpage++;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

// 异步 Action
export const fetchHomeList = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    dispatch(homeListSlice.actions.setLoading(true));
    dispatch(homeListSlice.actions.setError(null));
    
    const currentPage = getState().homelist.currentpage;
    const res = await getHomeList(currentPage);
    
    // res 直接是 HouseListItem 数组
    if (Array.isArray(res)) {
      dispatch(appendHomeListData(res));
      dispatch(incrementPage());
    } else {
      console.error('响应格式错误:', res);
      dispatch(homeListSlice.actions.setError('数据格式错误'));
    }
  } catch (error) {
    console.error('请求失败:', error);
    dispatch(homeListSlice.actions.setError(error instanceof Error ? error.message : '请求失败'));
  } finally {
    dispatch(homeListSlice.actions.setLoading(false));
  }
};

export const { appendHomeListData, incrementPage } = homeListSlice.actions;
export default homeListSlice.reducer;