import styled from "styled-components";

export const MonsterList = styled.li`
  position: relative;
  width: 95%;
  height: 250px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  background-color: black;
  color: white;
  box-shadow: 0px 0px 0px 5px grey;
`;

export const MonsterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 5px 10px;
  height: 20%;
`;

export const MonsterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  height: 80%;
  background-image: ${({ bg }) => `url("assets/${bg}.png");`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
`;

export const MonsterImage = styled.img`
  position: absolute;
  width: 64px;
  height: 64px;
  right: 10px;
  bottom: 60px;
`;
