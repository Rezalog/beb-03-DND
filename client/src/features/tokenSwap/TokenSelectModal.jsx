import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSubModal, changeToken0, changeToken1 } from "./tokenSwapSlice";

import { Modal, Container, Header } from "../../styles/Modal.styled";
import { TokenList, TokenContainer } from "../../styles/TokenList.styled";

const TokenSelectModal = ({ selectedToken }) => {
  const dispatch = useDispatch();
  const { tokens } = useSelector((state) => state.tokenSwap);
  return (
    <Modal>
      <Container>
        <Header>
          <h1>토큰 선택</h1>
          <button
            onClick={() => {
              dispatch(closeSubModal());
            }}
          ></button>
        </Header>
        <TokenList>
          {tokens.map((token, index) => {
            return (
              <TokenContainer>
                <li
                  key={index}
                  onClick={() => {
                    if (selectedToken === 0) dispatch(changeToken0({ index }));
                    if (selectedToken === 1) dispatch(changeToken1({ index }));
                    dispatch(closeSubModal());
                  }}
                >
                  <h5>{token.symbol}</h5>
                  <p>{token.name}</p>
                </li>
                <hr></hr>
              </TokenContainer>
            );
          })}
        </TokenList>
      </Container>
    </Modal>
  );
};

export default TokenSelectModal;
