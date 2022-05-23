// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP7/KIP7.sol";
import "@klaytn/contracts/token/KIP7/KIP7Metadata.sol";

contract DNDToken is KIP7, KIP7Metadata {
  constructor(
    string memory name,
    string memory symbol,
    uint8 decimals,
    uint256 initialSupply
  ) KIP7Metadata(name, symbol, decimals) public {
    _mint(msg.sender, initialSupply);
  }
  function mint(address to, uint256 amount) public {
    _mint(to, amount);
  }
}
