import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ModalCenter } from "../../styles/ModalCenter.styled";
import { Modal, Container, Header } from "../../styles/Modal.styled";
import { ListContainer } from "../../styles/LPContainer.styled";
import Loading from "../loading/Loading";
import Bet from "./components/Bet";
import { initBettings } from "./bettingSlice";

import { closeBettingModal } from "../modal/bettingModalSlice";
const Betting = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.loading);
  const { bettings } = useSelector((state) => state.betting);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const intervalID = setInterval(() => {
      const currentTime = Math.round(new Date().getTime() / 1000);
      setCurrentTime(currentTime);
    }, 1000);

    dispatch(
      initBettings({
        list: [
          {
            id: 1,
            lvl: 2,
            initiator: "0x853A8463F394aE595bAe16CFcD2229e639298763",
            token1Id: 1,
            token2Id: 2,
            success: 100,
            fail: 50,
            startTime: 1653538680,
            result: true,
            done: false,
          },
          {
            id: 2,
            lvl: 2,
            initiator: "0x853A8463F394aE595bAe16CFcD2229e639298763",
            token1Id: 1,
            token2Id: 2,
            success: 100,
            fail: 50,
            startTime: 1653551680,
            result: false,
            done: false,
          },
          {
            id: 3,
            lvl: 2,
            initiator: "0x853A8463F394aE595bAe16CFcD2229e639298763",
            token1Id: 1,
            token2Id: 2,
            success: 100,
            fail: 50,
            startTime: 1653552680,
            result: false,
            done: false,
          },
          {
            id: 4,
            lvl: 2,
            initiator: "0x853A8463F394aE595bAe16CFcD2229e639298763",
            token1Id: 1,
            token2Id: 2,
            success: 100,
            fail: 50,
            startTime: 1653553680,
            result: false,
            done: false,
          },
        ],
      })
    );
    return () => clearInterval(intervalID);
  }, []);
  return (
    <ModalCenter>
      <Modal width={"700px"}>
        <Container>
          <Header>
            <h1>베팅</h1>
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
                  <Bet key={idx} betting={betting} currentTime={currentTime} />
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
