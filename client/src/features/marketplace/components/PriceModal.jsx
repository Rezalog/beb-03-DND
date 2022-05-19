import React, { useRef } from "react";

import { ModalCenter } from "../../../styles/ModalCenter.styled";
import { Modal, Container, Header } from "../../../styles/Modal.styled";
import { InputContainer } from "../../../styles/InputContainer.styled";
import { Button } from "../../../styles/Modal.styled";

const PriceModal = ({ setIsSell, sellWeapon }) => {
  const priceRef = useRef(null);
  return (
    <Modal width={"510px"} height={"300px"} style={{ position: "absolute" }}>
      <Container height={"300px"} style={{ marginTop: "-40px" }}>
        <Header>
          <h1>판매</h1>
          <button
            onClick={() => {
              setIsSell((prev) => !prev);
            }}
          ></button>
        </Header>
        <InputContainer type='number'>
          <input placeholder='URU' ref={priceRef}></input>
        </InputContainer>
        <Button
          style={{ width: "30%", bottom: "0" }}
          onClick={() => sellWeapon(Number(priceRef.current.value))}
        >
          등록
        </Button>
      </Container>
    </Modal>
  );
};

export default PriceModal;
