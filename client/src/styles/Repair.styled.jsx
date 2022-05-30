import styled from "styled-components";

export const RepairModal = styled.div`
  position: fixed;
  width: 350px;
  height: 200px;
  background-image: url("assets/modal.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 10;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  & > h2 {
    margin-top: 30px;
  }
`;

export const RepairClose = styled.button`
  position: absolute;
  top: 15px;
  right: 40px;
  background-color: transparent;
  border: none;
  background-image: url("assets/close.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  width: 48px;
  height: 48px;
`;
