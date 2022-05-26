import React, { useState, useEffect, useRef } from "react";
import Caver from "caver-js";
import { useDispatch, useSelector } from "react-redux";
import { openSubModal } from "../../V2Swap/v2SwapSlice";
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
import {
  factoryABI,
  factoryAddress,
  routerAddress,
  routerABI,
  pairABI,
} from "../../V2Swap/v2Contract";
import { uruABI, uruAddress } from "../../userinfo/TokenContract";
import { updateBalance } from "../../userinfo/userInfoSlice";

const AddV2Liquidity = ({
  setSelectedToken,
  getExchangeContract,
  exchange,
  currentExchangeAddress,
}) => {
  const dispatch = useDispatch();
  const { isSubModalOpen, tokens, token0, token1 } = useSelector(
    (state) => state.v2Swap
  );
  const [balance, setBalance] = useState(0);
  const [balance1, setBalance1] = useState(0);
  const [currentTokenAddress, setCurrentTokenAddress] = useState("");
  const token0InputRef = useRef(null);
  const token1InputRef = useRef(null);
  const [minOutput, setMinOutput] = useState(0);
  const [reservedKlay, setReservedKlay] = useState(0);
  const [reservedToken, setReservedToken] = useState(0);
  const [reservedTokenA, setReservedTokenA] = useState(0);
  const [reservedTokenB, setReservedTokenB] = useState(0);
  const [lp, setLp] = useState(0);
  const input1 = useRef(null);
  const input2 = useRef(null);
  const [price, setPrice] = useState("");
  const [reversePrice, setReversePrice] = useState("");
  const [share, setShare] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const { address: account } = useSelector((state) => state.userInfo);
  const [klayAmount, setKlayAmount] = useState(0);
  const [tokenAAddress, setTokenAAddress] = useState("");
  const [tokenBAddress, setTokenBAddress] = useState("");
  const [pairAddress, setPairAddress] = useState("");
  const [tokenAAmount, setTokenAAmount] = useState(0);
  const [tokenBAmount, setTokenBAmount] = useState(0);

  const getReserved = async () => {
    const caver = new Caver(window.klaytn);
    const factory = new caver.klay.Contract(factoryABI, factoryAddress);
    const _pairAddress = await factory.methods
      .pairs(tokens[token0].address, tokens[token1].address)
      .call();
    setPairAddress(_pairAddress);
    if (_pairAddress !== "0x0000000000000000000000000000000000000000") {
      const pair = new caver.klay.Contract(pairABI, _pairAddress);
      const reserved = await pair.methods.getReserves().call();
      console.log(reserved);
      setReservedTokenA(caver.utils.fromPeb(reserved[0]));
      setReservedTokenB(caver.utils.fromPeb(reserved[1]));
    }
  };

  const getToken0 = async () => {
    const caver = new Caver(window.klaytn);
    const address = tokens[token0].address;
    const kip7 = new caver.klay.KIP7(address);
    const _balance = await kip7.balanceOf(account);
    setBalance(caver.utils.fromPeb(_balance));
    setTokenAAddress(address);
  };

  const getToken1 = async () => {
    const caver = new Caver(window.klaytn);
    const address = tokens[token1].address;
    const kip7 = new caver.klay.KIP7(address);
    const _balance = await kip7.balanceOf(account);
    setBalance1(caver.utils.fromPeb(_balance));
    setTokenBAddress(address);
  };

  const getInput1 = () => {
    if (pairAddress !== "0x0000000000000000000000000000000000000000") {
      const caver = new Caver(window.klaytn);
      const input2Value = input2.current.value;
      const tokenA = caver.utils.toPeb(reservedTokenA);
      const tokenB = caver.utils.toPeb(reservedTokenB);

      if (input2Value != "") {
        let result;
        if (tokenAAddress < tokenBAddress) {
          result = caver.utils.fromPeb(
            caver.utils
              .toBN(caver.utils.toPeb(input2Value))
              .mul(caver.utils.toBN(caver.utils.toPeb(tokenA)))
              .div(caver.utils.toBN(caver.utils.toPeb(tokenB)))
          );
        } else {
          result = caver.utils.fromPeb(
            caver.utils
              .toBN(caver.utils.toPeb(input2Value))
              .mul(caver.utils.toBN(caver.utils.toPeb(tokenB)))
              .div(caver.utils.toBN(caver.utils.toPeb(tokenA)))
          );
        }
        input1.current.value = parseFloat(Number(result).toFixed(6));
        setTokenAAmount(result);
        setTokenBAmount(input2Value);
        //getShareOfLP();
      } else {
        input1.current.value = "";
        setPrice("");
        setReversePrice("");
      }
    }
    getPrice();
  };

  const getInput2 = () => {
    if (pairAddress !== "0x0000000000000000000000000000000000000000") {
      const caver = new Caver(window.klaytn);
      const input1Value = input1.current.value;
      const tokenA = caver.utils.toPeb(reservedTokenA);
      const tokenB = caver.utils.toPeb(reservedTokenB);

      if (input1Value != "") {
        let result;
        if (tokenAAddress < tokenBAddress) {
          result = caver.utils.fromPeb(
            caver.utils
              .toBN(caver.utils.toPeb(input1Value))
              .mul(caver.utils.toBN(caver.utils.toPeb(tokenB)))
              .div(caver.utils.toBN(caver.utils.toPeb(tokenA)))
          );
        } else {
          result = caver.utils.fromPeb(
            caver.utils
              .toBN(caver.utils.toPeb(input1Value))
              .mul(caver.utils.toBN(caver.utils.toPeb(tokenA)))
              .div(caver.utils.toBN(caver.utils.toPeb(tokenB)))
          );
        }
        input2.current.value = parseFloat(Number(result).toFixed(6));
        setTokenBAmount(result);
        setTokenAAmount(input1Value);
        console.log(result);
        console.log(input1Value);
        //getShareOfLP();
      } else {
        input2.current.value = "";
        setPrice("");
        setReversePrice("");
      }
    }
    getPrice();
  };

  const addLiquidity = async () => {
    dispatch(pendingNoti());
    const caver = new Caver(window.klaytn);

    try {
      let kip7 = new caver.klay.KIP7(tokenAAddress);
      let allowed = await kip7.allowance(account, routerAddress);
      // 변경해야함
      // if allowed <= caver.utils.toPeb(input2.current.value)
      if (allowed.toString() === "0") {
        await kip7.approve(routerAddress, caver.utils.toPeb("100000000"), {
          from: account,
        });
      }
      kip7 = new caver.klay.KIP7(tokenBAddress);
      allowed = await kip7.allowance(account, routerAddress);
      // 변경해야함
      // if allowed <= caver.utils.toPeb(input2.current.value)
      if (allowed.toString() === "0") {
        await kip7.approve(routerAddress, caver.utils.toPeb("100000000"), {
          from: account,
        });
      }

      const router = new caver.klay.Contract(routerABI, routerAddress);
      const tokenAMinAmount = tokenAAmount * 0.99;
      const tokenBMinAmount = tokenBAmount * 0.99;
      await router.methods
        .addLiquidity(
          tokenAAddress,
          tokenBAddress,
          caver.utils.toPeb(tokenAAmount),
          caver.utils.toPeb(tokenBAmount),
          caver.utils.toPeb(tokenAMinAmount.toString()),
          caver.utils.toPeb(tokenBMinAmount.toString()),
          account
        )
        .send({
          from: account,
          gas: 2000000,
        });
      let pair;
      if (pairAddress === "0x0000000000000000000000000000000000000000") {
        const factory = new caver.klay.Contract(factoryABI, factoryAddress);
        const _pairAddress = await factory.methods.pairs(
          tokenAAddress,
          tokenBAddress
        );
        pair = new caver.klay.Contract(pairABI, _pairAddress);
      } else {
        pair = new caver.klay.Contract(pairABI, pairAddress);
      }
      const reserved = await pair.methods.getReserves().call();
      setReservedTokenA(caver.utils.fromPeb(reserved[0]));
      setReservedTokenB(caver.utils.fromPeb(reserved[1]));

      dispatch(
        successNoti({
          msg: `${Number(tokenAAmount).toFixed(2)} ${tokens[token0].symbol}
           와 ${Number(tokenBAmount).toFixed(2)} ${
            tokens[token1].symbol
          } 가 추가되었습니다!`,
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
      console.log(error);
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

  useEffect(() => {
    if (pairAddress !== "0x0000000000000000000000000000000000000000") {
      getToken0();
      getToken1();
    }
  }, [account, token0, token1]);

  useEffect(() => {
    getReserved();
  }, []);

  return (
    <>
      <InputContainer type='number'>
        <button
          onClick={() => {
            dispatch(openSubModal());
            setSelectedToken(0);
          }}
        >
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
      </SwapInfoContainer>

      <Button onClick={addLiquidity}>유동성 공급</Button>
    </>
  );
};

export default AddV2Liquidity;
