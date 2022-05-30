import React, { useEffect, useState } from "react";
import Caver from "caver-js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { closeDexModal } from "../modal/dexModalSlice";
import { closeV2DexModal } from "../modal/v2DexModalSlice";
import AddV2Liquidity from "./components/AddV2Liquidity";
import AddV2Pool from "./components/AddV2Pool";
import MyV2Liquidity from "./components/MyV2Liquidity";
import V2TokenSelectModal from "../V2Swap/V2TokenSelectModal";

import { Modal, Container, Header, Button } from "../../styles/Modal.styled";
import { ModalCenter } from "../../styles/ModalCenter.styled";
import { DexNavbar } from "../../styles/DexNavbar.styled";
import { exchangeABI } from "../dex/contractInfo";
import { initTokenList, clearState } from "../V2Swap/v2SwapSlice";
import { initV2Exchange } from "./V2DexSlice";

const V2DexModal = () => {
  const dispatch = useDispatch();
  const { isSubModalOpen } = useSelector((state) => state.v2Swap);
  const { exchanges } = useSelector((state) => state.dex);
  const { address: account } = useSelector((state) => state.userInfo);
  const [currentNav, setCurrentNav] = useState(0);
  const [exchange, setExchange] = useState({});
  const [selectedToken, setSelectedToken] = useState(0);
  const [currentExchangeAddress, setCurrentExchangeAddress] = useState("");

  const getExchangeContract = (address) => {
    const caver = new Caver(window.klaytn);
    for (let i = 0; i < exchanges.length; i++) {
      if (exchanges[i].tokenAddress.toLowerCase() === address.toLowerCase()) {
        setExchange(new caver.klay.Contract(exchangeABI, exchanges[i].address));
        setCurrentExchangeAddress(exchanges[i].address);
      }
    }
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
    if (currentNav === 0) {
      getTokenList();
      getExchangeList();
    }
  }, [currentNav]);

  return (
    <ModalCenter>
      {!isSubModalOpen && (
        <Modal height={"750px"}>
          <Container height={"750px"}>
            <Header>
              <h1>광산 (유동성)</h1>
              <button
                onClick={() => {
                  dispatch(closeV2DexModal());
                  dispatch(clearState());
                }}
              ></button>
            </Header>
            <DexNavbar left={currentNav * 180} width={180}>
              <li onClick={() => setCurrentNav(0)}>나의 유동성</li>
              <li onClick={() => setCurrentNav(1)}>유동성 풀</li>
              <div></div>
            </DexNavbar>
            {currentNav == 0 && account ? (
              <MyV2Liquidity account={account} />
            ) : currentNav == 1 && account ? (
              <AddV2Liquidity
                account={account}
                setSelectedToken={setSelectedToken}
                getExchangeContract={getExchangeContract}
                exchange={exchange}
                currentExchangeAddress={currentExchangeAddress}
                setCurrentNav={setCurrentNav}
              />
            ) : null}
          </Container>
        </Modal>
      )}
      {isSubModalOpen && (
        <V2TokenSelectModal
          selectedToken={selectedToken}
          getExchangeContract={getExchangeContract}
        />
      )}
    </ModalCenter>
  );
};

export default V2DexModal;
