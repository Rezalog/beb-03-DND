import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  monsters: [
    {
      address: "0x982dF25b6A67f8F181aF2f4782B7C054B8E8c681",
      name: "슬라임",
      lvl: 1,
      cooltime: 600,
      reward: 100,
    },
  ],
  staked: [],
  isSubModalOpen: false,
};

const monsterFarmSlice = createSlice({
  name: "monsterFarm",
  initialState,
  reducers: {
    openSubModal: (state) => {
      state.isSubModalOpen = true;
    },
    closeSubModal: (state) => {
      state.isSubModalOpen = false;
    },
    updateStakedWeapon: (state, action) => {
      state.staked = action.payload.staked;
    },
    removeStakedWeapon: (state, action) => {
      state.staked[action.payload.index] = {};
    },
  },
});

export const {
  openSubModal,
  closeSubModal,
  updateStakedWeapon,
  removeStakedWeapon,
} = monsterFarmSlice.actions;

export default monsterFarmSlice.reducer;
