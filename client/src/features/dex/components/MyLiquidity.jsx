import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Exchange from "./Exchange";

const MyLiquidity = ({ account }) => {
  const { exchanges } = useSelector((state) => state.dex);
  return (
    <div>
      {exchanges.map((exchange, idx) => {
        return <Exchange key={idx} {...exchange} account={account} />;
      })}
    </div>
  );
};

export default MyLiquidity;
