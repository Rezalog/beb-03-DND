module.exports = {
  routerAddress: "0x3DD2576bC66bCDdE71ea32B73791Ef227dEF56ef",
  factoryAddress: "0x8eA415E79bc83c4DeBe53Cc55ef1420271088F9B",
  factoryABI: [
    {
      constant: true,
      inputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      name: "allPairs",
      outputs: [
        {
          name: "",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "allPairsLength",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "",
          type: "address",
        },
        {
          name: "",
          type: "address",
        },
      ],
      name: "pairs",
      outputs: [
        {
          name: "",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      name: "pairCode",
      outputs: [
        {
          name: "",
          type: "bytes",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "tokenA",
          type: "address",
        },
        {
          name: "tokenB",
          type: "address",
        },
      ],
      name: "createPair",
      outputs: [
        {
          name: "pair",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "token0",
          type: "address",
        },
        {
          indexed: true,
          name: "token1",
          type: "address",
        },
        {
          indexed: false,
          name: "pair",
          type: "address",
        },
        {
          indexed: false,
          name: "",
          type: "uint256",
        },
      ],
      name: "PairCreated",
      type: "event",
    },
  ],
  routerABI: [
    {
      constant: false,
      inputs: [
        {
          name: "amountOut",
          type: "uint256",
        },
        {
          name: "amountInMax",
          type: "uint256",
        },
        {
          name: "path",
          type: "address[]",
        },
        {
          name: "to",
          type: "address",
        },
      ],
      name: "swapTokensForExactTokens",
      outputs: [
        {
          name: "amounts",
          type: "uint256[]",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "amountIn",
          type: "uint256",
        },
        {
          name: "amountOutMin",
          type: "uint256",
        },
        {
          name: "path",
          type: "address[]",
        },
        {
          name: "to",
          type: "address",
        },
      ],
      name: "swapExactTokensForTokens",
      outputs: [
        {
          name: "amounts",
          type: "uint256[]",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "tokenA",
          type: "address",
        },
        {
          name: "tokenB",
          type: "address",
        },
        {
          name: "liquidity",
          type: "uint256",
        },
        {
          name: "amountAMin",
          type: "uint256",
        },
        {
          name: "amountBMin",
          type: "uint256",
        },
        {
          name: "to",
          type: "address",
        },
      ],
      name: "removeLiquidity",
      outputs: [
        {
          name: "amountA",
          type: "uint256",
        },
        {
          name: "amountB",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "factory",
      outputs: [
        {
          name: "",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "tokenA",
          type: "address",
        },
        {
          name: "tokenB",
          type: "address",
        },
        {
          name: "amountADesired",
          type: "uint256",
        },
        {
          name: "amountBDesired",
          type: "uint256",
        },
        {
          name: "amountAMin",
          type: "uint256",
        },
        {
          name: "amountBMin",
          type: "uint256",
        },
        {
          name: "to",
          type: "address",
        },
      ],
      name: "addLiquidity",
      outputs: [
        {
          name: "amountA",
          type: "uint256",
        },
        {
          name: "amountB",
          type: "uint256",
        },
        {
          name: "liquidity",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_amountIn",
          type: "uint256",
        },
        {
          name: "path",
          type: "address[]",
        },
      ],
      name: "getOutput",
      outputs: [
        {
          name: "",
          type: "uint256[]",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          name: "factoryAddress",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
  ],
  pairABI: [
    {
      constant: true,
      inputs: [
        {
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "amount0Out",
          type: "uint256",
        },
        {
          name: "amount1Out",
          type: "uint256",
        },
        {
          name: "to",
          type: "address",
        },
        {
          name: "data",
          type: "bytes",
        },
      ],
      name: "swap",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getReserves",
      outputs: [
        {
          name: "",
          type: "uint112",
        },
        {
          name: "",
          type: "uint112",
        },
        {
          name: "",
          type: "uint32",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "spender",
          type: "address",
        },
        {
          name: "value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "token0",
      outputs: [
        {
          name: "",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "sender",
          type: "address",
        },
        {
          name: "recipient",
          type: "address",
        },
        {
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [
        {
          name: "",
          type: "uint8",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "recipient",
          type: "address",
        },
        {
          name: "amount",
          type: "uint256",
        },
      ],
      name: "safeTransfer",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "sender",
          type: "address",
        },
        {
          name: "recipient",
          type: "address",
        },
        {
          name: "amount",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "token0_",
          type: "address",
        },
        {
          name: "token1_",
          type: "address",
        },
      ],
      name: "initialize",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "price0CumulativeLast",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "price1CumulativeLast",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "to",
          type: "address",
        },
      ],
      name: "mint",
      outputs: [
        {
          name: "liquidity",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "to",
          type: "address",
        },
      ],
      name: "burn",
      outputs: [
        {
          name: "amount0",
          type: "uint256",
        },
        {
          name: "amount1",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [
        {
          name: "",
          type: "string",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "recipient",
          type: "address",
        },
        {
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "sender",
          type: "address",
        },
        {
          name: "recipient",
          type: "address",
        },
        {
          name: "amount",
          type: "uint256",
        },
        {
          name: "data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "MINIMUM_LIQUIDITY",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "token1",
      outputs: [
        {
          name: "",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "owner",
          type: "address",
        },
        {
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "recipient",
          type: "address",
        },
        {
          name: "amount",
          type: "uint256",
        },
        {
          name: "data",
          type: "bytes",
        },
      ],
      name: "safeTransfer",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "sync",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "sender",
          type: "address",
        },
        {
          indexed: false,
          name: "amount0",
          type: "uint256",
        },
        {
          indexed: false,
          name: "amount1",
          type: "uint256",
        },
      ],
      name: "Mint",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "sender",
          type: "address",
        },
        {
          indexed: false,
          name: "amount0",
          type: "uint256",
        },
        {
          indexed: false,
          name: "amount1",
          type: "uint256",
        },
        {
          indexed: false,
          name: "to",
          type: "address",
        },
      ],
      name: "Burn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "sender",
          type: "address",
        },
        {
          indexed: false,
          name: "amount0Out",
          type: "uint256",
        },
        {
          indexed: false,
          name: "amount1Out",
          type: "uint256",
        },
        {
          indexed: true,
          name: "to",
          type: "address",
        },
      ],
      name: "Swap",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "reserve0",
          type: "uint256",
        },
        {
          indexed: false,
          name: "reserve1",
          type: "uint256",
        },
      ],
      name: "Sync",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
  ],
};
