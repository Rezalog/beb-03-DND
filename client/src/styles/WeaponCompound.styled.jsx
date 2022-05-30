import styled from "styled-components";

export const WeaponCompoundModalBox = styled.div`
  position: fixed;
  width: 1000px;
  height: 700px;
  z-index: 10;
  color: white;
  top: 30px;
  left: 15vw;
  right: 15vw;
  background-color: rgb(63, 40, 50);
  border-radius: 10px;
  border-bottom: solid 10px rgb(116, 63, 57);
  border-right: solid 10px rgb(116, 63, 57);
  border-top: solid 10px rgb(184, 111, 80);
  border-left: solid 10px rgb(184, 111, 80);
`;

export const WeaponCompoundButton = styled.button`
  font-size: 30px;
  color: white;
  margin: 20px;
  padding: 10px;
  background-color: rgb(116, 63, 57);
`;

export const CloseWeaponCompoundButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  border: none;
  background-image: url("assets/close.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  width: 30px;
  height: 30px;
`;

export const SelectContainer = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 5px;
  height: 85%;
  overflow: scroll;
  border: white solid 3px;
  padding: 5px;

  & button {
    width: 70px;
    background-color: white;
    font-size: 10pt;
    padding: 3px;
    margin-top: 5px;
  }
`;

export const CompoundInfoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 50vw;
  height: 20vh;
  background-color: gray;
  font-size: 14pt;
  border: solid 2px black;
`;

export const CompoundInfoHeader = styled.div`
  margin: 10px;
  font-size: 14pt;
`;

export const SelectedWeapon = styled.div`
  margin: 20px;
  padding: 10px;
`;

export const CompoundResultContainer = styled.div``;
