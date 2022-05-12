import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exchanges: [],
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
