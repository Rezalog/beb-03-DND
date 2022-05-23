import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import WeaponRenderer from "../weapon/WeaponRenderer";
import Loading from "../loading/Loading";

import { InventoryContainer } from "../../styles/Inventory.styled";
import { ModalCenter } from "../../styles/ModalCenter.styled";
import { Modal, Container, Header } from "../../styles/Modal.styled";

import { getOwnedWeapons } from "../../helper/getOwnedWeapons";
import { startLoading, stopLoading } from "../loading/loadingSlice";
// const weapons = [
//   { dna: "5948301827384950", lvl: "1" },
//   { dna: "9829384617283748", lvl: "2" },
//   { dna: "1293745749283749", lvl: "3" },
//   { dna: "3982769740123042", lvl: "4" },
//   { dna: "7940102037588923", lvl: "5" },
//   { dna: "1209375847690857", lvl: "6" },
//   { dna: "8458493938392749", lvl: "7" },
//   { dna: "9202375918759385", lvl: "8" },
//   { dna: "107785958456567", lvl: "9" },
//   { dna: "7549384759048570", lvl: "10" },
// ];

const Inventory = () => {
  const dispatch = useDispatch();
  const [weapons, setWeapons] = useState([]);
  const { address } = useSelector((state) => state.userInfo);
  const { isLoading } = useSelector((state) => state.loading);

  useEffect(() => {
    const getWeapons = async () => {
      console.log(isLoading);
      const list = await getOwnedWeapons(address);

      setWeapons(list);
      dispatch(stopLoading());
    };
    getWeapons();
  }, []);
  return (
    <ModalCenter>
      <Modal width={"700px"}>
        <Container>
          <Header>
            <h1>인벤토리</h1>
          </Header>
          {isLoading ? (
            <Loading />
          ) : (
            <InventoryContainer>
              {weapons.map((weapon, idx) => {
                return <WeaponRenderer key={idx} {...weapon} />;
              })}
            </InventoryContainer>
          )}
        </Container>
      </Modal>
    </ModalCenter>
  );
};

export default Inventory;
