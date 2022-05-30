const UruToken = artifacts.require("./UruToken.sol");
const { expect } = require("chai");

contract("UruToken", ([deployer, ...accounts]) => {
  let uruToken;
  let cap = 100000000;

  before(async () => {
    uruToken = await UruToken.new(web3.utils.toWei(cap.toString(), "ether"));
  });

  it("mint correct tokens", async () => {
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
