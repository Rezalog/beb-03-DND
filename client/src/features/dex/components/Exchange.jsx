import React, { useState, useEffect, useRef } from "react";
import Caver from "caver-js";
import { exchangeABI } from "../contractInfo";
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

const Exchange = ({
  address,
  name,
  lp,
  tokenAddress,
  setIsWithdrawal,
  setSelectedExchange,
}) => {
  const [reservedKlay, setReservedKlay] = useState(0);
  const [reservedToken, setReservedToken] = useState(0);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [share, setShare] = useState("");

  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const getReserved = async () => {
      if (tokenAddress) {
        const caver = new Caver(window.klaytn);
        const exchange = new caver.klay.Contract(exchangeABI, address);

        const klayInExchange = await exchange.methods.getKlay().call();
        const tokenInExchange = await exchange.methods.getReserve().call();

        setReservedKlay(caver.utils.fromPeb(klayInExchange));
        setReservedToken(caver.utils.fromPeb(tokenInExchange));
        const token = new caver.klay.KIP7(tokenAddress);
        const name = await token.name();
        const symbol = await token.symbol();

        setTokenName(name);
        setTokenSymbol(symbol);
        getShareOfLP(lp);
      }
    };

    getReserved();
  }, [tokenAddress]);

  const getShareOfLP = async (balance) => {
    const caver = new Caver(window.klaytn);

    const kip7 = new caver.klay.KIP7(address);
    const totalSupply = await kip7.totalSupply();
    const lpShare = Number(
      caver.utils.fromPeb(
        caver.utils
          .toBN(caver.utils.toPeb(balance))
          .mul(caver.utils.toBN(Math.pow(10, 18)))
          .div(caver.utils.toBN(totalSupply))
      )
    );
    setShare(parseFloat(Number(lpShare * 100).toFixed(2)));
  };

  return (
    <LPContainer
      height={showMore ? 250 : 50}
      onClick={() => setShowMore(!showMore)}
    >
      <Content>
        <LPHeader scale={showMore ? -1 : 1}>
          <div>
            <h2>{name}</h2>
            <p>{parseFloat(Number(lp).toFixed(6))}</p>
          </div>
          <img src='assets/arrowDown.png'></img>
        </LPHeader>
        <SwapInfoContainer>
          <InfoContainer>
            <span>Pooled {tokenSymbol}</span>
            <span>{parseFloat(Number(reservedToken).toFixed(6))}</span>
          </InfoContainer>
          <InfoContainer>
            <span>Pooled KLAY</span>
            <span>{parseFloat(Number(reservedKlay).toFixed(6))}</span>
          </InfoContainer>
          <InfoContainer>
            <span>Share of Pool</span>
            <span>{share < 0.01 ? `<0.01` : share}%</span>
          </InfoContainer>
        </SwapInfoContainer>
        <Button
          style={{ bottom: "-100px" }}
          onClick={() => {
            setIsWithdrawal(true);
            setSelectedExchange(address);
          }}
        >
          출금
        </Button>
      </Content>
    </LPContainer>
  );
};

export default Exchange;
