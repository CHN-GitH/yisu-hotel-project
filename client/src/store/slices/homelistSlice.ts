import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../../store";
import getHomeList, {
  HouseListItem,
  HouseDetailData,
  newHouselist,
} from "../../services/modules/homelist";

export type SortType = | "default" | "rating" | "originalPrice" | "currentPrice" | "priceStar";

// 定义 State 类型
interface HomeListState {
  homelistdata: HouseListItem[];
  filteredData: HouseListItem[];
  currentpage: number;
  loading: boolean;
  error: string | null;
  sortType: SortType;
  priceRange: [number, number] | null;
  starLevels: number[];
}

// 初始状态
const initialState: HomeListState = {
  homelistdata: [],
  filteredData: [],
  currentpage: 1,
  loading: false,
  error: null,
  sortType: "default",
  priceRange: null,
  starLevels: [],
};

const homeListSlice = createSlice({
  name: "homelist",
  initialState,
  reducers: {
    appendHomeListData: (state, action: PayloadAction<HouseListItem[]>) => {
      // 检查是否有重复数据，避免本地接口的东西反复写进列表中
      const newData = action.payload.filter((item) => {
        return !state.homelistdata.some(
          (existingItem) => existingItem.data.houseId === item.data.houseId,
        );
      });
      state.homelistdata.push(...newData);
      // 应用筛选和排序
      state.filteredData = applyFiltersAndSort(
        state.homelistdata,
        state.priceRange,
        state.starLevels,
        state.sortType,
      );
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
      // 应用筛选和排序
      state.filteredData = applyFiltersAndSort(
        state.homelistdata,
        state.priceRange,
        state.starLevels,
        state.sortType,
      );
    },
    setFilters: (
      state,
      action: PayloadAction<{
        priceRange: [number, number] | null;
        starLevels: number[];
      }>,
    ) => {
      state.priceRange = action.payload.priceRange;
      state.starLevels = action.payload.starLevels;
      // 应用筛选和排序
      state.filteredData = applyFiltersAndSort(
        state.homelistdata,
        state.priceRange,
        state.starLevels,
        state.sortType,
      );
    },
    resetHomeList: (state) => {
      state.homelistdata = [];
      state.filteredData = [];
      state.currentpage = 1;
      state.error = null;
      state.sortType = "default";
      state.priceRange = null;
      state.starLevels = [];
    },
  },
});

// 筛选和排序逻辑
const applyFiltersAndSort = (
  list: HouseListItem[],
  priceRange: [number, number] | null,
  starLevels: number[],
  sortType: SortType,
): HouseListItem[] => {
  // 首先应用筛选
  let filtered = [...list];

  // 价格筛选
  if (priceRange) {
    const [min, max] = priceRange;
    filtered = filtered.filter((item) => {
      const price = item.data.finalPrice;
      return price >= min && (max === 2200 ? price >= min : price <= max);
    });
  }

  // 星级筛选
  if (starLevels.length > 0) {
    filtered = filtered.filter((item) => {
      const starLevel = Number(item.data.star);
      return starLevels.includes(starLevel);
    });
  }

  // 然后应用排序
  switch (sortType) {
    case "rating":
      return filtered.sort(
        (a, b) => Number(b.data.commentScore) - Number(a.data.commentScore),
      );
    case "originalPrice":
      return filtered.sort((a, b) => a.data.productPrice - b.data.productPrice);
    case "currentPrice":
      return filtered.sort((a, b) => a.data.finalPrice - b.data.finalPrice);
    case "priceStar":
      // 价格/星级排序：先按价格排序，再按星级排序
      return filtered.sort((a, b) => {
        const priceDiff = a.data.finalPrice - b.data.finalPrice;
        if (priceDiff !== 0) {
          return priceDiff;
        }
        return Number(b.data.star) - Number(a.data.star);
      });
    default:
      return filtered;
  }
};

// 异步 Action
export const fetchHomeList =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      dispatch(homeListSlice.actions.setLoading(true));
      dispatch(homeListSlice.actions.setError(null));

      const currentPage = getState().homelist.currentpage;

      // 同时获取新的数据和原有数据
      const [newData, oldData] = await Promise.all([
        newHouselist(currentPage),
        getHomeList(currentPage),
      ]);

      // 合并数据：新数据在前，旧数据在后
      let combinedData: HouseListItem[] = [];
      if (Array.isArray(newData)) {
        combinedData.push(...newData);
      }
      if (Array.isArray(oldData)) {
        combinedData.push(...oldData);
      }

      if (combinedData.length > 0) {
        // 直接添加数据，appendHomeListData 会自动处理重复数据、筛选和排序
        dispatch(appendHomeListData(combinedData));
        dispatch(incrementPage());
      } else {
        console.error("响应格式错误: 没有获取到有效的数据");
        dispatch(homeListSlice.actions.setError("数据格式错误"));
      }
    } catch (error) {
      console.error("请求失败:", error);
      dispatch(
        homeListSlice.actions.setError(
          error instanceof Error ? error.message : "请求失败",
        ),
      );
    } finally {
      dispatch(homeListSlice.actions.setLoading(false));
    }
  };

export const {
  appendHomeListData,
  incrementPage,
  setSortType,
  setFilters,
  resetHomeList,
} = homeListSlice.actions;
export default homeListSlice.reducer;
