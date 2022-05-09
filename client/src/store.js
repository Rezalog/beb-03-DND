import { configureStore } from "@reduxjs/toolkit";
import dexModalReducer from "./features/modal/dexModalSlice";
import dexSlice from "./features/dex/dexSlice";

export const store = configureStore({
  reducer: {
    dexModal: dexModalReducer,
    dex: dexSlice,
  },
});
