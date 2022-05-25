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
import weaponCompoundModalSlice from "./features/modal/weaponCompoundModalSlice";
import TooltipSlice from "./features/tooltip/TooltipSlice";
import marketplaceModalSlice from "./features/modal/marketplaceModalSlice";
import marketplaceSlice from "./features/marketplace/marketplaceSlice";
import monsterFarmModalSlice from "./features/modal/monsterFarmModalSlice";
import monsterFarmSlice from "./features/monsterFarm/monsterFarmSlice";
import notifiactionSlice from "./features/notification/notifiactionSlice";
import v2SwapModalSlice from "./features/modal/v2SwapModalSlice";
import v2SwapSlice from "./features/V2Swap/v2SwapSlice";
import v2DexModalSlice from "./features/modal/v2DexModalSlice";

export const store = configureStore({
  reducer: {
    dexModal: dexModalReducer,
    tokenSwapModal: TokenSwapModalReducer,
    signUpModal: signUpModalReducer,
    weaponCompoundModal: weaponCompoundModalSlice,
    dex: dexSlice,
    tokenSwap: tokenSwapSlice,
    signUp: signUpSlice,
    loading: loadingSlice,
    userInfo: userInfoSlice,
    lpFarm: lpFarmSlice,
    lpFarmModal: lpFarmingModalSlice,
    tooltip: TooltipSlice,
    marketplaceModal: marketplaceModalSlice,
    marketplace: marketplaceSlice,
    monsterFarmModal: monsterFarmModalSlice,
    monsterFarm: monsterFarmSlice,
    notification: notifiactionSlice,
    v2SwapModal: v2SwapModalSlice,
    v2Swap: v2SwapSlice,
    v2DexModal: v2DexModalSlice,
  },
});
