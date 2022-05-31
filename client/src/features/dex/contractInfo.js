module.exports = {
  factoryAddress: "0xf9ea8C4C9E18D79309cf576c91F176B80d99813C",
  factoryABI: [
    {
      constant: true,
      inputs: [],
      name: "uru",
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
          type: "address",
        },
      ],
      name: "tokenToExchange",
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
      name: "master",
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
      inputs: [
        {
          name: "_master",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_tokenAddress",
          type: "address",
        },
        {
          name: "_uru",
          type: "address",
        },
        {
          name: "_epochDuration",
          type: "uint256",
        },
      ],
      name: "createExchange",
      outputs: [
        {
          name: "",
          type: "address",
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
          name: "_tokenAddress",
          type: "address",
        },
      ],
      name: "getExchange",
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
  exchangeABI: [
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
      name: "uru",
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
      constant: true,
      inputs: [],
      name: "factoryAddress",
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
      inputs: [
        {
          name: "_token",
          type: "address",
        },
        {
          name: "_uru",
          type: "address",
        },
        {
          name: "_epochDuration",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
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
    {
      constant: false,
      inputs: [
        {
          name: "_tokenAmount",
          type: "uint256",
        },
      ],
      name: "addLiquidity",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      payable: true,
      stateMutability: "payable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "removeLiquidity",
      outputs: [
        {
          name: "",
          type: "uint256",
        },
        {
          name: "",
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
      name: "getKlay",
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
      inputs: [
        {
          name: "_tokenSold",
          type: "uint256",
        },
      ],
      name: "getKlayAmount",
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
          name: "_minTokens",
          type: "uint256",
        },
        {
          name: "recipient",
          type: "address",
        },
      ],
      name: "klayToToken",
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
          name: "_minTokens",
          type: "uint256",
        },
        {
          name: "_recipient",
          type: "address",
        },
      ],
      name: "klayToTokenTransfer",
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
      name: "tokenToKlaySwap",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
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
          name: "_minTokensBought",
          type: "uint256",
        },
        {
          name: "_tokenAddress",
          type: "address",
        },
      ],
      name: "tokenToTokenSwap",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};
