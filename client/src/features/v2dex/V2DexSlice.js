import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exchanges: [
    {
      address: "0x6b2071254a19a1C5AF4d09ba92b97A40367FBe9B",
      name: "URU/WKLAY",
      tokenAddress1: "0x481253AC3b7F9738461c70f8282435287915895d",
      tokenAddress2: "0xEFBAF5ca2Dd2FAc9AEe363972EE2ff9239Bcf6d9",
    },
    {
      address: "0xE12483a586e26AcE3e2b62CFa0A6ba27ED2ab25D",
      name: "TMP/WKLAY",
      tokenAddress1: "0xB71Fcd94e9e3EB87Cb220E76CFd6785A4a2DeaAF",
      tokenAddress2: "0xEFBAF5ca2Dd2FAc9AEe363972EE2ff9239Bcf6d9",
    },
  ],
};

const v2DexSlice = createSlice({
  name: "v2Dex",
  initialState,
  reducers: {
    addV2Exchange: (state, action) => {
      state.exchanges.push({
        address: action.payload.address,
        name: action.payload.name,
        tokenAddress1: action.payload.tokenAddress1,
        tokenAddress2: action.payload.tokenAddress2,
      });
    },
    initV2Exchange: (state, action) => {
      state.exchanges = action.payload.list;
    },
  },
});

export const { addV2Exchange, initV2Exchange } = v2DexSlice.actions;

export default v2DexSlice.reducer;
