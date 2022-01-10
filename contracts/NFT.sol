pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;
import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

/// @title NFT Market place contract.
/// @notice Contract to manage NFT creation and buying and selling.
contract NFT is ERC721Token{
    constructor (string _name, string _symbol) public
    ERC721Token(_name, _symbol)
    {
        Marketplace memory init = Marketplace({
            tokenId : 0,
            status : 'default',
            price : 0,
            owner: address(this)
        });
        market.push(init);
    }

    struct Marketplace
    {
    uint256 tokenId;
    string status;
    uint256 price;
    address owner;
    }

    Marketplace[] market;

    mapping(uint256 => uint256) public TokenToMarketIndex; // mapping for token listing in the market
    uint256 public tokenCounter;

    // Contract modifiers.
    modifier isTokenOwner(uint256 _tokenId){
        require(super.ownerOf(_tokenId) == address(msg.sender), 'sender is not the owner');
        _;
    }

    // Contract modifiers.
    modifier isValidTokenForSale(uint256 _tokenId){
        require(TokenToMarketIndex[_tokenId] != 0, 'Token is not put for sale');
        _;
    }

    /// @notice create a unique token
    /// @param _to to address of the created nft
    /// @param _NFTURI URI address of the nft
    function mintUniqueNFTTo(
        address _to,
        string  _NFTURI
    ) public returns(bool)
    {
        tokenCounter++;
        uint256 tokenId = tokenCounter;
        super._mint(_to, tokenId);
        super._setTokenURI(tokenId, _NFTURI);
        return true;
    }


    /// @notice put token for sale
    /// @param _tokenId token id of the nft 
    /// @param _price price of nft to put for sale
    function putNFTForSale(
        uint256 _tokenId,
        uint256 _price
    ) public isTokenOwner(_tokenId) returns(bool){
        Marketplace memory newOrder = Marketplace({
            tokenId : _tokenId,
            status : 'avaiable',
            price : _price,
            owner: msg.sender
            });
            market.push(newOrder);
        TokenToMarketIndex[_tokenId] = market.length - 1;
        return true;
}

    /// @notice buy token
    /// @param _tokenId token id of the nft 
    function buyNFT(
        uint256 _tokenId
    ) public isValidTokenForSale(_tokenId) payable returns(bool){
        Marketplace memory token = market[TokenToMarketIndex[_tokenId]];
        require(token.price == msg.value, 'Invalid price');
        token.owner.transfer(token.price);
        removeTokenFrom(token.owner, token.tokenId);
        addTokenTo(msg.sender, token.tokenId);
        Marketplace memory newOrder = Marketplace({
            tokenId : _tokenId,
            status : 'unavaiable',
            price : 0,
            owner: msg.sender
        });
        market[TokenToMarketIndex[_tokenId]] = newOrder;
        return true;
    }

    /// @notice  get total no of Minted Nfts
    function getTotalNFTS() public view returns(uint256){
        return super.totalSupply();
    }

    /// @notice  get all TokenIds held by the sender
    function getTotalNFTSHeldBySender() public view returns(uint256[]){
        return ownedTokens[msg.sender];
    }

    /// @notice  get all nfts in the market
    function getMarket() public view returns(Marketplace[]){
        return market;
    }

    /// @notice  get unique nft in the market
    /// @param _index index of the nft in the marketplace
    function getMarketByIndex(uint256 _index) public view returns(Marketplace){
        return market[_index];
    }
}
