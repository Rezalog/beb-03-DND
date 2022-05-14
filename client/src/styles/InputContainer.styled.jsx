import styled from "styled-components";

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  width: 85%;

  & button {
    align-self: flex-start;
    background-color: transparent;
    color: white;
    border: none;
    font-size: 2rem;
    margin-left: 10px;

    & > img {
      width: 14px;
      height: 14px;
      margin-left: 10px;
    }
  }

  & input {
    background-color: transparent;
    border: none;
    background-image: url("assets/input.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    height: 70px;
    align-self: center;
    text-align: right;
    width: 100%;
    padding-right: 30px;
    font-size: 2rem;
  }
`;

export const BalanceContainer = styled.div`
  display: flex;
  align-self: center;
  justify-content: flex-end;
  text-align: right;
  width: 100%;
  font-size: 1.2rem;
  margin-top: 2px;
  margin-right: 20px;

  & > div {
    border: 1px solid white;
    border-radius: 3px;
    text-align: right;
    margin-right: 10px;

    &:hover {
      opacity: 0.8;
    }
  }
`;
