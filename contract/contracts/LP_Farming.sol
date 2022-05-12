// // SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP7/KIP7.sol";
import "@klaytn/contracts/token/KIP7/IKIP7.sol";
import "@klaytn/contracts/token/KIP7/KIP7Mintable.sol";
import "./Token.sol";

contract LP_Farming {

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public isStaking;
    mapping(address => uint256) public startTime;
    mapping(address => uint256) public URUBalance;

    string public name = "LP_Farming";

    address public LP_Token;
    Token public token;

    event Stake(address indexed from, uint256 amount);
    event Unstake(address indexed from, uint256 amount);
    event YieldWithdraw(address indexed to, uint256 amount);

    constructor (
        Token _token
        ) public {
            LP_Token = 0x21e262db15568CfEe89C4A78E0306C8C4eaD5b57; // lp 토큰 주소 (예치)
            token = _token;
            // URU = 0xF9c00537247Db2331Dd62C73cb4e1C5e1D7502E3; // URU 토큰 주소 (보상)
        }

    function stake(uint256 amount) public {
        require(
            amount > 0 &&
            KIP7(LP_Token).balanceOf(msg.sender) >= amount, 
            "토큰이 부족합니다");

        if(isStaking[msg.sender] == true){
            uint256 toTransfer = calculateYieldTotal(msg.sender);
            URUBalance[msg.sender] += toTransfer;
        }

        KIP7(LP_Token).transferFrom(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
        emit Stake(msg.sender, amount);
    }

    function unstake(uint256 amount) public {
        require(
            isStaking[msg.sender] = true &&
            stakingBalance[msg.sender] >= amount, 
            "예치량보다 많습니다"
        );
        uint256 yieldTransfer = calculateYieldTotal(msg.sender);
        startTime[msg.sender] = block.timestamp;
        uint256 balTransfer = amount;
        amount = 0;
        stakingBalance[msg.sender] -= balTransfer;
        KIP7(LP_Token).transfer(msg.sender, balTransfer);
        URUBalance[msg.sender] += yieldTransfer;
        if(stakingBalance[msg.sender] == 0){
            isStaking[msg.sender] = false;
        }
        emit Unstake(msg.sender, balTransfer);
    }

    function calculateYieldTime(address user) public view returns(uint256){
        uint256 end = block.timestamp;
        uint256 totalTime = end - startTime[user];
        return totalTime;
    }


    function calculateYieldTotal(address user) public view returns(uint256) {
        uint256 time = calculateYieldTime(user) * 10**18;
        uint256 rawYield = (time * 25) / 10**18;
        return rawYield;
    } 

    function withdrawYield() public {
        uint256 toTransfer = calculateYieldTotal(msg.sender);

        require(
            toTransfer > 0 ||
            URUBalance[msg.sender] > 0,
            "Nothing to withdraw"
            );
            
        if(URUBalance[msg.sender] != 0){
            uint256 oldBalance = URUBalance[msg.sender];
            URUBalance[msg.sender] = 0;
            toTransfer += oldBalance;
        }

        startTime[msg.sender] = block.timestamp;
        token.mint(msg.sender, 10000);
        emit YieldWithdraw(msg.sender, toTransfer);
    } 
}