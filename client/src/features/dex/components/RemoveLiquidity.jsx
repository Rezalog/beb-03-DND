import React, { useState, useEffect, useRef } from "react";
import Caver from "caver-js";

import {
  InputContainer,
  BalanceContainer,
} from "../../../styles/InputContainer.styled";
import { Button, BackButton } from "../../../styles/Modal.styled";
import { exchangeABI } from "../contractInfo";

const RemoveLiquidity = ({ account, selectedExchange, setIsWithdrawal }) => {
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
    const caver = new Caver(window.klaytn);
    const exchange = new caver.klay.Contract(exchangeABI, selectedExchange);

    const kip7 = new caver.klay.KIP7(selectedExchange);
    const allowed = await kip7.allowance(account, selectedExchange);
    if (allowed.toString() === "0") {
      try {
        await kip7.approve(selectedExchange, caver.utils.toPeb("100000000"), {
          from: account,
        });
      } catch (err) {
        console.log(err);
      }
    }

    await exchange.methods
      .removeLiquidity(caver.utils.toPeb(removeLp.current.value))
      .send({
        from: account,
        gas: 2000000,
      });

    const balance = await kip7.balanceOf(account);

    setLp(caver.utils.fromPeb(balance));
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
