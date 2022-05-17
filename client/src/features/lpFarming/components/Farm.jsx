import React, { useEffect, useState } from "react";

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

const Farm = ({ address, name, tokenAddress }) => {
  const { address: account } = useSelector((state) => state.userInfo);
  const [showMore, setShowMore] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [locked, setLocked] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setTokenAmount((prev) => prev + 1);
    }, 1000);
  }, []);

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
