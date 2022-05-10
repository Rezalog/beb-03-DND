import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSubModal, changeToken0, changeToken1 } from "./tokenSwapSlice";

const SubModal = ({ selectedToken }) => {
  const dispatch = useDispatch();
  const { tokens } = useSelector((state) => state.tokenSwap);
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
      Token Sub Modal Coming Soon!!!
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

export default SubModal;
