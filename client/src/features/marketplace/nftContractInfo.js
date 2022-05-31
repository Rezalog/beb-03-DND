module.exports = {
  tokenAddress: "0x4b6AeB1f969B973C406B4221433c51381d2Da628",
  marketAddress: "0x808DD56c890dD47dc5B9F931A2FB6b13EEA4564B",
  nftAddress: "0xA43d22bbbcFeFC1E5D1837407ecb6A68BC5b40E9",
  marketABI: [
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
      name: "onSales",
      outputs: [
        {
          name: "id",
          type: "uint256",
        },
        {
          name: "seller",
          type: "address",
        },
        {
          name: "tokenId",
          type: "uint256",
        },
        {
          name: "price",
          type: "uint256",
        },
        {
          name: "sold",
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
          name: "_fee",
          type: "uint256",
        },
        {
          name: "_feeTo",
          type: "address",
        },
        {
          name: "tokenAddress",
          type: "address",
        },
        {
          name: "nftAddress",
          type: "address",
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
          name: "id",
          type: "uint256",
        },
        {
          indexed: true,
          name: "seller",
          type: "address",
        },
        {
          indexed: false,
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          name: "price",
          type: "uint256",
        },
      ],
      name: "Add",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "id",
          type: "uint256",
        },
        {
          indexed: true,
          name: "seller",
          type: "address",
        },
        {
          indexed: true,
          name: "buyer",
          type: "address",
        },
        {
          indexed: false,
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          name: "price",
          type: "uint256",
        },
      ],
      name: "Buy",
      type: "event",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_tokenId",
          type: "uint256",
        },
        {
          name: "_price",
          type: "uint256",
        },
      ],
      name: "addNftToMarket",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getNfts",
      outputs: [
        {
          components: [
            {
              name: "id",
              type: "uint256",
            },
            {
              name: "seller",
              type: "address",
            },
            {
              name: "tokenId",
              type: "uint256",
            },
            {
              name: "price",
              type: "uint256",
            },
            {
              name: "sold",
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
      constant: false,
      inputs: [
        {
          name: "_id",
          type: "uint256",
        },
      ],
      name: "buyNft",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_id",
          type: "uint256",
        },
      ],
      name: "removeNft",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  nftABI: [
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
      constant: true,
      inputs: [
        {
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
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
          name: "to",
          type: "address",
        },
        {
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
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
      constant: true,
      inputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      name: "tokenToFixDurability",
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
          name: "from",
          type: "address",
        },
        {
          name: "to",
          type: "address",
        },
        {
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
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
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenOfOwnerByIndex",
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
          name: "from",
          type: "address",
        },
        {
          name: "to",
          type: "address",
        },
        {
          name: "tokenId",
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
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenByIndex",
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
      ],
      name: "weapons",
      outputs: [
        {
          name: "weaponType",
          type: "uint256",
        },
        {
          name: "weaponLevel",
          type: "uint256",
        },
        {
          name: "durability",
          type: "uint256",
        },
        {
          name: "enchant",
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
      ],
      name: "tokenToCompound",
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
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
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
      constant: false,
      inputs: [
        {
          name: "to",
          type: "address",
        },
        {
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
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
      name: "compoundResult",
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
      ],
      name: "tokenToFixEnchant",
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
          name: "from",
          type: "address",
        },
        {
          name: "to",
          type: "address",
        },
        {
          name: "tokenId",
          type: "uint256",
        },
        {
          name: "_data",
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
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
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
      inputs: [
        {
          name: "",
          type: "uint256",
        },
      ],
      name: "tokenToFix",
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
      ],
      name: "percentage",
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
          name: "owner",
          type: "address",
        },
        {
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
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
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "weaponId",
          type: "uint256",
        },
        {
          indexed: false,
          name: "weaponType",
          type: "uint256",
        },
        {
          indexed: false,
          name: "weaponLevel",
          type: "uint256",
        },
      ],
      name: "NewWeapon",
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
          indexed: true,
          name: "tokenId",
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
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
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
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      constant: false,
      inputs: [
        {
          name: "recipient",
          type: "address",
        },
        {
          name: "_weaponLevel",
          type: "uint256",
        },
      ],
      name: "mint",
      outputs: [
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
      constant: false,
      inputs: [],
      name: "buyBasicWeapon",
      outputs: [
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
      constant: false,
      inputs: [
        {
          name: "_weaponLevel",
          type: "uint256",
        },
      ],
      name: "createRandomWeapon",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "createRandomNum",
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
          name: "_weapon1Id",
          type: "uint256",
        },
        {
          name: "_weapon2Id",
          type: "uint256",
        },
      ],
      name: "compoundWeapon",
      outputs: [
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
      inputs: [
        {
          name: "_weapon1Id",
          type: "uint256",
        },
        {
          name: "_weapon2Id",
          type: "uint256",
        },
      ],
      name: "getCompoundResult",
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
          name: "_weaponId",
          type: "uint256",
        },
      ],
      name: "getWeaponLevel",
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
          name: "_weaponId",
          type: "uint256",
        },
      ],
      name: "stakingWeapon",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_weaponId",
          type: "uint256",
        },
      ],
      name: "fixWeaponDurability",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          name: "_weaponId",
          type: "uint256",
        },
      ],
      name: "fixWeaponEnchant",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};
