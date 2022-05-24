import styled from "styled-components";

export const MonsterList = styled.li`
  position: relative;
  background: black;
  width: 90%;
  height: 200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
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
`;
