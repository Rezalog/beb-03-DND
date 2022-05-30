// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IDNDFactory.sol";
import "./interfaces/IDNDPair.sol";
import "./libraries/DNDLibrary.sol";
import "./libraries/SafeMath.sol";

contract DNDRouter {

    using SafeMath for uint;

    IDNDFactory public factory;

    constructor(address factoryAddress) public {
        factory = IDNDFactory(factoryAddress);
    }

    // **** ADD LIQUIDITY ****
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired, // 토큰 A에 넣고자하는 토큰의 양
        uint256 amountBDesired, // 토큰 B에 넣고자하는 토큰의 양
        uint256 amountAMin,     // 토큰 A에 들어가야하는 토큰의 최소 양
        uint256 amountBMin,     // 토큰 B에 들어가야하는 토큰의 최소 양
        address to              // A-B토큰 pair address
    )
        public
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        )
    {
        if (factory.pairs(tokenA, tokenB) == address(0)) {
            factory.createPair(tokenA, tokenB);
        }

        (amountA, amountB) = _calculateLiquidity(
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin
        );
        address pairAddress = DNDLibrary.pairFor(
            address(factory),
            tokenA,
            tokenB
        );
        _safeTransferFrom(tokenA, msg.sender, pairAddress, amountA);
        _safeTransferFrom(tokenB, msg.sender, pairAddress, amountB);
        liquidity = IDNDPair(pairAddress).mint(to);
    }

    // **** REMOVE LIQUIDITY ****
    //-- removeLiquidity 실행 전 : IKIP7(pair).approve(RouterAddress, liquidity) 승인 필요
      function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to
    ) public returns (uint256 amountA, uint256 amountB) {

        // A-B 토큰의 페어주소를 pair 변수에 assign
        address pair = DNDLibrary.pairFor(
            address(factory),
            tokenA,
            tokenB
        );

        // A-B 페어가 입력받은 Liquidity의 LP 토큰 만큼 burn(pair가 pair에게 전송 = burn)
        IDNDPair(pair).transferFrom(msg.sender, pair, liquidity);

        // to의 LP 토큰 잔액이 변경됐으므로, DNDPair의 burn함수로 amount0, amount1만큼 A,B 토큰을 to에게 돌려준다  
        (amountA, amountB) = IDNDPair(pair).burn(to);
        
        require(amountA >= amountAMin, 'DNDRouter: INSUFFICIENT_A_AMOUNT');
        require(amountB >= amountBMin, 'DNDRouter: INSUFFICIENT_B_AMOUNT');
    }

    // **** SWAP ****
    // requires the initial amount to have already been sent to the first pair
    // ref) https://jeiwan.net/posts/programming-defi-uniswapv2-4/

    function swapExactTokensForTokens(  // Token to Token swap : ex) DAI-WBTC
        uint256 amountIn,               // swap 을 위해 입금한 A Token
        uint256 amountOutMin,           // swap 후 최소한 얻고자하는 B Token output
        address[] calldata path,        // a list of token addresses we want this trade to happen([0]:tokenA, [1]: WKLAY, [2]: tokenB)
        address to                      // amountIn 을 보낼 대상의 주소
    ) external returns (uint[] memory amounts) {
        amounts = DNDLibrary.getAmountsOut(
            address(factory),
            amountIn,
            path
        );
        require(amounts[amounts.length - 1] >= amountOutMin, 'DNDRouter: INSUFFICIENT_OUTPUT_AMOUNT');
        _safeTransferFrom(
            path[0],
            msg.sender,
            DNDLibrary.pairFor(address(factory), path[0], path[1]),
            amounts[0]
        );
        _swap(amounts, path, to);
    }

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to
    ) external returns (uint256[] memory amounts) {
        amounts = DNDLibrary.getAmountsIn(
            address(factory),
            amountOut,
            path
        );
        require(amounts[0] <= amountInMax, 'DNDRouter: EXCESSIVE_INPUT_AMOUNT');

        _safeTransferFrom(
            path[0],
            msg.sender,
            DNDLibrary.pairFor(address(factory), path[0], path[1]),
            amounts[0]
        );
        _swap(amounts, path, to);
    }

    function getOutput(uint256 _amountIn, address[] memory path) public view returns (uint256[] memory) {
        return DNDLibrary.getAmountsOut(address(factory), _amountIn, path);
    }
    
    //
    //
    //
    //  PRIVATE
    //
    //
    //
    function _swap(
        uint256[] memory amounts,
        address[] memory path,
        address to_
    ) internal {
        for (uint256 i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0, ) = DNDLibrary.sortTokens(input, output);
            uint256 amountOut = amounts[i + 1];
            (uint256 amount0Out, uint256 amount1Out) = input == token0
                ? (uint256(0), amountOut)
                : (amountOut, uint256(0));
            address to = i < path.length - 2
                ? DNDLibrary.pairFor(
                    address(factory),
                    output,
                    path[i + 2]
                )
                : to_;
            IDNDPair(
                DNDLibrary.pairFor(address(factory), input, output)
            ).swap(amount0Out, amount1Out, to, "");
        }
    }
    function _calculateLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin
    ) internal view returns (uint256 amountA, uint256 amountB) {
        (uint256 reserveA, uint256 reserveB) = DNDLibrary.getReserves(
            address(factory),
            tokenA,
            tokenB
        );

        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            uint256 amountBOptimal = DNDLibrary.quote(
                amountADesired,
                reserveA,
                reserveB
            );
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, 'DNDRouter: INSUFFICIENT_B_AMOUNT');
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint256 amountAOptimal = DNDLibrary.quote(
                    amountBDesired,
                    reserveB,
                    reserveA
                );
                assert(amountAOptimal <= amountADesired);

                require(amountAOptimal >= amountAMin, 'DNDRouter: INSUFFICIENT_A_AMOUNT');
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }

    function _safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) private {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                from,
                to,
                value
            )
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'SAFETRANSFER_FAILED');
    }
}