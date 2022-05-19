// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "./NFT_Farming.sol";
import "./Token.sol";

contract NFT_Factory {

    Token public uru;

    function createNFTFarm(address _NFTAddress, Token _tokenAddress, uint256 _level, uint256 _coolDownTime) public returns (address) {
        
        uru = _tokenAddress;
        require(_NFTAddress != address(0), "invalid NFT address");

        NFT_Farming nft_farming = new NFT_Farming(_NFTAddress, uru, _level, _coolDownTime);

        return address(nft_farming);
    }
}
