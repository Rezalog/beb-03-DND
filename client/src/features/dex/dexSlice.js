import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exchanges: [
    {
      address: "0x50a292Fe9d1D134D8A93BC5CB3df1BEe680E5f4c",
      name: "klay-uru-LP-token",
      tokenAddress: "0xBf67648411457Dc88F20B8eAE26dF6563ec68067",
    },
  ],
};

const dexSlice = createSlice({
  name: "dex",
  initialState,
  reducers: {
    addExchange: (state, action) => {
      state.exchanges.push({
        address: action.payload.address,
        name: action.payload.name,
        tokenAddress: action.payload.tokenAddress,
      });
    },
  },
});

export const { addExchange } = dexSlice.actions;

export default dexSlice.reducer;
