import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义 State 类型
interface TimeState {
  starttime: Date;
  endtime: Date;
}

// 初始化时间
const startTime = new Date();
const endTime = new Date();
endTime.setDate(startTime.getDate() + 1);

// 初始状态
const initialState: TimeState = {
  starttime: startTime,
  endtime: endTime
};

const getTimeSlice = createSlice({
  name: 'gettime',
  initialState,
  reducers: {
    setStartTime: (state, action: PayloadAction<Date>) => {
      state.starttime = action.payload;
    },
    setEndTime: (state, action: PayloadAction<Date>) => {
      state.endtime = action.payload;
    }
  }
});

export const { setStartTime, setEndTime } = getTimeSlice.actions;
export default getTimeSlice.reducer;