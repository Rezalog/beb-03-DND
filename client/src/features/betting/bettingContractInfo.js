module.exports = {
  bettingAddress: "0x83865E39db8Eb853Cc57C96e47b9957fa548aE25",
  bettingABI: [
    {
      constant: true,
      inputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      name: "amountInfo",
      outputs: [
        {
          name: "betAmountSuccees",
          type: "uint256",
        },
        {
          name: "betAmountFailure",
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
      name: "nft",
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
      name: "startTime",
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
          type: "uint256",
        },
        {
          name: "",
          type: "uint256",
        },
      ],
      name: "failureUserList",
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
        {
          name: "",
          type: "address",
        },
      ],
      name: "userInfo",
      outputs: [
        {
          name: "amount",
          type: "uint256",
        },
        {
          name: "side",
          type: "bool",
        },
        {
          name: "isBet",
          type: "bool",
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
        {
          name: "",
          type: "uint256",
        },
      ],
      name: "succeesUserList",
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
      name: "tokenInfo",
      outputs: [
        {
          name: "timeStamp",
          type: "uint256",
        },
        {
          name: "level",
          type: "uint256",
        },
        {
          name: "token1Id",
          type: "uint256",
        },
        {
          name: "token2Id",
          type: "uint256",
        },
        {
          name: "id",
          type: "uint256",
        },
        {
          name: "initiator",
          type: "address",
        },
        {
          name: "result",
          type: "bool",
        },
        {
          name: "done",
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
      name: "betNumber",
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
      name: "token",
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
          name: "_NFTAddress",
          type: "address",
        },
        {
          name: "_tokenAddress",
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
          name: "operator",
          type: "address",
        },
        {
          name: "from",
          type: "address",
        },
        {
          name: "tokenId",
          type: "uint256",
        },
        {
          name: "data",
          type: "bytes",
        },
      ],
      name: "onKIP17Received",
      outputs: [
        {
          name: "",
          type: "bytes4",
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
          name: "_token1Id",
          type: "uint256",
        },
        {
          name: "_token2Id",
          type: "uint256",
        },
      ],
      name: "createBet",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_amount",
          type: "uint256",
        },
        {
          name: "_side",
          type: "bool",
        },
        {
          name: "_betNumber",
          type: "uint256",
        },
      ],
      name: "bet",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_betNumber",
          type: "uint256",
        },
      ],
      name: "distribution",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_betNumber",
          type: "uint256",
        },
        {
          name: "_player",
          type: "address",
        },
      ],
      name: "calculateRewardSuccees",
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
          name: "_betNumber",
          type: "uint256",
        },
        {
          name: "_player",
          type: "address",
        },
      ],
      name: "calculateRewardFailure",
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
          name: "_betNumber",
          type: "uint256",
        },
      ],
      name: "amountForSuccees",
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
          name: "_betNumber",
          type: "uint256",
        },
      ],
      name: "amountForFailure",
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
          name: "_betNumber",
          type: "uint256",
        },
        {
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "oddsForSuccees",
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
          name: "_betNumber",
          type: "uint256",
        },
        {
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "oddsForFailure",
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
      name: "getBettingInfo",
      outputs: [
        {
          components: [
            {
              name: "timeStamp",
              type: "uint256",
            },
            {
              name: "level",
              type: "uint256",
            },
            {
              name: "token1Id",
              type: "uint256",
            },
            {
              name: "token2Id",
              type: "uint256",
            },
            {
              name: "id",
              type: "uint256",
            },
            {
              name: "initiator",
              type: "address",
            },
            {
              name: "result",
              type: "bool",
            },
            {
              name: "done",
              type: "bool",
            },
          ],
          name: "",
          type: "tuple[]",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getAmountInfo",
      outputs: [
        {
          components: [
            {
              name: "betAmountSuccees",
              type: "uint256",
            },
            {
              name: "betAmountFailure",
              type: "uint256",
            },
          ],
          name: "",
          type: "tuple[]",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ],
};
