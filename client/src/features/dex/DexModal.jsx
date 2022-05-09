import React from "react";
import { useDispatch } from "react-redux";
import { closeDexModal } from "../modal/dexModalSlice";

const DexModal = () => {
  const dispatch = useDispatch();
  return (
    <div
      style={{
        width: "300px",
        height: "300px",
        backgroundColor: "black",
        zIndex: 10,
        color: "white",
      }}
    >
      DEX Coming Soon!!!
      <button onClick={() => dispatch(closeDexModal())}>X</button>
    </div>
  );
};

export default DexModal;
