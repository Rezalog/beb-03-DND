const Migrations = artifacts.require("./Migrations.sol");
const Exchange = artifacts.require("./Exchange.sol");
const Token = artifacts.require("./Token.sol");
require("dotenv").config();
const value = "10000000000000000000000";

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Exchange, process.env.TOKEN_CONTRACT);
  deployer.deploy(Token, "URUtoken", "URU", 18, value);
};
