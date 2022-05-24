import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Caver from "caver-js";

import { getOwnedWeapons } from "../../helper/getOwnedWeapons";
import WeaponRenderer from "../weapon/WeaponRenderer";

import { closeWeaponCompoundModal } from "../modal/weaponCompoundModalSlice";
import Inventory from "../inventory/Inventory";
import SelectWeapon from "./components/SelectWeapon";
import CompoundInfo from "./components/CompoundInfo";

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

const WeaponCompoundModal = () => {
  const dispatch = useDispatch();

  return (
    <div
      style={{
        width: "100vw",
        height: "150vh",
        backgroundColor: "black",
        zIndex: 10,
        color: "white",
      }}
    >
      <div>
        <SelectWeapon />
        <CompoundInfo />
        <button>합성</button>
        <button
          onClick={() => {
            dispatch(closeWeaponCompoundModal());
            console.log("close");
          }}
        >
          close weapon compound Modal
        </button>
      </div>
    </div>
  );
};

export default WeaponCompoundModal;
