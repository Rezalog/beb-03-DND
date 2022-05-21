import React, { useState, useEffect } from "react";
import Caver from "caver-js";

import { useDispatch, useSelector } from "react-redux";

import { closeMonsterFarmModal } from "../modal/monsterFarmModalSlice";
import { closeSubModal, updateStakedWeapon } from "./monsterFarmSlice";

import Monster from "./components/Monster";
import WeaponList from "./components/WeaponList";

import { ModalCenter } from "../../styles/ModalCenter.styled";
import { Modal, Container, Header } from "../../styles/Modal.styled";
import { ListContainer } from "../../styles/LPContainer.styled";

import { nftABI, nftAddress } from "../marketplace/nftContractInfo";
import { farmingABI } from "./nftStakingContractInfo";
import { getOwnedWeapons } from "../../helper/getOwnedWeapons";

const MonsterFarm = () => {
  const dispatch = useDispatch();
  const [weapons, setWeapons] = useState([]);
  const [availableWeapons, setAvailableWeapons] = useState([]);
  const { address } = useSelector((state) => state.userInfo);
  const { monsters, isSubModalOpen, staked } = useSelector(
    (state) => state.monsterFarm
  );
  const [selectedMonsterAddress, setSelectedMonsterAddress] = useState("");
  const [stakedWeapons, setStakedWeapons] = useState([]);
  const [currentTime, setCurrentTime] = useState("");

  // useEffect dependency list 잘 활용하기
  useEffect(() => {
    const temp = [];
    const getWeapons = async () => {
      const list = await getOwnedWeapons(address);

      setWeapons(list);
    };

    const getStakeInfo = async () => {
      const caver = new Caver(window.klaytn);
      for (let i = 0; i < monsters.length; i++) {
        const monsterContract = new caver.klay.Contract(
          farmingABI,
          monsters[i].address
        );

        const stakeInfo = await monsterContract.methods
          .stakeInfo(address)
          .call();

        let tempObj = {};
        if (stakeInfo.isStaking) {
          const nft = new caver.klay.Contract(nftABI, nftAddress);
          const weapon = await nft.methods
            .weapons(stakeInfo.tokenID - 1)
            .call();
          tempObj = {
            dna: weapon.weaponType,
            lvl: weapon.weaponLevel,
            id: stakeInfo.tokenID,
          };
        }
        temp.push(tempObj);
      }
      dispatch(updateStakedWeapon({ staked: temp }));
      //setStakedWeapons([...temp]);
      console.log(temp);
    };

    getWeapons();
    getStakeInfo();

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
              {monsters.map((monster, idx) => {
                return (
                  <Monster
                    key={idx}
                    staked={staked[idx]}
                    {...monster}
                    weapons={weapons}
                    setAvailableWeapons={setAvailableWeapons}
                    setSelectedMonsterAddress={setSelectedMonsterAddress}
                    currentTime={currentTime}
                  ></Monster>
                );
              })}
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
            />
          </Container>
        </Modal>
      )}
    </ModalCenter>
  );
};

export default MonsterFarm;
