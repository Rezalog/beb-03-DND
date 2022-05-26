import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSubModal, changeToken0, changeToken1 } from "./tokenSwapSlice";

import { Modal, Container, Header } from "../../styles/Modal.styled";
import { TokenList, TokenContainer } from "../../styles/TokenList.styled";

const TokenSelectModal = ({ selectedToken, getExchangeContract }) => {
  const dispatch = useDispatch();
  const { tokens, token0, token1 } = useSelector((state) => state.tokenSwap);
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
              <TokenContainer key={index}>
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
                        getExchangeContract(tokens[index].address);
                      }
                      if (selectedToken === 0) {
                        dispatch(changeToken0({ index }));
                        dispatch(changeToken1({ index: 0 }));
                      }
                      if (selectedToken === 1) {
                        dispatch(changeToken1({ index }));
                        dispatch(changeToken0({ index: 0 }));
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

export default TokenSelectModal;
