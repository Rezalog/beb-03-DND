import React, { useRef } from "react";
import Caver from "caver-js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { closeSubModal, changeToken0, changeToken1 } from "./v2SwapSlice";

import { Modal, Container, Header } from "../../styles/Modal.styled";
import { TokenList, TokenContainer } from "../../styles/TokenList.styled";
import { InputContainer } from "../../styles/InputContainer.styled";
import { addNewToken } from "./v2SwapSlice";

const V2TokenSelectModal = ({ selectedToken }) => {
  const dispatch = useDispatch();
  const { tokens, token0, token1 } = useSelector((state) => state.v2Swap);
  const newTokenAddress = useRef(null);

  const addToken = async () => {
    const caver = new Caver(window.klaytn);
    try {
      const kip7 = new caver.klay.KIP7(newTokenAddress.current.value);
      const name = await kip7.name();
      const symbol = await kip7.symbol();
      dispatch(
        addNewToken({ name, symbol, address: newTokenAddress.current.value })
      );
      await axios.post(
        "http://localhost:8080/contracts/v2token",
        [
          {
            token_symbol: symbol,
            token_name: name,
            token_address: newTokenAddress.current.value,
          },
        ],
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {}
  };
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
                  <li style={{ opacity: "0.7" }}>
                    <h5>{token.symbol}</h5>
                    <p>{token.name}</p>
                  </li>
                ) : (
                  <li
                    key={index}
                    onClick={() => {
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
        <p>추가 하고 싶은 토큰 주소를 입력하세요!</p>
        <InputContainer>
          <input
            placeholder='토큰 주소'
            ref={newTokenAddress}
            onChange={addToken}
          />
        </InputContainer>
      </Container>
    </Modal>
  );
};

export default V2TokenSelectModal;
