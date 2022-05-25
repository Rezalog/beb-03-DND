pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP7/KIP7.sol";
import "@klaytn/contracts/math/SafeMath.sol";
import "./NFT.sol";

contract Betting {

    using SafeMath for uint256;

    NFT public nft;

    struct user {
        uint256 amount;
        bool side;
        bool isBet;
    }

    struct amount {
        uint256 betAmountSuccees;
        uint256 betAmountFailure;
    }

    struct tokenPair {
        uint256 timeStamp;
        uint256 token1Id;
        uint256 token2Id;
    }

    // iteration을 위한 배열 선언

    mapping(uint256 => mapping(address => user)) public userInfo;
    mapping(uint256 => amount) public amountInfo;
    mapping(uint256 => tokenPair) public tokenInfo;
    mapping(uint256 => address[]) public succeesUserList;
    mapping(uint256 => address[]) public failureUserList;

    address public token; // uru토큰
    uint256 public startTime; // 베팅 시간제한 두기 위해서
    uint256 public betNumber = 0; // 베팅 열때마다 대응되는 숫자로 각 베팅을 구분

    constructor (NFT _NFTAddress, address _tokenAddress) public {
        nft = _NFTAddress;
        token = _tokenAddress;
        startTime = block.timestamp;
    }

    function createBet(uint256 _token1Id, uint256 _token2Id) public {
        betNumber = betNumber.add(1);
        tokenInfo[betNumber].timeStamp = block.timestamp;
        tokenInfo[betNumber].token1Id = _token1Id;
        tokenInfo[betNumber].token2Id = _token2Id;
    }

    function bet(uint256 _amount, bool _side, uint256 _betNumber) public {
        require(userInfo[_betNumber][msg.sender].isBet != true, "you already bet in this game");
        require(tokenInfo[_betNumber].timeStamp.add(600) > block.timestamp, "this betting is closed");

        // approve 필요!
        KIP7(token).transferFrom(msg.sender, address(this), _amount);

        userInfo[_betNumber][msg.sender].amount = _amount;
        userInfo[_betNumber][msg.sender].side = _side;
        userInfo[_betNumber][msg.sender].isBet = true;

        if (_side == true) {
            amountInfo[_betNumber].betAmountSuccees = amountInfo[_betNumber].betAmountSuccees.add(_amount);
            succeesUserList[_betNumber].push(msg.sender);
        } else if (_side == false) {
            amountInfo[_betNumber].betAmountFailure = amountInfo[_betNumber].betAmountFailure.add(_amount);
            failureUserList[_betNumber].push(msg.sender);
        }

    }

    function distribution(uint256 _betNumber) public {
        require(tokenInfo[_betNumber].timeStamp.add(120) < block.timestamp, "distribution is allowed after 10 minutes opened betting");

        bool betResult = nft.getCompoundResult(tokenInfo[_betNumber].token1Id, tokenInfo[_betNumber].token2Id);

        if (betResult == true) {
            for (uint256 i = 0; i < succeesUserList[_betNumber].length; i++) {
                uint256 reward = calculateRewardSuccees(_betNumber, succeesUserList[_betNumber][i]);
                KIP7(token).transfer(succeesUserList[_betNumber][i], reward);
            }
        } else if (betResult == false) {
            for (uint256 i = 0; i < failureUserList[_betNumber].length; i++) {
                uint256 reward = calculateRewardFailure(_betNumber, failureUserList[_betNumber][i]);
                KIP7(token).transfer(failureUserList[_betNumber][i], reward);
            }
        }
    }

    // 각 결과에 따른 현재 보상 계산
    function calculateRewardSuccees(uint256 _betNumber, address _player) public view returns (uint256) {
        uint256 value = userInfo[_betNumber][_player].amount;
        uint256 portion = value.mul(100).div(amountInfo[_betNumber].betAmountSuccees);
        uint256 reward = value.add(amountInfo[_betNumber].betAmountFailure.mul(portion).div(100));
        return reward;
    }

    function calculateRewardFailure(uint256 _betNumber, address _player) public view returns (uint256) {
        uint256 value = userInfo[_betNumber][_player].amount;
        uint256 portion = value.mul(100).div(amountInfo[_betNumber].betAmountFailure);
        uint256 reward = value.add(amountInfo[_betNumber].betAmountSuccees.mul(portion).div(100));
        return reward;
    }
    
    // assist function

    // 각 결과에 걸린 베팅 총액
    function amountForSuccees(uint256 _betNumber) public view returns (uint256) {
        return amountInfo[_betNumber].betAmountSuccees;
    }
    
    function amountForFailure(uint256 _betNumber) public view returns (uint256) {
        return amountInfo[_betNumber].betAmountFailure;
    }

    // 예상수익률 계산 (%)
    function oddsForSuccees(uint256 _betNumber, uint256 _amount) public view returns (uint256) {
        return amountInfo[_betNumber].betAmountFailure.mul(100).div(amountInfo[_betNumber].betAmountSuccees.add(_amount));
    }

    function oddsForFailure(uint256 _betNumber, uint256 _amount) public view returns (uint256) {
        return amountInfo[_betNumber].betAmountSuccees.mul(100).div(amountInfo[_betNumber].betAmountFailure.add(_amount));
    }
}