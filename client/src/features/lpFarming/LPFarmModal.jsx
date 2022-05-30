import React, { useEffect, useState } from "react";
import Caver from "caver-js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { closeLpFarmModal } from "../modal/lpFarmingModalSlice";

import Farm from "./components/Farm";
import { initFarm, initMaster } from "./lpFarmSlice";

import { ModalCenter } from "../../styles/ModalCenter.styled";
import { Modal, Container, Header, Button } from "../../styles/Modal.styled";
import { ListContainer } from "../../styles/LPContainer.styled";
import { masterABI, masterAddrss } from "./masterContractInfo";

const LPFarmModal = () => {
  const dispatch = useDispatch();
  const { farms } = useSelector((state) => state.lpFarm);
  const { address: account } = useSelector((state) => state.userInfo);

  const getExchangeList = async () => {
    let response = await axios.get("http://localhost:8080/contracts/pair", {});
    let temp = [];
    const caver = new Caver(window.klaytn);
    const master = new caver.klay.Contract(masterABI, masterAddrss);

    for (let i = 0; i < response.data.length; i++) {
      let pid = await master.methods
        .poolId(response.data[i].pair_address)
        .call();
      temp.push({
        address: response.data[i].pair_address,
        name: response.data[i].pair_name,
        pid: Number(pid),
      });
      console.log("p;id", pid);
    }
    response = await axios.get("http://localhost:8080/contracts/v2pair", {});

    for (let i = 0; i < response.data.length; i++) {
      console.log(response.data[i]);
      let pid = await master.methods
        .poolId(response.data[i].v2pair_address)
        .call();
      temp.push({
        address: response.data[i].v2pair_address,
        name: response.data[i].v2pair_name,
        pid: Number(pid),
      });
    }
    dispatch(initFarm({ list: temp }));
  };

  useEffect(() => {
    getExchangeList();
  }, []);
  return (
    <ModalCenter>
      <Modal height={"750px"}>
        <Container height={"750px"}>
          <Header>
            <h1>파밍</h1>
            <button onClick={() => dispatch(closeLpFarmModal())}></button>
          </Header>
          <ListContainer>
            {farms.map((farm, idx) => {
              return <Farm key={idx} {...farm} />;
            })}
          </ListContainer>
        </Container>
      </Modal>
    </ModalCenter>
  );
};

export default LPFarmModal;
