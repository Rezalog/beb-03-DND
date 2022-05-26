import styled from "styled-components";

export const Container = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 5px;
  /* width: 82%; */
  height: 75%;
  overflow: scroll;
  border: white solid 3px;
  padding: 5px;
`;
