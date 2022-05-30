import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getOwnedWeapons } from "../../../helper/getOwnedWeapons";
import WeaponRenderer from "../../weapon/WeaponRenderer";
import { setWeapons } from "../compoundInfoSlice";
import { stopLoading } from "../../loading/loadingSlice";
import Loading from "../../loading/Loading";
import {
  CompoundInfoHeader,
  CompoundResultContainer,
} from "../../../styles/WeaponCompound.styled";

const CompoundResult = () => {
  const dispatch = useDispatch();
  //   const [weapons, setWeapons] = useState([]);
  const { address } = useSelector((state) => state.userInfo);
  const { compoundResult, weapons } = useSelector(
    (state) => state.compoundInfo
  );
  const { isLoading } = useSelector((state) => state.loading);

  useEffect(() => {
    const getWeapons = async () => {
      const list = await getOwnedWeapons(address);

      dispatch(setWeapons({ weapons: list }));
      dispatch(stopLoading());
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
      <CompoundResultContainer
        style={{
          display: "flex",
          flexDirection: "column",
          width: "50vw",
          height: "20vh",
          backgroundColor: "gray",
        }}
      >
        {compoundResult ? (
          <CompoundInfoHeader> 무기 합성을 성공했습니다! </CompoundInfoHeader>
        ) : (
          <CompoundInfoHeader> 무기 합성을 실패했습니다! </CompoundInfoHeader>
        )}
        {isLoading ? (
          <Loading />
        ) : (
          <div
            style={{
              marginTop: "10px",
              height: "15vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <WeaponRenderer
              dna={weapons[weapons.length - 1].dna}
              lvl={weapons[weapons.length - 1].lvl}
              durability={weapons[weapons.length - 1].durability}
              id={weapons[weapons.length - 1].id}
            />
          </div>
        )}
      </CompoundResultContainer>
    </div>
  );
};
export default CompoundResult;
