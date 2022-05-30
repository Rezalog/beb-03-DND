import React, { useState, useEffect } from "react";
import Caver from "caver-js";

import { useDispatch, useSelector } from "react-redux";

import { closeMonsterFarmModal } from "../modal/monsterFarmModalSlice";
import {
  closeSubModal,
  updateStakedWeapon,
  initMonsters,
} from "./monsterFarmSlice";

import Monster from "./components/Monster";
import WeaponList from "./components/WeaponList";
import Loading from "../loading/Loading";

import { ModalCenter } from "../../styles/ModalCenter.styled";
import { Modal, Container, Header } from "../../styles/Modal.styled";
import { ListContainer } from "../../styles/LPContainer.styled";

import { nftABI, nftAddress } from "../marketplace/nftContractInfo";
import {
  farmingABI,
  nftFactoryABI,
  nftFactoryAddress,
} from "./nftStakingContractInfo";
import { getOwnedWeapons } from "../../helper/getOwnedWeapons";
import { startLoading, stopLoading } from "../loading/loadingSlice";

const MonsterFarm = () => {
  const dispatch = useDispatch();
  const [weapons, setWeapons] = useState([]);
  const [availableWeapons, setAvailableWeapons] = useState([]);
  const { address } = useSelector((state) => state.userInfo);
  const { monsters, isSubModalOpen, staked } = useSelector(
    (state) => state.monsterFarm
  );
  const { isLoading } = useSelector((state) => state.loading);
  const [selectedMonsterAddress, setSelectedMonsterAddress] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const getMonsters = async () => {
    dispatch(startLoading());
    const caver = new Caver(window.klaytn);

    const factory = new caver.klay.Contract(nftFactoryABI, nftFactoryAddress);
    const list = await factory.methods.getMonsters().call();
    dispatch(
      initMonsters({
        list: list.map((monster) => {
          const { NFTAddress, name, level, coolDownTime, reward } = monster;
          return {
            address: NFTAddress,
            name,
            lvl: level,
            cooltime: coolDownTime,
            reward: caver.utils.fromPeb(reward),
          };
        }),
      })
    );
  };
  const updateWeapons = async () => {
    const temp = [];
    if (!weapons.length) {
      const list = await getOwnedWeapons(address);
      setWeapons(list);
    }

    const caver = new Caver(window.klaytn);
    for (let i = 0; i < monsters.length; i++) {
      const monsterContract = new caver.klay.Contract(
        farmingABI,
        monsters[i].address
      );

      const stakeInfo = await monsterContract.methods.stakeInfo(address).call();
      let tempObj = {};
      if (stakeInfo.isStaking) {
        const nft = new caver.klay.Contract(nftABI, nftAddress);
        const weapon = await nft.methods.weapons(stakeInfo.tokenID - 1).call();
        tempObj = {
          dna: weapon.weaponType,
          lvl: weapon.weaponLevel,
          durability: weapon.durability,
          id: stakeInfo.tokenID,
        };
      }
      temp.push(tempObj);
    }
    dispatch(updateStakedWeapon({ staked: temp }));
    //setStakedWeapons([...temp]);
    dispatch(stopLoading());
  };

  useEffect(() => {
    getMonsters();
  }, []);

  useEffect(() => {
    updateWeapons();
  }, [monsters]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      const currentTime = Math.round(new Date().getTime() / 1000);
      setCurrentTime(currentTime);
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  return (
    <ModalCenter>
      {!isSubModalOpen ? (
        <Modal height={"750px"}>
          <Container height={"750px"}>
            <Header>
              <h1>사냥</h1>
              <button
                onClick={() => dispatch(closeMonsterFarmModal())}
              ></button>
            </Header>
            <ListContainer>
              {isLoading ? (
                <Loading />
              ) : (
                monsters.map((monster, idx) => {
                  return (
                    <Monster
                      key={idx}
                      staked={staked[idx]}
                      {...monster}
                      weapons={weapons}
                      setAvailableWeapons={setAvailableWeapons}
                      setSelectedMonsterAddress={setSelectedMonsterAddress}
                      currentTime={currentTime}
                      updateWeapons={updateWeapons}
                    ></Monster>
                  );
                })
              )}
            </ListContainer>
          </Container>
        </Modal>
      ) : (
        <Modal width={"700px"}>
          <Container height={"750px"}>
            <Header>
              <h1>무기 선택</h1>
              <button onClick={() => dispatch(closeSubModal())}></button>
            </Header>
            <WeaponList
              availableWeapons={availableWeapons}
              selectedMonsterAddress={selectedMonsterAddress}
              updateWeapons={updateWeapons}
            />
          </Container>
        </Modal>
      )}
    </ModalCenter>
  );
};

export default MonsterFarm;
