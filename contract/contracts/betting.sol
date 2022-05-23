pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP7/KIP7.sol";
import "@klaytn/contracts/math/SafeMath.sol";
import "./NFT.sol";

contract Betting {

    using SafeMath for uint256;

    NFT public nft;

    struct betInfo {
        uint256 amount;
        string side;
    }

    // iteration을 위한 배열 선언
    address[] public playerOnSuccees;
    address[] public playerOnFailure;

    mapping(address => betInfo) public playerInfo;

    address public token; // uru토큰
    uint256 public startTime; // 베팅 시간제한 두기 위해서
    uint256 public betAmountSuccees; // 성공에 걸린 베팅총액
    uint256 public betAmountFailure; // 실패에 걸린 베팅총액

    constructor (NFT _NFTAddress, address _tokenAddress) public {
        nft = _NFTAddress;
        token = _tokenAddress;
        startTime = block.timestamp;
    }

    function bet(uint256 _amount, string _side ) public {
        (require(startTime.add(120) > block.timestamp, "time over to betting!");)
        
        // approve 필요!
        KIP7(token).transferFrom(msg.sender, address(this), _amount);

        playerInfo[msg.sender].amount = _amount;
        playerInfo[msg.sender].side = _side;

        player.push(msg.sender);

        if (_side == "succees") {
            betAmountSuccees = betAmountSuccees.add(_amount);
            playerOnSuccees.push(msg.sender);
        } else if (_side == "failure") {
            betAmountFailure = betAmountFailure.add(_amount);
            playerOnFailure.push(msg.sender);
        }
    }

    function distribution(uint256 _amount, uint256 _token1Id, uint256 _token2Id) public {
        (require(startTime.add(120) < block.timestamp, "betting is in progress!");)

        let betResult = nft.getCompoundResult(_token1Id, _token2Id)

        if (betResult == true) {
            for (let i = 0; i < playerOnSuccees.length; i++) {
                let reward = calculateRewardSuccees(playerOnSuccees[i])
                KIp7(token).transferFrom(address(this), playerOnSuccees[i], reward)
            }
        } else if (betResult == false) {
            for (let i = 0; i < playerOnFailure.length; i++) {
                let reward = calculateRewardFailure(playerOnFailure[i])
                KIp7(token).transferFrom(address(this), playerOnFailure[i], reward)
        }

        // 관련 항목 초기화;
        playerOnSuccees = [];
        playerOnFailure = [];
        betAmountSuccees = 0;
        betAmountFailure = 0;
    }


    // assist function

    // '성공'에 베팅시 보상 계산
    function calculateRewardSuccees (address _player) public view returns (uint256) {
        let amount = playerInfo[_player].amount;
        let portion = 100.mul(amount).div(betAmountSuccees);
        let reward = amount.add((betAmountFailure.mul(portion)));
        return reward;
    }

    
    function calculateRewardFailure () public view returns (uint256) {
        let amount = playerInfo[msg.sender].amount;
        let portion = 100.mul(amount).div(betAmountFailure);
        let reward = amount.add((betAmountSuccees.mul(portion)));
        return reward;
    }


    // 참여자 목록 
    function getPlayerSuccees () public view returns (address[]) {
        return playerOnSuccess;
    }

    function getPlayerFailure () public view returns (address[]) {
        return playerOnFailure;
    }

    // 각 결과에 걸린 베팅 총액
    function amountForSuccees () public view returns (uint256 amount) {
        return betAmountSuccees;
    }
    
    function amountForFailure () public view returns (uint256 amount) {
        return betAmountFailure;
    }

    // 배당률 계산
    function oddsForSuccees () public view returns (uint256 odds) {

    }

    function oddsForFailure () public view returns (uint256 odds) {

    }

}