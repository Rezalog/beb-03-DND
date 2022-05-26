import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPending: false,
  isSuccess: false,
  isFail: false,
  msg: "",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    pendingNoti: (state) => {
      state.isPending = true;
    },
    stopPendingNoti: (state) => {
      state.isPending = false;
    },
    successNoti: (state, action) => {
      state.isPending = false;
      state.isSuccess = true;
      state.msg = action.payload.msg;
    },
    failNoti: (state) => {
      state.isPending = false;
      state.isFail = true;
    },
    clearState: (state) => {
      state.isPending = false;
      state.isSuccess = false;
      state.isFail = false;
    },
  },
});

export const {
  pendingNoti,
  stopPendingNoti,
  successNoti,
  failNoti,
  clearState,
} = notificationSlice.actions;

export default notificationSlice.reducer;
