const ethers = require("ethers");
const truffleAssert = require('truffle-assertions');
const truffleCost = require('truffle-cost');
let { assert } = require("chai");
let NFT = artifacts.require("./NFT.sol");

contract("Functional test ", function (accounts) {
    let NFTContract;
    before("Deploy all contracts", async function () {
        NFTContract = await NFT.deployed()
    });

    it("Should Fail to add a NFT.", async function () {
        let address = "wedwexw";
        let tokenURI = "34d324d2";
        await truffleAssert.fails(
            NFTContract.mintUniqueNFTTo(address, tokenURI, { from: accounts[0] }),
            "INVALID_ARGUMENT"
        );
    });
    it("Should Fail to put token for sale.", async function () {
        let tokenId = '10';
        let price = '1';
        await truffleAssert.fails(
            NFTContract.putNFTForSale(tokenId, price, { from: accounts[0] }),
            truffleAssert.ErrorType.REVERT,
            "VM Exception while processing transaction",
            "sender is not the owner"
        );
    });
    it("Should Fail to buy a token", async function () {
        let tokenId = '091';
        await truffleAssert.fails(
            NFTContract.buyNFT(tokenId, { from: accounts[2] }),
            "VM Exception while processing transaction",
        );
    });
    it("Should get total NFTS", async function () {
        const testTX1 = await
            NFTContract.getTotalNFTS(
                { from: accounts[0] }
            )
        assert.strictEqual(JSON.parse(testTX1), 0);
    });

    it("Should get total NFTS held by the sender", async function () {
        const testTX2 = await
            NFTContract.getTotalNFTSHeldBySender(
                { from: accounts[0] }
            )
        assert.deepEqual(testTX2, []);
    });
    it("Should get total NFT in the Market", async function () {
        const testTX3 = await
            NFTContract.getMarket(
                { from: accounts[0] }
            )
        assert.equal(testTX3.length,1);
    });
}
);
