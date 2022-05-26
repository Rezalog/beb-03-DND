// // SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP7/KIP7.sol";
import "@klaytn/contracts/math/SafeMath.sol";
import "./Token.sol";

contract Master {

    using SafeMath for uint256;

    struct userinfo {
        uint256 amount;
        uint256 reward;
    }

    struct poolinfo {
        KIP7 lpToken;
        uint256 stakeAmount; // 풀에 들어와 있는 돈
        uint256 lastUpdatedTime; // 마지막으로 갱신된 시간
        uint256 URUPerShare; // 해당 풀의 1단위당 지급할 uru;
    }

    Token public uru;
    uint256 public URUperblock; // 25, 즉 klaytn 블록 하나 생성 시간(1초)당 지급할 URU
    uint256 public startTime; 
    uint256 public totalStakeAmount = 0;

    poolinfo[] public poolInfo;
    mapping(uint256 => address[]) public userList; 
    mapping(uint256 => mapping(address => userinfo)) public userInfo;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);

    constructor (
        Token _uru,
        uint256 _URUperblock // 25
    ) public {
        uru = _uru;
        URUperblock = _URUperblock;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // add pool
    function add(KIP7 _lpToken) public {
        uint256 lastUpdatedTime = block.timestamp;
        poolInfo.push(
            poolinfo({
                lpToken: _lpToken,
                stakeAmount: 0,
                lastUpdatedTime: lastUpdatedTime,
                URUPerShare: 0
            })
        );
    }

    // _pid : poolInfo의 index
    function deposit(uint256 _pid, uint256 _amount) public {
        poolinfo storage pool = poolInfo[_pid];
        userinfo storage user = userInfo[_pid][msg.sender];

        // 새로 예치시 해당 풀 유저 목록에 주소 저장
        if(user.amount == 0) {
            userList[_pid].push(msg.sender);
        }

        // 입금 및 유저 입금량 저장
        totalStakeAmount = totalStakeAmount.add(_amount);
        user.amount = user.amount.add(_amount);
        pool.lpToken.transferFrom(address(msg.sender),address(this),_amount);
        emit Deposit(msg.sender, _pid, _amount);

        // 누군가 예치했으니 모든 풀에 대해서 분배 비율을 새롭게 조정해야함
        updatePool();
    }

    function withdraw(uint256 _pid, uint256 _amount) public {
        poolinfo storage pool = poolInfo[_pid];
        userinfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "can't withdraw over your deposit");

        totalStakeAmount = totalStakeAmount.sub(_amount);
        user.amount = user.amount.sub(_amount);
        pool.lpToken.transfer(address(msg.sender), _amount);
        emit Withdraw(msg.sender, _pid, _amount);

        // 누군가 인출했으니 모든 풀에 대해서 분배 비율을 새롭게 조정해야함
        updatePool();
    }

    // 이자 받기
    function harvest(uint256 _pid) public {
        poolinfo storage pool = poolInfo[_pid];
        userinfo storage user = userInfo[_pid][msg.sender];
        
        // 현재 마지막으로 reward에 저장되어 있는 값(1) + 해당 풀의 lastUpdatedTime과 현재 블록시간의 차이에다가 현재 urupershare를 곱한 값(2)을 지급
        // 그리고 reward를 0으로 만들어 버린다. 그리고 인출한 '해당 풀에민' 모든 유저 정보를 업데이트 해줘야 한다.
        // 왜냐하면 lastUpdatedTime을 갱신해야 하기 때문. 갱신하지 않으면 바로 또 harvest를 했을 때 2가 중복 지급이 되어버리기 떄문임.
        uint256 nowReward = block.timestamp.sub(pool.lastUpdatedTime).mul(pool.URUPerShare);
        uint256 toTransfer = user.reward.add(nowReward);

        uru.mint(msg.sender, toTransfer);

        pool.lastUpdatedTime = block.timestamp;
        user.reward = 0;
    }

    // 예치량의 변동에 따라서 새롭게 풀 끼리의 분배비율을 업데이트 하고 모든 풀의 모든 유저의 그 때까지의 보상을 reward에 스냅샷
    function updatePool() internal {
        // 풀 정보 업데이트 (마지막 업데이트 시기 기록, 분배비율 조정)
        for (uint256 i = 0; i < poolInfo.length; i++) {
            poolInfo[i].lastUpdatedTime = block.timestamp;
            poolInfo[i].URUPerShare = poolInfo[i].stakeAmount.mul(100).div(totalStakeAmount);
        }
    }

    // // 저장된 lp-token 주소 반환
    // function getLPAddress(uint256 _pid) public view returns (address) {
    //     return address(poolInfo[_pid].lpToken);
    // }

    // // 저장된 lp-token 주소 반환
    // function getPendingURU(uint256 _pid, address _user) public view returns (uint256) {
    //     return ;
    // }
}