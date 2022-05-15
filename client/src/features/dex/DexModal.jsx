import React, { useState } from "react";
import Caver from "caver-js";
import { useDispatch, useSelector } from "react-redux";
import { closeDexModal } from "../modal/dexModalSlice";
import LiquidityPool from "./components/LiquidityPool";
import AddPool from "./components/AddPool";
import MyLiquidity from "./components/MyLiquidity";
import TokenSelectModal from "../tokenSwap/TokenSelectModal";

import { Modal, Container, Header, Button } from "../../styles/Modal.styled";
import { ModalCenter } from "../../styles/ModalCenter.styled";
import { DexNavbar } from "../../styles/DexNavbar.styled";
import { exchangeABI } from "../dex/contractInfo";
import { clearState } from "../tokenSwap/tokenSwapSlice";

const DexModal = () => {
  const dispatch = useDispatch();
  const { isSubModalOpen } = useSelector((state) => state.tokenSwap);
  const { exchanges } = useSelector((state) => state.dex);
  const [account, setAccount] = useState(null);
  const [currentNav, setCurrentNav] = useState(0);
  const [exchange, setExchange] = useState({});
  const [selectedToken, setSelectedToken] = useState(0);
  const [currentExchangeAddress, setCurrentExchangeAddress] = useState("");

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

  const setExchangeContract = (address) => {
    const caver = new Caver(window.klaytn);
    for (let i = 0; i < exchanges.length; i++) {
      if (exchanges[i].tokenAddress.toLowerCase() === address.toLowerCase()) {
        setExchange(new caver.klay.Contract(exchangeABI, exchanges[i].address));
        setCurrentExchangeAddress(exchanges[i].address);
      }
    }
  };

  return (
    <ModalCenter>
      {!isSubModalOpen && (
        <Modal>
          <Container>
            <Header>
              <h1>광산 (유동성)</h1>
              <button
                onClick={() => {
                  dispatch(closeDexModal());
                  dispatch(clearState());
                }}
              ></button>
            </Header>
            <button onClick={connectToWallet}>연결</button>
            <DexNavbar left={currentNav * 120}>
              <li onClick={() => setCurrentNav(0)}>나의 유동성</li>
              <li onClick={() => setCurrentNav(1)}>유동성 풀</li>
              <li onClick={() => setCurrentNav(2)}>풀 추가</li>
              <div></div>
            </DexNavbar>
            {currentNav == 0 && account ? (
              <MyLiquidity account={account} />
            ) : currentNav == 1 && account ? (
              <LiquidityPool
                account={account}
                setSelectedToken={setSelectedToken}
                setExchangeContract={setExchangeContract}
                exchange={exchange}
                currentExchangeAddress={currentExchangeAddress}
              />
            ) : currentNav == 2 && account ? (
              <AddPool account={account} />
            ) : null}
          </Container>
        </Modal>
      )}
      {isSubModalOpen && (
        <TokenSelectModal
          selectedToken={selectedToken}
          setExchangeContract={setExchangeContract}
        />
      )}
    </ModalCenter>
  );
};

export default DexModal;
