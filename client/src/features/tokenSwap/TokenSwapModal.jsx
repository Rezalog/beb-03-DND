import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Caver from "caver-js";
import { closeTokenSwapModal } from "../modal/tokenSwapModalSlice";
import SubModal from "./SubModal";
import { openSubModal, clearState } from "./tokenSwapSlice";
const TokenSwapModal = () => {
  const dispatch = useDispatch();
  const { isSubModalOpen, tokens, token0, token1 } = useSelector(
    (state) => state.tokenSwap
  );
  const [balance, setBalance] = useState(0);
  const [balance1, setBalance1] = useState(1);
  const [account, setAccount] = useState({});
  const [selectedToken, setSelectedToken] = useState(0);
  const token0InputRef = useRef(null);

  const connectToWallet = async () => {
    if (typeof window.klaytn !== "undefined") {
      const provider = window["klaytn"];
      try {
        const accounts = await window.klaytn.enable();
        const _account = window.klaytn.selectedAddress;
        setAccount(_account);

        const caver = new Caver(window.klaytn);
        const _balance = await caver.klay.getBalance(_account);
        setBalance(caver.utils.convertFromPeb(_balance));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const inputMaxToken = () => {
    token0InputRef.current.value = balance;
  };

  useEffect(() => {
    const getToken = async () => {
      const caver = new Caver(window.klaytn);
      if (token0 > 0) {
        const address = tokens[token0].address;
        const kip7 = new caver.kct.kip7(address);
        const symbol = await kip7.symbol();
        const _balance = await kip7.balanceOf(account);
        setBalance(caver.utils.convertFromPeb(_balance));
      } else {
        const _balance = await caver.klay.getBalance(account);
        setBalance(caver.utils.convertFromPeb(_balance));
      }
    };
    getToken();
  }, [token0]);

  useEffect(() => {
    const getToken = async () => {
      const caver = new Caver(window.klaytn);
      if (token1 > 0) {
        const address = tokens[token1].address;
        const kip7 = new caver.kct.kip7(address);
        const symbol = await kip7.symbol();
        const _balance = await kip7.balanceOf(account);
        setBalance1(caver.utils.convertFromPeb(_balance));
      } else {
        const _balance = await caver.klay.getBalance(account);
        setBalance1(caver.utils.convertFromPeb(_balance));
      }
    };
    getToken();
  }, [token1]);

  return (
    <div
      style={{
        width: "300px",
        height: "300px",
        backgroundColor: "black",
        zIndex: 10,
        color: "white",
      }}
    >
      Token Swap Coming Soon!!!
      <button
        onClick={() => {
          dispatch(closeTokenSwapModal());
          dispatch(clearState());
        }}
      >
        X
      </button>
      <button onClick={connectToWallet}>잔액조회</button>
      <input placeholder='0.0' ref={token0InputRef} />
      <button
        onClick={() => {
          dispatch(openSubModal());
          setSelectedToken(0);
        }}
      >
        {tokens[token0].symbol}
      </button>
      <p>
        잔액: {Number(balance).toFixed(2)} {tokens[token0].symbol}
        <button onClick={inputMaxToken}>Max</button>
      </p>
      <input placeholder='0.0' />
      <button
        onClick={() => {
          dispatch(openSubModal());
          setSelectedToken(1);
        }}
      >
        {token1 < 0 ? "토큰선택" : tokens[token1].symbol}
      </button>
      <p>
        잔액:{" "}
        {token1 < 0
          ? "0.0"
          : `${Number(balance1).toFixed(2)} ${tokens[token1].symbol}`}
      </p>
      <button>교환</button>
      {isSubModalOpen && <SubModal selectedToken={selectedToken} />}
    </div>
  );
};

export default TokenSwapModal;
