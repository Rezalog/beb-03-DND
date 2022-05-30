import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getOwnedWeapons } from "../../../helper/getOwnedWeapons";
import WeaponRenderer from "../../weapon/WeaponRenderer";
import { setWeapons } from "../compoundInfoSlice";
import {
  CompoundInfoContainer,
  CompoundInfoHeader,
  SelectedWeapon,
} from "../../../styles/WeaponCompound.styled";

const CompoundInfo = () => {
  const dispatch = useDispatch();
  // const [weapons, setWeapons] = useState([]);
  const { address } = useSelector((state) => state.userInfo);
  const { firstWeapon, secondWeapon, compoundResult, weapons } = useSelector(
    (state) => state.compoundInfo
  );
  useEffect(() => {
    const getWeapons = async () => {
      const list = await getOwnedWeapons(address);

      dispatch(setWeapons({ weapons: list }));
    };
    getWeapons();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CompoundInfoContainer>
          {firstWeapon ? (
            <SelectedWeapon>
              <WeaponRenderer
                dna={weapons[firstWeapon].dna}
                lvl={weapons[firstWeapon].lvl}
                durability={weapons[firstWeapon].durability}
                id={weapons[firstWeapon].id}
              />
              무기 1
            </SelectedWeapon>
          ) : (
            <CompoundInfoHeader>첫번째 무기를 선택해주세요.</CompoundInfoHeader>
          )}
          {secondWeapon ? (
            <SelectedWeapon>
              <WeaponRenderer
                dna={weapons[secondWeapon].dna}
                lvl={weapons[secondWeapon].lvl}
                durability={weapons[secondWeapon].durability}
                id={weapons[secondWeapon].id}
              />
              무기2
            </SelectedWeapon>
          ) : (
            <CompoundInfoHeader>두번째 무기를 선택해주세요.</CompoundInfoHeader>
          )}
        </CompoundInfoContainer>
      </div>
    </div>
  );
};

export default CompoundInfo;
