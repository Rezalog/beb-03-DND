import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSubModalOpen: false,
  tokens: [
    {
      symbol: "KLAY",
      name: "Klay",
      address: null,
    },
    {
      symbol: "URU",
      name: "URU Token",
      address: "0xBf67648411457Dc88F20B8eAE26dF6563ec68067",
    },
  ],
  token0: 0,
  token1: -1,
};

const tokenSwapSlice = createSlice({
  name: "tokenSwap",
  initialState,
  reducers: {
    openSubModal: (state) => {
      state.isSubModalOpen = true;
    },
    closeSubModal: (state) => {
      state.isSubModalOpen = false;
    },
    changeToken0: (state, action) => {
      state.token0 = action.payload.index;
    },
    changeToken1: (state, action) => {
      state.token1 = action.payload.index;
    },
    clearState: (state) => {
      //state = initialState가 동작하지 않는다.
      //그래서 Object.assign 을 사용해서 초기화 진행함
      Object.assign(state, initialState);
    },
  },
});

export const {
  openSubModal,
  closeSubModal,
  changeToken0,
  changeToken1,
  clearState,
} = tokenSwapSlice.actions;

export default tokenSwapSlice.reducer;
