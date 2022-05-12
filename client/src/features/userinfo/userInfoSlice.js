import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nickname: "",
  characterIndex: "",
  address: "",
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setNickname: (state, action) => {
      state.nickname = action.payload.nickname;
    },
    setCharacterIndex: (state, action) => {
      state.characterIndex = action.payload.characterIndex;
    },
    setAddress: (state, action) => {
      state.address = action.payload.address;
    },
  },
});

export const { setNickname, setCharacterIndex, setAddress } =
  userInfoSlice.actions;

export default userInfoSlice.reducer;
