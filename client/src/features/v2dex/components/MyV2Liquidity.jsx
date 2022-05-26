import React, { useState, useEffect } from "react";
import Caver from "caver-js";
import { useDispatch, useSelector } from "react-redux";
import V2Exchange from "./V2Exchange";
import RemoveV2Liquidity from "./RemoveV2Liquidity";

import { ListContainer } from "../../../styles/LPContainer.styled";

import { Container } from "../../../styles/Modal.styled";
import { startLoading, stopLoading } from "../../loading/loadingSlice";
import Loading from "../../loading/Loading";
import { exchangeABI } from "../../dex/contractInfo";
import { pairABI } from "../../V2Swap/v2Contract";

const MyV2Liquidity = ({ account }) => {
  const dispatch = useDispatch();
  const { exchanges } = useSelector((state) => state.v2Dex);
  const { isLoading } = useSelector((state) => state.loading);
  const [ownedLP, setOwnedLP] = useState([]);
  const [lp, setLp] = useState([]);
  const [isWithdrawal, setIsWithdrawal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState("");

  const getOwnedLPAsync = async () => {
    dispatch(startLoading());
    const caver = new Caver(window.klaytn);
    let tempArr = [];
    let tempLp = [];
    for (let i = 0; i < exchanges.length; i++) {
      const kip7 = new caver.klay.KIP7(exchanges[i].address);
      const balance = await kip7.balanceOf(account);
      if (balance.toString() !== "0") {
        tempArr.push(exchanges[i]);
        tempLp.push(caver.utils.toBN(balance.toString()));
      }
    }
    setOwnedLP([...tempArr]);
    setLp([...tempLp]);
    dispatch(stopLoading());
  };

  useEffect(() => {
    getOwnedLPAsync();
  }, [exchanges]);

  if (isWithdrawal) {
    return (
      <RemoveV2Liquidity
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
          ownedLP.map((pair, idx) => {
            return (
              <V2Exchange
                key={idx}
                {...pair}
                lp={lp[idx]}
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

export default MyV2Liquidity;
