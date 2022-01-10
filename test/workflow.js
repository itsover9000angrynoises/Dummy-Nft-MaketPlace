const ethers = require("ethers");
const truffleAssert = require('truffle-assertions');
const truffleCost = require('truffle-cost');
let { assert } = require("chai");
let NFT = artifacts.require("./NFT.sol");

contract("Work Flow Test ", function (accounts) {
    let NFTContract;
    let tokenId=1;
    before("Deploy all contracts", async function (){
        NFTContract = await NFT.deployed()
    });

    it("Should add a NFT.", async function () {
        let address = accounts[0];
        let tokenURI = '1232112';
       const testTX1 = await
                NFTContract.mintUniqueNFTTo(
                   address,
                    tokenURI,
                    { from: accounts[0] }
                )
           assert.strictEqual(testTX1.receipt.status,true);
    });
    it("Should put token for sale.", async function () {
        let price = '1';
       const testTX2 = await
                NFTContract.putNFTForSale(
                    tokenId,
                    price,
                    { from: accounts[0] }
                )
           assert.strictEqual(testTX2.receipt.status,true);
    });
    it("Should buy a token", async function () {
       const testTX3 = await
                NFTContract.buyNFT(
                    tokenId,
                    { from: accounts[1] , value:1}
                )
           assert.strictEqual(testTX3.receipt.status,true);
    });
}
);
