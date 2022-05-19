import React from "react";

import { weapons } from "../../weapons";

import {
  WeaponContainer,
  WeaponInfoContainer,
  WeaponTextContainer,
} from "../../styles/Weapon.styled";
const types = ["불", "물", "독", "무", "얼음", "번개", "빛", "암"];

const WeaponRenderer = ({ dna, lvl }) => {
  let tempDna = dna;
  while (tempDna.length < 16) tempDna = "0" + tempDna;

  const details = {
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

  return (
    <WeaponContainer>
      <img src={weapons[lvl][details.img]}></img>
      <WeaponInfoContainer>
        <p>{tempDna}</p>
        <WeaponTextContainer>
          <span>공격력</span>
          <span>{details.attack}</span>
        </WeaponTextContainer>
        <WeaponTextContainer>
          <span>공격속도</span>
          <span>{details.speed}</span>
        </WeaponTextContainer>
        <WeaponTextContainer>
          <span>공격타입</span>
          <span>{types[details.type]}</span>
        </WeaponTextContainer>
        <WeaponTextContainer>
          <span>치명타</span>
          <span>{details.critical}%</span>
        </WeaponTextContainer>
        <WeaponTextContainer>
          <span>치명타 확률</span>
          <span>{details.criticalRate}%</span>
        </WeaponTextContainer>
        <WeaponTextContainer>
          <span>내구도</span>
          <span>{details.durability}</span>
        </WeaponTextContainer>
        <WeaponTextContainer>
          <span>강화횟수</span>
          <span>{details.enchant}</span>
        </WeaponTextContainer>
      </WeaponInfoContainer>
    </WeaponContainer>
  );
};

export default WeaponRenderer;
