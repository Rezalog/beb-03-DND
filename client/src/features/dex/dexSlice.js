import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exchanges: [
    {
      address: "0xf24d35830f3e1969dAf3Fc598B19921B67297e0B",
      name: "URU/KLAY",
      tokenAddress: "0x481253AC3b7F9738461c70f8282435287915895d",
    },
    {
      address: "0xf24d35830f3e1969dAf3Fc598B19921B67297e0B",
      name: "URU/KLAY",
      tokenAddress: "0x481253AC3b7F9738461c70f8282435287915895d",
    },
    {
      address: "0xf24d35830f3e1969dAf3Fc598B19921B67297e0B",
      name: "URU/KLAY",
      tokenAddress: "0x481253AC3b7F9738461c70f8282435287915895d",
    },
    {
      address: "0xf24d35830f3e1969dAf3Fc598B19921B67297e0B",
      name: "URU/KLAY",
      tokenAddress: "0x481253AC3b7F9738461c70f8282435287915895d",
    },
    {
      address: "0xf24d35830f3e1969dAf3Fc598B19921B67297e0B",
      name: "URU/KLAY",
      tokenAddress: "0xA935449F20f0e6867FF23dbFC627e4300bf011b3",
    },
    {
      address: "0xf24d35830f3e1969dAf3Fc598B19921B67297e0B",
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
