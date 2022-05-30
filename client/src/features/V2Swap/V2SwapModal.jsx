import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Caver from "caver-js";
import axios from "axios";
import { closeV2SwapModal } from "../modal/v2SwapModalSlice";
import TokenSelectModal from "./V2TokenSelectModal";
import { openSubModal, changeToken0, changeToken1 } from "./v2SwapSlice";
import { startLoading, stopLoading } from "../loading/loadingSlice";
import {
  Modal,
  Container,
  Header,
  Button,
  UpDownButton,
} from "../../styles/Modal.styled";
import { ModalCenter } from "../../styles/ModalCenter.styled";
import {
  InputContainer,
  BalanceContainer,
} from "../../styles/InputContainer.styled";
import {
  SwapInfoContainer,
  InfoContainer,
} from "../../styles/TokenSwap.styled";
//import { factoryABI, factoryAddress, exchangeABI } from "../dex/contractInfo";
import {
  routerABI,
  routerAddress,
  factoryABI,
  factoryAddress,
} from "./v2Contract";

import {
  pendingNoti,
  successNoti,
  failNoti,
  clearState,
} from "../notification/notifiactionSlice";
import { uruABI, uruAddress } from "../userinfo/TokenContract";
import { updateBalance } from "../userinfo/userInfoSlice";
import { initTokenList } from "./v2SwapSlice";
import { initV2Exchange } from "../v2dex/V2DexSlice";

