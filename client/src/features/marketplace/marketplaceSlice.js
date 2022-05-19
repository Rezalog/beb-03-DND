import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  onSaleList: [],
  remainingList: [],
};

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    updateList: (state, action) => {
      state.list = action.payload.list;
    },
    updateOnSaleList: (state, action) => {
      state.onSaleList = action.payload.list;
    },
    updateRemainingList: (state, action) => {
      state.remainingList = action.payload.list;
    },
  },
});

export const { updateList, updateOnSaleList, updateRemainingList } =
  marketplaceSlice.actions;

export default marketplaceSlice.reducer;
