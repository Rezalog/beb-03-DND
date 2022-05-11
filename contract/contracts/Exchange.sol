// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP7/KIP7.sol";
import "@klaytn/contracts/token/KIP7/IKIP7.sol";

contract Exchange {
  address public tokenAddress;

  constructor(address _token) public {
    require(_token != address(0), "invalid token address");
    tokenAddress = _token;
}

    function addLiquidity(uint256 _tokenAmount) public payable {
    KIP7 token = KIP7(tokenAddress);
    token.transferFrom(msg.sender, address(this), _tokenAmount);
}

    function getklay() public view returns (uint256 balance) {
    balance =  address(this).balance;
}
    function getReserve() public view returns (uint256 balance) {
    balance =  KIP7(tokenAddress).balanceOf(address(this)); 
}

    function getTokenAmount(uint256 _klaySold) public view returns (uint256) { // klay의 양을 받고 교환해 줄 토큰의 양을 출력하는 함수
    require(_klaySold > 0, "klaySold is too small");

    uint256 tokenReserve = getReserve();

    return getAmount(_klaySold, address(this).balance, tokenReserve); // 교환해 줄 토큰의 양 (y)
}

    function getklayAmount(uint256 _tokenSold) public view returns (uint256) {
    require(_tokenSold > 0, "tokenSold is too small");

    uint256 tokenReserve = getReserve();

    return getAmount(_tokenSold, tokenReserve, address(this).balance);
}

    function klayToTokenSwap(uint256 _minTokens) public payable {
    uint256 tokenReserve = getReserve(); // 풀의 토큰 잔액
    uint256 tokensBought = getAmount(
    msg.value, // 입금한 klay
    address(this).balance - msg.value, // 풀에있는 klay의 양
    tokenReserve // 풀에 있는 토큰의 양
  );

    require(tokensBought >= _minTokens, "insufficient output amount"); // 교환해 줄 토큰이 모자라면 안된다!

    KIP7(tokenAddress).transfer(msg.sender, tokensBought); // tokenBought = 교환해 줄 토큰의 양을 msg.sender에게 보내 준다.
}

    function tokenToklaySwap(uint256 _tokensSold, uint256 _minklay) public {

    uint256 tokenReserve = getReserve(); // 풀에 있는 토큰의 양
    uint256 klayBought = getAmount(
    _tokensSold, // 입급한 토큰의 양
    tokenReserve, // 풀에 있는 토큰의 양
    address(this).balance // 풀에 있는 klay의 양
  );

    require(klayBought >= _minklay, "insufficient output amount");

    KIP7(tokenAddress).transferFrom(msg.sender, address(this), _tokensSold); // msg.sender에게 컨트랙트 주소로 토큰을 보내게 한다.
    msg.sender.transfer(klayBought); // msg.sender에게 klaybought 만큼의 클레이를 보내 준다.
}

    function getAmount( // x(지불할 토큰)의 양을 넣으면 교환해 줄 y의 양을 출력하는 함수
    uint256 inputAmount,
    uint256 inputReserve,
    uint256 outputReserve
) private pure returns (uint256) {
    require(inputReserve > 0 && outputReserve > 0, "invalid reserves");

    return (inputAmount * outputReserve) / (inputReserve + inputAmount);
}

}
