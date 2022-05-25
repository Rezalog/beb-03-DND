import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Caver from "caver-js";

import { getOwnedWeapons } from "../../../helper/getOwnedWeapons";
import WeaponRenderer from "../../weapon/WeaponRenderer";
import { convertDNA } from "../../../helper/convertDNA";

import { weapons } from "../../../weapons";

const CompoundInfo = ({ dna, lvl }) => {
  const [weaponInfo, setWeaponInfo] = useState({});
  const dispatch = useDispatch();
  // useEffect(() => {
  //   setWeaponInfo({ ...convertDNA(dna, lvl) });
  // }, []);
  const { address } = useSelector((state) => state.userInfo);
  const [weapons, setWeapons] = useState([]);
  const { firstWeapon, secondWeapon } = useSelector(
    (state) => state.compoundInfo
  );
  useEffect(() => {
    const getWeapons = async () => {
      const list = await getOwnedWeapons(address);

      setWeapons(list);
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
          <div>
            무기 1<img src={weaponInfo.img}></img>
          </div>
          <div>
            무기 2<img src={weaponInfo.img}></img>
          </div>
        </div>
      </div>
      <button onClick={() => console.log(weapons)}>weaponInfo</button>
    </div>
  );
};

export default CompoundInfo;
