import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exchanges: [],
};

const v2DexSlice = createSlice({
  name: "v2Dex",
  initialState,
  reducers: {
    addV2Exchange: (state, action) => {
      state.exchanges.push({
        address: action.payload.address,
        name: action.payload.name,
        tokenAddress1: action.payload.tokenAddress1,
        tokenAddress2: action.payload.tokenAddress2,
      });
    },
    initV2Exchange: (state, action) => {
      state.exchanges = action.payload.list;
    },
  },
});

export const { addV2Exchange, initV2Exchange } = v2DexSlice.actions;

export default v2DexSlice.reducer;
