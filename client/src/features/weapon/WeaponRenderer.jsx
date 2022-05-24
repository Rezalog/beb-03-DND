import React, { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { setCurrentWeapon } from "../tooltip/TooltipSlice";
import Tooltip from "../tooltip/Tooltip";

import { WeaponContainer } from "../../styles/Weapon.styled";

import { convertDNA } from "../../helper/convertDNA";

const WeaponRenderer = ({ dna, lvl }) => {
  const [weaponInfo, setWeaponInfo] = useState({});
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (dna && lvl) setWeaponInfo({ ...convertDNA(dna, lvl) });
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
            setTooltipPos({ x: e.clientX + 20, y: e.clientY + 10 });
          }}
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
    </>
  );
};

export default WeaponRenderer;
