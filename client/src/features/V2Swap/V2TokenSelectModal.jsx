import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSubModal, changeToken0, changeToken1 } from "./v2SwapSlice";

import { Modal, Container, Header } from "../../styles/Modal.styled";
import { TokenList, TokenContainer } from "../../styles/TokenList.styled";

const V2TokenSelectModal = ({ selectedToken }) => {
  const dispatch = useDispatch();
  const { tokens, token0, token1 } = useSelector((state) => state.v2Swap);
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
            const selected =
              index === token0 || index === token1 ? true : false;
            return (
              <TokenContainer>
                {selected ? (
                  <li key={index} style={{ opacity: "0.7" }}>
                    <h5>{token.symbol}</h5>
                    <p>{token.name}</p>
                  </li>
                ) : (
                  <li
                    key={index}
                    onClick={() => {
                      console.log(tokens[index].address);
                      if (index > 0) {
                      }
                      if (selectedToken === 0) {
                        dispatch(changeToken0({ index }));
                      }
                      if (selectedToken === 1) {
                        dispatch(changeToken1({ index }));
                      }
                      dispatch(closeSubModal());
                    }}
                  >
                    <h5>{token.symbol}</h5>
                    <p>{token.name}</p>
                  </li>
                )}
                <hr></hr>
              </TokenContainer>
            );
          })}
        </TokenList>
      </Container>
    </Modal>
  );
};

export default V2TokenSelectModal;
