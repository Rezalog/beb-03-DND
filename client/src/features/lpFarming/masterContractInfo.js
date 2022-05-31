module.exports = {
  masterAddrss: "0x36FF06DA1dd8929b231ec7975986f745fC80c8EB",
  masterABI: [
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
          type: "uint256",
        },
      ],
      name: "poolInfo",
      outputs: [
        {
          name: "lpToken",
          type: "address",
        },
        {
          name: "stakeAmount",
          type: "uint256",
        },
        {
          name: "lastUpdatedTime",
          type: "uint256",
        },
        {
          name: "URUPerShare",
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
          name: "reward",
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
      name: "totalStakeAmount",
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
          name: "account",
          type: "address",
        },
      ],
      name: "addMinter",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "renounceMinter",
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
      name: "isMinter",
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
      name: "userList",
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
      name: "URUperblock",
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
      name: "poolId",
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
      inputs: [
        {
          name: "_uru",
          type: "address",
        },
        {
          name: "_URUperblock",
          type: "uint256",
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
          name: "user",
          type: "address",
        },
        {
          indexed: true,
          name: "pid",
          type: "uint256",
        },
        {
          indexed: false,
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Deposit",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "user",
          type: "address",
        },
        {
          indexed: true,
          name: "pid",
          type: "uint256",
        },
        {
          indexed: false,
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Withdraw",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "account",
          type: "address",
        },
      ],
      name: "MinterAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "account",
          type: "address",
        },
      ],
      name: "MinterRemoved",
      type: "event",
    },
    {
      constant: true,
      inputs: [],
      name: "poolLength",
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
          name: "_lpToken",
          type: "address",
        },
      ],
      name: "add",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_pid",
          type: "uint256",
        },
        {
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "deposit",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_pid",
          type: "uint256",
        },
        {
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "withdraw",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_pid",
          type: "uint256",
        },
      ],
      name: "harvest",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_pid",
          type: "uint256",
        },
        {
          name: "_user",
          type: "address",
        },
      ],
      name: "calculateContribute",
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
          name: "_pid",
          type: "uint256",
        },
        {
          name: "_user",
          type: "address",
        },
      ],
      name: "calculateCurrentReward",
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
          name: "_pid",
          type: "uint256",
        },
        {
          name: "_user",
          type: "address",
        },
      ],
      name: "calculateReward",
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
      name: "countDown",
      outputs: [
        {
          name: "count",
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
      name: "currentLockedPercentage",
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
  ],
};
