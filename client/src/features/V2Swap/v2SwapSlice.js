import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSubModalOpen: false,
  tokens: [
    {
      symbol: "WKLAY",
      name: "Wrapped Klay",
      address: "0xEFBAF5ca2Dd2FAc9AEe363972EE2ff9239Bcf6d9",
    },
    {
      symbol: "URU",
      name: "URU Token",
      address: "0x481253AC3b7F9738461c70f8282435287915895d",
    },
    {
      symbol: "TMP",
      name: "Temp Token",
      address: "0xB71Fcd94e9e3EB87Cb220E76CFd6785A4a2DeaAF",
    },
  ],
  token0: 1,
  token1: 2,
};

const v2SwapSlice = createSlice({
  name: "v2Swap",
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
  },
});

export const {
  openSubModal,
  closeSubModal,
  changeToken0,
  changeToken1,
  clearState,
  addNewToken,
} = v2SwapSlice.actions;

export default v2SwapSlice.reducer;
