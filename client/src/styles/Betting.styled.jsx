import styled from "styled-components";

export const BettingIcon = styled.div`
  position: fixed;
  top: 10px;
  left: 400px;
  width: 128px;
  height: 128px;
  background-color: transparent;
  border: none;
  background-image: url("assets/betting.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(0.9);
  }
`;

export const BetItem = styled.li`
  position: relative;
  margin: 10px auto;
  width: 90%;
  height: 150px;
  display: flex;
  flex-direction: column;
  background-color: #ead4aa;
  color: black;
  box-shadow: 0px 0px 0px 5px #e4a672;
  margin-bottom: 20px;
`;

export const BetTitle = styled.p`
  font-size: 1.5rem;
  display: flex;
  justify-self: flex-start;
  align-items: flex-end;
  margin: 10px 5px;
`;

export const BetInfo = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 10px;
  & > .txt {
    font-size: 1.2rem;
  }
  & > .vs {
    font-size: 2rem;
  }
  & > .rate {
    font-size: 3rem;
  }
`;

export const BetButton = styled.div`
  & > input {
    width: 100px;
  }
`;
