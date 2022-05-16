// // SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP7/KIP7.sol";
import "@klaytn/contracts/token/KIP7/IKIP7.sol";
import "@klaytn/contracts/token/KIP7/KIP7Mintable.sol";
import "./Token.sol";

contract LP_Farming {
    
    // iterations을 위한 배열 선언
    address[] public userList;

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
            LP_Token = 0x28F6221ED6F6e23C4943Bb5910E2F6BAb6F49470; // lp 토큰 주소 (예치)
            token = _token;
        }

    //  예치 기능
    function stake(uint256 amount) public {
        require(
            amount > 0 &&
            KIP7(LP_Token).balanceOf(msg.sender) >= amount, 
            "토큰이 부족합니다");

        // userList에 "없는 주소일 경우" msg.sender을 주소를 userList에 삽입
        if(isStaking[msg.sender] == false) {
            userList.push(msg.sender);
        }

        KIP7(LP_Token).transferFrom(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        startTime[msg.sender] = block.timestamp;
        isStaking[msg.sender] = true;
        emit Stake(msg.sender, amount);

        // stake가 일어날 때 마다 모든 유저에 대해서 해당 시각의 이자를 mapping 결과에 저장
        for (uint256 i = 0; i < userList.length; i++) {
            uint256 nowURUBalance = calculateYieldTotal(userList[i]);
            URUBalance[userList[i]] += nowURUBalance;
            startTime[userList[i]] = block.timestamp;
        }
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
            // 예치량이 0이되면 userList에서 해당 함수의 주소를 삭제
        }
        emit Unstake(msg.sender, balTransfer);

        // stake가 일어날 때와의 마찬가지의 논리
        for (uint256 i = 0; i < userList.length; i++) {
        uint256 nowURUBalance = calculateYieldTotal(userList[i]);
        URUBalance[userList[i]] += nowURUBalance;
        startTime[userList[i]] = block.timestamp;
        }
    }

    // 현재 스테이킹 중인 address를 배열로 반환
    function getuserList() public view returns(address[] memory) {
        return userList;
    }

    // 마지막 스테이킹 변화로부터 시간 측정 (블록타임 활용)
    function calculateYieldTime(address user) public view returns(uint256){
        uint256 end = block.timestamp;
        uint256 totalTime = end - startTime[user];
        return totalTime;
    }

    // 전체 비율 중 해당 유저의 유동성 기여도 측정
    // 소수점 둘째 자리까지 가능 (백분율)
    function calculateContribute(address user) public view returns(uint256){
        uint contribution = (stakingBalance[user] * 100) / KIP7(LP_Token).balanceOf(address(this));
        return contribution;
    }

    // 새로운 기간 동안 (새로운 stake나 unstake가 일어나지 않는 동안) 각 유저에게 지급할 이자를 계산
    // 시간과 기여도의 곱으로 계산
    // 총 분당 1500개, 초당 25개씩 발행될 것이고 이를 기여도에 따라서 나누는 시스템
    function calculateYieldTotal(address user) public view returns(uint256) {
        uint256 time = calculateYieldTime(user);
        uint256 contribution = calculateContribute(user);
        uint256 rawYield = (time * contribution * 25);
        return rawYield;
    } 

    // URUBalance에 저장된 값과 현재 기간 쌓인 이자의 합으로 mint해줌
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