import styled, { keyframes } from "styled-components";

const hoverAnimation = keyframes`
    0% {
      transform: scale(1);
    }
    50%{
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }  
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const StartImage = styled.img`
  margin-top: 50px;
  width: 80%;

  &:hover {
    animation: ${hoverAnimation} 1s infinite ease-in-out;
  }
`;
