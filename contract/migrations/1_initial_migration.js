const Migrations = artifacts.require("./Migrations.sol");
const Exchange = artifacts.require("./Exchange.sol");
const Token = artifacts.require("./Token.sol");
const LP_Farming = artifacts.require("./LP_Farming.sol");
require("dotenv").config();
const value = "10000000000000000000000";

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  // deployer.deploy(Token, "URUtoken", "URU", 18, value);
  // deployer.deploy(Exchange, process.env.TOKEN_CONTRACT);
  deployer.deploy(LP_Farming, process.env.TOKEN_CONTRACT);
};
