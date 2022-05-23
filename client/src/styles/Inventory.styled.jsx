import styled from "styled-components";

export const InventoryContainer = styled.div`
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 5px;
  width: 82%;
  height: 75%;
  overflow: scroll;
`;

export const BuySellButton = styled.button`
  position: relative;
  background-color: transparent;
  border: none;
  background-image: url("assets/button.png");
  width: 100%;
  height: 30px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  color: white;
  font-size: 1rem;
`;

export const PriceInput = styled.input`
  background-color: transparent;
  border: none;
  background-image: url("assets/input.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  height: 30px;
  align-self: center;
  text-align: right;
  width: 70%;
  margin-left: -65px;
  padding-right: 10px;
  font-size: 1rem;
`;
