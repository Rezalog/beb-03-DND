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
import { Button } from "../../../styles/Modal.styled";

import { exchangeABI } from "../../dex/contractInfo";
import {
  pendingNoti,
  successNoti,
  failNoti,
  clearState,
} from "../../notification/notifiactionSlice";
import { updateBalance } from "../../userinfo/userInfoSlice";
import { uruAddress, uruABI } from "../../userinfo/TokenContract";
import { masterABI, masterAddrss } from "../masterContractInfo";

const Farm = ({ address, name, pid, tokenAddress }) => {
  const dispatch = useDispatch();
  const { address: account } = useSelector((state) => state.userInfo);
  const [showMore, setShowMore] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [locked, setLocked] = useState(0);
  const [percentage, setPercentage] = useState(95);
  const [totalStaked, setTotalStaked] = useState(0);

  const stakeLPToken = async (e) => {
    e.preventDefault();
    dispatch(pendingNoti());
    const caver = new Caver(window.klaytn);
    const master = new caver.klay.Contract(masterABI, masterAddrss);
    try {
      const exchange = new caver.klay.Contract(exchangeABI, address);
      const allowed = await exchange.methods
        .allowance(account, masterAddrss)
        .call();
      // 변경해야함
      // if allowed <= caver.utils.toPeb(input2.current.value)
      if (allowed.toString() === "0") {
        await exchange.methods
          .approve(masterAddrss, caver.utils.toPeb("100000000"))
          .send({
            from: account,
            gas: 200000,
          });
      }
      const balance = await exchange.methods.balanceOf(account).call();
      await master.methods.deposit(pid, balance).send({
        from: account,
        gas: 2000000,
      });

      dispatch(
        successNoti({
          msg: `${Number(caver.utils.fromPeb(balance).toString()).toFixed(
            2
          )} LP 스테이킹 성공!`,
        })
      );
      getTotalStaked();
      getYieldReward();
    } catch (error) {
      console.log(error);
      dispatch(failNoti());
    }
    setTimeout(() => {
      dispatch(clearState());
    }, 5000);
  };

  const unStakeLPToken = async (e) => {
    e.preventDefault();
    dispatch(pendingNoti());
    const caver = new Caver(window.klaytn);
    const master = new caver.klay.Contract(masterABI, masterAddrss);
    try {
      await master.methods.withdraw(pid, caver.utils.toPeb(totalStaked)).send({
        from: account,
        gas: 400000,
      });

      dispatch(
        successNoti({
          msg: `LP 언스테이킹 성공!`,
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
      getTotalStaked();
      getYieldReward();
    } catch (error) {
      dispatch(failNoti());
    }
    setTimeout(() => {
      dispatch(clearState());
    }, 5000);
  };

  const claimReward = async (e) => {
    e.preventDefault();
    dispatch(pendingNoti());
    const caver = new Caver(window.klaytn);
    const master = new caver.klay.Contract(masterABI, masterAddrss);
    try {
      await master.methods.harvest(pid).send({
        from: account,
        gas: 200000,
      });

      dispatch(
        successNoti({
          msg: `${unlocked} URU 획득 성공!`,
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
      getTotalStaked();
      getYieldReward();
    } catch (error) {
      dispatch(failNoti());
    }
    setTimeout(() => {
      dispatch(clearState());
    }, 5000);
  };

  const getYieldReward = async () => {
    const caver = new Caver(window.klaytn);
    // let _exchange = exchange;
    // if (!exchange) {
    //   _exchange = new caver.klay.Contract(masterABI, masterAddrss);
    //   setMaster(master);
    // }
    const master = new caver.klay.Contract(masterABI, masterAddrss);
    const currentReward = await master.methods
      .calculateCurrentReward(pid, account)
      .call();
    const reward = await master.methods.calculateReward(pid, account).call();
    const totalReward =
      Number(caver.utils.fromPeb(currentReward)) +
      Number(caver.utils.fromPeb(reward));
    const _percentage = await master.methods.currentLockedPercentage().call();
    setPercentage(_percentage);
    setTokenAmount(totalReward);
    // if (lpBalanceOfExchange !== "0") {
    //   const reward = await _exchange.methods
    //     .calculateYieldTotal(account)
    //     .call();
    //   const _percentage = await _exchange.methods
    //     .currentLockedPercentage()
    //     .call();
    //   setPercentage(_percentage);
    //   setTokenAmount(Number(reward).toString());
    // }
  };

  const getTotalStaked = async () => {
    const caver = new Caver(window.klaytn);
    const master = new caver.klay.Contract(masterABI, masterAddrss);
    const userinfo = await master.methods.userInfo(pid, account).call();
    const staked = userinfo.amount;
    setTotalStaked(caver.utils.fromPeb(staked));
  };

  useEffect(() => {
    getTotalStaked();
    getYieldReward();
  }, []);

  useEffect(() => {
    const intervalID = setInterval(async () => {
      getTotalStaked();
      getYieldReward();
    }, 20000);
    return () => clearInterval(intervalID);
  }, []);

  useEffect(() => {
    setUnlocked(
      parseFloat(Number(tokenAmount * ((100 - percentage) / 100)).toFixed(6))
    );
    setLocked(parseFloat(Number(tokenAmount * (percentage / 100)).toFixed(6)));
  }, [tokenAmount]);

  return (
    <LPContainer
      height={showMore ? 240 : 150}
      onClick={() => setShowMore(!showMore)}
    >
      <Content>
        <LPHeader scale={showMore ? -1 : 1}>
          <div>
            <h2>{name}</h2> 예치된 LP:{" "}
            {parseFloat(Number(totalStaked).toFixed(2))}
          </div>
          <Button
            style={{
              width: "60px",
              height: "30px",
              top: "5px",
              right: "50px",
              fontSize: "1rem",
            }}
            onClick={claimReward}
          >
            Claim
          </Button>
          <img src='assets/arrowDown.png'></img>
        </LPHeader>
        <SwapInfoContainer style={{ width: "70%", marginTop: "0px" }}>
          <InfoContainer>
            <h2>보상</h2>
            <h2>{tokenAmount} URU</h2>
          </InfoContainer>
          <InfoContainer>
            <span>Unlocked</span>
            <span>{unlocked} URU</span>
          </InfoContainer>
          <InfoContainer>
            <span>Locked</span>
            <span>{locked} URU</span>
          </InfoContainer>
        </SwapInfoContainer>
        <Button
          style={{ width: "175px", bottom: "-100px", left: "5px" }}
          onClick={stakeLPToken}
        >
          Stake
        </Button>
        <Button
          style={{ width: "175px", bottom: "-100px", right: "5px" }}
          onClick={unStakeLPToken}
        >
          Unstake
        </Button>
      </Content>
    </LPContainer>
  );
};

export default Farm;
