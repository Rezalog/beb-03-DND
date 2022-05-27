import React, { useState, useEffect, useRef } from "react";
import Caver from "caver-js";
import axios from "axios";
import { factoryABI, exchangeABI, factoryAddress } from "../contractInfo";
import { useDispatch, useSelector } from "react-redux";
import { addExchange } from "../dexSlice";
import { addNewToken } from "../../tokenSwap/tokenSwapSlice";

import {
  InputContainer,
  BalanceContainer,
} from "../../../styles/InputContainer.styled";
import {
  SwapInfoContainer,
  InfoContainer,
} from "../../../styles/TokenSwap.styled";
import { Button } from "../../../styles/Modal.styled";
import {
  pendingNoti,
  successNoti,
  failNoti,
  clearState,
} from "../../notification/notifiactionSlice";
import { uruABI, uruAddress } from "../../userinfo/TokenContract";
import { updateBalance } from "../../userinfo/userInfoSlice";

const AddPool = ({ account }) => {
  const [klayBalance, setKlayBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [selectedToken, setSelectedToken] = useState("");
  const [currentTokenSymbol, setCurrentTokenSymbol] = useState("URU");
  const [currentTokenName, setCurrentTokenName] = useState("");
  const klayAmount = useRef(null);
  const tokenAmount = useRef(null);
  const newTokenAddress = useRef(null);
  const [price, setPrice] = useState("");

  const { tokens } = useSelector((state) => state.tokenSwap);
  const dispatch = useDispatch();

  const addPool = async () => {
    dispatch(pendingNoti());
    const caver = new Caver(window.klaytn);
    const factory = new caver.klay.Contract(factoryABI, factoryAddress);

    try {
      await factory.methods
        .createExchange(selectedToken, tokens[1].address, 604800)
        .send({ from: account, gas: 5000000 });

      const exchangeAddress = await factory.methods
        .getExchange(selectedToken)
        .call();
      const exchange = new caver.klay.Contract(exchangeABI, exchangeAddress);

      const klayAmountInPeb = caver.utils.toPeb(klayAmount.current.value);
      const tokenAmountInPeb = caver.utils.toPeb(tokenAmount.current.value);

      const kip7 = new caver.klay.KIP7(selectedToken);
      const allowed = await kip7.allowance(account, exchangeAddress);
      // 변경해야함
      // if allowed <= caver.utils.toPeb(input2.current.value)
      if (allowed.toString() === "0") {
        await kip7.approve(exchangeAddress, caver.utils.toPeb("100000000"), {
          from: account,
        });
      }

      await exchange.methods.addLiquidity(tokenAmountInPeb).send({
        from: account,
        value: klayAmountInPeb,
        gas: 2000000,
      });

      const lpKip7 = new caver.klay.KIP7(exchangeAddress);
      const lpSymbol = await lpKip7.symbol();
      //const lpName = await lpKip7.name();

      dispatch(
        addExchange({
          address: exchangeAddress,
          name: `${currentTokenSymbol}/KLAY`,
          tokenAddress: selectedToken,
        })
      );
      const newToken = {
        symbol: currentTokenSymbol,
        name: currentTokenName,
        address: newTokenAddress.current.value,
      };
      dispatch(addNewToken(newToken));

      const token = new caver.klay.Contract(uruABI, uruAddress);
      const balance = await token.methods.balanceOf(account).call();
      const locked = await token.methods.getLockedTokenAmount(account).call();
      dispatch(
        updateBalance({
          uru: parseFloat(Number(caver.utils.fromPeb(balance)).toFixed(2)),
          locked: parseFloat(Number(caver.utils.fromPeb(locked)).toFixed(2)),
        })
      );

      await axios.post(
        "http://localhost:8080/contracts/token",
        [
          {
            token_symbol: currentTokenSymbol,
            token_name: currentTokenName,
            token_address: newTokenAddress.current.value,
          },
        ],
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await axios.post(
        "http://localhost:8080/contracts/pair",
        {
          pair_address: exchangeAddress,
          pair_name: `${currentTokenSymbol}/KLAY`,
          token_address: selectedToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
      dispatch(
        successNoti({ msg: `${currentTokenSymbol}/KLAY 풀이 추가되었습니다!` })
      );
    } catch (error) {
      console.log(error);
      dispatch(failNoti());
    }
    setTimeout(() => {
      dispatch(clearState());
    }, 5000);
  };

  const addToken = async () => {
    const caver = new Caver(window.klaytn);
    try {
      const kip7 = new caver.klay.KIP7(newTokenAddress.current.value);
      const name = await kip7.name();
      const symbol = await kip7.symbol();
      const balance = await kip7.balanceOf(account);
      setCurrentTokenSymbol(symbol);
      setCurrentTokenName(name);
      setTokenBalance(caver.utils.fromPeb(balance));
      setSelectedToken(newTokenAddress.current.value);
      setIsValidAddress(true);
    } catch (err) {
      setIsValidAddress(false);
    }
  };

  const getPrice = () => {
    const ka = klayAmount.current.value;
    const ta = tokenAmount.current.value;
    if (ka && ta) {
      const result = klayAmount.current.value / tokenAmount.current.value;
      setPrice(parseFloat(result.toFixed(6)));
    } else {
      setPrice("");
    }
  };
  useEffect(() => {
    const getBalance = async () => {
      const caver = new Caver(window.klaytn);
      const kbalance = await caver.klay.getBalance(account);
      setKlayBalance(caver.utils.fromPeb(kbalance));
    };
    getBalance();
  }, []);

  return (
    <>
      <InputContainer>
        <input
          placeholder='토큰 주소'
          ref={newTokenAddress}
          onChange={addToken}
        />
      </InputContainer>
      {!isValidAddress ? (
        <p>추가 하고 싶은 토큰 주소를 입력하세요!</p>
      ) : (
        <>
          <InputContainer>
            <button style={{ opacity: "0.8" }}>KLAY</button>
            <input placeholder='0.0' ref={klayAmount} onChange={getPrice} />
            <BalanceContainer>
              <span>잔액: {Number(klayBalance).toFixed(2)} KLAY</span>
            </BalanceContainer>
          </InputContainer>
          <InputContainer>
            <button style={{ opacity: "0.8" }}>
              {currentTokenSymbol}
              <span style={{ marginLeft: "20px", fontSize: "1rem" }}>
                {currentTokenName}
              </span>
            </button>

            <input placeholder='0.0' ref={tokenAmount} onChange={getPrice} />
            <BalanceContainer>
              <span>
                잔액: {Number(tokenBalance).toFixed(2)} {currentTokenSymbol}
              </span>
            </BalanceContainer>
          </InputContainer>
          {price && (
            <SwapInfoContainer>
              <InfoContainer>
                <span>{price}</span>
                <span>KLAY per {currentTokenSymbol}</span>
              </InfoContainer>
            </SwapInfoContainer>
          )}
          <Button onClick={addPool}>풀 추가</Button>
        </>
      )}
    </>
  );
};

export default AddPool;
