import React from "react";
import { useDispatch } from "react-redux";
import { openSubModal } from "../monsterFarmSlice";

import WeaponRenderer from "../../weapon/WeaponRenderer";
import { BuySellButton } from "../../../styles/Inventory.styled";

const StakedWeapon = ({
  staked,
  setAvailableWeapons,
  setSelectedMonsterAddress,
  weapons,
  lvl,
  monsterAddress,
}) => {
  const dispatch = useDispatch();
  return (
    <div>
      <WeaponRenderer {...staked} />
      <BuySellButton
        onClick={() => {
          setAvailableWeapons(weapons.filter((weapon) => weapon.lvl == lvl));
          setSelectedMonsterAddress(monsterAddress);
          dispatch(openSubModal());
        }}
      >
        무기 선택
      </BuySellButton>
    </div>
  );
};

export default StakedWeapon;
