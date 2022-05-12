import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { closeDexModal } from "../modal/dexModalSlice";
import LiquidityPool from "./components/LiquidityPool";
import AddPool from "./components/AddPool";

const DexModal = () => {
  const dispatch = useDispatch();
  const [account, setAccount] = useState(null);
  const [currentNav, setCurrentNav] = useState(0);

  const connectToWallet = async () => {
    if (typeof window.klaytn !== "undefined") {
      const provider = window["klaytn"];
      try {
        const accounts = await window.klaytn.enable();
        const _account = window.klaytn.selectedAddress;
        setAccount(_account);

        // const caver = new Caver(window.klaytn);
        // setExchange(new caver.klay.Contract(abi, address));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "500px",
          height: "500px",
          backgroundColor: "black",
          zIndex: 10,
          color: "white",
        }}
      >
        DEX Coming Soon!!!
        <button onClick={() => dispatch(closeDexModal())}>X</button>
        <button onClick={connectToWallet}>연결</button>
        <nav>
          <div onClick={() => setCurrentNav(0)}>유동성 풀</div>
          <div onClick={() => setCurrentNav(1)}>풀 추가</div>
        </nav>
        {currentNav == 0 && account ? (
          <LiquidityPool account={account} />
        ) : currentNav == 1 && account ? (
          <AddPool account={account} />
        ) : null}
      </div>
    </div>
  );
};

export default DexModal;
