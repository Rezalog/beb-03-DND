import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getOwnedWeapons } from "../../../helper/getOwnedWeapons";
import WeaponRenderer from "../../weapon/WeaponRenderer";
import { setWeapons } from "../compoundInfoSlice";

const CompoundResult = () => {
  const dispatch = useDispatch();
  //   const [weapons, setWeapons] = useState([]);
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
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50vw",
          height: "20vh",
          backgroundColor: "gray",
        }}
      >
        {compoundResult ? (
          <div> 무기 합성을 성공했습니다 </div>
        ) : (
          <div> 무기 합성을 실패했습니다 </div>
        )}
        <div
          style={{
            backgroundColor: "red",
            height: "15vh",
          }}
        >
          <WeaponRenderer
            dna={weapons[weapons.length - 1].dna}
            lvl={weapons[weapons.length - 1].lvl}
          />
          합성결과 무기
        </div>
      </div>
    </div>
  );
};
export default CompoundResult;
