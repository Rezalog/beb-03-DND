import styled from "styled-components";

export const WeaponContainer = styled.div`
  position: relative;
  width: 96px;
  height: 96px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: #8f5765;
  border: ${(props) => {
    if (props.durability >= 8) {
      return "5px solid black";
    } else if (props.durability === "0") {
      return "5px solid red";
    } else {
      return "5px solid orange";
    }
  }};
  & > img {
    width: 90%;
  }
`;

export const WeaponInfoContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #cf968c;
  bottom: 0;

  & > p {
    position: absolute;
    left: 2px;
    top: 0px;
  }
`;

export const WeaponTextContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 3px 40px;
  justify-content: space-between;
  align-items: center;
  background-color: #cf968c;
`;
