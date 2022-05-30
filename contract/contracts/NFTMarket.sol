// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "../node_modules/@klaytn/contracts/token/KIP17/IKIP17.sol";
import "../node_modules/@klaytn/contracts/token/KIP17/IKIP17Receiver.sol";
import "../node_modules/@klaytn/contracts/token/KIP7/IKIP7.sol";
import "../node_modules/@klaytn/contracts/drafts/Counters.sol";
import "../node_modules/@klaytn/contracts/math/SafeMath.sol";

contract NFTMarket{
  using Counters for Counters.Counter;
  using SafeMath for uint256;
  Counters.Counter private _Ids;

  uint256 fee;
  address feeTo;
  IKIP7 public token;
  IKIP17 public nft;

  struct NftOnSale {
    uint256 id;
    address seller;
    uint256 tokenId;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => NftOnSale) public onSales;

  event Add(uint256 id, address indexed seller, uint256 tokenId, uint256 price);
  event Buy(uint256 id, address indexed seller, address indexed buyer, uint256 tokenId, uint256 price);
  
  constructor(uint256 _fee, address _feeTo, address tokenAddress, address nftAddress) public {
    fee = _fee;
    feeTo = _feeTo;
    token = IKIP7(tokenAddress);
    nft = IKIP17(nftAddress);
  }

  modifier addCheck(uint256 _tokenId, address seller) {
    require(nft.ownerOf(_tokenId) == seller, "You don't own this NFT!!");
    require(!_isAdded(_tokenId), "This NFT is already added to Market!!");
    _;
  }

  function _isAdded(uint256 _tokenId) internal view returns (bool){      
    for(uint i = 1 ; i <= _Ids.current(); i++){
        if(!onSales[i].sold && onSales[i].tokenId == _tokenId){
            return true;
        }
    }
    return false;
  }
  
  //등록
  function addNftToMarket(uint256 _tokenId, uint256 _price) addCheck( _tokenId, msg.sender) external {
    _Ids.increment();

    onSales[_Ids.current()] = NftOnSale(_Ids.current(), msg.sender, _tokenId, _price, false);

    emit Add(_Ids.current(), msg.sender, _tokenId, _price);
  }

  function getNfts() external view returns(NftOnSale[] memory){
    uint count;
    NftOnSale[] memory checkList = new NftOnSale[](_Ids.current());
    for(uint i = 1 ; i <= _Ids.current(); i++){
        if(onSales[i].sold == false){
            checkList[count] = onSales[i];
            count++;
        }
    }
    NftOnSale[] memory filteredCheckList = new NftOnSale[](count);
    for(uint i = 0; i<count; i++){
        filteredCheckList[i] = checkList[i];
    }
    return filteredCheckList;
  }
  
  modifier buyCheck(uint256 _id, address buyer) {
    require(!onSales[_id].sold, "Already sold!!");
    require(buyer != onSales[_id].seller, "You cannot buy your NFT!!");
    _;
  }
  // // 구매
  function buyNft(uint256 _id) buyCheck(_id, msg.sender) external {
    uint256 price = onSales[_id].price;
    uint256 feePrice = price.mul(fee).div(1000);
    require(token.balanceOf(msg.sender) >= price.add(feePrice), "Not enough URU Token!!");

    token.transferFrom(msg.sender, onSales[_id].seller, price);
    token.transferFrom(msg.sender, feeTo, feePrice);

    onSales[_id].sold = true;
    nft.safeTransferFrom(onSales[_id].seller, msg.sender, onSales[_id].tokenId, "");
    
    emit Buy(_id, onSales[_id].seller, msg.sender, onSales[_id].tokenId, onSales[_id].price);
  }

  modifier removeCheck(uint256 _id, address seller) {
    require(onSales[_id].seller == seller, "You don't own this NFT!!");
    require(!onSales[_id].sold, "Already sold!!");
    _;
  }

  // 구매 목록에서 제거
  function removeNft(uint256 _id) removeCheck(_id, msg.sender) external {
    onSales[_id].sold = true;
  }
}