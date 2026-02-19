import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../store'; // 需确保根 store 导出这两个类型
import getCategories, { CategoryItem } from '../../services/modules/categories';

// 定义 State 类型
interface CategoriesState {
  categoriedata: CategoryItem[]; // 对应接口返回的分类数组类型
}

// 初始状态（指定类型）
const initialState: CategoriesState = {
  categoriedata: [] // 原初始值为 {}，修正为数组更符合实际场景
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<CategoryItem[]>) => {
      state.categoriedata = action.payload;
    }
  }
});

// 异步 Action（补充 Dispatch 和 RootState 类型）
export const fetchCategories = () => async (dispatch: AppDispatch) => {
  // 注意：原封装的请求已直接返回 data，无需再取 res.data
  const res = await getCategories();
  dispatch(setData(res));
};

export const { setData } = categoriesSlice.actions;
export default categoriesSlice.reducer;