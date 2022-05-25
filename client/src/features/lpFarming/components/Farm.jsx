import React, { useEffect, useState } from "react";
import Caver from "caver-js";

import { useDispatch, useSelector } from "react-redux";

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
import {
  pendingNoti,
  successNoti,
  failNoti,
  clearState,
} from "../../notification/notifiactionSlice";

const Farm = ({ address, name, tokenAddress }) => {
  const dispatch = useDispatch();
  const { address: account } = useSelector((state) => state.userInfo);
  const [showMore, setShowMore] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [locked, setLocked] = useState(0);
  const [exchange, setExchange] = useState(null);
  const [percentage, setPercentage] = useState(95);

  const stakeLPToken = async (e) => {
    e.preventDefault();
    dispatch(pendingNoti());
    const caver = new Caver(window.klaytn);
    try {
      const kip7 = new caver.klay.KIP7(address);
      const allowed = await kip7.allowance(account, address);
      // 변경해야함
      // if allowed <= caver.utils.toPeb(input2.current.value)
      if (allowed.toString() === "0") {
        await kip7.approve(address, caver.utils.toPeb("100000000"), {
          from: account,
        });
      }
      const balance = await exchange.methods.balanceOf(account).call();
      await exchange.methods.stake(balance).send({
        from: account,
        gas: 200000,
      });

      dispatch(
        successNoti({
          msg: `${Number(caver.utils.fromPeb(balance).toString()).toFixed(
            2
          )} LP 스테이킹 성공!`,
        })
      );
    } catch (error) {
      dispatch(failNoti);
    }
    setTimeout(() => {
      dispatch(clearState());
    }, 5000);
  };

  const getYieldReward = async () => {
    const caver = new Caver(window.klaytn);
    let _exchange = exchange;
    if (!exchange) {
      _exchange = new caver.klay.Contract(exchangeABI, address);
      setExchange(_exchange);
    }
    const lpBalanceOfExchange = await _exchange.methods
      .balanceOf(address)
      .call();
    if (lpBalanceOfExchange !== "0") {
      const reward = await _exchange.methods
        .calculateYieldTotal(account)
        .call();
      const _percentage = await _exchange.methods
        .currentLockedPercentage()
        .call();
      setPercentage(_percentage);
      setTokenAmount(Number(caver.utils.fromPeb(reward)).toString());
    }
  };

  useEffect(() => {
    getYieldReward();
  }, []);

  useEffect(() => {
    const intervalID = setInterval(async () => {
      getYieldReward();
    }, 20000);

    return () => clearInterval(intervalID);
  }, [exchange]);

  useEffect(() => {
    setUnlocked(
      parseFloat(Number(tokenAmount * ((100 - percentage) / 100)).toFixed(6))
    );
    setLocked(parseFloat(Number(tokenAmount * (percentage / 100)).toFixed(6)));
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
        <SwapInfoContainer style={{ width: "50%", marginTop: "0px" }}>
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
        <Button
          style={{ width: "175px", bottom: "-100px", left: "5px" }}
          onClick={stakeLPToken}
        >
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
