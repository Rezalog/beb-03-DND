import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const signUpSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {},
});

export const {} = signUpSlice.actions;

export default signUpSlice.reducer;
