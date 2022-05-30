import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  farms: [],
  master: null,
};

const lpFarmSlice = createSlice({
  name: "lpFarm",
  initialState,
  reducers: {
    initFarm: (state, action) => {
      state.farms = action.payload.list;
    },
  },
});

export const { initFarm } = lpFarmSlice.actions;

export default lpFarmSlice.reducer;
