import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store';
import getSearchHotel, { SearchParams, SearchResponse } from '../../services/modules/searchHotel';

// 定义 State 类型
interface SearchState {
  searchdata: SearchResponse | {}; // 搜索结果类型，初始为空对象
}

// 初始状态
const initialState: SearchState = {
  searchdata: {}
};

const searchSlice = createSlice({
  name: 'searchHotel',
  initialState,
  reducers: {
    setSearchData: (state, action: PayloadAction<SearchResponse>) => {
      state.searchdata = action.payload;
    }
  }
});

// 扩展：支持传入搜索参数（更贴合实际业务）
export const fetchSearch = (params?: SearchParams) => async (dispatch: AppDispatch) => {
  const res = await getSearchHotel(params);
  dispatch(setSearchData(res));
};

export const { setSearchData } = searchSlice.actions;
export default searchSlice.reducer;