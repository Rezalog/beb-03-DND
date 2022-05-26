import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getOwnedWeapons } from "../../../helper/getOwnedWeapons";
import WeaponRenderer from "../../weapon/WeaponRenderer";
import { setWeapons } from "../compoundInfoSlice";

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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "50vw",
            height: "20vh",
            backgroundColor: "gray",
          }}
        >
          {firstWeapon ? (
            <div>
              <WeaponRenderer
                dna={weapons[firstWeapon].dna}
                lvl={weapons[firstWeapon].lvl}
              />
              무기 1
            </div>
          ) : (
            <div>첫번째 무기를 선택해주세요.</div>
          )}
          {secondWeapon ? (
            <div>
              <WeaponRenderer
                dna={weapons[secondWeapon].dna}
                lvl={weapons[secondWeapon].lvl}
              />
              무기2
            </div>
          ) : (
            <div>두번째 무기를 선택해주세요.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompoundInfo;
