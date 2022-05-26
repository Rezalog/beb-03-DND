import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { updateBetting } from "../bettingSlice";

import {
  BetItem,
  BetTitle,
  BetInfo,
  BetButton,
} from "../../../styles/Betting.styled";
const Bet = ({ betting, currentTime }) => {
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

  const { address: account } = useSelector((state) => state.userInfo);

  const checkResult = (e) => {
    e.preventDefault();
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
  };

  useEffect(() => {
    setSuccessRate(Math.round((success / (success + fail)) * 100));
    setFailRate(Math.round((fail / (success + fail)) * 100));
    setEndTime(Number(startTime) + 6000);
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
        lvl.{lvl} 무기 강화 베팅! 남은시간: {remainingTime} 초
      </BetTitle>
      <BetInfo>
        <p className='txt'>성공</p>
        <p className='rate'>{successRate}</p>
        <p className='vs'>VS</p>
        <p className='rate'>{failRate}</p>
        <p className='txt'>실패</p>
      </BetInfo>
      {remainingTime > 0 ? (
        <BetButton>
          <button>성공</button>
          <input placeholder='0.0'></input>
          <button>실패</button>
        </BetButton>
      ) : !done ? (
        account.toLowerCase() === initiator.toLowerCase() ? (
          <BetButton>
            <button style={{ width: "100px" }} onClick={checkResult}>
              결과확인
            </button>
          </BetButton>
        ) : null
      ) : result ? (
        <p>성공!</p>
      ) : (
        <p>실패...</p>
      )}
    </BetItem>
  );
};

export default Bet;
