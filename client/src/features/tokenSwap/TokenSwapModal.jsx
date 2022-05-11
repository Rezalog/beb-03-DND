import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Caver from "caver-js";
import { closeTokenSwapModal } from "../modal/tokenSwapModalSlice";
import SubModal from "./SubModal";
import { openSubModal, clearState } from "./tokenSwapSlice";
import { startLoading, stopLoading } from "../loading/loadingSlice";

import { abi, address } from "./exchangeContract";

const TokenSwapModal = () => {
  const dispatch = useDispatch();
  const { isSubModalOpen, tokens, token0, token1 } = useSelector(
    (state) => state.tokenSwap
  );
  const [balance, setBalance] = useState(0);
  const [balance1, setBalance1] = useState(1);
  const [account, setAccount] = useState(null);
  const [selectedToken, setSelectedToken] = useState(0);
  const token0InputRef = useRef(null);
  const token1InputRef = useRef(null);
  const [exchange, setExchange] = useState({});
  const [minOutput, setMinOutput] = useState(0);

  const connectToWallet = async () => {
    if (typeof window.klaytn !== "undefined") {
      const provider = window["klaytn"];
      try {
        const accounts = await window.klaytn.enable();
        const _account = window.klaytn.selectedAddress;
        setAccount(_account);

        const caver = new Caver(window.klaytn);
        const _balance = await caver.klay.getBalance(_account);
        setExchange(new caver.klay.Contract(abi, address));
        setBalance(caver.utils.fromPeb(_balance));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const inputMaxToken = () => {
    token0InputRef.current.value = balance;
  };

  const getOutputAmount = async () => {
    const caver = new Caver(window.klaytn);
    const input = token0InputRef.current.value || 0;
    if (input > 0) {
      let output;
      if (token0 > 0) {
        output = await exchange.methods
          .getklayAmount(caver.utils.toPeb(input))
          .call();
        //console.log(caver.utils.fromPeb(output));
      } else {
        output = await exchange.methods
          .getTokenAmount(caver.utils.toPeb(input))
          .call();
      }
      token1InputRef.current.value = caver.utils.fromPeb(output);
      setMinOutput(caver.utils.fromPeb(output) * 0.99);
    }
  };

  const swapToken = async () => {
    const caver = new Caver(window.klaytn);
    dispatch(startLoading());
    if (token0 > 0) {
      const tokenAddress = tokens[token0].address;
      const kip7 = new caver.klay.KIP7(tokenAddress);
      const allowed = await kip7.allowance(account, address);
      if (allowed.toString() === "0") {
        try {
          await kip7.approve(address, caver.utils.toPeb("100000000"), {
            from: account,
          });
        } catch (err) {
          console.log(err);
        }
      }

      const input = token0InputRef.current.value;
      await exchange.methods
        .tokenToklaySwap(
          caver.utils.toPeb(input),
          caver.utils.toPeb(minOutput.toString())
        )
        .send({ from: account, gas: 20000000 });
      dispatch(stopLoading());
    } else {
      const input = token0InputRef.current.value;
      await exchange.methods
        .klayToTokenSwap(caver.utils.toPeb(minOutput.toString()))
        .send({
          from: account,
          value: caver.utils.toPeb(input),
          gas: 20000000,
        });

      dispatch(stopLoading());
      console.log(tokens[token0].symbol);
      if (tokens[token1].symbol === "URU") {
        const tokenAdded = localStorage.getItem("tokenAdded");
        console.log(tokenAdded);
        if (!tokenAdded) {
          window.klaytn.sendAsync(
            {
              method: "wallet_watchAsset",
              params: {
                type: "ERC20", // Initially only supports ERC20, but eventually more!
                options: {
                  address: tokens[3].address, // The address that the token is at.
                  symbol: tokens[3].symbol, // A ticker symbol or shorthand, up to 5 chars.
                  decimals: 18, // The number of decimals in the token
                  image: "", // A string url of the token logo
                },
              },
              id: Math.round(Math.random() * 100000),
            },
            (err, added) => {
              if (added) {
                console.log("Thanks for your interest!");
              } else {
                console.log("Your loss!");
              }
            }
          );
          localStorage.setItem("tokenAdded", "false");
        }
      }
    }
    getToken0();
    getToken1();
    token0InputRef.current.value = 0;
    token1InputRef.current.value = 0;
  };
  const getToken0 = async () => {
    const caver = new Caver(window.klaytn);
    if (token0 > 0) {
      const address = tokens[token0].address;
      const kip7 = new caver.klay.KIP7(address);
      const symbol = await kip7.symbol();
      const _balance = await kip7.balanceOf(account);
      setBalance(caver.utils.fromPeb(_balance));
    } else {
      const _balance = await caver.klay.getBalance(account);
      setBalance(caver.utils.fromPeb(_balance));
    }
  };

  const getToken1 = async () => {
    const caver = new Caver(window.klaytn);
    if (token1 > 0) {
      const address = tokens[token1].address;
      const kip7 = new caver.klay.KIP7(address);
      const symbol = await kip7.symbol();
      const _balance = await kip7.balanceOf(account);
      setBalance1(caver.utils.fromPeb(_balance));
    } else {
      const _balance = await caver.klay.getBalance(account);
      setBalance1(caver.utils.fromPeb(_balance));
    }
  };

  useEffect(() => {
    if (account) getToken0();
  }, [token0]);

  useEffect(() => {
    if (account) getToken1();
  }, [token1]);

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
          position: "absolute",
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
        <input
          placeholder='0.0'
          ref={token0InputRef}
          onChange={getOutputAmount}
        />
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
        <input placeholder='0.0' disabled ref={token1InputRef} />
        <button
          onClick={() => {
            dispatch(openSubModal());
            setSelectedToken(1);
          }}
        >
          {token1 < 0 ? "토큰선택" : tokens[token1].symbol}
        </button>
        <p>최소 교환 금액 (Slippage 1%): {minOutput.toFixed(6)}</p>
        <p>
          잔액:{" "}
          {token1 < 0
            ? "0.0"
            : `${Number(balance1).toFixed(2)} ${tokens[token1].symbol}`}
        </p>
        <button onClick={swapToken}>교환</button>
        {isSubModalOpen && <SubModal selectedToken={selectedToken} />}
      </div>
    </div>
  );
};

export default TokenSwapModal;
