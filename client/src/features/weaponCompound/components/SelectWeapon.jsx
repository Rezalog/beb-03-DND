import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Caver from "caver-js";

import { getOwnedWeapons } from "../../../helper/getOwnedWeapons";
import WeaponRenderer from "../../weapon/WeaponRenderer";

import { setFirstWeapon, setSecondWeapon } from "../compoundInfoSlice";

import { nftAddress, nftABI } from "../nftContractInfo";
import { InventoryContainer } from "../../../styles/Inventory.styled";

const SelectWeapon = () => {
  const [weapons, setWeapons] = useState([]);
  const { address } = useSelector((state) => state.userInfo);
  const { firstWeapon, secondWeapon } = useSelector(
    (state) => state.compoundInfo
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getWeapons = async () => {
      const list = await getOwnedWeapons(address);

      setWeapons(list);
    };
    getWeapons();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {/* <InventoryContainer> */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <span>무기 1</span>
          {weapons.map((weapon, idx) => {
            return (
              <div key={idx}>
                <WeaponRenderer {...weapon} />
                <button
                  value={idx}
                  onClick={(event) =>
                    dispatch(
                      setFirstWeapon({ firstWeapon: event.target.value })
                    )
                  }
                >
                  선택
                </button>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <span>무기 2</span>
          {weapons.map((weapon, idx) => {
            return (
              <div key={idx}>
                <WeaponRenderer {...weapon} />
                <button
                  value={idx}
                  onClick={(event) =>
                    dispatch(
                      setSecondWeapon({ secondWeapon: event.target.value })
                    )
                  }
                >
                  선택
                </button>
              </div>
            );
          })}
        </div>
        {/* </InventoryContainer> */}
        <button
          onClick={() => {
            if (firstWeapon === "" || secondWeapon === "") {
              console.log("nothing selected");
            } else {
              console.log(weapons[firstWeapon].id);
              console.log(weapons[secondWeapon].id);
              console.log(weapons);
            }
          }}
        >
          check
        </button>
      </div>
    </div>
  );
};

export default SelectWeapon;
