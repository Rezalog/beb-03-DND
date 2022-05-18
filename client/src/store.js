import { configureStore } from "@reduxjs/toolkit";
import dexModalReducer from "./features/modal/dexModalSlice";
import TokenSwapModalReducer from "./features/modal/tokenSwapModalSlice";
import dexSlice from "./features/dex/dexSlice";
import tokenSwapSlice from "./features/tokenSwap/tokenSwapSlice";
import signUpModalReducer from "./features/modal/signUpModalSlice";
import signUpSlice from "./features/signup/signUpSlice";
import loadingSlice from "./features/loading/loadingSlice";
import userInfoSlice from "./features/userinfo/userInfoSlice";
import lpFarmSlice from "./features/lpFarming/lpFarmSlice";
import lpFarmingModalSlice from "./features/modal/lpFarmingModalSlice";
import TooltipSlice from "./features/tooltip/TooltipSlice";
export const store = configureStore({
  reducer: {
    dexModal: dexModalReducer,
    tokenSwapModal: TokenSwapModalReducer,
    signUpModal: signUpModalReducer,
    dex: dexSlice,
    tokenSwap: tokenSwapSlice,
    signUp: signUpSlice,
    loading: loadingSlice,
    userInfo: userInfoSlice,
    lpFarm: lpFarmSlice,
    lpFarmModal: lpFarmingModalSlice,
    tooltip: TooltipSlice,
  },
});
