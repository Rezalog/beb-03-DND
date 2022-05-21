module.exports = {
  farmingABI: [
    {
      constant: false,
      inputs: [
        {
          name: "_tokenID",
          type: "uint256",
        },
      ],
      name: "stake",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_tokenID",
          type: "uint256",
        },
      ],
      name: "unstake",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "withdrawYield",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          name: "_NFTaddress",
          type: "address",
        },
        {
          name: "_tokenAddress",
          type: "address",
        },
        {
          name: "_level",
          type: "uint256",
        },
        {
          name: "_coolDownTime",
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
          indexed: false,
          name: "owner",
          type: "address",
        },
        {
          indexed: false,
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "NFTStaked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "owner",
          type: "address",
        },
        {
          indexed: false,
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "NFTUnstaked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          name: "amount",
          type: "uint256",
        },
      ],
      name: "YieldWithdraw",
      type: "event",
    },
    {
      constant: true,
      inputs: [],
      name: "getStakingTime",
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
      ],
      name: "stakeInfo",
      outputs: [
        {
          name: "tokenID",
          type: "uint256",
        },
        {
          name: "yieldLockTime",
          type: "uint256",
        },
        {
          name: "isStaking",
          type: "bool",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ],
};
