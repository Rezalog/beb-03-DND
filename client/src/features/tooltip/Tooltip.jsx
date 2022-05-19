import React from "react";

import { useSelector } from "react-redux";

import {
  TooltipCard,
  TooltipContainer,
  TooltipInfoContainer,
  TooltipTextContainer,
} from "../../styles/Tooltip.styled";
const types = ["불", "물", "독", "무", "얼음", "번개", "빛", "암"];

const Tooltip = ({ x, y }) => {
  const { currentWeapon } = useSelector((state) => state.tooltip);
  return (
    <TooltipCard x={x} y={y}>
      <TooltipContainer frame={currentWeapon.lvl}>
        <img src={currentWeapon.img}></img>
        <TooltipInfoContainer>
          <p>{currentWeapon.dna}</p>
          <TooltipTextContainer>
            <span>공격력</span>
            <span>{currentWeapon.attack}</span>
          </TooltipTextContainer>
          <TooltipTextContainer>
            <span>공격속도</span>
            <span>{currentWeapon.speed}</span>
          </TooltipTextContainer>
          <TooltipTextContainer>
            <span>공격타입</span>
            <span>{types[currentWeapon.type]}</span>
          </TooltipTextContainer>
          <TooltipTextContainer>
            <span>치명타</span>
            <span>{currentWeapon.critical}%</span>
          </TooltipTextContainer>
          <TooltipTextContainer>
            <span>치명타 확률</span>
            <span>{currentWeapon.criticalRate}%</span>
          </TooltipTextContainer>
          <TooltipTextContainer>
            <span>내구도</span>
            <span>{currentWeapon.durability}</span>
          </TooltipTextContainer>
          <TooltipTextContainer>
            <span>강화횟수</span>
            <span>{currentWeapon.enchant}</span>
          </TooltipTextContainer>
        </TooltipInfoContainer>
      </TooltipContainer>
    </TooltipCard>
  );
};

export default Tooltip;
