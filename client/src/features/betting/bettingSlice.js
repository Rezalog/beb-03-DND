import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bettings: [],
};

const bettingSlice = createSlice({
  name: "betting",
  initialState,
  reducers: {
    updateBetting: (state, action) => {
      state.bettings[action.payload.betting.id - 1] = {
        ...action.payload.betting,
      };
    },
    initBettings: (state, action) => {
      state.bettings = action.payload.list;
    },
  },
});

export const { updateBetting, initBettings } = bettingSlice.actions;

export default bettingSlice.reducer;
