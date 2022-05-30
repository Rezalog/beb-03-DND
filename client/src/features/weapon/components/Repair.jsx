import React, { useState, useEffect } from "react";
import Caver from "caver-js";

import { nftABI, nftAddress } from "../../marketplace/nftContractInfo";
import { RepairModal, RepairClose } from "../../../styles/Repair.styled";

import { Button } from "../../../styles/Modal.styled";
const Repair = ({ setOpenRepair, lvl, repairWeapon }) => {
  const [cost, setCost] = useState(0);
  useEffect(() => {
    const getRepairCost = async () => {
      const caver = new Caver(window.klaytn);
      const nft = new caver.klay.Contract(nftABI, nftAddress);

      const cost = await nft.methods.tokenToFix(lvl - 1).call();
      setCost(cost);
    };
    getRepairCost();
  }, []);
  return (
    <RepairModal>
      <h2>수리하겠습니까?</h2>
      <RepairClose
        onClick={() => {
          setOpenRepair(false);
        }}
      ></RepairClose>
      <Button
        style={{ bottom: "0px", transform: `translate(-50%, -50%)` }}
        onClick={repairWeapon}
      >
        {cost} URU
      </Button>
    </RepairModal>
  );
};

export default Repair;
