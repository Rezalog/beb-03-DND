import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstWeapon: "",
  secondWeapon: "",
  compoundResult: false,
  weapons: [],
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
    setCompoundResult: (state, action) => {
      state.compoundResult = action.payload.compoundResult;
    },
    setWeapons: (state, action) => {
      state.weapons = action.payload.weapons;
    },
  },
});

export const {
  setFirstWeapon,
  setSecondWeapon,
  setCompoundResult,
  setWeapons,
} = compoundInfoSlice.actions;

export default compoundInfoSlice.reducer;
