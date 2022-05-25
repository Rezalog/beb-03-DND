import React, { useState, useEffect } from "react";
import Caver from "caver-js";
import { useDispatch, useSelector } from "react-redux";
import Exchange from "./Exchange";
import RemoveLiquidity from "./RemoveLiquidity";

import { ListContainer } from "../../../styles/LPContainer.styled";

import { Container } from "../../../styles/Modal.styled";
import { startLoading, stopLoading } from "../../loading/loadingSlice";
import Loading from "../../loading/Loading";

const MyLiquidity = ({ account }) => {
  const dispatch = useDispatch();
  const { exchanges } = useSelector((state) => state.dex);
  const { isLoading } = useSelector((state) => state.loading);
  const [ownedLP, setOwnedLP] = useState([]);
  const [isWithdrawal, setIsWithdrawal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState("");

  const getOwnedLPAsync = async () => {
    dispatch(startLoading());
    const caver = new Caver(window.klaytn);
    let tempArr = [];
    console.log(exchanges);
    for (let i = 0; i < exchanges.length; i++) {
      const kip7 = new caver.klay.KIP7(exchanges[i].address);
      const balacne = await kip7.balanceOf(account);
      if (balacne.toString() !== "0") {
        tempArr.push(exchanges[i]);
      }
    }
    setOwnedLP([...tempArr]);
    dispatch(stopLoading());
  };

  useEffect(() => {
    getOwnedLPAsync();
  }, [exchanges]);

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
        {isLoading ? (
          <Loading />
        ) : (
          ownedLP.map((exchange, idx) => {
            return (
              <Exchange
                key={idx}
                {...exchange}
                account={account}
                setIsWithdrawal={setIsWithdrawal}
                setSelectedExchange={setSelectedExchange}
              />
            );
          })
        )}
      </ListContainer>
    );
  }
};

export default MyLiquidity;
