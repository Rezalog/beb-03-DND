import React, { useEffect, useState } from "react";
import Caver from "caver-js";

import { useSelector } from "react-redux";

import {
  LPContainer,
  LPHeader,
  Content,
} from "../../../styles/LPContainer.styled";
import {
  SwapInfoContainer,
  InfoContainer,
} from "../../../styles/TokenSwap.styled";
import { RewardContainer } from "../../../styles/Reward.styled";
import { Button } from "../../../styles/Modal.styled";

import { exchangeABI } from "../../dex/contractInfo";

const Farm = ({ address, name, tokenAddress }) => {
  const { address: account } = useSelector((state) => state.userInfo);
  const [showMore, setShowMore] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [locked, setLocked] = useState(0);
  const [exchange, setExchange] = useState(null);

  useEffect(() => {
    const caver = new Caver(window.klaytn);
    const _exchange = new caver.klay.Contract(exchangeABI, address);
    setExchange(_exchange);
  }, []);

  useEffect(() => {
    const intervalID = setInterval(async () => {
      if (exchange) {
        const reward = await exchange.methods
          .calculateYieldTotal(account)
          .call();
        console.log(reward);
      }
    }, 1000);

    return () => clearInterval(intervalID);
  }, [exchange]);

  useEffect(() => {
    setUnlocked(parseFloat(Number(tokenAmount * 0.05).toFixed(6)));
    setLocked(parseFloat(Number(tokenAmount * 0.95).toFixed(6)));
  }, [tokenAmount]);

  return (
    <LPContainer
      height={showMore ? 220 : 150}
      onClick={() => setShowMore(!showMore)}
    >
      <Content>
        <LPHeader scale={showMore ? -1 : 1}>
          <div>
            <h2>{name}</h2>
          </div>
          <Button
            style={{
              width: "60px",
              height: "30px",
              top: "5px",
              right: "50px",
              fontSize: "1rem",
            }}
          >
            Claim
          </Button>
          <img src='assets/arrowDown.png'></img>
        </LPHeader>
        <SwapInfoContainer style={{ width: "30%", marginTop: "0px" }}>
          <InfoContainer>
            <h2>보상</h2>
            <h2>{tokenAmount}</h2>
          </InfoContainer>
          <InfoContainer>
            <span>Unlocked</span>
            <span>{unlocked}</span>
          </InfoContainer>
          <InfoContainer>
            <span>Locked</span>
            <span>{locked}</span>
          </InfoContainer>
        </SwapInfoContainer>
        <Button style={{ width: "175px", bottom: "-100px", left: "5px" }}>
          Stake
        </Button>
        <Button style={{ width: "175px", bottom: "-100px", right: "5px" }}>
          Unstake
        </Button>
      </Content>
    </LPContainer>
  );
};

export default Farm;
