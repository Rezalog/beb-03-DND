import React from "react";
import { useDispatch } from "react-redux";
import { closeLpFarmModal } from "../modal/lpFarmingModalSlice";

const LPFarmModal = () => {
  const dispatch = useDispatch();
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "500px",
          height: "500px",
          backgroundColor: "black",
          zIndex: 10,
          color: "white",
        }}
      >
        Lp Farming Coming Soon!!!
        <button onClick={() => dispatch(closeLpFarmModal())}>X</button>
      </div>
    </div>
  );
};

export default LPFarmModal;
