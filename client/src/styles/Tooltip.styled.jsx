import styled from "styled-components";

export const TooltipCard = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  transform: ${(props) => `translate(${props.x}px, ${props.y}px)`};
`;

export const TooltipContainer = styled.div`
  position: relative;
  width: 250px;
  height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: #8f5765;
  border: 5px solid black;

  & > img {
    width: 90%;
    position: absolute;
    top: 10px;
  }
`;

export const TooltipInfoContainer = styled.div`
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

export const TooltipTextContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 3px 40px;
  justify-content: space-between;
  align-items: center;
  background-color: #cf968c;
`;
