const UruToken = artifacts.require("./UruToken.sol");
const Vesting = artifacts.require("./Vesting.sol");
const { expect } = require("chai");
require("chai").use(require("chai-as-promised")).should();

contract("Vesting", ([deployer, ...accounts]) => {
  let uruToken;
  let vesting;
  let startTime = 1652185898;
  let cap = 100000000;

  before(async () => {
    uruToken = await UruToken.new(web3.utils.toWei(cap.toString(), "ether"));
    vesting = await Vesting.new(uruToken.address, startTime, 12);
  });

  describe("mint", () => {
    it("set correct values", async () => {
      const name = await uruToken.name();
      const symbol = await uruToken.symbol();
      const decimal = await uruToken.decimals();
      const totalSupply = await uruToken.totalSupply();
      const _cap = await uruToken.cap();

      expect(name).to.equal("Uru Token");
      expect(symbol).to.equal("URU");
      expect(decimal.toString()).to.equal("18");
      expect(totalSupply.toString()).to.equal("0");
      expect(_cap.toString()).to.equal(
        web3.utils.toWei(cap.toString(), "ether").toString()
      );
    });
  });

  describe("Vesting", () => {
    it("is deployed", async () => {
      expect(await vesting.uruToken()).to.equal(uruToken.address);
    });
    it("sets correct value", async () => {
      const _startTime = await vesting.startTime();
      const _stages = await vesting.stages();

      expect(_startTime.toString()).to.equal(startTime.toString());
      expect(_stages.toString()).to.equal("12");
    });
  });

  describe("Token distribute", async () => {
    it("only owner can", async () => {
      await uruToken
        .tokenDistribution(vesting.address, { from: accounts[0] })
        .should.be.rejectedWith("Only Owner can call this funtction");
    });

    it("token is distributed", async () => {
      await uruToken.tokenDistribution(vesting.address, {
        from: deployer,
      });
      const vestingBalance = await uruToken.balanceOf(vesting.address);

      expect(web3.utils.fromWei(vestingBalance.toString(), "ether")).to.equal(
        "12000000"
      );
    });

    it("can only call once", async () => {
      await uruToken
        .tokenDistribution(vesting.address, { from: deployer })
        .should.be.rejectedWith("Cannot call token distribution twice!");
    });

    describe("Beneficiaries", async () => {
      it("add beneficiaries", async () => {
        await vesting.addBeneficairies(
          [accounts[0], accounts[1]],
          [
            web3.utils.toWei("1000", "ether"),
            web3.utils.toWei("10000", "ether"),
          ],
          { from: deployer }
        );
        const tokenPerMonth0 = await vesting.releasedTokenPerMonth(accounts[0]);
        const tokenPerMonth1 = await vesting.releasedTokenPerMonth(accounts[1]);
        expect(web3.utils.fromWei(tokenPerMonth0, "ether")).to.equal("100");
        expect(web3.utils.fromWei(tokenPerMonth1, "ether")).to.equal("1000");
      });
    });
  });
});
