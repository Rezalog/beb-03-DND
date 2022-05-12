import { configureStore } from "@reduxjs/toolkit";
import dexModalReducer from "./features/modal/dexModalSlice";
import TokenSwapModalReducer from "./features/modal/tokenSwapModalSlice";
import dexSlice from "./features/dex/dexSlice";
import tokenSwapSlice from "./features/tokenSwap/tokenSwapSlice";
import loadingSlice from "./features/loading/loadingSlice";

export const store = configureStore({
  reducer: {
    dexModal: dexModalReducer,
    tokenSwapModal: TokenSwapModalReducer,
    dex: dexSlice,
    tokenSwap: tokenSwapSlice,
    loading: loadingSlice,
  },
});
