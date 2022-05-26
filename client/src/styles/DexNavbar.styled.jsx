import styled from "styled-components";

export const DexNavbar = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 80%;
  margin-top: 10px;

  & > li {
    flex: 1;
    text-align: center;
    font-size: 1.2rem;

    &:hover {
      cursor: pointer;
    }
  }

  & > div {
    height: 4px;
    width: ${({ width }) => `${width || "120"}px`};
    background: white;
    position: absolute;
    bottom: -5px;
    left: ${({ left }) => `${left}px`};
    transition: left 0.3s ease;
  }
`;
