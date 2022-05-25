import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { closeLpFarmModal } from "../modal/lpFarmingModalSlice";

import Farm from "./components/Farm";
import { initExchange } from "../dex/dexSlice";

import { ModalCenter } from "../../styles/ModalCenter.styled";
import { Modal, Container, Header, Button } from "../../styles/Modal.styled";
import { ListContainer } from "../../styles/LPContainer.styled";

const LPFarmModal = () => {
  const dispatch = useDispatch();
  const { farms } = useSelector((state) => state.lpFarm);
  const { address: account } = useSelector((state) => state.userInfo);
  const { exchanges } = useSelector((state) => state.dex);

  const getExchangeList = async () => {
    const response = await axios.get(
      "http://localhost:8080/contracts/pair",
      {}
    );
    const exchangeList = response.data.map((token) => {
      return {
        address: token.pair_address,
        name: token.pair_name,
        tokenAddress: token.token_address,
      };
    });
    dispatch(initExchange({ list: exchangeList }));
  };

  useEffect(() => {
    getExchangeList();
  }, []);
  return (
    <ModalCenter>
      <Modal height={"750px"}>
        <Container height={"750px"}>
          <Header>
            <h1>파밍</h1>
            <button onClick={() => dispatch(closeLpFarmModal())}></button>
          </Header>
          <ListContainer>
            {exchanges.map((exchange, idx) => {
              return <Farm key={idx} {...exchange} />;
            })}
          </ListContainer>
        </Container>
      </Modal>
    </ModalCenter>
  );
};

export default LPFarmModal;
