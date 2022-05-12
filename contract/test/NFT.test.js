const NFT = artifacts.require("./NFT.sol");
const NFTMarket = artifacts.require("./NFTMarket.sol");
const UruToken = artifacts.require("./UruToken.sol");
const { expect, assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();

contract("NFT", ([deployer, ...accounts]) => {
  let nft;
  let market;
  let uruToken;
  let cap = 100000000;

  beforeEach(async () => {
    uruToken = await UruToken.new(web3.utils.toWei(cap.toString(), "ether"));
    nft = await NFT.new();
    market = await NFTMarket.new(0, deployer, uruToken.address, nft.address);
  });

  describe("Deploy", () => {
    it("is deployed", async () => {
      const name = await nft.name();
      const symbol = await nft.symbol();

      expect(name).to.equal("DND-WEAPON");
      expect(symbol).to.equal("WEAPON");
    });
  });

  describe("Minting", () => {
    it("mint NFT", async () => {
      const tokenURI = "1234";

      await nft.mint(accounts[0], tokenURI);
      const totalSupply = await nft.totalSupply();
      const ownerOf = await nft.ownerOf(1);

      expect(ownerOf).to.equal(accounts[0]);
      expect(totalSupply.toString()).to.equal("1");
    });
  });

  describe("Market", () => {
    it("is deployed", async () => {
      expect(await market.token()).to.equal(uruToken.address);
    });

    it("add NFT", async () => {
      await nft.setApprovalForAll(market.address, true, { from: accounts[0] });
      await uruToken.approve(
        market.address,
        web3.utils.toWei(cap.toString(), "ether"),
        { from: accounts[0] }
      );
      await market.addNftToMarket(1, web3.utils.toWei("30", "ether"), {
        from: accounts[0],
      });

      const ownerOf = await nft.ownerOf(1);
      expect(ownerOf).to.equal(accounts[0]);
    });

    it("buy NFT", async () => {
      await uruToken.mint(accounts[1], web3.utils.toWei("100", "ether"));
      await uruToken.approve(
        market.address,
        web3.utils.toWei(cap.toString(), "ether"),
        { from: accounts[1] }
      );

      const ownerOfBefore = await nft.ownerOf(1);
      expect(ownerOfBefore).to.equal(accounts[0]);
      await market.buyNft(1, {
        from: accounts[1],
      });
      const ownerOfAfter = await nft.ownerOf(1);
      const balanceOfAfter0 = await uruToken.balanceOf(accounts[0]);
      const balanceOfAfter1 = await uruToken.balanceOf(accounts[1]);
      expect(ownerOfAfter).to.equal(accounts[1]);
      console.log(balanceOfAfter1.toString());
      console.log(balanceOfAfter0.toString());
    });

    it.only("buy and sell NFT again", async () => {
      const tokenURI = "1234";

      await nft.mint(accounts[0], tokenURI);

      await nft.setApprovalForAll(market.address, true, { from: accounts[0] });
      await uruToken.approve(
        market.address,
        web3.utils.toWei(cap.toString(), "ether"),
        { from: accounts[0] }
      );
      await market.addNftToMarket(1, web3.utils.toWei("30", "ether"), {
        from: accounts[0],
      });

      await uruToken.mint(accounts[1], web3.utils.toWei("100", "ether"));
      await uruToken.approve(
        market.address,
        web3.utils.toWei(cap.toString(), "ether"),
        { from: accounts[1] }
      );

      const ownerOfBefore = await nft.ownerOf(1);
      expect(ownerOfBefore).to.equal(accounts[0]);
      await market.buyNft(1, {
        from: accounts[1],
      });

      await nft.setApprovalForAll(market.address, true, { from: accounts[1] });
      await market.addNftToMarket(1, web3.utils.toWei("50", "ether"), {
        from: accounts[1],
      });

      const ownerOf = await nft.ownerOf(1);
      expect(ownerOf).to.equal(accounts[1]);
      const nfts = await market.getNfts();
      console.log(nfts);
    });

    it("remove NFT from market", async () => {
      await nft.setApprovalForAll(market.address, true, { from: accounts[0] });
      await uruToken.approve(
        market.address,
        web3.utils.toWei(cap.toString(), "ether"),
        { from: accounts[0] }
      );
      await market.addNftToMarket(1, web3.utils.toWei("30", "ether"), {
        from: accounts[0],
      });

      let nfts = await market.getNfts();
      console.log(nfts);

      await market.removeNft(1, { from: accounts[0] });

      nfts = await market.getNfts();
      console.log(nfts);
    });

    it("cannot remove someone else's nft", async () => {
      await nft.setApprovalForAll(market.address, true, { from: accounts[0] });
      await uruToken.approve(
        market.address,
        web3.utils.toWei(cap.toString(), "ether"),
        { from: accounts[0] }
      );
      await market.addNftToMarket(1, web3.utils.toWei("30", "ether"), {
        from: accounts[0],
      });

      await market
        .removeNft(1, { from: accounts[1] })
        .should.be.rejectedWith("You don't own this NFT!!");
    });
  });
});
