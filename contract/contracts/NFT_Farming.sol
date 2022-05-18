// // SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "@klaytn/contracts/math/SafeMath.sol";

contract NFT-Farming {

    using SafeMath for uint256;

    address nft;
    address token;
    uint8 level;

    event NFTStaked(address owner, uint256 tokenId);
    event NFTUnstaked(address owner, uint256 tokenId);
    event YieldWithdraw(address indexed to, uint256 amount);

    mapping(uint256 => bool) public isStaking;
    mapping(address => uint256) public yieldLockTime;

    constructor (address _NFTaddress, address _tokenaddress, uint8 _level) public {
        nft = _NFTaddress; // nft 배포 컨트랙트 주소를 받아옴
        token = _tokenaddress; // 보상 (uru 토큰)
        level = _level; // 보상수준을 결정하는 레벨
    }

    function stake (uint256 _tokenID) public {
        // 중복 방지
        require(isStaking[_tokenID] != true, "already staking");

        // 먼저 approve 필요
        nft.transferFrom(msg.sender, address(this), _tokenID)
        emit NFTStaked(msg.sender, _tokenId);

        isStaking[_tokenID] = true;
    }

    function unskate (uint256 _tokenID) public {
        require("nft 주인" == msg.sender, "소유한 nft가 아닙니다")

        nft.transferFrom(address(this), msg.sender, _tokenID)
        emit NFTUnstaked(msg.sender, _tokenId);
    }   

    function calculateYield(address user) public view returns(uint256) {
        uint256 stakingTime = lock.timestamp.sub(startTime[user]);
        return stakingTime / 86400;
    } 

    function withdrawYield () public {

        uint256 toTransfer = calculateYield(msg.sender);
        require(toTransfer > 0, "Nothing to withdraw");
        require(block.timestamp.sub(yieldLockTime[msg.sender] > 60, "이자는 매 ## 마다 출금 가능합니다"))

        token.mint(msg.sender, toTransfer)
        yieldLockTime[msg.sender] = block.timestamp

        emit YieldWithdraw(msg.sender, toTransfer)
    }

    // assist functions

    function assist () public view returns() {

    } 
}