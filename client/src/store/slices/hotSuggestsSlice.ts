import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store';
import getHotSuggests, { HotSuggestItem } from '../../services/modules/hotSuggests';

// 定义 State 类型
interface HotSuggestsState {
  hotSuggestdata: HotSuggestItem[]; // 热门推荐数组
}

// 初始状态
const initialState: HotSuggestsState = {
  hotSuggestdata: []
};

const hotSuggestsSlice = createSlice({
  name: 'hotSuggests',
  initialState,
  reducers: {
    setHotSuggestData: (state, action: PayloadAction<HotSuggestItem[]>) => {
      state.hotSuggestdata = action.payload;
    }
  }
});

// 异步 Action
export const fetchHotSuggests = () => async (dispatch: AppDispatch) => {
  const res = await getHotSuggests();
  dispatch(setHotSuggestData(res));
};

export const { setHotSuggestData } = hotSuggestsSlice.actions;
export default hotSuggestsSlice.reducer;