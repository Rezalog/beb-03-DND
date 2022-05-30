import React, { useState, useEffect } from "react";
import Caver from "caver-js";

import { useDispatch, useSelector } from "react-redux";

import WeaponRenderer from "../../weapon/WeaponRenderer";
import { openSubModal, removeStakedWeapon } from "../monsterFarmSlice";
import { BuySellButton } from "../../../styles/Inventory.styled";

import {
  MonsterList,
  MonsterHeader,
  MonsterContainer,
  MonsterImage,
} from "../../../styles/Monster.styled";

import { farmingABI } from "../nftStakingContractInfo";
import {
  pendingNoti,
  successNoti,
  failNoti,
  clearState,
} from "../../notification/notifiactionSlice";
import { uruABI, uruAddress } from "../../userinfo/TokenContract";
import { updateBalance } from "../../userinfo/userInfoSlice";

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
  updateWeapons,
}) => {
  const dispatch = useDispatch();
  const { address } = useSelector((state) => state.userInfo);
  const { isPending } = useSelector((state) => state.notification);
  const [endTime, setEndTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");

  const getReward = async () => {
    const caver = new Caver(window.klaytn);
    dispatch(pendingNoti());
    try {
      const monsterContract = new caver.klay.Contract(
        farmingABI,
        monsterAddress
      );

      await monsterContract.methods.withdrawYield().send({
        from: address,
        gas: 200000,
      });
      dispatch(successNoti({ msg: `${reward} URU 획득 완료!` }));
      const token = new caver.klay.Contract(uruABI, uruAddress);
      const balance = await token.methods.balanceOf(address).call();
      const locked = await token.methods.getLockedTokenAmount(address).call();
      dispatch(
        updateBalance({
          uru: parseFloat(Number(caver.utils.fromPeb(balance)).toFixed(2)),
          locked: parseFloat(Number(caver.utils.fromPeb(locked)).toFixed(2)),
        })
      );
      getRemainingTime();
      updateWeapons();
    } catch (error) {
      dispatch(failNoti());
    }
    setTimeout(() => {
      dispatch(clearState());
    }, 5000);
  };

  const getRemainingTime = async () => {
    const caver = new Caver(window.klaytn);
    const monsterContract = new caver.klay.Contract(farmingABI, monsterAddress);

    const { yieldLockTime } = await monsterContract.methods
      .stakeInfo(address)
      .call();
    if (yieldLockTime !== "0") {
      const end = Number(yieldLockTime.toString()) + Number(cooltime);
      setEndTime(end);
      const currentTime = Math.round(new Date().getTime() / 1000);
      setRemainingTime(end - currentTime >= 0 ? end - currentTime : 0);
    } else {
      setEndTime(0);
    }
  };

  const unStakeWeapon = async () => {
    dispatch(pendingNoti());
    const caver = new Caver(window.klaytn);
    try {
      const monsterContract = new caver.klay.Contract(
        farmingABI,
        monsterAddress
      );

      await monsterContract.methods.unstake(staked.id).send({
        from: address,
        gas: 300000,
      });

      dispatch(removeStakedWeapon({ index: staked.id - 1 }));
      updateWeapons();
      dispatch(successNoti({ msg: "NFT 언스테이킹 완료!" }));
    } catch (err) {
      dispatch(failNoti());
    }
    setTimeout(() => {
      dispatch(clearState());
    }, 5000);
  };

  useEffect(() => {
    if (staked?.durability > 0) getRemainingTime();
  }, [staked]);

  // 이런식으로 하면 몇초뒤부터 카운트 시작함
  // getRemainingTime하고 같이 묶으면 endTime이 0임
  // 왜냐하면 state는 rendering이 끝날때 적용되기 때문에
  useEffect(() => {
    if (currentTime === "" || endTime === 0) {
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
          {reward} URU / {endTime === 0 ? cooltime : remainingTime}초
        </p>
        {remainingTime === 0 && (
          <button style={{ fontSize: "1.5rem" }} onClick={getReward}>
            보상획득
          </button>
        )}
      </MonsterHeader>
      <MonsterContainer
        bg={lvl <= 1 ? "easyLevel" : lvl <= 2 ? "midLevel" : "highLevel"}
      >
        <div>
          <WeaponRenderer {...staked} />
          {staked && Object.keys(staked).length ? (
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
        <MonsterImage src={`assets/monster_${lvl}.gif`}></MonsterImage>
      </MonsterContainer>
    </MonsterList>
  );
};

export default Monster;
