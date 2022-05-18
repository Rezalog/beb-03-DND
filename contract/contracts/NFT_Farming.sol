// // SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP17/KIP17.sol";
import "@klaytn/contracts/math/SafeMath.sol";
import "./Token.sol";

contract NFT_Farming {

    using SafeMath for uint256;

    struct Stake {
        uint256 tokenID;
        uint256 yieldLockTime;
        bool isStaking;
    }

    address nft;
    Token token;
    uint256 level;

    event NFTStaked(address owner, uint256 tokenId);
    event NFTUnstaked(address owner, uint256 tokenId);
    event YieldWithdraw(address to, uint256 amount);

    mapping(address => Stake) public stakeInfo;

    constructor (address _NFTaddress, Token _tokenAddress, uint256 _level) public {
        nft = _NFTaddress; // nft 배포 컨트랙트 주소를 받아옴
        token = _tokenAddress; // 보상 (uru 토큰)
        level = _level; // 보상수준을 결정하는 레벨
    }

    function stake (uint256 _tokenID) public {
        // 중복 방지
        // 메타데이터 가져와서 비교 require()
        require(stakeInfo[msg.sender].isStaking != true, "you already hunting monster");

        // 먼저 approve 필요
        KIP17(nft).transferFrom(msg.sender, address(this), _tokenID);
        emit NFTStaked(msg.sender, _tokenID);

        stakeInfo[msg.sender] = Stake({
            tokenID: _tokenID,
            yieldLockTime: block.timestamp,
            isStaking: true
        });
    }

    function unstake (uint256 _tokenID) public {
        require(stakeInfo[msg.sender].tokenID == _tokenID, "not your own NFT");

        KIP17(nft).transferFrom(address(this), msg.sender, _tokenID);
        emit NFTUnstaked(msg.sender, _tokenID);

        delete stakeInfo[msg.sender];
    }   

    function withdrawYield () public {
        require(getStakingTime() > 20, "withdrawl can be 20s after your last claim"); 
        require(stakeInfo[msg.sender].isStaking == true, "there is no staking nft");

        token.mint(msg.sender, level.mul(100));
        stakeInfo[msg.sender].yieldLockTime = block.timestamp;

        emit YieldWithdraw(msg.sender, level.mul(100));
    }

    // assist functions

    function getStakingTime() public view returns(uint256) {
        return block.timestamp - stakeInfo[msg.sender].yieldLockTime;
    } 
}