import { useState, useEffect } from "react";
import "./App.css";
import game from "./PhaserGame";
import Caver from "caver-js";
import { useDispatch, useSelector } from "react-redux";
import DexModal from "./features/dex/DexModal";
import TokenSwapModal from "./features/tokenSwap/TokenSwapModal";
import { openDexModal } from "./features/modal/dexModalSlice";
import { openTokenSwapModal } from "./features/modal/tokenSwapModalSlice";

function App() {
  const { isOpen: isDexOpen } = useSelector((state) => state.dexModal);
  const { isOpen: isTokenSwapOpen } = useSelector(
    (state) => state.tokenSwapModal
  );
  const dispatch = useDispatch();

  const connectToWallet = async () => {
    if (typeof window.klaytn !== "undefined") {
      const provider = window["klaytn"];
      try {
        const accounts = await window.klaytn.enable();
        const account = window.klaytn.selectedAddress;

        const caver = new Caver(window.klaytn);
        const balance = await caver.klay.getBalance(account);
        console.log(balance);

        // emit 이벤트
        // 두번째 인자값에 캐릭터 이미지 파일 이름이 들어가면된다.
        game.events.emit("start", "dragon");
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    game.events.on("enter", (event) => {
      console.log(event);
      switch (event) {
        case "1": {
          dispatch(openDexModal());
          break;
        }
        case "2": {
          dispatch(openTokenSwapModal());
          break;
        }
        default: {
          break;
        }
      }
    });
  }, []);

  return (
    <div className='App'>
      <button onClick={connectToWallet}>지갑 연결</button>
      {isDexOpen && <DexModal />}
      {isTokenSwapOpen && <TokenSwapModal />}
    </div>
  );
}

export default App;
