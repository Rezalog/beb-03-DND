module.exports = {
  nftFactoryAddress: "0x3BB5623705B5BF5aE1A936FF18300bCB66cBed4b",
  nftFactoryABI: [
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
      inputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      name: "monsters",
      outputs: [
        {
          name: "NFTAddress",
          type: "address",
        },
        {
          name: "name",
          type: "string",
        },
        {
          name: "level",
          type: "uint256",
        },
        {
          name: "coolDownTime",
          type: "uint256",
        },
        {
          name: "reward",
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
          name: "_NFTAddress",
          type: "address",
        },
        {
          name: "_tokenAddress",
          type: "address",
        },
        {
          name: "_name",
          type: "string",
        },
        {
          name: "_level",
          type: "uint256",
        },
        {
          name: "_coolDownTime",
          type: "uint256",
        },
        {
          name: "_reward",
          type: "uint256",
        },
      ],
      name: "createNFTFarm",
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
      inputs: [],
      name: "getMonsters",
      outputs: [
        {
          components: [
            {
              name: "NFTAddress",
              type: "address",
            },
            {
              name: "name",
              type: "string",
            },
            {
              name: "level",
              type: "uint256",
            },
            {
              name: "coolDownTime",
              type: "uint256",
            },
            {
              name: "reward",
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
  farmingABI: [
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
        {
          name: "_reward",
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
  ],
};
