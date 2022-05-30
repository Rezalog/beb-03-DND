import React, { useState, useEffect, useRef } from "react";
import Caver from "caver-js";
import { useDispatch, useSelector } from "react-redux";
import { openSubModal } from "../../tokenSwap/tokenSwapSlice";
import {
  InputContainer,
  BalanceContainer,
} from "../../../styles/InputContainer.styled";
import { Button } from "../../../styles/Modal.styled";
import {
  SwapInfoContainer,
  InfoContainer,
} from "../../../styles/TokenSwap.styled";
import {
  pendingNoti,
  successNoti,
  failNoti,
  clearState,
} from "../../notification/notifiactionSlice";
import { uruABI, uruAddress } from "../../userinfo/TokenContract";
import { updateBalance } from "../../userinfo/userInfoSlice";

const AddLiquidity = ({
  account,
  setSelectedToken,
  getExchangeContract,
  exchange,
  currentExchangeAddress,
}) => {
  const dispatch = useDispatch();
  const { tokens, token0, token1 } = useSelector((state) => state.tokenSwap);
  const [balance, setBalance] = useState(0);
  const [balance1, setBalance1] = useState(0);
  const [currentTokenAddress, setCurrentTokenAddress] = useState("");
  const [reservedKlay, setReservedKlay] = useState(0);
  const [reservedToken, setReservedToken] = useState(0);
  const input1 = useRef(null);
  const input2 = useRef(null);
  const [price, setPrice] = useState("");
  const [reversePrice, setReversePrice] = useState("");
  const [share, setShare] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [klayAmount, setKlayAmount] = useState(0);
  const getReserved = async () => {
    const caver = new Caver(window.klaytn);

    const klayInExchange = await exchange.methods.getKlay().call();
    const tokenInExchange = await exchange.methods.getReserve().call();

    setReservedKlay(caver.utils.fromPeb(klayInExchange));
    setReservedToken(caver.utils.fromPeb(tokenInExchange));
  };

  const getToken0 = async () => {
    const caver = new Caver(window.klaytn);
    if (token0 > 0) {
      const address = tokens[token0].address;
      const kip7 = new caver.klay.KIP7(address);
      const _balance = await kip7.balanceOf(account);
      setBalance(caver.utils.fromPeb(_balance));
      getExchangeContract(address);
      setCurrentTokenAddress(address);
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
      const _balance = await kip7.balanceOf(account);
      setBalance1(caver.utils.fromPeb(_balance));
      getExchangeContract(address);
      setCurrentTokenAddress(address);
    } else {
      const _balance = await caver.klay.getBalance(account);
      setBalance1(caver.utils.fromPeb(_balance));
    }
  };

  const getInput1 = () => {
    const caver = new Caver(window.klaytn);
    const input2Value = input2.current.value;
    const klay = caver.utils.toPeb(reservedKlay);
    const token = caver.utils.toPeb(reservedToken);

    if (input2Value != "") {
      const result = caver.utils.fromPeb(
        caver.utils
          .toBN(caver.utils.toPeb(input2Value))
          .mul(caver.utils.toBN(caver.utils.toPeb(klay)))
          .div(caver.utils.toBN(caver.utils.toPeb(token)))
      );
      input1.current.value = parseFloat(Number(result).toFixed(6));
      setKlayAmount(result);
      setTokenAmount(input2Value);
      getPrice();
      getShareOfLP();
    } else {
      input1.current.value = "";
      setPrice("");
      setReversePrice("");
      setShare("");
    }
  };

  const getInput2 = () => {
    const caver = new Caver(window.klaytn);
    const input1Value = input1.current.value;
    const klay = caver.utils.toPeb(reservedKlay);
    const token = caver.utils.toPeb(reservedToken);

    if (input1Value != "") {
      const result = caver.utils.fromPeb(
        caver.utils
          .toBN(caver.utils.toPeb(input1Value))
          .mul(caver.utils.toBN(caver.utils.toPeb(token)))
          .div(caver.utils.toBN(caver.utils.toPeb(klay)))
      );
      input2.current.value = parseFloat(Number(result).toFixed(6));
      setTokenAmount(result);
      setKlayAmount(input1Value);
      getPrice();
      getShareOfLP();
    } else {
      input2.current.value = "";
      setPrice("");
      setReversePrice("");
      setShare("");
    }
  };

  const addLiquidity = async () => {
    dispatch(pendingNoti());
    const caver = new Caver(window.klaytn);

    try {
      const kip7 = new caver.klay.KIP7(currentTokenAddress);
      const allowed = await kip7.allowance(account, currentExchangeAddress);
      // 변경해야함
      // if allowed <= caver.utils.toPeb(input2.current.value)
      if (allowed.toString() === "0") {
        await kip7.approve(
          currentExchangeAddress,
          caver.utils.toPeb("100000000"),
          {
            from: account,
          }
        );
      }

      await exchange.methods.addLiquidity(caver.utils.toPeb(tokenAmount)).send({
        from: account,
        value: caver.utils.toPeb(klayAmount),
        gas: 2000000,
      });

      const klayInExchange = await exchange.methods.getKlay().call();
      const tokenInExchange = await exchange.methods.getReserve().call();

      setReservedKlay(caver.utils.fromPeb(klayInExchange));
      setReservedToken(caver.utils.fromPeb(tokenInExchange));
      dispatch(
        successNoti({
          msg: `${Number(tokenAmount).toFixed(2)} ${
            token0 === 0 ? tokens[token1].symbol : tokens[token0].symbol
          } 와 ${Number(klayAmount).toFixed(2)} KLAY 가 추가되었습니다!`,
        })
      );

      const token = new caver.klay.Contract(uruABI, uruAddress);
      const balance = await token.methods.balanceOf(account).call();
      const locked = await token.methods.getLockedTokenAmount(account).call();
      dispatch(
        updateBalance({
          uru: parseFloat(Number(caver.utils.fromPeb(balance)).toFixed(2)),
          locked: parseFloat(Number(caver.utils.fromPeb(locked)).toFixed(2)),
        })
      );
    } catch (error) {
      dispatch(failNoti());
    }
    setTimeout(() => {
      dispatch(clearState());
    }, 5000);
  };

  const getPrice = () => {
    const t0 = input1.current.value;
    const t1 = input2.current.value;
    if (t0 === "" || t1 === "") {
      setPrice("");
      setReversePrice("");
    } else {
      setPrice(parseFloat((Number(t1) / Number(t0)).toFixed(6)));
      setReversePrice(parseFloat((Number(t0) / Number(t1)).toFixed(6)));
    }
  };

  const getShareOfLP = async () => {
    const caver = new Caver(window.klaytn);
    const currentKlayAmount = caver.utils.toPeb(input1.current.value);

    const lpKip7 = new caver.klay.KIP7(currentExchangeAddress);
    const totalSupply = await lpKip7.totalSupply();
    const expectedLP = Number(
      caver.utils.fromPeb(
        caver.utils
          .toBN(totalSupply)
          .mul(caver.utils.toBN(currentKlayAmount))
          .div(caver.utils.toBN(caver.utils.toPeb(reservedKlay)))
      )
    ).toFixed(6);
    setShare(
      parseFloat(
        Number(
          (expectedLP /
            (Number(caver.utils.fromPeb(totalSupply)) + Number(expectedLP))) *
            100
        ).toFixed(2)
      )
    );
  };

  useEffect(() => {
    if (account) {
      getToken0();
      getToken1();
    }
  }, [account, token0, token1]);

  useEffect(() => {
    if (Object.keys(exchange).length !== 0) {
      getReserved();
    }
  }, [exchange]);

  return (
    <>
      <InputContainer type='number'>
        <button style={{ opacity: "0.8" }}>
          {tokens[token0].symbol}
          <img src='assets/arrowDown.png' />
        </button>
        <input placeholder='0.0' ref={input1} onChange={getInput2} />
        <BalanceContainer>
          <span>
            잔액: {Number(balance).toFixed(2)} {tokens[token0].symbol}
          </span>
        </BalanceContainer>
      </InputContainer>
      <span style={{ fontSize: "2rem", marginBottom: "-20px" }}>+</span>
      <InputContainer type='number'>
        <button
          onClick={() => {
            dispatch(openSubModal());
            setSelectedToken(1);
          }}
        >
          {tokens[token1].symbol}
          <img src='assets/arrowDown.png' />
        </button>
        <input placeholder='0.0' ref={input2} onChange={getInput1} />

        <BalanceContainer>
          <span>
            잔액:{" "}
            {token1 < 0
              ? "0.0"
              : `${Number(balance1).toFixed(2)} ${tokens[token1].symbol}`}
          </span>
        </BalanceContainer>
      </InputContainer>
      <SwapInfoContainer>
        {reversePrice && (
          <InfoContainer>
            <span>{reversePrice}</span>
            <span>
              {tokens[token0].symbol} per {tokens[token1].symbol}
            </span>
          </InfoContainer>
        )}
        {price && (
          <InfoContainer>
            <span>{price}</span>
            <span>
              {tokens[token1].symbol} per {tokens[token0].symbol}
            </span>
          </InfoContainer>
        )}
        {share && (
          <InfoContainer>
            <span>{share < 0.01 ? `< 0.01` : share} %</span>
            <span>Share of Pool</span>
          </InfoContainer>
        )}
      </SwapInfoContainer>

      <Button onClick={addLiquidity}>유동성 공급</Button>
    </>
  );
};

export default AddLiquidity;
