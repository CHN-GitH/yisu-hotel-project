import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import getDetail, {
  HouseDetailData,
  newInfos,
} from "../../services/modules/detail";

interface DetailState {
  detaildata: HouseDetailData | Record<string, never>;
  loading: boolean;
  error: string | null;
  // 添加一个字段用于标识当前数据来自哪个 API
  source: "local" | "remote" | null;
}

const initialState: DetailState = {
  detaildata: {},
  loading: false,
  error: null,
  source: null,
};

const detailSlice = createSlice({
  name: "detail",
  initialState,
  reducers: {
    setDetailData: (
      state,
      action: PayloadAction<{
        data: HouseDetailData;
        source: "local" | "remote";
      }>,
    ) => {
      state.detaildata = action.payload.data;
      state.source = action.payload.source;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearDetailData: (state) => {
      state.detaildata = {};
      state.loading = false;
      state.error = null;
      state.source = null;
    },
  },
});

// 从本地 API 获取数据
export const getLocalDetailData =
  (houseId: string) => async (dispatch: AppDispatch) => {
    if (!houseId) {
      dispatch(detailSlice.actions.setError("房屋ID不能为空"));
      return;
    }
    dispatch(detailSlice.actions.setLoading(true));
    try {
      console.log("从本地 API 获取详情数据");
      const localRes = await newInfos(houseId);
      console.log("本地 API 获取详情数据成功");
      dispatch(setDetailData({ data: localRes, source: "local" }));
    } catch (error) {
      console.error("本地 API 获取详情失败:", error);
      dispatch(
        detailSlice.actions.setError(
          error instanceof Error ? error.message : "获取详情失败",
        ),
      );
    }
  };

// 从远程 API 获取数据
export const getRemoteDetailData =
  (houseId: string) => async (dispatch: AppDispatch) => {
    if (!houseId) {
      dispatch(detailSlice.actions.setError("房屋ID不能为空"));
      return;
    }
    dispatch(detailSlice.actions.setLoading(true));
    try {
      console.log("从远程 API 获取详情数据");
      const remoteRes = await getDetail(houseId);
      console.log("远程 API 获取详情数据成功");
      dispatch(setDetailData({ data: remoteRes, source: "remote" }));
    } catch (error) {
      console.error("远程 API 获取详情失败:", error);
      dispatch(
        detailSlice.actions.setError(
          error instanceof Error ? error.message : "获取详情失败",
        ),
      );
    }
  };

// 默认获取详情数据的函数 - 保持向后兼容
export const getDetailData =
  (houseId: string) => async (dispatch: AppDispatch) => {
    if (!houseId) {
      dispatch(detailSlice.actions.setError("房屋ID不能为空"));
      return;
    }
    dispatch(detailSlice.actions.setLoading(true));
    try {
      // 首先尝试从远程 API 获取数据
      console.log("尝试从远程 API 获取详情数据");
      const remoteRes = await getDetail(houseId);
      console.log("远程 API 获取详情数据成功");
      dispatch(setDetailData({ data: remoteRes, source: "remote" }));
    } catch (remoteError) {
      console.error("远程 API 获取详情失败，尝试从本地 API 获取:", remoteError);
      // 远程 API 失败，回退到本地 API
      try {
        console.log("尝试从本地 API 获取详情数据");
        const localRes = await newInfos(houseId);
        console.log("本地 API 获取详情数据成功");
        dispatch(setDetailData({ data: localRes, source: "local" }));
      } catch (localError) {
        console.error("本地 API 获取详情也失败:", localError);
        dispatch(
          detailSlice.actions.setError(
            localError instanceof Error ? localError.message : "获取详情失败",
          ),
        );
      }
    }
  };

export const { setDetailData, clearDetailData } = detailSlice.actions;
export default detailSlice.reducer;
