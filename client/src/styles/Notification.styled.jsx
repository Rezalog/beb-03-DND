import styled from "styled-components";

export const NotificationCard = styled.div`
  position: fixed;
  width: 400px;
  height: 50px;
  background: black;
  top: 50px;
  right: 0;
  z-index: 10;
  color: white;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;

  & > p {
    width: 350px;
    padding-left: 30px;
    text-align: left;
  }
`;
