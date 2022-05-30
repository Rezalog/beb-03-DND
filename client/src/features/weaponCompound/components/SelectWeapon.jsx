import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getOwnedWeapons } from "../../../helper/getOwnedWeapons";
import WeaponRenderer from "../../weapon/WeaponRenderer";

import { SelectContainer } from "../../../styles/WeaponCompound.styled";

import {
  setFirstWeapon,
  setSecondWeapon,
  setWeapons,
} from "../compoundInfoSlice";
import { startLoading, stopLoading } from "../../loading/loadingSlice";
import Loading from "../../loading/Loading";

const SelectWeapon = () => {
  const { address } = useSelector((state) => state.userInfo);
  const { firstWeapon, secondWeapon, weapons } = useSelector(
    (state) => state.compoundInfo
  );
  const { isLoading } = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const getWeapons = async () => {
      const list = await getOwnedWeapons(address);

      dispatch(setWeapons({ weapons: list }));
      dispatch(stopLoading());
    };
    getWeapons();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          height: "400px",
          padding: "20px",
        }}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "400px",
              padding: "20px",
            }}
          >
            <div>
              무기1
              <SelectContainer>
                {weapons.map((weapon, idx) => {
                  return (
                    <div key={idx}>
                      <WeaponRenderer {...weapon} />
                      <button
                        style={{ width: "70px" }}
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
              </SelectContainer>
            </div>
            <div>
              무기2
              <SelectContainer>
                {weapons.map((weapon, idx) => {
                  return (
                    <div key={idx}>
                      <WeaponRenderer {...weapon} />
                      <button
                        value={idx}
                        onClick={(event) =>
                          dispatch(
                            setSecondWeapon({
                              secondWeapon: event.target.value,
                            })
                          )
                        }
                      >
                        선택
                      </button>
                    </div>
                  );
                })}
              </SelectContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectWeapon;
