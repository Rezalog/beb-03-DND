// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@klaytn/contracts/token/KIP17/KIP17Full.sol";
import "@klaytn/contracts/drafts/Counters.sol";
import "./Token.sol";

contract NFT is KIP17Full{
  using Counters for Counters.Counter;
  Counters.Counter private _Ids;

    uint256 weaponDigits = 16;
    uint256 weaponModulus = 10 ** weaponDigits;
    
    uint256 [9] public percentage; // 합성 성공확률
    uint256 [9] public tokenToCompound; // 합성시 토큰 소모량
    uint256 [10] public tokenToFixDurability; // 내구도 수리시 토큰 소모량
    uint256 [9] public tokenToFixEnchant; // 강화 내구도 수리시 토큰 소모량
    uint256 [10] public tokenToFix; // 내구도 수리시 토큰 소모량
    // uint256 [9] public tokenToFixEnchant; // 합성 내구도 수리시 토큰 소모량

    Token token;

    struct Weapon {
        uint256 weaponType; // dna 
        uint256 weaponLevel; // 
        uint256 durability; // 내구도 - staking
        uint256 enchant; //합성횟수 - compound
    }

    Weapon[] public weapons;

    mapping(uint256 => mapping(uint256 => bool)) public compoundResult;

    event NewWeapon(uint256 weaponId, uint256 weaponType, uint256 weaponLevel);


    constructor(address _token) public KIP17Full("DND-WEAPON", "WEAPON"){
        percentage[0] = 99;
        percentage[1] = 79;
        percentage[2] = 69;
        percentage[3] = 49;
        percentage[4] = 39;
        percentage[5] = 29;
        percentage[6] = 19;
        percentage[7] = 9;
        percentage[8] = 4;

        tokenToCompound[0] = 50;
        tokenToCompound[1] = 100;
        tokenToCompound[2] = 200;
        tokenToCompound[3] = 300;
        tokenToCompound[4] = 500;
        tokenToCompound[5] = 700;
        tokenToCompound[6] = 1000;
        tokenToCompound[7] = 3000;
        tokenToCompound[8] = 5000;

        // 내구도, 합성내구도 수리시 토큰 소모량 의논 후 수정
        tokenToFix[0] = 10;
        tokenToFix[1] = 20;
        tokenToFix[2] = 30;
        tokenToFix[3] = 50;
        tokenToFix[4] = 80;
        tokenToFix[5] = 110;
        tokenToFix[6] = 190;
        tokenToFix[7] = 300;
        tokenToFix[8] = 490;
        tokenToFix[9] = 750;
        // tokenToFixEnchant[0~8] = ??;

        token = Token(_token);
        
    }


    function mint (address recipient, uint256 _weaponLevel) public returns (uint256) {
    _Ids.increment();

    uint256 newItemId = _Ids.current();
    _mint(recipient, newItemId);

    createRandomWeapon(_weaponLevel);

    return newItemId;
     }
    
    // 기본 무기 구매
    function buyBasicWeapon () public returns (uint256){
        // 구매자가 50 토큰 이상 보유중인지 확인
        require(50 * 10**18<= token.balanceOf(msg.sender), "Not enough token to buy basic weapon");
        
        token.burn(msg.sender, 50 * 10**18);
        
        _Ids.increment();

        uint256 newItemId = _Ids.current();
        _mint(msg.sender, newItemId);

        createRandomWeapon(1);

        return newItemId;
    }

    // 무기 합성 
    function _createWeapon(uint256 _weaponType, uint256 _weaponLevel) internal returns(uint256) {
         _Ids.increment();

        uint256 id = weapons.push(Weapon(_weaponType, _weaponLevel, 10, 10)) - 1;
        uint256 newItemId = _Ids.current();
        
        _mint(msg.sender, newItemId);
    
        emit NewWeapon(id, _weaponType, _weaponLevel);
        return newItemId;
    }

    // 무기타입을 위한 랜덤 16자리 숫자 생성
    function _generateRandomType() private view returns (uint256) {
      // 블록 타임스탬프를 활용해서 랜덤한 값을 뽑아냄. 
        uint256 randomNumFromBlock = block.timestamp; 
        uint256 randomNum = uint256(keccak256(abi.encodePacked(randomNumFromBlock)));
        return randomNum % weaponModulus;
    }

    function createRandomWeapon(uint256 _weaponLevel) public {
        uint256 randomType = _generateRandomType();
        randomType = randomType - randomType % 100; // 생각하기
        uint256 id = weapons.push(Weapon(randomType, _weaponLevel, 10, 10)) - 1;

        emit NewWeapon(id, randomType, _weaponLevel);
    }

    // 합성을 위한 랜덤 2자리 숫자 생성
    function createRandomNum() public view returns(uint256) {
        uint256 randomNumFromBlock = block.timestamp;
        uint256 randomNum = uint256(keccak256(abi.encodePacked(randomNumFromBlock)));

        return randomNum % 100;
    }

    function compoundWeapon(uint256 _weapon1Id, uint256 _weapon2Id) public returns(uint256) { // targetType 없이 weaponId 2개
    // 소유한 2개의 무기만 합성 가능
    require(msg.sender == ownerOf(_weapon1Id));
    require(msg.sender == ownerOf(_weapon2Id));

    // 동일 id의 nft는 합성불가
    require(_weapon1Id != _weapon2Id , "Can not compound with Same weapon");
    
    // 동일 레벨의 무기를 합성필요 
    Weapon storage myWeapon1 = weapons[_weapon1Id - 1];
    Weapon storage myWeapon2 = weapons[_weapon2Id - 1];
    require(myWeapon1.weaponLevel == myWeapon2.weaponLevel, "Compound Same weapon level");

    // 합성 진행시 enchant(합성 내구도) 필요
    require(myWeapon1.enchant != 0 && myWeapon2.enchant != 0, "Weapon compound needs enchant");
    
    // 유저가 합성시 필요한 토큰을 충분히 가졌는지 확인
    uint256 spendToken = tokenToCompound[myWeapon1.weaponLevel - 1];
    require(spendToken <= token.balanceOf(msg.sender), "You must have URU token to compound");

    // 동일 단계 또는 한 단계 위의 무기를 확률적으로 생성
    // weapon1과의 레벨보다 하나 낮은 퍼센테이지와 랜덤숫자를 비교해서 성공, 실패 판단
    uint256 compoundPercentage = percentage[myWeapon1.weaponLevel - 1];

    uint256 newType = (myWeapon1.weaponType + myWeapon2.weaponType + _generateRandomType()) / 2 % weaponModulus;

    // 합성시 enchant(합성 내구도) 1씩 소모
    myWeapon1.enchant = myWeapon1.enchant - 1;
    myWeapon2.enchant = myWeapon2.enchant - 1;

    // 합성시 msg.sender 토큰 소모(burn)
    token.burn(msg.sender, spendToken * 10**18);
    
    uint256 _tokenId;
    // 합성확률보다 랜덤숫자가 크면 실패, 작거나 같으면 성공
    if(createRandomNum() <= compoundPercentage) {
        _tokenId = _createWeapon(newType, myWeapon1.weaponLevel + 1);
        compoundResult[_weapon1Id][_weapon2Id] = true;
    } else {
        _tokenId = _createWeapon(newType, myWeapon1.weaponLevel);
        compoundResult[_weapon1Id][_weapon2Id] = false;
    }
    return _tokenId;
    
    }
    function getCompoundResult (uint256 _weapon1Id, uint256 _weapon2Id) public view returns (bool) {
        return compoundResult[_weapon1Id][_weapon2Id];
    }
    // 무기 레벨을 알려주는 함수 (getter)
    function getWeaponLevel (uint256 _weaponId) public view returns(uint256) {
        return weapons[_weaponId - 1].weaponLevel;
    }

    // staking 내구도 소모
    function stakingWeapon (uint256 _weaponId) public {
        // 스테이킹하는 무기의 주인인지 확인
        require(msg.sender == ownerOf(_weaponId), "You have to staking your weapon");

        weapons[_weaponId - 1].durability = weapons[_weaponId - 1].durability - 1;
    }

    // staking 내구도 수리
    function fixWeaponDurability (uint256 _weaponId) public {
        // 수리하는 무기의 소유 확인
        require(msg.sender == ownerOf(_weaponId));
        
        // 내구도가 3미만일 경우에만 수리
        require(weapons[_weaponId -1].durability < 10, "Your weapon doesn't need to fix");

        // 충분한 수리비용을 가졌는 지 확인
        uint256 spendToken = tokenToFix[weapons[_weaponId - 1].weaponLevel - 1];
        require(spendToken <= token.balanceOf(msg.sender), "You must have enough URU token to fix durability");
        
        
        weapons[_weaponId - 1].durability = 10;

        token.burn(msg.sender, spendToken * 10**18);
    }


    // enchant 내구도 수리
    function fixWeaponEnchant (uint256 _weaponId) public {
        // 수리하는 무기의 소유 확인
        require(msg.sender == ownerOf(_weaponId));

        // 내구도가 3미만일 경우에만 수리
        require(weapons[_weaponId -1].enchant < 10, "Your weapon doesn't need to fix");
        
        // 충분한 수리비용을 가졌는 지 확인
        uint256 spendToken = tokenToFix[weapons[_weaponId - 1].weaponLevel - 1];
        require(spendToken <= token.balanceOf(msg.sender), "You must have enough URU token to fix enchant");
        
        
        weapons[_weaponId - 1].enchant = 10;

        token.burn(msg.sender, spendToken * 10**18);
    }

    // 현재 msg.sender가 보유중인 무기를 배열로 리턴해주는 함수 (getter)

}