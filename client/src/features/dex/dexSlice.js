import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exchanges: [
    {
      address: "0xf4Ff858D64a45b84237a74f413F6A67805e9A76C",
      name: "URU/KLAY",
      tokenAddress: "0xA935449F20f0e6867FF23dbFC627e4300bf011b3",
    },
    {
      address: "0xf4Ff858D64a45b84237a74f413F6A67805e9A76C",
      name: "URU/KLAY",
      tokenAddress: "0xA935449F20f0e6867FF23dbFC627e4300bf011b3",
    },
    {
      address: "0xf4Ff858D64a45b84237a74f413F6A67805e9A76C",
      name: "URU/KLAY",
      tokenAddress: "0xA935449F20f0e6867FF23dbFC627e4300bf011b3",
    },
    {
      address: "0xf4Ff858D64a45b84237a74f413F6A67805e9A76C",
      name: "URU/KLAY",
      tokenAddress: "0xA935449F20f0e6867FF23dbFC627e4300bf011b3",
    },
    {
      address: "0xf4Ff858D64a45b84237a74f413F6A67805e9A76C",
      name: "URU/KLAY",
      tokenAddress: "0xA935449F20f0e6867FF23dbFC627e4300bf011b3",
    },
    {
      address: "0xf4Ff858D64a45b84237a74f413F6A67805e9A76C",
      name: "URU/KLAY",
      tokenAddress: "0xA935449F20f0e6867FF23dbFC627e4300bf011b3",
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
