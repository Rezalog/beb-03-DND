// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import './interfaces/IDNDFactory.sol';
import './DNDPair.sol';

/* DNDFactory.sol

1. create pool for token-token pair(createPair)
2. feeTo, feeToSetter getter/setter
3. migrate
4. 각 토큰 페어 주소에서 거래가 이루어지면, 각 페어주소에서 프로토콜 수수료만큼의 LP를 쌓는다(DNDPair._mintFee 참조)

*/

contract DNDFactory is IDNDFactory { 
    address public feeTo; // 토큰 거래시 발생하는 수수료(프로토콜 수수료 0.05%)를 받을 대상(임시 : factory contract address)
    address public feeToSetter;
    address public migrator;

    // 두 토큰 대한 토큰 페어 주소를 반환한다.
    mapping(address => mapping(address => address)) public getPair;

    // 생성한 토큰 페어 주소를 모두 담음
    address[] public allPairs;

    // createPair에서 호출됨
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function pairCodeHash() external pure returns (bytes32) {
        return keccak256(type(DNDPair).creationCode);
    }

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        // 두 토큰 주소는 달라야하므로 같은지 검증
        require(tokenA != tokenB, 'IDENTICAL_ADDRESSES'); 

        // 0토큰이 크면 token1-token0 페어, 1토큰이 크면 token0-token1 페어 생성
        //-- 컨트랙트 주소의 크기 : 0x 다음의 숫자(16진수)로 크기가 결정
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        
        // 위의 크기비교에 따른 구조적 할당으로, 토큰0는 토큰1보다 작기 때문에 토큰 0주소만 검사함
        require(token0 != address(0), 'ZERO_ADDRESS');
        
        // 두 토큰 페어에 해당하는 컨트랙트가 이미 존재하는지 검증
        require(getPair[token0][token1] == address(0), 'PAIR_EXISTS'); // single check is sufficient
        
        // DNDPair 컨트랙트의 코드를 가져와서 바이트코드 변수에 담음(salt 만들기 위해)
        bytes memory bytecode = type(DNDPair).creationCode;
        
        // 토큰0, 토큰1의 abi를 활용해 keccak256으로 해시함수를 만들어 salt에 저장
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            // create2 함수로 위에서 만든 salt를 이용해 페어 컨트랙트 생성
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }

        // 생성한 토큰 페어에 token0, token1 주소를 초기화(DNDPair의 token 변수에 대입)하여 
        // token0와 token1을 교환할 수 있고 풀을 형성할 수 있게 한다.
        DNDPair(pair).initialize(token0, token1);

        // * 추가 : 생성한 pair주소가 feeTo가 될 수 있게 set 해준다
        //         (가장 최근에 생성된 토큰 페어주소가 feeTo가 됨을 유의)
        setFeeTo(pair);

        // 토큰 페어 주소를 담고 있는 자료구조 getPair에 페어 주소를 넣어준다.(안정성을 위해 반대 조합도 담는다.)
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        
        // allPairs에도 넣어줌
        allPairs.push(pair);

        // 페어 생성시 emit
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, 'FORBIDDEN');
        feeTo = _feeTo;
    }

    function setMigrator(address _migrator) external {
        require(msg.sender == feeToSetter, 'FORBIDDEN');
        migrator = _migrator;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, 'FORBIDDEN');
        feeToSetter = _feeToSetter;
    }

}