import React, { useState, useEffect } from "react";
import Caver from "caver-js";
import { useDispatch, useSelector } from "react-redux";
import Exchange from "./Exchange";
import RemoveLiquidity from "./RemoveLiquidity";

import { ListContainer } from "../../../styles/LPContainer.styled";

import { startLoading, stopLoading } from "../../loading/loadingSlice";
import Loading from "../../loading/Loading";
import { masterABI, masterAddrss } from "../../lpFarming/masterContractInfo";

const MyLiquidity = ({ account }) => {
  const dispatch = useDispatch();
  const { exchanges } = useSelector((state) => state.dex);
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

      const master = new caver.klay.Contract(masterABI, masterAddrss);
      const userinfo = await master.methods.userInfo(i, account).call();
      const stakedBalance = userinfo.amount;
      if (balance.toString() !== "0" || stakedBalance.toString() !== "0") {
        tempArr.push(exchanges[i]);
        tempLp.push(
          caver.utils.fromPeb(
            caver.utils
              .toBN(balance.toString())
              .add(caver.utils.toBN(stakedBalance))
              .toString()
          )
        );
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
                lp={lp[idx]}
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
