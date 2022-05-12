import React, { useState, useEffect, useRef } from "react";
import Caver from "caver-js";
import { factoryABI, exchangeABI, factoryAddress } from "../contractInfo";
import { useDispatch, useSelector } from "react-redux";
import { addExchange } from "../dexSlice";

const AddPool = ({ account }) => {
  const [klayBalance, setKlayBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [selectedToken, setSelectedToken] = useState("");
  const klayAmount = useRef(null);
  const tokenAmount = useRef(null);

  const { tokens } = useSelector((state) => state.tokenSwap);
  const dispatch = useDispatch();

  useEffect(() => {
    const getInitialBalance = async () => {
      const caver = new Caver(window.klaytn);

      const kbalance = await caver.klay.getBalance(account);
      setKlayBalance(caver.utils.fromPeb(kbalance));

      const address = tokens[1].address;
      const kip7 = new caver.klay.KIP7(address);
      const symbol = await kip7.symbol();
      const tbalance = await kip7.balanceOf(account);
      setTokenBalance(caver.utils.fromPeb(tbalance));
      setSelectedToken(address);
    };
    getInitialBalance();
  }, [account]);

  const addPool = async () => {
    const caver = new Caver(window.klaytn);
    const factory = new caver.klay.Contract(factoryABI, factoryAddress);

    await factory.methods
      .createExchange(selectedToken)
      .send({ from: account, gas: 5000000 });

    const exchangeAddress = await factory.methods
      .getExchange(selectedToken)
      .call();
    const exchange = new caver.klay.Contract(exchangeABI, exchangeAddress);

    const klayAmountInPeb = caver.utils.toPeb(klayAmount.current.value);
    const tokenAmountInPeb = caver.utils.toPeb(tokenAmount.current.value);

    const kip7 = new caver.klay.KIP7(selectedToken);
    const allowed = await kip7.allowance(account, exchangeAddress);
    if (allowed.toString() === "0") {
      try {
        await kip7.approve(exchangeAddress, caver.utils.toPeb("100000000"), {
          from: account,
        });
      } catch (err) {
        console.log(err);
      }
    }

    await exchange.methods.addLiquidity(tokenAmountInPeb).send({
      from: account,
      value: klayAmountInPeb,
      gas: 2000000,
    });

    const lpKip7 = new caver.klay.KIP7(exchangeAddress);
    const lpSymbol = await lpKip7.symbol();
    const lpName = await lpKip7.name();

    dispatch(
      addExchange({
        address: exchangeAddress,
        name: lpName,
        tokenAddress: selectedToken,
      })
    );
    window.klaytn.sendAsync(
      {
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: exchangeAddress, // The address that the token is at.
            symbol: lpSymbol, // A ticker symbol or shorthand, up to 5 chars.
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
  };

  return (
    <div>
      <input placeholder='0.0' ref={klayAmount} />
      <button>KLAY</button>
      <p>
        잔액: {Number(klayBalance).toFixed(6)} KLAY
        <button>Max</button>
      </p>
      <input placeholder='0.0' ref={tokenAmount} />
      <button>URU</button>
      <p>잔액:{Number(tokenBalance).toFixed(6)} </p>
      <button onClick={addPool}>풀 추가</button>
    </div>
  );
};

export default AddPool;
