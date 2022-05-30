import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import WeaponRenderer from "../weapon/WeaponRenderer";
import Loading from "../loading/Loading";

import { InventoryContainer } from "../../styles/Inventory.styled";
import { ModalCenter } from "../../styles/ModalCenter.styled";
import { Modal, Container, Header } from "../../styles/Modal.styled";

import { getOwnedWeapons } from "../../helper/getOwnedWeapons";
import { startLoading, stopLoading } from "../loading/loadingSlice";

const Inventory = () => {
  const dispatch = useDispatch();
  const [weapons, setWeapons] = useState([]);
  const { address } = useSelector((state) => state.userInfo);
  const { isLoading } = useSelector((state) => state.loading);

  useEffect(() => {
    const getWeapons = async () => {
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
