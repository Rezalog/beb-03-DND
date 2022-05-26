import React, { useState, useEffect, useRef } from "react";
import Caver from "caver-js";
import { useDispatch } from "react-redux";

import {
  InputContainer,
  BalanceContainer,
} from "../../../styles/InputContainer.styled";
import { Button, BackButton } from "../../../styles/Modal.styled";
import { exchangeABI } from "../contractInfo";
import {
  pendingNoti,
  successNoti,
  failNoti,
  clearState,
} from "../../notification/notifiactionSlice";
import { uruABI, uruAddress } from "../../userinfo/TokenContract";
import { updateBalance } from "../../userinfo/userInfoSlice";

const RemoveLiquidity = ({ account, selectedExchange, setIsWithdrawal }) => {
  const dispatch = useDispatch();
  const removeLp = useRef(null);
  const [lp, setLp] = useState(0);

  useEffect(() => {
    const getOwnedLP = async () => {
      const caver = new Caver(window.klaytn);

      const kip7 = new caver.klay.KIP7(selectedExchange);
      const balance = await kip7.balanceOf(account);
      setLp(caver.utils.fromPeb(balance));
    };

    getOwnedLP();
  }, []);

  const removeLiquidity = async () => {
    dispatch(pendingNoti());
    const caver = new Caver(window.klaytn);
    try {
      const exchange = new caver.klay.Contract(exchangeABI, selectedExchange);

      const kip7 = new caver.klay.KIP7(selectedExchange);
      const allowed = await kip7.allowance(account, selectedExchange);
      if (allowed.toString() === "0") {
        await kip7.approve(selectedExchange, caver.utils.toPeb("100000000"), {
          from: account,
        });
      }

      await exchange.methods
        .removeLiquidity(caver.utils.toPeb(removeLp.current.value))
        .send({
          from: account,
          gas: 2000000,
        });

      let balance = await kip7.balanceOf(account);

      setLp(caver.utils.fromPeb(balance));
      dispatch(successNoti({ msg: `성공적으로 출금되었습니다!` }));

      const token = new caver.klay.Contract(uruABI, uruAddress);
      balance = await token.methods.balanceOf(account).call();
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

  return (
    <>
      <BackButton onClick={() => setIsWithdrawal(false)}></BackButton>
      <InputContainer type='number' style={{ marginTop: "70px" }}>
        <input placeholder='0.0' ref={removeLp} />
        <BalanceContainer>
          <span>잔액: {parseFloat(Number(lp).toFixed(6))}</span>
        </BalanceContainer>
      </InputContainer>
      <Button onClick={removeLiquidity}>출금하기</Button>
    </>
  );
};

export default RemoveLiquidity;
