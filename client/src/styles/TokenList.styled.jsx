import styled from "styled-components";

export const TokenList = styled.ul`
  width: 70%;
  font-size: 2rem;
  text-align: left;
  margin-top: 20px;
`;

export const TokenContainer = styled.div`
  & > li {
    margin-bottom: 10px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  & > li > p {
    margin-top: 5px;
    font-size: 1.3rem;
  }
  & > hr {
    margin-bottom: 10px;
  }
`;
