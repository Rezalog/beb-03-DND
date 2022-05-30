import React from "react";
import Caver from "caver-js";
import WeaponRenderer from "../../weapon/WeaponRenderer";
import { useDispatch, useSelector } from "react-redux";

import { closeSubModal } from "../monsterFarmSlice";
import {
  pendingNoti,
  successNoti,
  failNoti,
  clearState,
} from "../../notification/notifiactionSlice";

import { InventoryContainer } from "../../../styles/Inventory.styled";
import { BuySellButton } from "../../../styles/Inventory.styled";

import { farmingABI } from "../nftStakingContractInfo";
import { nftAddress } from "../../marketplace/nftContractInfo";
const WeaponList = ({
  availableWeapons,
  selectedMonsterAddress,
  updateWeapons,
}) => {
  const dispatch = useDispatch();
  const { address } = useSelector((state) => state.userInfo);
  const { isPending } = useSelector((state) => state.notification);

  const stakeWeapon = async (id) => {
    dispatch(pendingNoti());
    const caver = new Caver(window.klaytn);
    try {
      const monsterContract = new caver.klay.Contract(
        farmingABI,
        selectedMonsterAddress
      );

      const nft = new caver.klay.KIP17(nftAddress);
      const isApproved = await nft.isApprovedForAll(
        address,
        selectedMonsterAddress
      );
      if (!isApproved) {
        await nft.setApprovalForAll(selectedMonsterAddress, true, {
          from: address,
        });
      }

      await monsterContract.methods.stake(id).send({
        from: address,
        gas: 300000,
      });

      dispatch(closeSubModal());
      updateWeapons();
      dispatch(successNoti({ msg: "NFT 스테이킹 완료!" }));
    } catch (err) {
      dispatch(failNoti());
    }
    setTimeout(() => {
      dispatch(clearState());
    }, 5000);
  };
  return (
    <InventoryContainer>
      {availableWeapons.map((item, idx) => {
        return (
          <div key={idx}>
            <WeaponRenderer {...item}></WeaponRenderer>
            <BuySellButton onClick={() => stakeWeapon(item.id)}>
              선택
            </BuySellButton>
          </div>
        );
      })}
    </InventoryContainer>
  );
};

export default WeaponList;
