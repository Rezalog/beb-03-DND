// // SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP7/KIP7.sol";
import "@klaytn/contracts/token/KIP7/IKIP7.sol";
import "@klaytn/contracts/math/SafeMath.sol";
import "./Token.sol";

contract Master {

    using SafeMath for uint256;

    struct userinfo {
        uint256 amount;
        uint256 reward;
    }

    struct poolinfo {
        address lpToken;
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
    function add(address _lpToken) public {
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

        // 입금 및 유저 입금량 저장
        totalStakeAmount = totalStakeAmount.add(_amount);
        pool.stakeAmount = pool.stakeAmount.add(_amount);
        user.amount = user.amount.add(_amount);
        KIP7(pool.lpToken).transferFrom(msg.sender, address(this), _amount);
        emit Deposit(msg.sender, _pid, _amount);

        // 누군가 예치했으니 모든 풀에 대해서 분배 비율을 새롭게 조정해야함
        updatePool();

        // 새로 예치하는 유저
        if (user.amount == _amount) {
            userList[_pid].push(msg.sender);
            user.reward = 0;
        }
    }

    function withdraw(uint256 _pid, uint256 _amount) public {
        poolinfo storage pool = poolInfo[_pid];
        userinfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "can't withdraw over your deposit");

        // 전액 인출시 이자도 자동 인출
        if (user.amount == _amount) {
            harvest(_pid);
        }

        totalStakeAmount = totalStakeAmount.sub(_amount);
        pool.stakeAmount = pool.stakeAmount.sub(_amount);
        user.amount = user.amount.sub(_amount);
        KIP7(pool.lpToken).transfer(msg.sender, _amount);
        emit Withdraw(msg.sender, _pid, _amount);

        // 누군가 인출했으니 모든 풀에 대해서 분배 비율을 새롭게 조정해야함
        updatePool();
    }

    // 이자 받기
    function harvest(uint256 _pid) public {
        poolinfo storage pool = poolInfo[_pid];
        userinfo storage user = userInfo[_pid][msg.sender];

        uint256 userContribution = calculateContribute(_pid, msg.sender);  

        // 현재 마지막으로 reward에 저장되어 있는 값(1) + 해당 풀의 lastUpdatedTime과 현재 블록시간의 차이에다가 현재 urupershare를 곱한 값(2)을 지급
        // 그리고 reward를 0으로 만들어 버린다. 그리고 인출한 '해당 풀에민' 모든 유저 정보를 업데이트 해줘야 한다.
        // 왜냐하면 lastUpdatedTime을 갱신해야 하기 때문. 갱신하지 않으면 바로 또 harvest를 했을 때 2가 중복 지급이 되어버리기 떄문임.

        uint256 nowReward = block.timestamp.sub(pool.lastUpdatedTime).mul(pool.URUPerShare).mul(userContribution).div(10000);
        // contribution이랑 urupershare계산할 때 각각 100씩 곱한거 10000으로 나눠줘서 디코딩
        uint256 toTransfer = (user.reward).add(nowReward);

        uru.mint(msg.sender, toTransfer);

        pool.lastUpdatedTime = block.timestamp;
        user.reward = 0;
    }

    // 예치량의 변동에 따라서 새롭게 풀 끼리의 분배비율을 업데이트 하고 모든 풀의 모든 유저의 그 때까지의 보상을 reward에 스냅샷
    function updatePool() internal {
        for (uint256 i = 0; i < poolInfo.length; i++) {
            for (uint256 j = 0; j < userList[i].length; j++) {
                if (poolInfo[i].stakeAmount != 0) {
                userInfo[i][userList[i][j]].reward = userInfo[i][userList[i][j]].reward.add(calculateCurrentReward(i, userList[i][j]));
                }
            }
            // 풀 정보 업데이트
            poolInfo[i].URUPerShare = (poolInfo[i].stakeAmount).mul(100).div(totalStakeAmount).mul(URUperblock);
            poolInfo[i].lastUpdatedTime = block.timestamp;
        }
    }

    // 풀 내의 비율 계산
    function calculateContribute(uint256 _pid, address _user) public view returns(uint256) {
        poolinfo storage pool = poolInfo[_pid];
        userinfo storage user = userInfo[_pid][_user];

        uint256 contribution = (user.amount.mul(100)).div((KIP7(pool.lpToken)).balanceOf(address(this)));
        return contribution;
    }

    // 마지막 갱신 후 현재 쌓이고 있는 보상
    function calculateCurrentReward(uint256 _pid, address _user) public view returns(uint256) {
        poolinfo storage pool = poolInfo[_pid];

        uint256 userContribution = calculateContribute(_pid, _user); 
        return block.timestamp.sub(pool.lastUpdatedTime).mul(pool.URUPerShare).mul(userContribution).div(10000);
    }

    // struct 내에 저장된 보상 반환
    function calculateReward(uint256 _pid, address _user) public view returns(uint256) {
        userinfo storage user = userInfo[_pid][_user];
        return user.reward;
    }
}