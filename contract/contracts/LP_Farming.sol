// // SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP7/KIP7.sol";
import "@klaytn/contracts/token/KIP7/IKIP7.sol";
import "@klaytn/contracts/token/KIP7/KIP7Mintable.sol";
import "./Token.sol";

contract LP_Farming {

    // 관련 정보를 기록할 mapping 선언
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
            LP_Token = 0x87E8Df6A461B0451A09bbc1FCc053b47d2dB5A4d; // lp 토큰 주소 (예치)
            token = _token;
        }

    //  예치 기능
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

    // 예치량 빼기
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

    // 마지막 스테이킹 변화로부터 시간 측정 (블록타임 활용)
    function calculateYieldTime(address user) public view returns(uint256){
        uint256 end = block.timestamp;
        uint256 totalTime = end - startTime[user];
        return totalTime;
    }

    // 전체 비율 중 해당 유저의 유동성 기여도 측정
    function calculateContribute(address user) public view returns(uint256){
        uint contribution = stakingBalance[user] / KIP7(LP_Token).balanceOf(address(this)) * 10**18;
        return contribution;
    }

    // 시간과 기여도의 곱으로 지급할 이자를 계산
    // 총 분당 1500개, 초당 25개씩 지급
    function calculateYieldTotal(address user) public view returns(uint256) {
        uint256 time = calculateYieldTime(user);
        uint256 contribution = calculateContribute(user);
        uint256 rawYield = (time * contribution * 25);
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
        token.mint(msg.sender, toTransfer);
        emit YieldWithdraw(msg.sender, toTransfer);
    } 
}