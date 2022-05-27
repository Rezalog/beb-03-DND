import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  monsters: [],
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
    initMonsters: (state, action) => {
      return {
        ...state,
        monsters: action.payload.list,
      };
    },
  },
});

export const {
  openSubModal,
  closeSubModal,
  updateStakedWeapon,
  removeStakedWeapon,
  initMonsters,
} = monsterFarmSlice.actions;

export default monsterFarmSlice.reducer;
