import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  monsters: [
    {
      address: "0xC5b97472D201E90fb56e1B54949c78b4D5eAFA2C",
      name: "달팽이",
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
