// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AdContract {
    address payable public owner;

    uint256 public adCost = 0.0000000001 ether;
    string[] public ads;

    event AdSubmitted(
        string ipfsLink
    );

    constructor() {
        owner = payable (msg.sender);
    }

    function submitAd(
        string memory ipfs_ad
    ) external payable {
        require(
            msg.value == adCost,
            "Incorrect payment amount. Ad costs 0.0000000001 ETH."
        );
        ads.push(
            ipfs_ad
        );

        emit AdSubmitted(ipfs_ad);
    }

    function getAd(uint256 _index) external view returns (string memory) {
        require(_index < ads.length, "Ad does not exist.");
        return ads[_index];
    }

    function getAllAds() external view returns(string[] memory) {
        return ads;
    }

    function withdrawFunds() external {
        require(address(this).balance > 0, "Contract balance is zero");
        payable(owner).transfer(address(this).balance);
    }
}
