import styled from "styled-components";

export const LPContainer = styled.li`
  position: relative;
  width: 90%;
  height: ${({ height }) => `${height}px`};
  background-color: #ead4aa;
  color: black;
  overflow: hidden;
  box-shadow: 0px 0px 0px 5px #e4a672;

  transition: height 0.4s ease-out;
  margin: 20px auto;
`;

export const Content = styled.div`
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ListContainer = styled.ul`
  position: relative;
  width: 90%;
  overflow: scroll;
  margin: 30px 0;
`;

export const LPHeader = styled.div`
  width: 100%;
  margin: 5px 0px;
  padding: 0px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > div {
    text-align: left;
  }

  & > img {
    width: 15px;
    height: 10px;

    transform: scaleY(${({ scale }) => `${scale}`});
  }
`;
