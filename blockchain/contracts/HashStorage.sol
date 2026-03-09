// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract HashStorage {

    struct Record {
        string recordHash;
        uint256 timestamp;
    }

    mapping(uint256 => Record) public records;

    uint256 public recordCount = 0;

    function storeHash(string memory _hash) public {
        records[recordCount] = Record(_hash, block.timestamp);
        recordCount++;
    }

    function getHash(uint256 _id) public view returns (string memory, uint256) {
        Record memory r = records[_id];
        return (r.recordHash, r.timestamp);
    }
}