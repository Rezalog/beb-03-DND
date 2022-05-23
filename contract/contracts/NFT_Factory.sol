// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "./NFT_Farming.sol";
import "./Token.sol";
import "./NFT.sol";

contract NFT_Factory {

    NFT public nft;
    Token public uru;

    function createNFTFarm(NFT _NFTAddress, Token _tokenAddress, uint256 _level, uint256 _coolDownTime) public returns (address) {
        
        nft = _NFTAddress;
        uru = _tokenAddress;
        require(address(_NFTAddress) != address(0), "invalid NFT address");
        require(address(_tokenAddress) != address(0), "invalid token address");

        NFT_Farming nft_farming = new NFT_Farming(nft, uru, _level, _coolDownTime);

        return address(nft_farming);
    }
}

