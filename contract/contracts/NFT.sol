// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@klaytn/contracts/token/KIP17/KIP17Full.sol";
import "../node_modules/@klaytn/contracts/drafts/Counters.sol";

contract NFT is KIP17Full{
  using Counters for Counters.Counter;
  Counters.Counter private _Ids;

  constructor() public KIP17Full("DND-WEAPON", "WEAPON"){}

  function mint (address recipient) public returns (uint256) {
    _Ids.increment();

    uint256 newItemId = _Ids.current();
    _mint(recipient, newItemId);

    return newItemId;
  }

  // 장비 합성 추가 중

    event NewWeapon(uint256 weaponId, uint256 weaponType);

    uint256 weaponDigits = 16;
    uint256 weaponModulus = 10 ** weaponDigits;

    struct Weapon {
        uint256 weaponType; // dna 
        uint256 weaponLevel; // grade, tier, rairity 등
        uint256 durability; // 내구도
    }

    Weapon[] public weapons;

    mapping (uint256 => address) public weaponIndexToOwner;
    mapping (address => uint256) ownerWeaponCount;

    function _createWeapon(uint256 _weaponType) internal {
        uint256 id = weapons.push(Weapon(_weaponType, 1, 3)) - 1;
        WeaponIndexToOwner[id] = msg.sender;
        ownerWeaponCount[msg.sender]++;
        NewWeapon(id, _weaponType);
    }

    function _generateRandomType() private view returns (uint256) {
      // 블록 타임스탬프를 활용해서 랜덤한 값을 뽑아냄. 
        uint256 randomNumFromBlock = block.timestamp; 
        uint256 randomNum = uint256(keccak256(randomNumFromBlock));
        return randomNum % weaponModulus;
    }

    function createRandomWeapon() public {
        uint256 randomType = _generateRandomType();
        randomType = randomType - randomType % 100;
        _createWeapon(randomType);
    }

    function compoundWeapon(uint256 _weapon1Id, uint256 _weapon2Id) public { // targetType 없이 weaponId 2개
    // 
    require(msg.sender == weaponIndexToOwner[_weapon1Id]);
    require(msg.sender == weaponIndexToOwner[_weapon2Id]);

    // 동일 id의 nft는 합성불가
    require(_weapon1Id != _weapon2Id , "Can not compound with Same weapon");
    
    // 동일 레벨의 무기를 합성필요 
    Weapon storage myWeapon1 = weapons[_weaponId1];
    Weapon storage myWeapon2 = weapons[_weaponId2];
    require(myWeapon1.weaponLevel == myWeapon2.weaponLevel, "Compound Same weapon level");

    // 합성 진행시 내구도 필요
    require(myWeapon1.durability != 0 && myWeapon2.durability != 0, "Weapon compound needs durability");

    
    // 동일 단계 또는 한 단계 위의 무기를 확률적으로 생성
    


    // 내구도 업데이트 
    

    // approve, msg.sender 토큰 소모(burn)
    
    
    uint256 newType = (myWeapon1.weaponType + myWeapon2.weaponType) / 2;
    _createWeapon(newType);
    }

    // 무기 레벨을 알려주는 함수 추가 (getter)




// 동일한 레벨의 무기 2개를 합성해서 동일 단계 또는 한단계 위의 무기를 만든다.
// 합성할 때 uru 토큰 소모
// 수리할 때 uru 토큰 소모


// -  메타데이터 DNA 형식 -> 1234567890 + 1234567890 = 12 34 51 67 27 33 
// 내구도 (클레임(합성 시도)을 할 때마다 1씩 감소)
// 이름
// 설명
// 등급
// 무기 종류
// 이미지
// 토큰 보상률

//   - 토큰 소모
// 무기 합성 (레벨1 ~ 10) : 합성시 각 레벨별 무기의 NFT 총 발행량을 제한
// 레벨1: 50개 (성공확률 100%) (5000)
// 레벨2: 100개 (80%) (5000)
// 레벨3: 200개 (70%) (5000)
// 레벨4: 300개 (50%) (5000)
// 레벨5: 500개 (40%) (4000)
// 레벨6: 700개 (30%) (4000)
// 레벨7: 1000개 (20%) (4000)
// 레벨8: 3000개 (10%) (3000)
// 레벨9: 5000개 (5%) (3000)
// 레벨10: 발행량 1000개
// 
// 무기 수리 / 내구도(합성가능횟수)
// 레벨1: 50개 /  3
// 레벨2: 100개 / 3
// 레벨3: 200개 / 3
// 레벨4: 300개 / 3
// 레벨5: 500개 / 3
// 레벨6: 700개 / 3
// 레벨7: 1000개 / 3
// 레벨8: 3000개 / 3
// 레벨9: 5000개 / 3
// 레벨10: 발행량 1000개 / 3




}