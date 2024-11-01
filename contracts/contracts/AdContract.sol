// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract AdContract {
    address payable public owner;

    uint256 public adCost;
    string[] public ads;

    event AdSubmitted(string ipfsLink);
    event Withdrawn(address who);

    constructor() {
        owner = payable(msg.sender);
        adCost = 1 gwei; // Set to 1 gwei for better granularity and avoid precision issues
    }

    function submitAd(string memory ipfs_ad) external payable {
        require(
            msg.value == adCost,
            "Incorrect payment amount. Ad costs 0.000000001 ETH."
        );
        ads.push(ipfs_ad);

        emit AdSubmitted(ipfs_ad);
    }

    function getAd(uint256 _index) external view returns (string memory) {
        require(_index < ads.length, "Ad does not exist.");
        return ads[_index];
    }

    function getAllAds() external view returns (string[] memory) {
        return ads;
    }

    function withdrawFunds() external {
        require(address(this).balance > 0, "Contract balance is zero");
        require(msg.sender == owner, "Only owner can withdraw");
        owner.transfer(address(this).balance);

        emit Withdrawn(msg.sender);
    }
}
