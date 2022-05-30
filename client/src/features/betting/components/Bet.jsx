import React, { useEffect, useState, useRef } from "react";
import Caver from "caver-js";

import { useDispatch, useSelector } from "react-redux";
import { updateBetting } from "../bettingSlice";

import {
  BetItem,
  BetTitle,
  BetInfo,
  BetButton,
} from "../../../styles/Betting.styled";

import {
  pendingNoti,
  successNoti,
  failNoti,
  clearState,
} from "../../notification/notifiactionSlice";
import { bettingABI, bettingAddress } from "../bettingContractInfo";
import { uruAddress, uruABI } from "../../userinfo/TokenContract";
import { updateBalance } from "../../userinfo/userInfoSlice";

const Bet = ({ betting, currentTime, getBettings }) => {
  const dispatch = useDispatch();
  const {
    id,
    lvl,
    initiator,
    token1Id,
    token2Id,
    success,
    fail,
    startTime,
    result,
    done,
  } = betting;
  const [successRate, setSuccessRate] = useState(0);
  const [failRate, setFailRate] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");
  const [successReward, setSuccessReward] = useState(0);
  const [failReward, setFailReward] = useState(0);
  const [betSide, setBetSide] = useState(false);
  const [isBet, setIsBet] = useState(false);

  const { address: account } = useSelector((state) => state.userInfo);
  const betAmount = useRef(null);

  const checkResult = async (e) => {
    e.preventDefault();
    dispatch(pendingNoti());
    try {
      const caver = new Caver(window.klaytn);
      const bettingContract = new caver.klay.Contract(
        bettingABI,
        bettingAddress
      );

      await bettingContract.methods.distribution(id).send({
        from: account,
        gas: 2000000,
      });

      dispatch(
        successNoti({
          msg: `베팅 완료!`,
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
      dispatch(
        updateBetting({
          betting: {
            id,
            lvl,
            initiator,
            token1Id,
            token2Id,
            success,
            fail,
            startTime,
            result,
            done: true,
          },
        })
      );
      getBettings();
    } catch (error) {
      dispatch(failNoti());
    }
    setTimeout(() => {
      dispatch(clearState());
    }, 5000);
  };

  const placeBet = async (side) => {
    dispatch(pendingNoti());
    try {
      const caver = new Caver(window.klaytn);
      const bettingAmount = caver.utils.toPeb(betAmount.current.value);
      const kip7 = new caver.klay.KIP7(uruAddress);
      const allowed = await kip7.allowance(account, bettingAddress);
      // 변경해야함
      // if allowed <= caver.utils.toPeb(input2.current.value)
      if (allowed.toString() === "0") {
        await kip7.approve(bettingAddress, caver.utils.toPeb("100000000"), {
          from: account,
        });
      }

      const bettingContract = new caver.klay.Contract(
        bettingABI,
        bettingAddress
      );

      await bettingContract.methods.bet(bettingAmount, side, id).send({
        from: account,
        gas: 2000000,
      });

      dispatch(
        successNoti({
          msg: `${betAmount.current.value} URU를 베팅!`,
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
      getBettings();
    } catch (error) {
      dispatch(failNoti());
    }
    setTimeout(() => {
      dispatch(clearState());
    }, 5000);
  };

  const getCurrentWinningReward = async () => {
    const caver = new Caver(window.klaytn);
    const bettingContract = new caver.klay.Contract(bettingABI, bettingAddress);

    const userInfo = await bettingContract.methods.userInfo(id, account).call();
    const side = userInfo.side;
    setBetSide(side);
    setIsBet(userInfo.isBet);
    if (userInfo.isBet) {
      if (success === "0" || fail === "0") {
        const amount = userInfo.amount;
        if (side) {
          setSuccessReward(
            parseFloat(Number(caver.utils.fromPeb(amount)).toFixed(6))
          );
        } else {
          setFailReward(
            parseFloat(Number(caver.utils.fromPeb(amount)).toFixed(6))
          );
        }
      } else {
        if (side) {
          const rewardSuccess = await bettingContract.methods
            .calculateRewardSuccees(id, account)
            .call();
          setSuccessReward(
            parseFloat(Number(caver.utils.fromPeb(rewardSuccess)).toFixed(6))
          );
        } else {
          const rewardFail = await bettingContract.methods
            .calculateRewardFailure(id, account)
            .call();
          setFailReward(
            parseFloat(Number(caver.utils.fromPeb(rewardFail)).toFixed(6))
          );
        }
      }
    }
  };

  useEffect(() => {
    const caver = new Caver(window.klaytn);

    if (success === "0" && fail === "0") {
      setSuccessRate(0);
      setFailRate(0);
    } else {
      setSuccessRate(
        Math.round(
          Number(
            (caver.utils.fromPeb(success) /
              caver.utils.fromPeb(
                caver.utils.toBN(success).add(caver.utils.toBN(fail))
              )) *
              100
          )
        )
      );

      setFailRate(
        Math.round(
          Number(
            (caver.utils.fromPeb(fail) /
              caver.utils.fromPeb(
                caver.utils.toBN(fail).add(caver.utils.toBN(success))
              )) *
              100
          )
        )
      );
    }
    setEndTime(Number(startTime) + 120);
    getCurrentWinningReward();
  }, []);

  useEffect(() => {
    if (currentTime === "" || endTime === 0) {
      setRemainingTime("");
    } else {
      setRemainingTime(endTime - currentTime >= 0 ? endTime - currentTime : 0);
    }
  }, [currentTime]);

  return (
    <BetItem>
      <BetTitle>
        lvl.{lvl} 무기 강화 배팅!{" "}
        <span style={{ marginLeft: "50px", fontSize: "1rem" }}>
          남은시간: {remainingTime} 초
        </span>
      </BetTitle>
      <BetInfo>
        <p className='txt'>성공</p>
        <p className='rate'>{successRate}</p>
        <p className='vs'>VS</p>
        <p className='rate'>{failRate}</p>
        <p className='txt'>실패</p>
      </BetInfo>
      {remainingTime > 0 && !isBet ? (
        <BetButton>
          <button onClick={() => placeBet(true)}>성공</button>
          <input placeholder='0.0' ref={betAmount}></input>
          <button onClick={() => placeBet(false)}>실패</button>
        </BetButton>
      ) : !done ? (
        account.toLowerCase() === initiator.toLowerCase() ? (
          <BetButton>
            <button style={{ width: "100px" }} onClick={checkResult}>
              결과확인
            </button>
          </BetButton>
        ) : successReward === 0 && failReward === 0 ? null : betSide ? (
          <p>강화 성공에 배팅했습니다. 결과를 기다려주세요!</p>
        ) : (
          <p>강화 실패에 배팅했습니다. 결과를 기다려주세요!</p>
        )
      ) : successReward === 0 && failReward === 0 ? null : result ===
        betSide ? (
        <p>배팅 성공! (지급완료)</p>
      ) : (
        <p>배팅 실패...</p>
      )}
      {successReward === 0 && failReward === 0 ? null : (
        <p>배팅 성공 시 {betSide ? successReward : failReward} URU 획득!</p>
      )}
    </BetItem>
  );
};

export default Bet;
