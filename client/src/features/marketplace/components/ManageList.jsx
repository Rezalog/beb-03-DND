import React, { useState, useEffect } from "react";

import Caver from "caver-js";
import { useDispatch, useSelector } from "react-redux";
import PriceModal from "./PriceModal";

import { InventoryContainer } from "../../../styles/Inventory.styled";
import WeaponRenderer from "../../weapon/WeaponRenderer";
import { updateList } from "../marketplaceSlice";
import { BuySellButton, PriceInput } from "../../../styles/Inventory.styled";
import { update, updateOnSaleList } from "../marketplaceSlice";

import {
  marketAddress,
  nftAddress,
  marketABI,
  nftABI,
} from "../nftContractInfo";

const ManageList = ({ getMarketplaceList }) => {
  const dispatch = useDispatch();
  const [isSell, setIsSell] = useState(false);
  const [sellingItem, setSellingItem] = useState(0);
  const { address } = useSelector((state) => state.userInfo);
  const { onSaleList, remainingList } = useSelector(
    (state) => state.marketplace
  );

  const sellWeapon = async (price) => {
    const caver = new Caver(window.klaytn);
    const market = new caver.klay.Contract(marketABI, marketAddress);

    const nft = new caver.klay.KIP17(nftAddress);
    const isApproved = await nft.isApprovedForAll(address, marketAddress);
    console.log(isApproved);
    if (!isApproved) {
      console.log("here");
      await nft.setApprovalForAll(marketAddress, true, { from: address });
    }

    await market.methods
      .addNftToMarket(sellingItem, caver.utils.toPeb(price))
      .send({
        from: address,
        gas: 200000,
      });
    getMarketplaceList();
    setIsSell(!isSell);
  };

  const removeItem = async (id) => {
    const caver = new Caver(window.klaytn);
    const market = new caver.klay.Contract(marketABI, marketAddress);

    await market.methods.removeNft(id).send({
      from: address,
      gas: 200000,
    });
    getMarketplaceList();
    setIsSell(!isSell);
  };

  return (
    <InventoryContainer style={{ height: "70%" }}>
      {onSaleList.map((item, idx) => {
        return (
          <div key={idx}>
            <WeaponRenderer {...item} />
            <BuySellButton
              onClick={() => {
                removeItem(item.marketId);
              }}
            >
              제거
            </BuySellButton>
          </div>
        );
      })}
      {remainingList.map((item, idx) => {
        return (
          <div>
            <WeaponRenderer key={idx} {...item}></WeaponRenderer>
            <BuySellButton
              onClick={() => {
                setIsSell(!isSell);
                setSellingItem(item.id);
              }}
            >
              판매
            </BuySellButton>
          </div>
        );
      })}
      {isSell && (
        <PriceModal setIsSell={setIsSell} sellWeapon={sellWeapon}></PriceModal>
      )}
    </InventoryContainer>
  );
};

export default ManageList;
