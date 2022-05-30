import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Caver from "caver-js";

import { getOwnedWeapons } from "../../helper/getOwnedWeapons";
import { closeWeaponCompoundModal } from "../modal/weaponCompoundModalSlice";
import Inventory from "../inventory/Inventory";
import SelectWeapon from "./components/SelectWeapon";
import CompoundInfo from "./components/CompoundInfo";
import CompoundResult from "./components/CompoundResult";
import Loading from "../loading/Loading";
import { startLoading, stopLoading } from "../loading/loadingSlice";
import { setCompoundResult } from "./compoundInfoSlice";
import {
  setFirstWeapon,
  setSecondWeapon,
  setWeapons,
} from "./compoundInfoSlice";

import { nftAddress, nftABI } from "./nftContractInfo";
import {
  WeaponCompoundModalBox,
  CloseWeaponCompoundButton,
  WeaponCompoundButton,
} from "../../styles/WeaponCompound.styled";
import { bettingABI, bettingAddress } from "../betting/bettingContractInfo";

// 처음에 무기 가져올 때 로딩 컴포넌트 필요
// 무기합성 결과 보여주기전에도 로딩컴포넌트 필요

const WeaponCompoundModal = () => {
  const dispatch = useDispatch();
  //   const [weapons, setWeapons] = useState([]);
  const { address } = useSelector((state) => state.userInfo);
  const { firstWeapon, secondWeapon, compoundResult, weapons } = useSelector(
    (state) => state.compoundInfo
  );
  const { isLoading } = useSelector((state) => state.loading);
  const [isCompound, setIsCompound] = useState(false);
  const [isResultClicked, setIsResultClicked] = useState(false);

  const caver = new Caver(window.klaytn);
  const nft = new caver.klay.Contract(nftABI, nftAddress);

  useEffect(() => {
    const getWeapons = async () => {
      const list = await getOwnedWeapons(address);

      dispatch(setWeapons({ weapons: list }));
    };
    getWeapons();
  }, []);

  //   const checkWeaponEnchant = async () => {
  //     const weapon1Info = await nft.methods
  //       .weapons([weapons[firstWeapon].id - 1])
  //       .call();
  //     const weapon2Info = await nft.methods
  //       .weapons([weapons[secondWeapon].id - 1])
  //       .call();
  //     console.log(weapon1Info.enchant);
  //     console.log(weapon2Info.enchant);
  //   };

  const weaponCompound = async () => {
    if (!firstWeapon || !secondWeapon) {
      alert("Select Weapon Please");
    } else if (weapons[firstWeapon].id === weapons[secondWeapon].id) {
      alert("Select Two Other Weapon Please");
    } else {
      const weapon1Info = await nft.methods
        .weapons([weapons[firstWeapon].id - 1])
        .call();
      const weapon2Info = await nft.methods
        .weapons([weapons[secondWeapon].id - 1])
        .call();
      if (weapons[firstWeapon].lvl !== weapons[secondWeapon].lvl) {
        alert("Select Same Level Weapons");
      } else if (weapon1Info.enchant === "0" || weapon2Info.enchant === "0") {
        alert("Fix Enchant please");
      } else {
        setIsCompound(true);
        await nft.methods
          .compoundWeapon(weapons[firstWeapon].id, weapons[secondWeapon].id)
          .send({ from: address, gas: 2000000 });
        console.log(weapons[firstWeapon].id);
        console.log(weapons[secondWeapon].id);
      }
    }
  };
  const checkResult = async () => {
    const compoundResult = await nft.methods
      .getCompoundResult(weapons[firstWeapon].id, weapons[secondWeapon].id)
      .call();
    if (compoundResult === true) {
      alert("Weapon Compound Success");
    } else if (compoundResult === false) {
      alert("Weapon Compound Fail");
    } else {
      alert("No compound");
    }
    setIsResultClicked(true);
    dispatch(setCompoundResult({ compoundResult: compoundResult }));
    dispatch(startLoading());
  };

  const additionalCompound = () => {
    setIsCompound(false);
    setIsResultClicked(false);
    dispatch(setFirstWeapon({ firstWeapon: "" }));
    dispatch(setSecondWeapon({ SecondWeapon: "" }));
  };

  const openBet = async () => {
    const weapon1Info = await nft.methods
      .weapons([weapons[firstWeapon].id - 1])
      .call();
    const weapon2Info = await nft.methods
      .weapons([weapons[secondWeapon].id - 1])
      .call();

    if (!firstWeapon || !secondWeapon) {
      alert("Select Weapon Please");
    } else if (weapons[firstWeapon].id === weapons[secondWeapon].id) {
      alert("Select Two Other Weapon Please");
    } else {
      if (weapons[firstWeapon].lvl !== weapons[secondWeapon].lvl) {
        alert("Select Same Level Weapons");
      } else if (weapon1Info.enchant === "0" || weapon2Info.enchant === "0") {
        alert("Fix Enchant please");
      } else {
        const bettingContract = new caver.klay.Contract(
          bettingABI,
          bettingAddress
        );

        await bettingContract.methods
          .createBet(weapons[firstWeapon].id, weapons[secondWeapon].id)
          .send({ from: address, gas: 2000000 });
      }
    }
  };

  useEffect(() => {
    console.log(firstWeapon);
    console.log(secondWeapon);
  }, [firstWeapon, secondWeapon, compoundResult]);

  return (
    <WeaponCompoundModalBox>
      <SelectWeapon />
      {isResultClicked ? <CompoundResult /> : <CompoundInfo />}
      {isResultClicked ? (
        <WeaponCompoundButton onClick={() => additionalCompound()}>
          추가 합성
        </WeaponCompoundButton>
      ) : isCompound ? (
        <WeaponCompoundButton onClick={() => checkResult()}>
          결과 확인
        </WeaponCompoundButton>
      ) : (
        <WeaponCompoundButton onClick={() => weaponCompound()}>
          무기 합성
        </WeaponCompoundButton>
      )}

      <CloseWeaponCompoundButton
        onClick={() => {
          dispatch(closeWeaponCompoundModal());
          dispatch(setFirstWeapon({ firstWeapon: "" }));
          dispatch(setSecondWeapon({ SecondWeapon: "" }));
          setIsCompound(false);
          setIsResultClicked(false);
          console.log("close");
        }}
      ></CloseWeaponCompoundButton>
      <WeaponCompoundButton
        onClick={() => {
          openBet();
        }}
      >
        배팅열기
      </WeaponCompoundButton>
    </WeaponCompoundModalBox>
  );
};

export default WeaponCompoundModal;
