// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@klaytn/contracts/token/KIP7/KIP7.sol";
import "./libraries/Math.sol";
import "./libraries/SafeMath.sol";
import "./libraries/UQ112x112.sol";
import "@klaytn/contracts/contracts/KIP/token/KIP7/KIP7.sol";
import "./interfaces/IDNDCallee.sol";

contract DNDPair is KIP7, Math {
    using SafeMath  for uint;
    using UQ112x112 for uint224;

    uint256 public constant MINIMUM_LIQUIDITY = 1000; // 최초 LP 토큰이 발행될 때 최소 liquidity만큼 burn 될 수 있도록하는 최소 유동성

    // address public factory;             // factory의 contract address
    address public token0;              // token0 의 contract address
    address public token1;              // token0 의 contract address

    uint112 private reserve0;           // DNDPair 에서 기록하는 token0의 잔고(balance는 실제잔고)
    uint112 private reserve1;           // DNDPair 에서 기록하는 token1의 잔고(balance는 실제잔고)
    uint32  private blockTimestampLast; // uses single storage slot, accessible via getReserves

    uint public price0CumulativeLast;   // 다른 컨트랙트에서 price oracle로 사용하기위한 변수(public)
    uint public price1CumulativeLast;   // 다른 컨트랙트에서 price oracle로 사용하기위한 변수(public)

    bool private isEntered;

    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1, address to);
    event Swap(
        address indexed sender,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint256 reserve0, uint256 reserve1);

    modifier nonReentrant() {
        require(!isEntered);
        isEntered = true;

        _;

        isEntered = false;
    }

    constructor() KIP7("V2 Pair", "V2") public {}

    // called once by the factory at time of deployment
    function initialize(address token0_, address token1_) external {
        require(token0 == address(0) && token1 == address(0), 'already initialized');

        token0 = token0_;
        token1 = token1_;
    }

    /*
    (this low-level function should be called from a contract which performs important safety checks)
        - mint : LP 토큰(LP Share)을 만드는 함수
        - burn : LP 토큰(LP Share)을 소각하는 함수

        DNDPair contract에서 기록하고 있는 token0, token1 자산의 양과 
        실제로 token0, token1 contract에서 기록하는 자산의 양이 다를 수 있으므로
        실제 자산의 양 > pair 기록의 양 : mint, 실제 < pair : burn 

        _reserve0, _reserve1 : pair에서 기록하고 있는 token0, token1의 잔고(현재 balance 이전의 balance)
        balance0, balance1 : 실제 token0, token1의 잔고
        amount0, amount1 : 실제 잔고 - pair에서 기록하는 잔고(내가 받은 amount)
    */
    function mint(address to) public returns (uint256 liquidity) {
        (uint112 reserve0_, uint112 reserve1_, ) = getReserves(); // gas savings
        
        uint balance0 = IKIP7(token0).balanceOf(address(this));
        uint balance1 = IKIP7(token1).balanceOf(address(this));
        uint amount0 = balance0.sub(reserve0_);
        uint amount1 = balance1.sub(reserve1_);

        // 처음 이 컨트랙트에 pair를 넣는 사람이면, 1 LP의 1000배(MINIMUM_LIQUIDITY)에 해당하는 돈이 burn됨(백서 참조)
        if (totalSupply() == 0) {

            // 생성되는 liquidity(LP 토큰의 양) : (amount0, amount1의 기하평균 값 - MINIMUM_LIQUIDITY)
            liquidity = Math.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
            // MINIMUM_LIQUIDITY 만큼 mint 후 0 주소로 보냄(영원히 묶임, 사실상 burn)
            //_mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens

        } else {

            // 새로 생성한 사람이 아니면, 인플레이션을 시킴
            // inflation0 = totalSupply * amount0 / reserve0 
            // inflation1 = totalSupply * amount1 / reserve1
            // 이 중 더 작은 inflation 으로 liquidity 인플레이션을 결정(발행할 LP토큰의 양)
            liquidity = Math.min(amount0.mul(totalSupply()) / reserve0_,
                                 amount1.mul(totalSupply()) / reserve1_);
        }
        require(liquidity > 0, 'INSUFFICIENT_LIQUIDITY_MINTED');

        // 돈을 넣은 사람에게 계산한 LP 토큰을 보냄 
        _mint(to, liquidity);

        // pair에서 기록하는 reserve0, reserve1, kLast를 update 해줌(잔고, kLast가 더 커질 것)
        _update(balance0, balance1, reserve0_, reserve1_);
 
        emit Mint(msg.sender, amount0, amount1);
    }

    // 위 mint 처럼 잔고를 받아오고, 이 사람이 태우는 liquidity의 비율에 해당하는 각 토큰의 amount만큼을 태우는 사람이 받게 된다.
    function burn(address to) public returns (uint256 amount0, uint256 amount1) {
        
        uint256 balance0 = IKIP7(token0).balanceOf(address(this)); // to 의 A 토큰의 실제 balance
        uint256 balance1 = IKIP7(token1).balanceOf(address(this)); // to 의 B 토큰의 실제 balance
        uint256 liquidity = balanceOf(address(this)); // to 의 LP 토큰의 실제 balance

        // amount = 태우는 LP liquidity 양(liquidity * balance) / 전체 토큰의 양 (totalSupply))
        amount0 = liquidity.mul(balance0) / totalSupply(); // 전체 LP 토큰의 양 대비 to가 가진 LP 토큰의 지분율(to의 A LP토큰 비율의 양)
        amount1 = liquidity.mul(balance1) / totalSupply(); // 전체 LP 토큰의 양 대비 to가 가진 LP 토큰의 지분율(to의 B LP토큰 비율의 양)
        
        require(amount0 > 0 && amount1 > 0, 'INSUFFICIENT_LIQUIDITY_BURNED');

        // 위에서 계산한 amount 만큼 transfer해준다. 
        _burn(address(this), liquidity);

        _safeTransfer(token0, to, amount0); // to의 A 토큰에 대한 liquidity만큼 tokenA 주소에 돌려줌
        _safeTransfer(token1, to, amount1); // to의 B 토큰에 대한 liquidity만큼 tokenB 주소에 돌려줌

        // pair에서 기록하는 reserve0, reserve1, kLast를 update 해줌(잔고, kLast가 더 작아 것)
        balance0 = IKIP7(token0).balanceOf(address(this));
        balance1 = IKIP7(token1).balanceOf(address(this));

        (uint112 reserve0_, uint112 reserve1_, ) = getReserves();
        _update(balance0, balance1, reserve0_, reserve1_);

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
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external nonReentrant {
        require(amount0Out > 0 || amount1Out > 0, 'INSUFFICIENT_OUTPUT_AMOUNT');

        (uint112 reserve0_, uint112 reserve1_, ) = getReserves();
        
        require(amount0Out < reserve0_ && amount1Out < reserve1_, 'INSUFFICIENT_LIQUIDITY');

        // in을 계산해서 빼기전에 먼저 amount 만큼 더해준다.
        if (amount0Out > 0) _safeTransfer(token0, to, amount0Out);
        if (amount1Out > 0) _safeTransfer(token1, to, amount1Out);

        // calldata 존재시 call하여 부른다.
        if (data.length > 0) IDNDCallee(to).DNDCall(msg.sender, amount0Out, amount1Out, data);

        // swap 하려는 사람이 돈을 넣었는지 확인하기위해 balance를 받아온다.
        uint256 balance0 = IKIP7(token0).balanceOf(address(this));
        uint256 balance1 = IKIP7(token1).balanceOf(address(this));

        // address _token0 = token0;
        // address _token1 = token1;
        // require(to != _token0 && to != _token1, 'INVALID_TO');


        // out만큼 보내고 난 뒤 새로워진 balance를 봤을 때, 
        // pair에서 기록하고 있는 reserve에서 out만큼 뺀것이 새 balance보다 큰 지 확인
        // 크면 amountIn을 각각 계산해준다.
        uint256 amount0In = balance0 > reserve0 - amount0Out
            ? balance0 - (reserve0 - amount0Out)
            : 0;
        uint256 amount1In = balance1 > reserve1 - amount1Out
            ? balance1 - (reserve1 - amount1Out)
            : 0;

        require(amount0In > 0 || amount1In > 0, 'INSUFFICIENT_INPUT_AMOUNT');
        
        // 0.3% 수수료를 낼 수 있는 상태인지 검증
        uint balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3));
        uint balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3));

        require(balance0Adjusted.mul(balance1Adjusted) >= uint(reserve0_).mul(reserve1_).mul(1000**2), 'invaild K');

        _update(balance0, balance1, reserve0_, reserve1_);

        emit Swap(msg.sender, amount0Out, amount1Out, to);
    }

    /*
        - sync : skim과 반대로, 돈이 너무 적은데 토큰간 imbalance가 생겼을 때 토큰간 balance를 맞추기위한 함수
    */
    // force reserves to match balances
    function sync() public {
        (uint112 reserve0_, uint112 reserve1_, ) = getReserves();
        _update(
            IKIP7(token0).balanceOf(address(this)),
            IKIP7(token1).balanceOf(address(this)),
            reserve0_,
            reserve1_
        );
    }

    function getReserves() public view returns (uint112, uint112, uint32) {
        return (reserve0, reserve1, blockTimestampLast);
    }

    //
    //
    //
    //  PRIVATE
    //
    //
    //

    /*
        _update : update reserves and, on the first call per block, price accumulators

        1. 현재 기록하고있는 잔고와 실제 token0, token1의 컨트랙트에서 가진 잔고의 차이를 update 하기 위한 함수
           ex) reserve 보다 balance가 더 크다면 을 받았음을 확인할 수 있음
        2. price oracle로 사용하기 위한 함수(각 price가 유지된 시간의 가중치만큼 더하여 평균을 내 현재가격 결정)
           ex) 시간에 따라서 달라지는 가격을 price0CumulativeLast 변수를 통해 다른 컨트랙트에서도 가격 정보를 받을 수 있음
    */
    function _update(uint balance0, uint balance1, uint112 _reserve0, uint112 _reserve1) private {
        require(balance0 <= type(uint).max && balance1 <= type(uint).max, 'OVERFLOW');
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

    function _safeTransfer(
        address token,
        address to,
        uint256 value
    ) private {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", to, value)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TRANSFER_FAILED');
    }
}