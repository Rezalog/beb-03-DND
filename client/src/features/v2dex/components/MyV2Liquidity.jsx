import React, { useState, useEffect } from "react";
import Caver from "caver-js";
import { useDispatch, useSelector } from "react-redux";
import V2Exchange from "./V2Exchange";
import RemoveV2Liquidity from "./RemoveV2Liquidity";

import { ListContainer } from "../../../styles/LPContainer.styled";
import { startLoading, stopLoading } from "../../loading/loadingSlice";
import Loading from "../../loading/Loading";
import { masterABI, masterAddrss } from "../../lpFarming/masterContractInfo";

const MyV2Liquidity = ({ account }) => {
  const dispatch = useDispatch();
  const { exchanges } = useSelector((state) => state.v2Dex);
  const { isLoading } = useSelector((state) => state.loading);
  const [ownedLP, setOwnedLP] = useState([]);
  const [lp, setLp] = useState([]);
  const [isWithdrawal, setIsWithdrawal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState("");
  const [selectedTokenA, setSelectedTokenA] = useState("");
  const [selectedTokenB, setSelectedTokenB] = useState("");

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
  }, []);

  if (isWithdrawal) {
    return (
      <RemoveV2Liquidity
        account={account}
        selectedExchange={selectedExchange}
        setIsWithdrawal={setIsWithdrawal}
        selectedTokenA={selectedTokenA}
        selectedTokenB={selectedTokenB}
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
                setSelectedTokenA={setSelectedTokenA}
                setSelectedTokenB={setSelectedTokenB}
              />
            );
          })
        )}
      </ListContainer>
    );
  }
};

export default MyV2Liquidity;
