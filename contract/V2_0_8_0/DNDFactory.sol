// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DNDPair.sol";
import "./interfaces/IDNDPair.sol";

/* DNDFactory.sol

1. create pool for token-token pair(createPair)
2. feeTo, feeToSetter getter/setter
3. migrate
4. 각 토큰 페어 주소에서 거래가 이루어지면, 각 페어주소에서 프로토콜 수수료만큼의 LP를 쌓는다(DNDPair._mintFee 참조)

*/

contract DNDFactory { 

    event PairCreated(address indexed token0, address indexed token1, address pair, uint); // createPair function emited

    mapping(address => mapping(address => address)) public pairs;

    bytes[] public pairCode;
    address[] public allPairs;    // 생성한 토큰 페어 주소를 모두 담음
    

    function createPair(address tokenA, address tokenB)
        public
        returns (address pair)
    {
        require(tokenA != tokenB, 'IDENTICAL_ADDRESSES'); 

        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);

        require(token0 != address(0), 'ZERO_ADDRESS');

        require(pairs[token0][token1] == address(0), 'PAIR_EXISTS'); // single check is sufficient

        bytes memory bytecode = type(DNDPair).creationCode;
        pairCode.push(bytecode);
        
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        IDNDPair(pair).initialize(token0, token1);

        pairs[token0][token1] = pair;
        pairs[token1][token0] = pair;
        allPairs.push(pair);

        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

}