import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store';
import getHomeList, { HouseListItem, HouseDetailData } from '../../services/modules/homelist';

export type SortType = 'default' | 'rating' | 'originalPrice' | 'currentPrice';

// 定义 State 类型
interface HomeListState {
  homelistdata: HouseListItem[];
  currentpage: number;
  loading: boolean;
  error: string | null;
  sortType: SortType;
}

// 初始状态
const initialState: HomeListState = {
  homelistdata: [],
  currentpage: 1,
  loading: false,
  error: null,
  sortType: 'default'
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
    },
    setSortType: (state, action: PayloadAction<SortType>) => {
      state.sortType = action.payload;
      if (action.payload !== 'default') {
        state.homelistdata = sortHouseList(state.homelistdata, action.payload);
      }
    },
    resetHomeList: (state) => {
      state.homelistdata = [];
      state.currentpage = 1;
      state.error = null;
    }
  }
});

// 排序逻辑
const sortHouseList = (list: HouseListItem[], sortType: SortType): HouseListItem[] => {
  const sorted = [...list];
  
  switch (sortType) {
    case 'rating':
      return sorted.sort((a, b) => Number(b.data.commentScore) - Number(a.data.commentScore));
    case 'originalPrice':
      return sorted.sort((a, b) => a.data.productPrice - b.data.productPrice);
    case 'currentPrice':
      return sorted.sort((a, b) => a.data.finalPrice - b.data.finalPrice);
    default:
      return sorted;
  }
};

// 异步 Action
export const fetchHomeList = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    dispatch(homeListSlice.actions.setLoading(true));
    dispatch(homeListSlice.actions.setError(null));
    
    const currentPage = getState().homelist.currentpage;
    const res = await getHomeList(currentPage);
    
    if (Array.isArray(res)) {
      // 获取当前排序类型并应用排序
      const currentSort = getState().homelist.sortType;
      const sortedData = sortHouseList(res, currentSort);
      dispatch(appendHomeListData(sortedData));
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

export const { 
  appendHomeListData, 
  incrementPage, 
  setSortType, 
  resetHomeList 
} = homeListSlice.actions;
export default homeListSlice.reducer;