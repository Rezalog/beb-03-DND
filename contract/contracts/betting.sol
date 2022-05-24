pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP7/KIP7.sol";
import "@klaytn/contracts/math/SafeMath.sol";
import "./NFT.sol";

contract Betting {

    using SafeMath for uint256;

    NFT public nft;

    struct betInfo {
        uint256 amount;
        bool side;
    }

    struct tokenPair {
        uint256 token1Id;
        uint256 token2Id;
    }

    // iteration을 위한 배열 선언
    address[] public playerOnSuccees;
    address[] public playerOnFailure;
    address[] public tokenPairList;

    mapping(uint256 => mapping(address => betInfo)) public playerInfo;
    mapping(uint256 => tokenPair) public tokenInfo;

    address public token; // uru토큰
    uint256 public startTime; // 베팅 시간제한 두기 위해서
    uint256 public betAmountSuccees; // 성공에 걸린 베팅총액
    uint256 public betAmountFailure; // 실패에 걸린 베팅총액

    uint256 public count = 0;

    constructor (NFT _NFTAddress, address _tokenAddress) public {
        nft = _NFTAddress;
        token = _tokenAddress;
        startTime = block.timestamp;
    }

    function createBet(uint256 _token1Id, uint256 _token2Id) public view returns (uint256) {
        tokenInfo[count].token1Id = _token1Id;
        tokenInfo[count].token2Id = _token2Id;
        count = count.add(1);
        return count;
    }

    function bet(uint256 _amount, bool _side, uint _betId) public {
        require(startTime.add(1200) > block.timestamp, "time over to betting!");
        
        // approve 필요!
        KIP7(token).transferFrom(msg.sender, address(this), _amount);

        playerInfo[_betId][msg.sender].amount = _amount;
        playerInfo[_betId][msg.sender].side = _side;

        if (_side == true) {
            betAmountSuccees = betAmountSuccees.add(_amount);
            playerOnSuccees.push(msg.sender);
        } else if (_side == false) {
            betAmountFailure = betAmountFailure.add(_amount);
            playerOnFailure.push(msg.sender);
        }
    }

    // function distribution(uint256 _token1Id, uint256 _token2Id) public {
    //     require(startTime.add(30) < block.timestamp, "betting is in progress!");

    //     bool betResult = nft.getCompoundResult(_token1Id, _token2Id);

    //     if (betResult == true) {
    //         for (uint256 i = 0; i < playerOnSuccees.length; i++) {
    //             uint256 reward = calculateRewardSuccees(playerOnSuccees[i]);
    //             KIP7(token).transfer(playerOnSuccees[i], reward);
    //         }
    //     } else if (betResult == false) {
    //         for (uint256 i = 0; i < playerOnFailure.length; i++) {
    //             uint256 reward = calculateRewardFailure(playerOnFailure[i]);
    //             KIP7(token).transfer(playerOnFailure[i], reward);
    //         }
    //     }
    //     betAmountSuccees = 0;
    //     betAmountFailure = 0;
    //     delete playerOnSuccees;
    //     delete playerOnFailure;
    // }

    // assist function

    // '성공'에 베팅시 보상 계산
    // function calculateRewardSuccees(address _player) public view returns (uint256) {
    //     uint256 amount = playerInfo[_player].amount;
    //     uint256 portion = amount.mul(100).div(betAmountSuccees);
    //     uint256 reward = amount.add(betAmountFailure.mul(portion).div(100));
    //     return reward;
    // }

    
    // function calculateRewardFailure(address _player) public view returns (uint256) {
    //     uint256 amount = playerInfo[_player].amount;
    //     uint256 portion = amount.mul(100).div(betAmountFailure);
    //     uint256 reward = amount.add(betAmountSuccees.mul(portion).div(100));
    //     return reward;
    // }

    // // 참여자 목록 
    // function getPlayerSuccees() public view returns (address[] memory) {
    //     return playerOnSuccees;
    // }

    // function getPlayerFailure() public view returns (address[] memory) {
    //     return playerOnFailure;
    // }

    // // 각 결과에 걸린 베팅 총액
    // function amountForSuccees() public view returns (uint256 amount) {
    //     return betAmountSuccees;
    // }
    
    // function amountForFailure() public view returns (uint256 amount) {
    //     return betAmountFailure;
    // }

    // 배당률 계산
    // function oddsForSuccees() public view returns (uint256 odds) {

    // }

    // function oddsForFailure() public view returns (uint256 odds) {

    // }

}