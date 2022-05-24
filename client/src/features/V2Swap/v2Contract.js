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
};
