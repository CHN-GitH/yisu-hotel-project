import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义 State 类型（存储时间戳，而非 Date 对象）
interface TimeState {
  starttime: string; // 改用 ISO 字符串（推荐，可读性好）
  endtime: string;
}

// 初始化时间（转换为 ISO 字符串）
const startTime = new Date();
const endTime = new Date();
endTime.setDate(startTime.getDate() + 1);

// 初始状态（存储字符串）
const initialState: TimeState = {
  starttime: startTime.toISOString(),
  endtime: endTime.toISOString()
};

const getTimeSlice = createSlice({
  name: 'gettime',
  initialState,
  reducers: {
    // Action Payload 接收 Date 对象，存储为字符串
    setStartTime: (state, action: PayloadAction<Date>) => {
      state.starttime = action.payload.toISOString();
    },
    setEndTime: (state, action: PayloadAction<Date>) => {
      state.endtime = action.payload.toISOString();
    }
  }
});

export const { setStartTime, setEndTime } = getTimeSlice.actions;
export default getTimeSlice.reducer;