import styled from "styled-components";

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 5px;
  width: 85%;

  & button {
    align-self: flex-start;
    background-color: transparent;
    color: white;
    border: none;
    font-size: 1.1rem;

    &:hover {
      opacity: 0.8;
    }

    & > img {
      width: 10px;
      height: 10px;
      margin-left: 5px;
    }
  }

  & input {
    background-color: transparent;
    border: none;
    background-image: url("assets/input.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    height: 40px;
    align-self: center;
    text-align: right;
    width: 96%;
    padding-right: 20px;
  }
`;

export const BalanceContainer = styled.div`
  display: flex;
  align-self: flex-end;
  justify-content: space-between;
  text-align: right;
  width: 50%;
  font-size: 0.5rem;

  & > div {
    border: 1px solid white;
    border-radius: 3px;
    text-align: right;

    &:hover {
      opacity: 0.8;
    }
  }

  & > span {
    width: 100%;
  }
`;
