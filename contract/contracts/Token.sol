// SPDX-License-Identifier: MIT
pragma solidity ^0.5.6;

import "@klaytn/contracts/token/KIP7/KIP7.sol";
import "@klaytn/contracts/token/KIP7/KIP7Metadata.sol";
import "@klaytn/contracts/math/SafeMath.sol";
import "@klaytn/contracts/access/roles/MinterRole.sol";

contract Token is KIP7, KIP7Metadata, MinterRole {
    using SafeMath for uint256;
    
    uint256 lockStartTime;
    uint256 lockEndTime;
    
    mapping (address => uint256) lockedToken;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply,
        uint256 _lockPeriod
    ) KIP7Metadata(name, symbol, decimals) public {
        _mint(msg.sender, initialSupply);
        lockStartTime = block.timestamp;
        lockEndTime = lockStartTime.add(_lockPeriod);
    }

    function mint(address to, uint256 amount) external onlyMinter{
        _mint(to, amount);
    }

    function lock(address owner, uint256 _amount) external onlyMinter{
        lockedToken[owner] = lockedToken[owner].add(_amount);
    }

    function burn(address owner, uint256 _amount) external onlyMinter{
        _burn(owner, _amount);
    }

    function releaseLockedToken(address to) public {
        require(block.timestamp > lockEndTime);
        uint256 amount = lockedToken[to];
        lockedToken[to] = 0;
        _mint(to, amount);
    }   

    function getLockedTokenAmount(address owner) public view returns (uint256) {
        return lockedToken[owner];
    }

    function getLockStartTime() public view returns (uint256) {
        return lockStartTime;
    }

    function getLockEndTime() public view returns (uint256) {
        return lockEndTime;
    }

    function currentBlockTime() public view returns (uint256){
        return block.timestamp;
    }
}
