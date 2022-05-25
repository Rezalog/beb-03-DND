import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nickname: "",
  characterIndex: "",
  address: "",
  uru: 0,
  lockedUru: 0,
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    addNickname: (state, action) => {
      state.nickname = action.payload.nickname;
    },
    addCharacterIndex: (state, action) => {
      state.characterIndex = action.payload.characterIndex;
    },
    addAddress: (state, action) => {
      state.address = action.payload.address; // or state.address = action.payload
    },
  },
});

export const { addNickname, addCharacterIndex, addAddress } =
  userInfoSlice.actions;

export default userInfoSlice.reducer;
