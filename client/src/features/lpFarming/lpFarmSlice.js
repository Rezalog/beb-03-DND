import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  farms: [
    {
      farmAddress: "0x50a292Fe9d1D134D8A93BC5CB3df1BEe680E5f4c",
      name: "klay-uru-LP-token",
      tokenAddress: "0xA935449F20f0e6867FF23dbFC627e4300bf011b3",
    },
  ],
};

const lpFarmSlice = createSlice({
  name: "lpFarm",
  initialState,
  reducers: {},
});

export const {} = lpFarmSlice.actions;

export default lpFarmSlice.reducer;
