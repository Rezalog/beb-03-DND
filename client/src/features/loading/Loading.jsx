import React from "react";

const Loading = () => {
  return (
    <div
      style={{
        position: "fixed",
        width: "200px",
        height: "100px",
        background: "black",
        color: "white",
        right: 0,
        top: 50,
        zIndex: 10,
      }}
    >
      pending...
    </div>
  );
};

export default Loading;
