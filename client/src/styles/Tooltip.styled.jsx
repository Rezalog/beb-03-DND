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
  background-image: ${(props) => `url("assets/Frames/${props.frame}.png");`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;

  & > img {
    width: 60%;
    position: absolute;
    top: 35px;
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
  bottom: 15px;

  & > p {
    position: absolute;
    left: 15px;
    top: 0px;
  }
`;

export const TooltipTextContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 3px 40px;
  justify-content: space-between;
  align-items: center;
`;
