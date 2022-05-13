import React, { useState, useEffect, useRef } from "react";
import Caver from "caver-js";
import { exchangeABI } from "../contractInfo";

const Exchange = ({ address, name, tokenAddress, account }) => {
  const [reservedKlay, setReservedKlay] = useState(0);
  const [reservedToken, setReservedToken] = useState(0);
  const [lp, setLp] = useState(0);
  const input1 = useRef(null);
  const input2 = useRef(null);
  const removeLp = useRef(null);

  useEffect(() => {
    const getReserved = async () => {
      const caver = new Caver(window.klaytn);
      const exchange = new caver.klay.Contract(exchangeABI, address);

      const klayInExchange = await exchange.methods.getKlay().call();
      const tokenInExchange = await exchange.methods.getReserve().call();

      setReservedKlay(caver.utils.fromPeb(klayInExchange));
      setReservedToken(caver.utils.fromPeb(tokenInExchange));

      const kip7 = new caver.klay.KIP7(address);
      const balance = await kip7.balanceOf(account);
      setLp(caver.utils.fromPeb(balance));
    };

    getReserved();
  }, []);

  const getInput2 = () => {
    const caver = new Caver(window.klaytn);
    const input1Value = input1.current.value;
    const klay = caver.utils.toPeb(reservedKlay);
    const token = caver.utils.toPeb(reservedToken);

    if (input1Value != "") {
      input2.current.value = caver.utils.fromPeb(
        caver.utils
          .toBN(caver.utils.toPeb(input1Value))
          .mul(caver.utils.toBN(caver.utils.toPeb(token)))
          .div(caver.utils.toBN(caver.utils.toPeb(klay)))
      );
    }
  };
  const getInput1 = () => {
    const caver = new Caver(window.klaytn);
    const input2Value = input2.current.value;
    const klay = caver.utils.toPeb(reservedKlay);
    const token = caver.utils.toPeb(reservedToken);

    if (input2Value != "") {
      input1.current.value = caver.utils.fromPeb(
        caver.utils
          .toBN(caver.utils.toPeb(input2Value))
          .mul(caver.utils.toBN(caver.utils.toPeb(klay)))
          .div(caver.utils.toBN(caver.utils.toPeb(token)))
      );
    }
  };

  const addLiquidity = async () => {
    const caver = new Caver(window.klaytn);
    const exchange = new caver.klay.Contract(exchangeABI, address);

    const kip7 = new caver.klay.KIP7(tokenAddress);
    const allowed = await kip7.allowance(account, address);
    // 변경해야함
    // if allowed <= caver.utils.toPeb(input2.current.value)
    if (allowed.toString() === "0") {
      try {
        await kip7.approve(address, caver.utils.toPeb("100000000"), {
          from: account,
        });
      } catch (err) {
        console.log(err);
      }
    }

    await exchange.methods
      .addLiquidity(caver.utils.toPeb(input2.current.value))
      .send({
        from: account,
        value: caver.utils.toPeb(input1.current.value),
        gas: 2000000,
      });

    const klayInExchange = await exchange.methods.getKlay().call();
    const tokenInExchange = await exchange.methods.getReserve().call();

    setReservedKlay(caver.utils.fromPeb(klayInExchange));
    setReservedToken(caver.utils.fromPeb(tokenInExchange));

    const lpKip7 = new caver.klay.KIP7(address);
    const balance = await lpKip7.balanceOf(account);
    setLp(caver.utils.fromPeb(balance));
  };

  const removeLiquidity = async () => {
    const caver = new Caver(window.klaytn);
    const exchange = new caver.klay.Contract(exchangeABI, address);

    const kip7 = new caver.klay.KIP7(address);
    const allowed = await kip7.allowance(account, address);
    if (allowed.toString() === "0") {
      try {
        await kip7.approve(address, caver.utils.toPeb("100000000"), {
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

    const klayInExchange = await exchange.methods.getKlay().call();
    const tokenInExchange = await exchange.methods.getReserve().call();
    const balance = await kip7.balanceOf(account);

    setReservedKlay(caver.utils.fromPeb(klayInExchange));
    setReservedToken(caver.utils.fromPeb(tokenInExchange));

    setLp(caver.utils.fromPeb(balance));
  };

  return (
    <div>
      <p>{name}</p>
      <p>{Number(reservedKlay).toFixed(6)} KLAY</p>
      <p>{Number(reservedToken).toFixed(6)}</p>
      <div>
        <input placeholder='0.0 KLAY' ref={input1} onChange={getInput2}></input>
        <input placeholder='0.0' ref={input2} onChange={getInput1}></input>
        <button onClick={addLiquidity}>입금</button>
      </div>
      <div>
        <input placeholder='0.0' ref={removeLp}></input>
        <p>{Number(lp).toFixed(6)} LP</p>
        <button onClick={removeLiquidity}>출금</button>
      </div>
    </div>
  );
};

export default Exchange;
