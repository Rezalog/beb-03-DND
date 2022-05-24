import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Caver from "caver-js";

import { getOwnedWeapons } from "../../../helper/getOwnedWeapons";
import WeaponRenderer from "../../weapon/WeaponRenderer";
import { convertDNA } from "../../../helper/convertDNA";

const CompoundInfo = ({ dna, lvl }) => {
  const [weaponInfo, setWeaponInfo] = useState({});
  const dispatch = useDispatch();
  // useEffect(() => {
  //   setWeaponInfo({ ...convertDNA(dna, lvl) });
  // }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "50vw", height: "20vh", backgroundColor: "gray" }}>
          <span>아래의 두 무기를 조합합니다</span>
          <div>
            <img src={weaponInfo.img}></img>
          </div>
          <div>
            <img src={weaponInfo.img}></img>
          </div>
          <button onClick={() => console.log(weaponInfo)}>weaponInfo</button>
        </div>
      </div>
    </div>
  );
};

export default CompoundInfo;
