import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstWeapon: "",
  secondWeapon: "",
};

const compoundInfoSlice = createSlice({
  name: "compoundInfo",
  initialState,
  reducers: {
    setFirstWeapon: (state, action) => {
      state.firstWeapon = action.payload.firstWeapon;
    },
    setSecondWeapon: (state, action) => {
      state.secondWeapon = action.payload.secondWeapon;
    },
  },
});

export const { setFirstWeapon, setSecondWeapon } = compoundInfoSlice.actions;

export default compoundInfoSlice.reducer;
