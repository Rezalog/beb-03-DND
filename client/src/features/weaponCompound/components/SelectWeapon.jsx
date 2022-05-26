import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getOwnedWeapons } from "../../../helper/getOwnedWeapons";
import WeaponRenderer from "../../weapon/WeaponRenderer";

import { Container } from "../../../styles/SelectWeapon.styled";

import {
  setFirstWeapon,
  setSecondWeapon,
  setWeapons,
} from "../compoundInfoSlice";

const SelectWeapon = () => {
  const { address } = useSelector((state) => state.userInfo);
  const { firstWeapon, secondWeapon, weapons } = useSelector(
    (state) => state.compoundInfo
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getWeapons = async () => {
      const list = await getOwnedWeapons(address);

      dispatch(setWeapons({ weapons: list }));
    };
    getWeapons();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          //   alignItems: "center",
          height: "400px",
          //   justifyContent: "center",
          padding: "20px",
        }}
      >
        <div>
          무기1
          <Container>
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
          </Container>
        </div>

        <div>
          무기2
          <Container>
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
          </Container>
        </div>
      </div>
    </div>
  );
};

export default SelectWeapon;
