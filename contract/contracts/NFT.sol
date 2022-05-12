// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@klaytn/contracts/token/KIP17/KIP17Full.sol";
import "../node_modules/@klaytn/contracts/drafts/Counters.sol";

contract NFT is KIP17Full{
  using Counters for Counters.Counter;
  Counters.Counter private _Ids;

  constructor() public KIP17Full("DND-WEAPON", "WEAPON"){}

  function mint (address recipient, string memory _tokenURI) public returns (uint256) {
    _Ids.increment();

    uint256 newItemId = _Ids.current();
    _mint(recipient, newItemId);
    _setTokenURI(newItemId, _tokenURI);

    return newItemId;
  }
}