const V2SwapModal = () => {
  const dispatch = useDispatch();
  const { isSubModalOpen, tokens, token0, token1 } = useSelector(
    (state) => state.v2Swap
  );
  const { address: account } = useSelector((state) => state.userInfo);
  const { exchanges } = useSelector((state) => state.dex);
  const [balance, setBalance] = useState(0);
  const [balance1, setBalance1] = useState(0);
  const [selectedToken, setSelectedToken] = useState(0);
  const token0InputRef = useRef(null);
  const token1InputRef = useRef(null);
  const [exchange, setExchange] = useState({});
  const [minOutput, setMinOutput] = useState(0);
  const [price, setPrice] = useState("");
  const [inputTokenAddress, setInputTokenAddress] = useState("");
  const [outputTokenAddress, setOutputTokenAddress] = useState("");
  const [swapPath, setSwapPath] = useState([]);

  // DFS를 이용해서 토큰 Path 찾기
  const getPath = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const caver = new Caver(window.klaytn);
        const factory = new caver.klay.Contract(factoryABI, factoryAddress);
        const visited = Array(tokens.length).fill(false);
        let stacks = [];
        stacks.push({ token: token0, path: [tokens[token0].address] });
        visited[token0] = true;
        let result = [];
        while (stacks.length) {
          const next = stacks.pop();
          const pairAddress = await factory.methods
            .pairs(tokens[next.token].address, tokens[token1].address)
            .call();
          if (pairAddress !== "0x0000000000000000000000000000000000000000") {
            result = [...next.path, tokens[token1].address];
            break;
          }

          for (let i = 0; i < visited.length; i++) {
            if (!visited[i]) {
              stacks.push({
                token: i,
                path: [...next.path, tokens[i].address],
              });
              visited[i] = true;
            }
          }
        }
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  };
  /*
   * 현재 보유중인 전체 수량을 input으로 넣어준다.
   */
  const inputMaxToken = () => {
    token0InputRef.current.value = balance;
    getOutputAmount();
  };

  /*
   *
   */
  const getOutputAmount = async () => {
    const path = await getPath();
    setSwapPath(path);
    const caver = new Caver(window.klaytn);
    const input = token0InputRef.current.value || 0;
    // input field가 비어있는지 확인하고
    // 비어있지 않으면 블록체인에서 output amount를 가져온다.
    // 비어있다면 초기화한다.
    // path가 존재할 때만 output을 가져온다.
    if (input > 0 && path.length) {
      const router = new caver.klay.Contract(routerABI, routerAddress);
      const output = await router.methods
        .getOutput(caver.utils.toPeb(input), [...path])
        .call();
      token1InputRef.current.value = Number(
        caver.utils.fromPeb(output[output.length - 1])
      ).toFixed(6);
      setMinOutput(caver.utils.fromPeb(output[output.length - 1]) * 0.99);
    } else {
      token1InputRef.current.value = "";
      setMinOutput(0);
    }
    getPrice();
  };

  /*
   * 클레이와 토큰을 교환한다.
   */
  const swapToken = async () => {
    dispatch(pendingNoti());

    const caver = new Caver(window.klaytn);
    const token1Address = tokens[token0].address;
    const token2Address = tokens[token1].address;
    const kip7 = new caver.klay.KIP7(token1Address);

    const allowed = await kip7.allowance(account, routerAddress);
    // allowed가 적을경우에 approve 다시한다.
    if (allowed.toString() === "0") {
      try {
        await kip7.approve(routerAddress, caver.utils.toPeb("100000000"), {
          from: account,
        });
      } catch (err) {
        dispatch(failNoti());
      }
    }
    try {
      const router = new caver.klay.Contract(routerABI, routerAddress);

      const input = token0InputRef.current.value;
      await router.methods
        .swapExactTokensForTokens(
          caver.utils.toPeb(input),
          caver.utils.toPeb(minOutput.toString()),
          [...swapPath],
          account
        )
        .send({ from: account, gas: 20000000 });
      dispatch(stopLoading());
      if (tokens[token1].symbol === "URU") {
        const tokenAdded = localStorage.getItem("tokenAdded");
        if (!tokenAdded) {
          window.klaytn.sendAsync(
            {
              method: "wallet_watchAsset",
              params: {
                type: "ERC20", // Initially only supports ERC20, but eventually more!
                options: {
                  address: tokens[token1].address, // The address that the token is at.
                  symbol: tokens[token1].symbol, // A ticker symbol or shorthand, up to 5 chars.
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
          localStorage.setItem("tokenAdded", "true");
        }
      }
      getToken0();
      getToken1();
      token0InputRef.current.value = 0;
      token1InputRef.current.value = 0;
      dispatch(
        successNoti({
          msg: `최소 ${Number(minOutput).toFixed(6)} ${
            tokens[token1].symbol
          }을 받았습니다!`,
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

  const getToken0 = async () => {
    const caver = new Caver(window.klaytn);
    const address = tokens[token0].address;
    const kip7 = new caver.klay.KIP7(address);
    const _balance = await kip7.balanceOf(account);
    setBalance(caver.utils.fromPeb(_balance));
    //getExchangeContract(address);
    setInputTokenAddress(address);
  };

  const getToken1 = async () => {
    const caver = new Caver(window.klaytn);
    const address = tokens[token1].address;
    const kip7 = new caver.klay.KIP7(address);
    const _balance = await kip7.balanceOf(account);
    setBalance1(caver.utils.fromPeb(_balance));
    setOutputTokenAddress(address);
  };

  const getPrice = () => {
    const t0 = token0InputRef.current.value;
    const t1 = token1InputRef.current.value;
    if (t0 === "" || t1 === "") {
      setPrice("");
    } else {
      setPrice(parseFloat((Number(t1) / Number(t0)).toFixed(6)));
    }
  };

  const swapToken0AndToken1 = () => {
    const currentToken0 = token0;
    const currentToken1 = token1;
    const currentToken1Value = token1InputRef.current.value;
    token1InputRef.current.value = token0InputRef.current.value;
    token0InputRef.current.value = currentToken1Value;
    getPrice();
    dispatch(changeToken0({ index: currentToken1 }));
    dispatch(changeToken1({ index: currentToken0 }));
  };

  const getTokenList = async () => {
    const response = await axios.get(
      "http://localhost:8080/contracts/v2token",
      {}
    );
    const tokenList = response.data.map((token) => {
      return {
        symbol: token.token_symbol,
        name: token.token_name,
        address: token.token_address,
      };
    });
    dispatch(initTokenList({ list: tokenList }));
  };

  const getExchangeList = async () => {
    const response = await axios.get(
      "http://localhost:8080/contracts/v2pair",
      {}
    );
    const exchangeList = response.data.map((token) => {
      return {
        address: token.v2pair_address,
        name: token.v2pair_name,
        tokenAddress1: token.v2tokenA_address,
        tokenAddress2: token.v2tokenB_address,
      };
    });
    dispatch(initV2Exchange({ list: exchangeList }));
  };

  useEffect(() => {
    getTokenList();
    getExchangeList();
  }, []);

  useEffect(() => {
    if (tokens.length) {
      getToken0();
      getToken1();
    }
  }, [account, token0, token1]);

  return (
    <ModalCenter>
      {!isSubModalOpen && (
        <Modal>
          <Container>
            <Header>
              <h1>토큰 교환</h1>
              <button
                onClick={() => {
                  dispatch(closeV2SwapModal());
                  //dispatch(clearState());
                }}
              ></button>
            </Header>
            <InputContainer type='number'>
              <button
                onClick={() => {
                  dispatch(openSubModal());
                  setSelectedToken(0);
                }}
              >
                {tokens[token0]?.symbol}
                <img src='assets/arrowDown.png' />
              </button>
              <input
                placeholder='0.0'
                ref={token0InputRef}
                onChange={getOutputAmount}
              />
              <BalanceContainer>
                <div onClick={inputMaxToken}>Max</div>
                <span>
                  잔액: {parseFloat(Number(balance).toFixed(2))}{" "}
                  {tokens[token0]?.symbol}
                </span>
              </BalanceContainer>
            </InputContainer>
            <UpDownButton onClick={swapToken0AndToken1}></UpDownButton>
            <InputContainer type='number'>
              <button
                onClick={() => {
                  dispatch(openSubModal());
                  setSelectedToken(1);
                }}
              >
                {tokens[token1]?.symbol}
                <img src='assets/arrowDown.png' />
              </button>
              <input placeholder='0.0' disabled ref={token1InputRef} />

              <BalanceContainer>
                <span>
                  잔액:{" "}
                  {token1 < 0
                    ? "0.0"
                    : `${parseFloat(Number(balance1).toFixed(2))} ${
                        tokens[token1]?.symbol
                      }`}
                </span>
              </BalanceContainer>
            </InputContainer>
            <SwapInfoContainer>
              {price && (
                <InfoContainer>
                  <span>가격</span>
                  <span>
                    {price} {tokens[token1]?.symbol} per{" "}
                    {tokens[token0]?.symbol}{" "}
                  </span>
                </InfoContainer>
              )}
              <InfoContainer>
                <span>Slippage 허용</span>
                <span>1%</span>
              </InfoContainer>
              <InfoContainer>
                <span>최소 수령</span>
                <span>{parseFloat(minOutput.toFixed(6))}</span>
              </InfoContainer>
            </SwapInfoContainer>
            <Button onClick={swapToken}>교환</Button>
          </Container>
        </Modal>
      )}
      {isSubModalOpen && <TokenSelectModal selectedToken={selectedToken} />}
    </ModalCenter>
  );
};

export default V2SwapModal;
