import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSubModalOpen: false,
  tokens: [],
  token0: 0,
  token1: 1,
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
      state.token0 = 0;
      state.token1 = 1;
    },
    addNewToken: (state, action) => {
      state.tokens.push({
        symbol: action.payload.symbol,
        name: action.payload.name,
        address: action.payload.address,
      });
    },
    initTokenList: (state, action) => {
      state.tokens = action.payload.list;
    },
  },
});

export const {
  openSubModal,
  closeSubModal,
  changeToken0,
  changeToken1,
  clearState,
  addNewToken,
  initTokenList,
} = tokenSwapSlice.actions;

export default tokenSwapSlice.reducer;
