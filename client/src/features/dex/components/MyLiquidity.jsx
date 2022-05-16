import React, { useState, useEffect } from "react";
import Caver from "caver-js";
import { useSelector } from "react-redux";
import Exchange from "./Exchange";
import RemoveLiquidity from "./RemoveLiquidity";

import { ListContainer } from "../../../styles/LPContainer.styled";

import { Container } from "../../../styles/Modal.styled";

const MyLiquidity = ({ account }) => {
  const { exchanges } = useSelector((state) => state.dex);
  const [ownedLP, setOwnedLP] = useState([]);
  const [isWithdrawal, setIsWithdrawal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState("");

  const getOwnedLPAsync = async () => {
    const caver = new Caver(window.klaytn);
    let tempArr = [];
    for (let i = 0; i < exchanges.length; i++) {
      const kip7 = new caver.klay.KIP7(exchanges[i].address);
      const balacne = await kip7.balanceOf(account);
      if (balacne.toString() !== "0") {
        tempArr.push(exchanges[i]);
      }
    }
    setOwnedLP([...tempArr]);
  };

  useEffect(() => {
    getOwnedLPAsync();
  }, []);
  if (isWithdrawal) {
    return (
      <RemoveLiquidity
        account={account}
        selectedExchange={selectedExchange}
        setIsWithdrawal={setIsWithdrawal}
      />
    );
  } else {
    return (
      <ListContainer>
        {ownedLP.map((exchange, idx) => {
          return (
            <Exchange
              key={idx}
              {...exchange}
              account={account}
              setIsWithdrawal={setIsWithdrawal}
              setSelectedExchange={setSelectedExchange}
            />
          );
        })}
      </ListContainer>
    );
  }
};

export default MyLiquidity;
