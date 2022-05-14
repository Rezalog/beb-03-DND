import styled from "styled-components";

export const Modal = styled.div`
  position: relative;
  width: 360px;
  height: 480px;
  background-image: url("assets/modal.png");
  background-size: cover;
  z-index: 10;
  color: white;
`;

export const Container = styled.div`
  position: absolute;
  padding: 40px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Header = styled.div`
  position: relative;

  & > button {
    position: absolute;
    top: 10px;
    right: -75px;
  }
`;

export const Button = styled.button`
  background-color: transparent;
  border: none;
  background-image: url("assets/button.png");
  width: 90%;
  height: 50px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  color: white;
`;
