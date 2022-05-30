import React, { useState, useEffect } from "react";
import Caver from "caver-js";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWeapon } from "../tooltip/TooltipSlice";
import Tooltip from "../tooltip/Tooltip";
import Repair from "./components/Repair";

import { WeaponContainer } from "../../styles/Weapon.styled";

import { convertDNA } from "../../helper/convertDNA";

import {
  tokenAddress,
  nftAddress,
  nftABI,
} from "../marketplace/nftContractInfo";

import {
  failNoti,
  successNoti,
  clearState,
  pendingNoti,
} from "../notification/notifiactionSlice";

const WeaponRenderer = ({ dna, lvl, durability, id }) => {
  const [weaponInfo, setWeaponInfo] = useState({});
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [openRepair, setOpenRepair] = useState(false);
  const { address } = useSelector((state) => state.userInfo);

  const repairWeapon = async (e) => {
    if (durability < 10) {
      dispatch(pendingNoti());
      const caver = new Caver(window.klaytn);

      const kip7 = new caver.klay.KIP7(tokenAddress);
      const allowed = await kip7.allowance(address, nftAddress);

      if (allowed.toString() === "0") {
        try {
          await kip7.approve(nftAddress, caver.utils.toPeb("100000000"), {
            from: address,
          });
        } catch (err) {
          dispatch(failNoti());
          setTimeout(() => {
            dispatch(clearState());
          }, 5000);
        }
      }

      const nft = new caver.klay.Contract(nftABI, nftAddress);
      try {
        nft.methods
          .fixWeaponDurability(id)
          .send({ from: address, gas: 300000 })
          .on("transactionHash", (resolve) => {
            dispatch(successNoti({ msg: `NFT 수리 성공!` }));
            setOpenRepair(false);
            setTimeout(() => {
              dispatch(clearState());
            }, 5000);
          });
      } catch (error) {
        console.log(error);
        dispatch(failNoti());
        setTimeout(() => {
          dispatch(clearState());
        }, 5000);
      }
    }
  };

  useEffect(() => {
    if (dna && lvl && durability)
      setWeaponInfo({ ...convertDNA(dna, lvl, durability) });
  }, [dna]);

  return (
    <>
      {dna && lvl ? (
        <WeaponContainer
          onMouseOver={() => {
            dispatch(setCurrentWeapon({ weapon: weaponInfo }));
            setIsVisible(true);
          }}
          onMouseOut={() => setIsVisible(false)}
          onMouseMove={(e) => {
            setTooltipPos({ x: e.clientX + 20, y: e.clientY - 270 });
          }}
          onClick={() => setOpenRepair(true)}
          durability={durability}
        >
          <img src={weaponInfo.img}></img>
        </WeaponContainer>
      ) : (
        <div
          style={{
            width: "96px",
            height: "96px",

            backgroundColor: "#8f5765",
            border: "5px solid black",
          }}
        ></div>
      )}

      {isVisible && <Tooltip {...tooltipPos}></Tooltip>}
      {openRepair && (
        <Repair
          setOpenRepair={setOpenRepair}
          lvl={lvl}
          repairWeapon={repairWeapon}
        />
      )}
    </>
  );
};

export default WeaponRenderer;
