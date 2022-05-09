import { useState, useEffect } from "react";
import "./App.css";
import game from "./PhaserGame";
import Caver from "caver-js";
import { useDispatch, useSelector } from "react-redux";
import DexModal from "./features/dex/DexModal";
import { openDexModal } from "./features/modal/dexModalSlice";

function App() {
  const { isOpen: isDexOpen } = useSelector((state) => state.dexModal);
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
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    game.events.on("enter", (event) => {
      switch (event) {
        case "1": {
          dispatch(openDexModal());
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
    </div>
  );
}

export default App;
