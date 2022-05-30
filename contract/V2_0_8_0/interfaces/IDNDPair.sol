// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IDNDPair {
    function initialize(address, address) external;
    function getReserves() external view returns (uint112, uint112, uint32);

    function mint(address) external returns (uint);
    function burn(address) external returns (uint, uint);
    function swap(uint amount0Out, uint, address, bytes calldata) external;
    
    function transferFrom(address, address, uint256) external returns (bool);
}