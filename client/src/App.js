import React, { Component } from 'react'
import Web3 from 'web3'
import { NFTContractABI, NFTContractAddress } from './config'
class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }
  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider)
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const nftMarket = new web3.eth.Contract(NFTContractABI, NFTContractAddress)
    this.setState({ nftMarket })
    let marketAvailable = await nftMarket.methods.getMarket().call()
    this.setState({ marketAvailable })
    const nftsOwnedByAccount = await nftMarket.methods.getTotalNFTSHeldBySender().call({ from: this.state.account })
    this.setState({ nftsOwnedByAccount })
  }

  async callMintNft(tokenUrl) {
    await this.state.nftMarket.methods.mintUniqueNFTTo(this.state.account, tokenUrl).send({ from: this.state.account })
  }
  async getNFTOwnedByAccount() {
    const nftsOwnedByAccount = await this.state.nftMarket.methods.getTotalNFTSHeldBySender().call({ from: this.state.account })
    this.setState({ nftsOwnedByAccount })
  }

  async putNFTForSale(tokenId, price) {
    await this.state.nftMarket.methods.putNFTForSale(tokenId, price).send({ from: this.state.account })
  }

  async buyNFT(tokenId) {
    const price = this.getPriceOfNFTInMarket(tokenId);
    await this.state.nftMarket.methods.buyNFT(tokenId).send({ from: this.state.account, value: price })
  }
  async getMarket() {
    const nftMarket = await this.state.nftMarket.methods.getMarket().call()
    this.setState({ nftMarket })
  }
  async getMarketByIndex(tokenIndex) {
    const uniqueNFTDetails = await this.state.nftMarket.methods.getMarketByIndex(tokenIndex).call()
    this.setState({ uniqueNFTDetails })
  }

  getPriceOfNFTInMarket(id) {
    return this.state.marketAvailable.find((x) => x.tokenId === id).price
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      marketAvailable: [],
      nftsOwnedByAccount: [],
      nftMarket: [],
      uniqueNFTDetails: {}
    }
  }

  render() {
    const ethereum = window.ethereum._state.isConnected && window.ethereum._state.isUnlocked;
    return (
      <div className="container">
        <h1>NFT MARKETPLACE</h1>
        {!ethereum && <h1>Unlock metamask and connect to this site and refresh</h1>}
        <p>Your account: {this.state.account}</p>
        <p> Your NFT Token ID's: {this.state.nftsOwnedByAccount.map((tokenId) => <li>{tokenId}</li>)} </p>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.callMintNft(this.task.value)
          this.getNFTOwnedByAccount()
        }}>
          <h5> Mint NFT </h5>
          <input id="mintNFT" ref={(input) => this.task = input} type="text" className="form-control" placeholder="ADD NFT URL" required />
          <input type="submit" />
        </form>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.putNFTForSale(this.tokenId.value, this.price.value)
          this.getNFTOwnedByAccount()
        }}>
          <h5> Put NFT For Sale </h5>
          <input id="putNFTForSale" ref={(tokenId) => this.tokenId = tokenId} type="text" className="form-control" placeholder="ADD TokenID" required />
          <input id="Price" ref={(tokenPrice) => this.price = tokenPrice} type="text" className="form-control" placeholder="ADD Price" required />
          <input type="submit" />
        </form>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.buyNFT(this.id.value)
          this.getNFTOwnedByAccount()
        }}>
          <h5> Buy NFT </h5>
          <input id="buyNFT" ref={(id) => this.id = id} type="text" className="form-control" placeholder="ADD TokenID" required />
          <input type="submit" />
        </form>
        <h3>Market place</h3>
        {this.state.marketAvailable.map((listing) =>
          <p>tokenId: {listing.tokenId} <br />
        status: {listing.status} <br />
        price: {listing.price} <br />
        owner: {listing.owner}</p>
        )}
      </div>
    );
  }
}

export default App;