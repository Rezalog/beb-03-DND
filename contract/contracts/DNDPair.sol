// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import './libraries/Math.sol';
import './libraries/UQ112x112.sol';
import "./DNDKIP7.sol";
import "../node_modules/@klaytn/contracts/token/KIP7/IKIP7.sol";
import "./interfaces/IDNDPair.sol";
import "./interfaces/IDNDFactory.sol";
import "./interfaces/IDNDCallee.sol";

contract DNDPair is IDNDPair, DNDKIP7{
    using SafeMath  for uint;
    using UQ112x112 for uint224;

    uint public constant MINIMUM_LIQUIDITY = 10**3; // 최초 LP 토큰이 발행될 때 최소 liquidity만큼 burn 될 수 있도록하는 최소 유동성
    bytes4 private constant SELECTOR = bytes4(keccak256(bytes('transfer(address,uint256)')));

    address public factory;             // factory의 contract address
    address public token0;              // token0 의 contract address
    address public token1;              // token0 의 contract address

    uint112 private reserve0;           // DNDPair 에서 기록하는 token0의 잔고(balance는 실제잔고)
    uint112 private reserve1;           // DNDPair 에서 기록하는 token1의 잔고(balance는 실제잔고)
    uint32  private blockTimestampLast; // uses single storage slot, accessible via getReserves

    uint public price0CumulativeLast;   // 다른 컨트랙트에서 price oracle로 사용하기위한 변수(public)
    uint public price1CumulativeLast;   // 다른 컨트랙트에서 price oracle로 사용하기위한 변수(public)
    uint public kLast; // reserve0 * reserve1, as of immediately after the most recent liquidity event

    uint private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, 'LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }

    function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    function _safeTransfer(address token, address to, uint value) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TRANSFER_FAILED');
    }

    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    constructor() public {
        // 팩토리를 통해 이 컨트랙트를 생성(배포)했을 것이므로, 그 팩토리주소를 받아와 factory에 담는다.
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, 'FORBIDDEN'); // 팩토리 주소 검증
        token0 = _token0;
        token1 = _token1;
    }

    /*
        _update : update reserves and, on the first call per block, price accumulators

        1. 현재 기록하고있는 잔고와 실제 token0, token1의 컨트랙트에서 가진 잔고의 차이를 update 하기 위한 함수
           ex) reserve 보다 balance가 더 크다면 을 받았음을 확인할 수 있음
        2. price oracle로 사용하기 위한 함수(각 price가 유지된 시간의 가중치만큼 더하여 평균을 내 현재가격 결정)
           ex) 시간에 따라서 달라지는 가격을 price0CumulativeLast 변수를 통해 다른 컨트랙트에서도 가격 정보를 받을 수 있음
    */
    function _update(uint balance0, uint balance1, uint112 _reserve0, uint112 _reserve1) private {
        require(balance0 <= uint112(-1) && balance1 <= uint112(-1), 'OVERFLOW');
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // * never overflows, and + overflow is desired
            price0CumulativeLast += uint(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) * timeElapsed;
            price1CumulativeLast += uint(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) * timeElapsed;
        }
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
    }
    
    // 프로토콜 fee 를 계산하는 공식(백서 참조한 공식)
    // ex) token0 : 10, token1 : 10, kLast : 100, protocol fee : 1.67 LP
    // if fee is on, mint liquidity equivalent to 1/6th of the growth in sqrt(k)
    function _mintFee(uint112 _reserve0, uint112 _reserve1) private returns (bool feeOn) {
        address feeTo = DNDFactory(factory).feeTo();
        feeOn = feeTo != address(0);
        uint _kLast = kLast; // gas savings
        if (feeOn) {
            if (_kLast != 0) {
                uint rootK = Math.sqrt(uint(_reserve0).mul(_reserve1));
                uint rootKLast = Math.sqrt(_kLast);
                if (rootK > rootKLast) {
                    uint numerator = totalSupply.mul(rootK.sub(rootKLast));
                    uint denominator = rootK.mul(5).add(rootKLast);
                    uint liquidity = numerator / denominator;

                    // 프로토콜 수수료(0.05%)를 feeTo address에 계산한 liquidity 만큼 보냄(LP token)
                    if (liquidity > 0) _mint(feeTo, liquidity);
                }
            }
        } else if (_kLast != 0) {
            kLast = 0;
        }
    }

    // 
    /*
    (this low-level function should be called from a contract which performs important safety checks)
        - mint : LP 토큰(LP Share)을 만드는 함수
        - burn : LP 토큰(LP Share)을 소각하는 함수

        DNDPair contract에서 기록하고 있는 token0, token1 자산의 양과 
        실제로 token0, token1 contract에서 기록하는 자산의 양이 다를 수 있으므로
        실제 자산의 양 > pair 기록의 양 : mint, 실제 < pair : burn 

        _reserve0, _reserve1 : pair에서 기록하고 있는 token0, token1의 잔고
        balance0, balance1 : 실제 token0, token1의 잔고
        amount0, amount1 : 실제 잔고 - pair에서 기록하는 잔고(내가 받은 amount)
    */
    function mint(address to) external lock returns (uint liquidity) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        
        uint balance0 = IKIP7(token0).balanceOf(address(this));
        uint balance1 = IKIP7(token1).balanceOf(address(this));
        uint amount0 = balance0.sub(_reserve0);
        uint amount1 = balance1.sub(_reserve1);

        // 인플레이션이 발생했으므로 _mintFee로 수수료 계산
        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee

        // 처음 이 컨트랙트에 pair를 넣는 사람이면, 1 LP의 1000배(MINIMUM_LIQUIDITY)에 해당하는 돈이 burn됨(백서 참조)
        if (_totalSupply == 0) {

            // 생성되는 liquidity(LP 토큰의 양) : (amount0, amount1의 기하평균 값 - MINIMUM_LIQUIDITY)
            liquidity = Math.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);

            // MINIMUM_LIQUIDITY 만큼 mint 후 0 주소로 보냄(영원히 묶임, 사실상 burn)
           _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens

        } else {

            // 새로 생성한 사람이 아니면, 인플레이션을 시킴
            // inflation0 = totalSupply * amount0 / reserve0 
            // inflation1 = totalSupply * amount1 / reserve1
            // 이 중 더 작은 inflation 으로 liquidity 인플레이션을 결정(발행할 LP토큰의 양)
            liquidity = Math.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);
        }
        require(liquidity > 0, 'INSUFFICIENT_LIQUIDITY_MINTED');

        // 돈을 넣은 사람에게 계산한 LP 토큰을 보냄 
        _mint(to, liquidity);

        // pair에서 기록하는 reserve0, reserve1, kLast를 update 해줌(잔고, kLast가 더 커질 것)
        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint(reserve0).mul(reserve1);
 
        emit Mint(msg.sender, amount0, amount1);
    }

    // 위 mint 처럼 잔고를 받아오고, 이 사람이 태우는 liquidity의 비율에 해당하는 각 토큰의 amount만큼을 태우는 사람이 받게 된다.
    function burn(address to) external lock returns (uint amount0, uint amount1) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        address _token0 = token0;                                // gas savings
        address _token1 = token1;                                // gas savings
        uint balance0 = IKIP7(_token0).balanceOf(address(this));
        uint balance1 = IKIP7(_token1).balanceOf(address(this));        
        uint liquidity = balanceOf[address(this)];

        bool feeOn = _mintFee(_reserve0, _reserve1);
        uint _totalSupply = totalSupply; // gas savings, must be defined here since totalSupply can update in _mintFee
        
        // amount = 태우는 LP liquidity 양(liquidity * balance) / 전체 토큰의 양 (totalSupply)
        amount0 = liquidity.mul(balance0) / _totalSupply; // using balances ensures pro-rata distribution
        amount1 = liquidity.mul(balance1) / _totalSupply; // using balances ensures pro-rata distribution
        require(amount0 > 0 && amount1 > 0, 'INSUFFICIENT_LIQUIDITY_BURNED');

        // 위에서 계산한 amount 만큼 transfer해준다. 
        _burn(address(this), liquidity);
        _safeTransfer(_token0, to, amount0);
        _safeTransfer(_token1, to, amount1);

        // pair에서 기록하는 reserve0, reserve1, kLast를 update 해줌(잔고, kLast가 더 작아 것)
        balance0 = IKIP7(_token0).balanceOf(address(this));
        balance1 = IKIP7(_token1).balanceOf(address(this));
        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date

        emit Burn(msg.sender, amount0, amount1, to);
    }
    /*
    (this low-level function should be called from a contract which performs important safety checks)
        - swap: 임의의 ERC20 간의 토큰 교환 함수 (eth, klay 등은 wrapped 된 ERC-20으로 교환해주어야함)
                이 함수를 실행하기전에, DNDPair의 token0 나 token1 주소에 교환하고자하는 토큰을 미리 넣고 
                그다음 swap 함수를 호출하여 swap해야한다.

                reserve는 이 pair에서 기록한 잔고이고, 실제로 기록하는 잔고는 balance로 pair는 이를 모두 가지고 있을 수 있으므로
                amountOut은 계산전에 미리 transfer 한 뒤,
                각각의 잔고를 확인해서 그 차액이 발생하는 점을 이용하여 
                새로 늘어난 토큰만큼 amountIn 을 계산할 수 있고, 
                이는 flash loan 을 방지하기 위해서이다.
    */
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external lock {
        require(amount0Out > 0 || amount1Out > 0, 'INSUFFICIENT_OUTPUT_AMOUNT');
        (uint112 _reserve0, uint112 _reserve1,) = getReserves(); // gas savings
        require(amount0Out < _reserve0 && amount1Out < _reserve1, 'INSUFFICIENT_LIQUIDITY');

        uint balance0;
        uint balance1;
        { // scope for _token{0,1}, avoids stack too deep errors
        address _token0 = token0;
        address _token1 = token1;
        require(to != _token0 && to != _token1, 'INVALID_TO');

        // in을 계산해서 빼기전에 먼저 amount 만큼 더해준다.
        if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out); // optimistically transfer tokens
        if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out); // optimistically transfer tokens

        // calldata 존재시 call하여 부른다.
        if (data.length > 0) IDNDCallee(to).DNDCall(msg.sender, amount0Out, amount1Out, data);

        // swap 하려는 사람이 돈을 넣었는지 확인하기위해 balance를 받아온다.
        balance0 = IKIP7(_token0).balanceOf(address(this));
        balance1 = IKIP7(_token1).balanceOf(address(this));
        }

        // out만큼 보내고 난 뒤 새로워진 balance를 봤을 때, 
        // pair에서 기록하고 있는 reserve에서 out만큼 뺀것이 새 balance보다 큰 지 확인
        // 크면 amountIn을 각각 계산해준다.
        uint amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        require(amount0In > 0 || amount1In > 0, 'INSUFFICIENT_INPUT_AMOUNT');
        { // scope for reserve{0,1}Adjusted, avoids stack too deep errors

        // 0.3% 수수료를 낼 수 있는 상태인지 검증
        uint balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3));
        uint balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3));
        require(balance0Adjusted.mul(balance1Adjusted) >= uint(_reserve0).mul(_reserve1).mul(1000**2), 'K');
        }

        // reserve update
        _update(balance0, balance1, _reserve0, _reserve1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    /*
        - skim : 입금된 토큰이 이 DNDPair에서 담을 수 있는 토큰의 양을 넘었을 경우(kLast가 Max인 경우)
                 남는 여유분을 회수하고, 다른 로직이 망가지지 않을 수 있도록 to 주소에 보낼 수 있도록 하는 함수
        - sync : skim과 반대로, 돈이 너무 적은데 토큰간 imbalance가 생겼을 때 토큰간 balance를 맞추기위한 함수
    */
    function skim(address to) external lock {
        address _token0 = token0; // gas savings
        address _token1 = token1; // gas savings
        _safeTransfer(_token0, to, IKIP7(_token0).balanceOf(address(this)).sub(reserve0));
        _safeTransfer(_token1, to, IKIP7(_token1).balanceOf(address(this)).sub(reserve1));
    }

    // force reserves to match balances
    function sync() external lock {
        _update(IKIP7(token0).balanceOf(address(this)), IKIP7(token1).balanceOf(address(this)), reserve0, reserve1);
    }
}