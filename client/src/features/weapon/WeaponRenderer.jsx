import React, { useState, useEffect } from "react";

import { weapons } from "../../weapons";

import { useDispatch, useSelector } from "react-redux";
import { setCurrentWeapon } from "../tooltip/TooltipSlice";
import Tooltip from "../tooltip/Tooltip";

import {
  WeaponContainer,
  WeaponInfoContainer,
  WeaponTextContainer,
} from "../../styles/Weapon.styled";

const WeaponRenderer = ({ dna, lvl }) => {
  const [weaponInfo, setWeaponInfo] = useState({});
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  let tempDna = dna;
  while (tempDna.length < 16) tempDna = "0" + tempDna;

  useEffect(() => {
    const details = {
      dna,
      lvl,
      img: tempDna.substring(0, 2) % weapons[lvl].length,
      attack: (tempDna.substring(2, 4) % 10) + 10 * (Number(lvl) - 1),
      type: tempDna.substring(4, 6) % 8,
      speed: (tempDna.substring(6, 8) % 11) + 10 * (Number(lvl) - 1),
      critical: (tempDna.substring(8, 10) % 10) + 10 * (Number(lvl) - 1) + 100,
      criticalRate: (tempDna.substring(10, 12) % 10) + 5 * (Number(lvl) - 1),
      durability: (tempDna.substring(12, 14) % 2) + Number(lvl),
      enchant: (tempDna.substring(14, 16) % 4) + 1,
    };
    setWeaponInfo({ ...details });
  }, []);

  return (
    <>
      <WeaponContainer
        onMouseOver={() => {
          dispatch(setCurrentWeapon({ weapon: weaponInfo }));
          setIsVisible(true);
        }}
        onMouseOut={() => setIsVisible(false)}
        onMouseMove={(e) => {
          setTooltipPos({ x: e.clientX + 20, y: e.clientY + 10 });
        }}
      >
        <img src={weapons[lvl][weaponInfo.img]}></img>
      </WeaponContainer>
      {isVisible && <Tooltip {...tooltipPos}></Tooltip>}
    </>
  );
};

export default WeaponRenderer;
