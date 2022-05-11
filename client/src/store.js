import { configureStore } from "@reduxjs/toolkit";
import dexModalReducer from "./features/modal/dexModalSlice";
import TokenSwapModalReducer from "./features/modal/tokenSwapModalSlice";
import dexSlice from "./features/dex/dexSlice";
import tokenSwapSlice from "./features/tokenSwap/tokenSwapSlice";
// import SignUpModalReducer from "./features/signup/signUpModalSlice";
import signUpSlice from "./features/signup/signUpSlice";

export const store = configureStore({
  reducer: {
    dexModal: dexModalReducer,
    tokenSwapModal: TokenSwapModalReducer,
    // signUpModal: SignUpModalReducer,
    dex: dexSlice,
    tokenSwap: tokenSwapSlice,
    signUp: signUpSlice,
  },
});
