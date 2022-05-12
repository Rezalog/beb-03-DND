module.exports = {
  abi: [
    {
      constant: false,
      inputs: [
        {
          name: "_tokenAmount",
          type: "uint256",
        },
      ],
      name: "addLiquidity",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_minTokens",
          type: "uint256",
        },
      ],
      name: "klayToTokenSwap",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_tokensSold",
          type: "uint256",
        },
        {
          name: "_minklay",
          type: "uint256",
        },
      ],
      name: "tokenToklaySwap",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          name: "_token",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      constant: true,
      inputs: [],
      name: "getklay",
      outputs: [
        {
          name: "balance",
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
          name: "_tokenSold",
          type: "uint256",
        },
      ],
      name: "getklayAmount",
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
      name: "getReserve",
      outputs: [
        {
          name: "balance",
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
          name: "_klaySold",
          type: "uint256",
        },
      ],
      name: "getTokenAmount",
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
      name: "tokenAddress",
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
  ],
  address: "0xD17A1319c1b6A4B7B5c95BABF70BDf027c47D947",
};
