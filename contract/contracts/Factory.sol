// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "./Exchange.sol";
import "./Token.sol";

interface IMaster {
    function add(address _lpToken) external;
}

contract Factory {

    // data structure : store exchange
    mapping(address => address) public tokenToExchange;

    Token public uru;
    IMaster public master;

    constructor (address _master) public {
        master = IMaster(_master);
    }

    // 거래소 생성
    function createExchange(address _tokenAddress, Token _uru, uint256 _epochDuration) public returns (address) {
        
        uru = _uru;
        // 0 주소(zero address)인지 검사
        require(_tokenAddress != address(0), "invalid token address");

        // 이미 존재하는 거래소에 추가되었던 토큰인지 검사(다른 거래소에서 같은 토큰의 유동성이 분산되는 것을 방지)
        require(
            tokenToExchange[_tokenAddress] == address(0),
            "exchange already exists"
        );

        // 생성자로 새로운 거래소 생성, 토큰 주소 store
        //--참고 : Solidity의 new 생성자는 다른 객체지향언어와 달리 해당 contract를 deploy 한다.
        Exchange exchange = new Exchange(_tokenAddress, uru, _epochDuration);
        tokenToExchange[_tokenAddress] = address(exchange);
        master.add(address(exchange));
        //uru.addMinter(address(exchange));

        // 여기서는 Exchange만 address 타입으로 casting 되었지만
        // 다른 컨트랙트들도 address 타입으로 convert 할 수 있다.
        return address(exchange);
    }

    function getExchange(address _tokenAddress) external view returns (address) {
        return tokenToExchange[_tokenAddress];
    }
}