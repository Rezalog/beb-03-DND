import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentWeapon: {},
};

const tooltipSlice = createSlice({
  name: "tooltipSlice",
  initialState,
  reducers: {
    setCurrentWeapon: (state, action) => {
      state.currentWeapon = { ...action.payload.weapon };
    },
  },
});

export const { setCurrentWeapon } = tooltipSlice.actions;

export default tooltipSlice.reducer;
