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
import { stopLoading } from "../loading/loadingSlice";
import { setCompoundResult } from "./compoundInfoSlice";
import {
  setFirstWeapon,
  setSecondWeapon,
  setWeapons,
} from "./compoundInfoSlice";

import { nftAddress, nftABI } from "../marketplace/nftContractInfo";
import { bettingABI, bettingAddress } from "../betting/bettingContractInfo";
// 무기 합성 모달창을 열면 보유중인 무기(nft)리스트를 가져옴
// 합성할 두 개의 무기를 선택
// 합성시 선택된 두 개의 무기 id값을 무기컴파운드 함수 컨트랙트에 보냄
// 합성 성공여부와 합성된 결과물을 보여줌
//
// 두 개의 무기를 각각의 창에서 하나씩을 필수로 선택하게 하기
// 하나의 창에서 두 개의 무기를 선택하게 하기, 하나를 선택하면 리스트를 새로 고침해 남는 것 중에 하나를 더 선택하게 하는 방식
// 무기선택 컴포넌트(각 무기 이미지만 간략하게 보여주기)
// 선택된 두 개의 무기를 보여주는 컴포넌트(각 무기의 이미지, 정보 보여주기 - 남은 강화횟수는 강조해서 보여주기)
// 합성 버튼
// 결과 모달창(또는 alert로 알려주기)

// 하나의 창에서 무기를 두 개 선택할 경우
//
// 무기를 클릭하면,
// 첫번째 무기 state가 비었을 경우 state에 추가
// 첫번째 무기 state가 차있으며, 현재 클릭한 무기가 첫번째 무기 state와 같을 경우 -> state를 null 상태로 만들어줌
// 첫번째 무기 state가 차있으며, 현재 클릭한 무기가 첫번째 무기 state와 다를 경우 -> 두번째 무기 state에 추가

// 합성버튼을 누르고 나면 alert를 통해 결과확인 버튼을 누르게 유도(합성 결과는 결과 확인 버튼 또는 인벤토리에서 확인이 가능합니다.)

// 결과 확인 버튼을 누르면 compoundInfo 컴포넌트를 보이지 않게 하고, compoundResult 컴포넌트를 보이게 한다.
// 또는 무기 합성시 state변경을 통해 바로 result 컴포넌트를 보이게 하는 방법 - 이 경우 로딩 시간 때문에 안보이지 않을까 걱정
// 결과 확인 버튼은 누르고 나면 추가 합성하기 버튼으로 변경, 추가 합성하기 버튼을 누를 경우 SelectWeapon컴포넌트 새로고침과 compoundInfo로 다시 변경

// compoundResult 컴포넌트에는
// 무기 합성의 성공, 실패 여부와 합성을 통해 나온 결과물을 보여줌.

const WeaponCompoundModal = () => {
  const dispatch = useDispatch();
  //   const [weapons, setWeapons] = useState([]);
  const { address } = useSelector((state) => state.userInfo);
  const { firstWeapon, secondWeapon, compoundResult, weapons } = useSelector(
    (state) => state.compoundInfo
  );
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

  const checkWeaponEnchant = async () => {
    const weapon1Info = await nft.methods
      .weapons([weapons[firstWeapon].id - 1])
      .call();
    const weapon2Info = await nft.methods
      .weapons([weapons[secondWeapon].id - 1])
      .call();
    console.log(weapon1Info.enchant);
    console.log(weapon2Info.enchant);
  };

  const weaponCompound = async () => {
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
        await nft.methods
          .compoundWeapon(weapons[firstWeapon].id, weapons[secondWeapon].id)
          .send({ from: address, gas: 2000000 });
        setIsCompound(true);
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
    <div
      style={{
        position: "fixed",
        width: "80vw",
        height: "80vh",
        backgroundColor: "black",
        zIndex: 10,
        color: "white",
        bottom: "5vw",
        right: "20vh",
      }}
    >
      <div>
        <SelectWeapon />
        {isResultClicked ? <CompoundResult /> : <CompoundInfo />}
        {isResultClicked ? (
          <button onClick={() => additionalCompound()}>추가 합성</button>
        ) : isCompound ? (
          <button onClick={() => checkResult()}>결과 확인</button>
        ) : (
          <button onClick={() => weaponCompound()}>무기 합성</button>
        )}

        <button
          onClick={() => {
            dispatch(closeWeaponCompoundModal());
            dispatch(setFirstWeapon({ firstWeapon: "" }));
            dispatch(setSecondWeapon({ SecondWeapon: "" }));
            setIsCompound(false);
            setIsResultClicked(false);
            console.log("close");
          }}
        >
          close weapon compound Modal
        </button>
        <button
          onClick={() => {
            checkWeaponEnchant();
          }}
        >
          check
        </button>
        <button
          onClick={() => {
            openBet();
          }}
        >
          배팅열기
        </button>
      </div>
    </div>
  );
};

export default WeaponCompoundModal;
