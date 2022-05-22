import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  monsters: [
    {
      address: "0x982dF25b6A67f8F181aF2f4782B7C054B8E8c681",
      name: "달팽이",
      lvl: 1,
      cooltime: 600,
      reward: 100,
    },
    {
      address: "0xb86640826070874b68b61fe41dd3e19980000efe",
      name: "슬라임",
      lvl: 2,
      cooltime: 600,
      reward: 200,
    },
    {
      address: "0x864918ba720e2334ea8712595fbee95f2874d3b0",
      name: "옥토퍼스",
      lvl: 3,
      cooltime: 600,
      reward: 300,
    },
    {
      address: "0x573ce465bdd506123872bfcf469e0508c2fbfdab",
      name: "주황버섯",
      lvl: 4,
      cooltime: 600,
      reward: 400,
    },
    {
      address: "0x1dee151608081d6ebdc7e953b54695217d9dd803",
      name: "이블아이",
      lvl: 5,
      cooltime: 600,
      reward: 500,
    },
    {
      address: "0xbe393707739a6a411d2ae7262b0935e57b665354",
      name: "와일드보어",
      lvl: 6,
      cooltime: 600,
      reward: 600,
    },
    {
      address: "0x215da48b967fcd7a73d95cd598c3280d7bfde5a5",
      name: "믹스골렘",
      lvl: 7,
      cooltime: 600,
      reward: 700,
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
