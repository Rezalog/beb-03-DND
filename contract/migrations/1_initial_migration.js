const Migrations = artifacts.require("./Migrations.sol");
const Token = artifacts.require("./Token.sol");
const Factory = artifacts.require("./Factory.sol");
const Exchange = artifacts.require("./Exchange.sol");
const LP_Farming = artifacts.require("./LP_Farming.sol");
const NFT = artifacts.require("./NFT.sol");
const NFT_Factory = artifacts.require("./NFT_Factory.sol");
const NFT_Farming = artifacts.require("./NFT_Farming.sol");
const Betting = artifacts.require("./Betting.sol");
const Master = artifacts.require("./Master.sol");
require("dotenv").config();
const value = "10000000000000000000000";

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  // deployer.deploy(Token, "URUtoken", "URU", 18, value, 10000);
  // deployer.deploy(Factory, process.env.TOKEN_CONTRACT, process.env.TOKEN_CONTRACT, 120);
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

  // deployer.deploy(Betting,process.env.NFT_CONTRACT,process.env.TOKEN_CONTRACT);
  // deployer.deploy(Master, process.env.TOKEN_CONTRACT, 25);
};
