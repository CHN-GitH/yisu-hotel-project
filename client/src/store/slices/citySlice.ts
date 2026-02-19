import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '../../store';
import { getCityAll, CityItem } from '../../services/modules/city';

// 定义 State 类型
interface CityState {
  citydata: CityItem[]; // 城市列表数组
  currentcity: {
    cityName: string;
    // 可扩展其他字段，如 cityId 等
  };
}

// 初始状态
const initialState: CityState = {
  citydata: [], // 修正为数组更合理
  currentcity: {
    cityName: "上海"
  }
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    setCityData: (state, action: PayloadAction<CityItem[]>) => {
      state.citydata = action.payload;
    },
    setCurrentCity: (state, action: PayloadAction<{ cityName: string }>) => {
      state.currentcity = action.payload;
    }
  }
});

// 异步 Action
export const fetchAllCityData = () => async (dispatch: AppDispatch) => {
  const res = await getCityAll();
  dispatch(setCityData(res));
};

export const { setCityData, setCurrentCity } = citySlice.actions;
export default citySlice.reducer;