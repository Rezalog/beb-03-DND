import React, { useState, useEffect } from "react";
import Caver from "caver-js";

import { useDispatch, useSelector } from "react-redux";

import WeaponRenderer from "../../weapon/WeaponRenderer";
import { openSubModal, removeStakedWeapon } from "../monsterFarmSlice";
import StakedWeapon from "./StakedWeapon";
import { BuySellButton } from "../../../styles/Inventory.styled";

import {
  MonsterList,
  MonsterHeader,
  MonsterContainer,
} from "../../../styles/Monster.styled";

import { farmingABI } from "../nftStakingContractInfo";
import { nftABI, nftAddress } from "../../marketplace/nftContractInfo";

import { getOwnedWeapons } from "../../../helper/getOwnedWeapons";
import { current } from "@reduxjs/toolkit";

const Monster = ({
  name,
  staked,
  address: monsterAddress,
  lvl,
  cooltime,
  reward,
  weapons,
  setAvailableWeapons,
  setSelectedMonsterAddress,
  currentTime,
}) => {
  const dispatch = useDispatch();
  const { address } = useSelector((state) => state.userInfo);
  const [endTime, setEndTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");

  const getReward = async () => {
    const caver = new Caver(window.klaytn);
    const monsterContract = new caver.klay.Contract(farmingABI, monsterAddress);

    await monsterContract.methods.withdrawYield().send({
      from: address,
      gas: 200000,
    });
    getRemainingTime();
  };
  const getRemainingTime = async () => {
    const caver = new Caver(window.klaytn);
    const monsterContract = new caver.klay.Contract(farmingABI, monsterAddress);

    const { yieldLockTime } = await monsterContract.methods
      .stakeInfo(address)
      .call();
    const end = Number(yieldLockTime.toString()) + Number(cooltime);
    setEndTime(end);
    const currentTime = Math.round(new Date().getTime() / 1000);
    setRemainingTime(end - currentTime >= 0 ? end - currentTime : 0);
  };

  const unStakeWeapon = async () => {
    const caver = new Caver(window.klaytn);
    const monsterContract = new caver.klay.Contract(farmingABI, monsterAddress);

    await monsterContract.methods.unstake(staked.id).send({
      from: address,
      gas: 300000,
    });

    dispatch(removeStakedWeapon({ index: staked.id - 1 }));
  };

  useEffect(() => {
    getRemainingTime();
  }, []);

  useEffect(() => {
    console.log(staked);
  }, [staked]);

  // 이런식으로 하면 몇초뒤부터 카운트 시작함
  // getRemainingTime하고 같이 묶으면 endTime이 0임
  // 왜냐하면 state는 rendering이 끝날때 적용되기 때문에
  useEffect(() => {
    if (currentTime === "") {
      setRemainingTime("");
    } else {
      setRemainingTime(endTime - currentTime >= 0 ? endTime - currentTime : 0);
    }
  }, [currentTime]);

  return (
    <MonsterList>
      <MonsterHeader>
        <h2>
          lvl {lvl} {name}
        </h2>
        <p>
          {reward} URU / {remainingTime}초
        </p>
        {remainingTime === 0 && <button onClick={getReward}>보상획득</button>}
      </MonsterHeader>
      <MonsterContainer>
        <div>
          <WeaponRenderer dna={staked?.dna} lvl={staked?.lvl} />
          {Object.keys(staked).length ? (
            <BuySellButton
              onClick={() => {
                unStakeWeapon();
              }}
            >
              무기 제거
            </BuySellButton>
          ) : (
            <BuySellButton
              onClick={() => {
                setAvailableWeapons(
                  weapons.filter((weapon) => weapon.lvl == lvl)
                );
                setSelectedMonsterAddress(monsterAddress);
                dispatch(openSubModal());
              }}
            >
              무기 선택
            </BuySellButton>
          )}
        </div>
      </MonsterContainer>
    </MonsterList>
  );
};

export default Monster;
