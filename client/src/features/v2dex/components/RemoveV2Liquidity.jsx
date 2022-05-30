import React, { useState, useEffect, useRef } from "react";
import Caver from "caver-js";
import { useDispatch } from "react-redux";

import {
  InputContainer,
  BalanceContainer,
} from "../../../styles/InputContainer.styled";
import { Button, BackButton } from "../../../styles/Modal.styled";
import { pairABI } from "../../V2Swap/v2Contract";
import {
  pendingNoti,
  successNoti,
  failNoti,
  clearState,
} from "../../notification/notifiactionSlice";
import { routerABI, routerAddress } from "../../V2Swap/v2Contract";

const RemoveV2Liquidity = ({
  account,
  selectedExchange,
  setIsWithdrawal,
  selectedTokenA,
  selectedTokenB,
}) => {
  const dispatch = useDispatch();
  const removeLp = useRef(null);
  const [lp, setLp] = useState(0);
  const [reservedTokenA, setReservedTokenA] = useState(0);
  const [reservedTokenB, setReservedTokenB] = useState(0);

  useEffect(() => {
    const getOwnedLP = async () => {
      const caver = new Caver(window.klaytn);

      const kip7 = new caver.klay.KIP7(selectedExchange);
      const balance = await kip7.balanceOf(account);
      setLp(caver.utils.fromPeb(balance));
    };

    const getReserved = async () => {
      const caver = new Caver(window.klaytn);
      const pair = new caver.klay.Contract(pairABI, selectedExchange);
      const reserved = await pair.methods.getReserves().call();
      setReservedTokenA(caver.utils.fromPeb(reserved[0]));
      setReservedTokenB(caver.utils.fromPeb(reserved[1]));
    };

    getOwnedLP();
    getReserved();
  }, []);

  const removeLiquidity = async () => {
    dispatch(pendingNoti());
    const caver = new Caver(window.klaytn);
    try {
      const router = new caver.klay.Contract(routerABI, routerAddress);
      const kip7 = new caver.klay.KIP7(selectedExchange);
      const allowed = await kip7.allowance(account, routerAddress);
      if (allowed.toString() === "0") {
        await kip7.approve(routerAddress, caver.utils.toPeb("100000000"), {
          from: account,
        });
      }
      await router.methods
        .removeLiquidity(
          selectedTokenA,
          selectedTokenB,
          caver.utils.toPeb(removeLp.current.value),
          caver.utils.toPeb(
            ((reservedTokenA * removeLp.current.value * 0.95) / lp).toString()
          ),
          caver.utils.toPeb(
            ((reservedTokenB * removeLp.current.value * 0.95) / lp).toString()
          ),
          account
        )
        .send({
          from: account,
          gas: 2000000,
        });

      const balance = await kip7.balanceOf(account);

      setLp(caver.utils.fromPeb(balance));
      dispatch(successNoti({ msg: `성공적으로 출금되었습니다!` }));
    } catch (error) {
      console.log(error);
      dispatch(failNoti());
    }
    setTimeout(() => {
      dispatch(clearState());
    }, 5000);
  };

  return (
    <>
      <BackButton onClick={() => setIsWithdrawal(false)}></BackButton>
      <InputContainer type='number' style={{ marginTop: "70px" }}>
        <input placeholder='0.0' ref={removeLp} />
        <BalanceContainer>
          <span>잔액: {lp}</span>
        </BalanceContainer>
      </InputContainer>
      <Button onClick={removeLiquidity}>출금하기</Button>
    </>
  );
};

export default RemoveV2Liquidity;
