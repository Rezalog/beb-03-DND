import React, { useState, useEffect } from "react";
import Caver from "caver-js";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { ModalCenter } from "../../styles/ModalCenter.styled";
import { Modal, Container, Header } from "../../styles/Modal.styled";
import { ListContainer } from "../../styles/LPContainer.styled";
import Loading from "../loading/Loading";
import { startLoading, stopLoading } from "../loading/loadingSlice";
import Bet from "./components/Bet";
import { initBettings } from "./bettingSlice";

import { closeBettingModal } from "../modal/bettingModalSlice";
import { bettingABI, bettingAddress } from "./bettingContractInfo";
const Betting = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.loading);
  const { bettings } = useSelector((state) => state.betting, shallowEqual);
  const [currentTime, setCurrentTime] = useState(0);

  const getBettings = async () => {
    dispatch(startLoading());
    const caver = new Caver(window.klaytn);
    const bettingContract = new caver.klay.Contract(bettingABI, bettingAddress);

    const bettingInfo = await bettingContract.methods.getBettingInfo().call();
    const amountInfo = await bettingContract.methods.getAmountInfo().call();

    let temp = [];
    for (let i = 0; i < bettingInfo.length; i++) {
      temp.push({
        id: bettingInfo[i].id,
        lvl: bettingInfo[i].level,
        initiator: bettingInfo[i].initiator,
        token1Id: bettingInfo[i].token1Id,
        token2Id: bettingInfo[i].token2Id,
        success: amountInfo[i].betAmountSuccees,
        fail: amountInfo[i].betAmountFailure,
        startTime: bettingInfo[i].timeStamp,
        result: bettingInfo[i].result,
        done: bettingInfo[i].done,
      });
    }
    dispatch(initBettings({ list: temp }));
    dispatch(stopLoading());
  };

  useEffect(() => {
    const intervalID = setInterval(() => {
      const currentTime = Math.round(new Date().getTime() / 1000);
      setCurrentTime(currentTime);
    }, 1000);
    getBettings();
    return () => clearInterval(intervalID);
  }, []);
  return (
    <ModalCenter>
      <Modal width={"700px"}>
        <Container>
          <Header>
            <h1>배팅</h1>
            <button
              style={{
                right: "100px",
              }}
              onClick={() => {
                dispatch(closeBettingModal());
              }}
            ></button>
          </Header>
          {isLoading ? (
            <Loading />
          ) : (
            <ListContainer>
              {bettings.map((betting, idx) => {
                return (
                  <Bet
                    key={idx}
                    betting={betting}
                    currentTime={currentTime}
                    getBettings={getBettings}
                  />
                );
              })}
            </ListContainer>
          )}
        </Container>
      </Modal>
    </ModalCenter>
  );
};

export default Betting;
