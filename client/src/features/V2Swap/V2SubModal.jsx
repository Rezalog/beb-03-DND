import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSubModal, changeToken0, changeToken1 } from "./v2SwapSlice";

const V2SubModal = ({ selectedToken }) => {
  const dispatch = useDispatch();
  const { tokens } = useSelector((state) => state.v2Swap);
  return (
    <div
      style={{
        width: "300px",
        height: "700px",
        backgroundColor: "grey",
        zIndex: 10,
        color: "white",
      }}
    >
      <button onClick={() => dispatch(closeSubModal())}>X</button>
      {tokens.map((token, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              if (selectedToken === 0) dispatch(changeToken0({ index }));
              if (selectedToken === 1) dispatch(changeToken1({ index }));
              dispatch(closeSubModal());
            }}
          >
            <h5>
              {token.symbol} <span>{token.name}</span>
            </h5>
          </div>
        );
      })}
    </div>
  );
};

export default V2SubModal;
