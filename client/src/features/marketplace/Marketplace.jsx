import React, { useState, useEffect } from "react";
import Caver from "caver-js";

import Loading from "../loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { closeMarketplaceModal } from "../modal/marketplaceModalSlice";
import { stopLoading } from "../loading/loadingSlice";

import { ModalCenter } from "../../styles/ModalCenter.styled";
import { Modal, Container, Header } from "../../styles/Modal.styled";
import { DexNavbar } from "../../styles/DexNavbar.styled";
import TradingList from "./components/TradingList";
import ManageList from "./components/ManageList";
import {
  updateList,
  updateOnSaleList,
  updateRemainingList,
} from "./marketplaceSlice";
import { getOwnedWeapons } from "../../helper/getOwnedWeapons";

import {
  marketAddress,
  nftAddress,
  marketABI,
  nftABI,
} from "./nftContractInfo";

const Marketplace = () => {
  const dispatch = useDispatch();
  const { address } = useSelector((state) => state.userInfo);
  const { isLoading } = useSelector((state) => state.loading);
  const [owned, setOwned] = useState([]);
  const [currentNav, setCurrentNav] = useState(0);

  const getMarketplaceList = async () => {
    const caver = new Caver(window.klaytn);
    const market = new caver.klay.Contract(marketABI, marketAddress);
    const nft = new caver.klay.Contract(nftABI, nftAddress);
    let _owned = [...owned];
    if (!owned.length) {
      _owned = await getOwnedWeapons(address);
      setOwned(_owned);
    }

    const _list = await market.methods.getNfts().call();
    const tempList = [];
    const tempOnSale = {};
    for (let i = 0; i < _list.length; i++) {
      const { id, seller, tokenId, price } = _list[i];
      const weapon = await nft.methods.weapons(tokenId - 1).call();
      tempList.push({
        dna: weapon.weaponType,
        lvl: weapon.weaponLevel,
        durability: weapon.durability,
        id: tokenId,
        marketId: id,
        owner: seller,
        price,
      });

      if (seller.toLowerCase() === address.toLowerCase()) {
        tempOnSale[tokenId] = {
          dna: weapon.weaponType,
          lvl: weapon.weaponLevel,
          durability: weapon.durability,
          id: tokenId,
          marketId: id,
          owner: seller,
          price,
        };
      }
    }

    const ownedList = [];
    const remainingList = [];

    for (let i = 0; i < _owned.length; i++) {
      if (tempOnSale[_owned[i].id]) {
        ownedList.push(tempOnSale[_owned[i].id]);
      } else {
        remainingList.push(_owned[i]);
      }
    }

    dispatch(updateList({ list: tempList }));
    dispatch(updateOnSaleList({ list: ownedList }));
    dispatch(updateRemainingList({ list: remainingList }));
    dispatch(stopLoading());
  };

  useEffect(() => {
    getMarketplaceList();
  }, []);

  return (
    <ModalCenter>
      <Modal width={"700px"}>
        <Container>
          <Header>
            <h1>거래소</h1>
            <button
              style={{
                right: "100px",
              }}
              onClick={() => {
                dispatch(closeMarketplaceModal());
              }}
            ></button>
          </Header>
          <DexNavbar left={currentNav * 250}>
            <li onClick={() => setCurrentNav(0)}>거래 목록</li>
            <li onClick={() => setCurrentNav(1)}>관리</li>
            <div style={{ width: "250px" }}></div>
          </DexNavbar>
          {isLoading ? (
            <Loading />
          ) : currentNav === 0 ? (
            <TradingList getMarketplaceList={getMarketplaceList} />
          ) : currentNav === 1 ? (
            <ManageList getMarketplaceList={getMarketplaceList} />
          ) : null}
        </Container>
      </Modal>
    </ModalCenter>
  );
};

export default Marketplace;
