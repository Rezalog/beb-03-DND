const Migrations = artifacts.require("./Migrations.sol");
const Token = artifacts.require("./Token.sol");
const Factory = artifacts.require("./Factory.sol");
const Exchange = artifacts.require("./Exchange.sol");
const LP_Farming = artifacts.require("./LP_Farming.sol");
const NFT = artifacts.require("./NFT.sol");
const NFTMarket = artifacts.require("./NFTMarket.sol");
const NFT_Factory = artifacts.require("./NFT_Factory.sol");
const NFT_Farming = artifacts.require("./NFT_Farming.sol");
const Betting = artifacts.require("./Betting.sol");
const Master = artifacts.require("./Master.sol");
const DNDFactory = artifacts.require("./V2/DNDFactory.sol");
const DNDRouter = artifacts.require("./V2/DNDRouter.sol");
const DNDLibrary = artifacts.require("./V2/libraries/DNDLibrary.sol");
require("dotenv").config();
const value = "1000000000000000000000000";

module.exports = async function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Token, "DNDtoken", "DND", 18, value, 31536000);
  // deployer.deploy(Factory, "0x36FF06DA1dd8929b231ec7975986f745fC80c8EB");
  // deployer.deploy(
  //   Exchange,
  //   process.env.TOKEN_CONTRACT,
  //   process.env.TOKEN_CONTRACT,
  //   120
  // );
  // deployer.deploy(LP_Farming, process.env.TOKEN_CONTRACT);

  // deployer.deploy(NFT, process.env.TOKEN_CONTRACT);
  // deployer.deploy(NFT_Factory);
  // deployer.deploy(NFT_Farming, process.env.NFT_CONTRACT, process.env.TOKEN_CONTRACT, 5, 15);
  // deployer.deploy(
  //   NFTMarket,
  //   0,
  //   "0x853A8463F394aE595bAe16CFcD2229e639298763",
  //   process.env.TOKEN_CONTRACT,
  //   process.env.NFT_CONTRACT
  // );

  // deployer.deploy(
  //   Betting,
  //   process.env.NFT_CONTRACT,
  //   process.env.TOKEN_CONTRACT
  // );
  // deployer.deploy(
  //   Master,
  //   process.env.TOKEN_CONTRACT,
  //   "10000000000000000000",
  //   604800
  // );
  // deployer.deploy(DNDFactory);
  //await deployer.deploy(DNDLibrary);
  // deployer.deploy(DNDRouter, "0x52ca2A3150e4b8Af2E7C962439e2A0A8422B76F7");
};
