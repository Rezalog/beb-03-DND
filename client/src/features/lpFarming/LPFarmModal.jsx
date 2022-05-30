import React, { useEffect, useState } from "react";
import Caver from "caver-js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { closeLpFarmModal } from "../modal/lpFarmingModalSlice";

import Farm from "./components/Farm";
import { initExchange } from "../dex/dexSlice";

import { ModalCenter } from "../../styles/ModalCenter.styled";
import { Modal, Container, Header, Button } from "../../styles/Modal.styled";
import { ListContainer } from "../../styles/LPContainer.styled";
import { masterABI, masterAddrss } from "./masterContractInfo";

const LPFarmModal = () => {
  const dispatch = useDispatch();
  const { farms } = useSelector((state) => state.lpFarm);
  const { address: account } = useSelector((state) => state.userInfo);
  const [master, setMaster] = useState(null);
  const { exchanges } = useSelector((state) => state.dex);

  const getExchangeList = async () => {
    let response = await axios.get("http://localhost:8080/contracts/pair", {});
    let temp = [];
    let exchangeList = response.data.map((token) => {
      return {
        address: token.pair_address,
        name: token.pair_name,
      };
    });
    temp = [...exchangeList];
    // response = await axios.get("http://localhost:8080/contracts/v2pair", {});
    // exchangeList = response.data.map((token) => {
    //   return {
    //     address: token.v2pair_address,
    //     name: token.v2pair_name,
    //   };
    // });
    // temp = [...temp, ...exchangeList];
    dispatch(initExchange({ list: temp }));
  };

  useEffect(() => {
    const caver = new Caver(window.klaytn);
    const _master = new caver.klay.Contract(masterABI, masterAddrss);
    setMaster(_master);
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
            {exchanges.map((exchange, idx) => {
              return <Farm key={idx} pid={idx} {...exchange} master={master} />;
            })}
          </ListContainer>
        </Container>
      </Modal>
    </ModalCenter>
  );
};

export default LPFarmModal;
