// // SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP17/KIP17.sol";
import "@klaytn/contracts/math/SafeMath.sol";
import "./Token.sol";
import "./NFT.sol";

contract NFT_Farming {

    using SafeMath for uint256;

    // 각 주소의 스테이킹 정보를 저장
    struct Stake {
        uint256 tokenID;
        uint256 yieldLockTime;
        bool isStaking;
    }

    mapping(address => Stake) public stakeInfo;
    

    Token token;
    NFT nft;
    uint256 level;
    uint256 coolDownTime;
    uint256 reward;

    // lock 관련 선언
    uint8 lockedPercentage = 95;
    uint256 lockStartTime;
    uint256 nextEpoch;
    uint256 epochDuration;

    event NFTStaked(address owner, uint256 tokenId);
    event NFTUnstaked(address owner, uint256 tokenId);
    event YieldWithdraw(address to, uint256 amount);

    constructor (NFT _NFTaddress, Token _tokenAddress, uint256 _level, uint256 _coolDownTime, uint256 _reward) public {
        nft = _NFTaddress; // NFT 컨트랙트 주소
        token = _tokenAddress; // URU 토큰 컨트랙트 주소
        level = _level; // 보상수준을 결정하는 레벨
        coolDownTime = _coolDownTime; // 한 번 클레임 한 후 다음 클레임까지 쿨다운 타임
        reward = _reward;
    }

    function stake (uint256 _tokenID) public {
        // 레벨에 맞는 던전 입장
        require(nft.getWeaponLevel(_tokenID) == level, "weapon and dungeon level do not match");
        // 중복 사냥 금지
        require(stakeInfo[msg.sender].isStaking != true, "you already hunting monster");

        // stake 함수 호출 전 approve 필요!\
        KIP17(nft).transferFrom(msg.sender, address(this), _tokenID);
        emit NFTStaked(msg.sender, _tokenID);

        stakeInfo[msg.sender] = Stake({
            tokenID: _tokenID,
            yieldLockTime: block.timestamp,
            isStaking: true
        });
    }

    function unstake (uint256 _tokenID) public {
        // 본인 소유의 NFT만 인출 가능
        require(stakeInfo[msg.sender].tokenID == _tokenID, "not your own NFT");

        KIP17(nft).transferFrom(address(this), msg.sender, _tokenID);
        emit NFTUnstaked(msg.sender, _tokenID);

        delete stakeInfo[msg.sender];
    }   

    function withdrawYield () public {
        (,,uint256 durability,) = nft.weapons(stakeInfo[msg.sender].tokenID - 1);
        require(durability > 0);
        require(getStakingTime() > coolDownTime, "withdrawl can be after cooldowntime"); 
        require(stakeInfo[msg.sender].isStaking == true, "there is no staking nft");

        token.mint(msg.sender, reward);
        stakeInfo[msg.sender].yieldLockTime = block.timestamp;
        nft.stakingWeapon(stakeInfo[msg.sender].tokenID);
        emit YieldWithdraw(msg.sender, reward);
    }

    // assist functions

    function getStakingTime() public view returns(uint256) {
        return block.timestamp - stakeInfo[msg.sender].yieldLockTime;
    } 
}