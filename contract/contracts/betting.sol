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
    address[] public player; 

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
            betAmountSuccees = betAmountSuccees.add(_amount)
        } else if (_side == "failure") {
            betAmountFailure = betAmountFailure.add(_amount)
        }
    }

    function distribution(uint256 _amount, uint256 _token1Id, uint256 _token2Id) public {
        (require(startTime.add(120) < block.timestamp, "betting is in progress!");)

        let betResult = nft.getCompoundResult(_token1Id, _token2Id)
        if (betResult == true) {
            // 성공에 건 사람에게 보상
        } else if (betResult == false) {
            // 실패에 건 사람에게 보상
        }

        // 관련 항목 초기화;
    }


    // assist function

    // 참여자 목록 
    function getPlayerList () public view returns (address[]) {
        return player;
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