const UruToken = artifacts.require("./UruToken.sol");
const LPTokenStaking = artifacts.require("./LPTokenStaking.sol");
const TokenTimeLock = artifacts.require("./TokenTimeLock.sol");
const { expect, assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();

contract("LPTokenStaking", ([deployer, ...accounts]) => {
  let uruToken;
  let lpTokenStaking;
  let timeLock;
  let cap = 100000000;
  let amount = 100;

  before(async () => {
    uruToken = await UruToken.new(web3.utils.toWei(cap.toString(), "ether"));
    timeLock = await TokenTimeLock.new(uruToken.address);
    lpTokenStaking = await LPTokenStaking.new(
      uruToken.address,
      timeLock.address
    );

    await uruToken.addMinter(lpTokenStaking.address);
    await uruToken.addMinter(timeLock.address);
  });

  describe("Deploy", () => {
    it("is deployed", async () => {
      expect(await lpTokenStaking.uruToken()).to.equal(uruToken.address);
    });
    it("has minter role", async () => {
      expect(await uruToken.isMinter(lpTokenStaking.address)).to.equal(true);
    });
  });

  describe("Claim", () => {
    it("send reward to recipient", async () => {
      await lpTokenStaking.claim(
        accounts[0],
        web3.utils.toWei(amount.toString(), "ether")
      );
      const balanceOfAccount = await uruToken.balanceOf(accounts[0]);
      expect(balanceOfAccount.toString()).to.equal(
        web3.utils.toWei((amount * 0.05).toString(), "ether")
      );
    });
    it("lock portion of reward", async () => {
      const lockedToken = await timeLock.lockedToken(accounts[0]);
      expect(lockedToken.toString()).to.equal(
        web3.utils.toWei((amount * 0.95).toString(), "ether")
      );
    });
  });
});
