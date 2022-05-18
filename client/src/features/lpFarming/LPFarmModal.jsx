import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeLpFarmModal } from "../modal/lpFarmingModalSlice";

import Farm from "./components/Farm";

import { ModalCenter } from "../../styles/ModalCenter.styled";
import { Modal, Container, Header, Button } from "../../styles/Modal.styled";
import { ListContainer } from "../../styles/LPContainer.styled";

const LPFarmModal = () => {
  const dispatch = useDispatch();
  const { farms } = useSelector((state) => state.lpFarm);
  const { address: account } = useSelector((state) => state.userInfo);
  return (
    <ModalCenter>
      <Modal height={"750px"}>
        <Container height={"750px"}>
          <Header>
            <h1>파밍</h1>
            <button onClick={() => dispatch(closeLpFarmModal())}></button>
          </Header>
          <ListContainer>
            {farms.map((farm, idx) => {
              return <Farm key={idx} {...farm} />;
            })}
          </ListContainer>
        </Container>
      </Modal>
    </ModalCenter>
  );
};

export default LPFarmModal;
