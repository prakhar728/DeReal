// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IEntropyConsumer} from "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";
import {IEntropy} from "@pythnetwork/entropy-sdk-solidity/IEntropy.sol";
import { AutomationCompatibleInterface } from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract DeReal is IEntropyConsumer, AutomationCompatibleInterface {
    address public owner;
    IEntropy public entropy;
    address public provider;

    struct User {
        string bio;
        uint256 likes;
        uint256[] interactions; // IDs of interactions
        bool exists;
    }

    struct Interaction {
        address user;
        string content; // Link to content stored on IPFS
        uint256 timestamp;
    }

    mapping(address => User) public users;
    mapping(uint256 => Interaction) public interactions;
    uint256 public interactionCount;
    uint256 public nextEventTimestamp;

    event NextEventScheduled(uint256 timestamp);
    event RandomEventTriggered(address triggeredBy, uint256 timestamp);

    event UserRegistered(address user);
    event InteractionPosted(address user, uint256 interactionId);
    event Liked(address user, uint256 interactionId);
    event CamerasTriggered(address triggeredBy, uint256 timestamp);

    constructor(address _entropyAddress, address _provider) payable {
        owner = msg.sender;
        entropy = IEntropy(_entropyAddress);
        provider = _provider;

        // Request the initial random number
        requestRandomTime();
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier userExists() {
        require(users[msg.sender].exists, "User not registered");
        _;
    }

    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }

    function entropyCallback(
        uint64 sequenceNumber,
        address _provider,
        bytes32 randomNumber
    ) internal override {
        // Use the random number to compute a random time interval
        uint256 minInterval = 120; // 2 minutes in seconds
        uint256 maxInterval = 180; // 3 minutes in seconds
        uint256 randomInterval = minInterval +
            (uint256(randomNumber) % (maxInterval - minInterval + 1));

        // Schedule the next event time
        nextEventTimestamp = block.timestamp + randomInterval;

        emit NextEventScheduled(nextEventTimestamp);
    }

    function requestRandomTime() internal {
        uint256 fee = entropy.getFee(provider);
        entropy.requestWithCallback{value: fee}(provider, bytes32(0));
    }

    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = block.timestamp >= nextEventTimestamp;
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        if (block.timestamp >= nextEventTimestamp) {
            emit RandomEventTriggered(msg.sender, block.timestamp);
            requestRandomTime();
        }
    }

    // Register a new user with an optional bio
    function registerUser(string memory _bio, address _user) public {
        require(!users[_user].exists, "User already exists");
        users[_user] = User({
            bio: _bio,
            likes: 0,
            interactions: new uint256[](0),
            exists: true
        });

        emit UserRegistered(_user);
    }

    // Get user details for the caller
    function getUser() public view returns (User memory) {
        require(users[msg.sender].exists, "User does not exist");
        return users[msg.sender];
    }

    // Update the bio of the user
    function updateBio(string memory _bio) public userExists {
        users[msg.sender].bio = _bio;
    }

    function viewBio(address _address) public view returns (string memory) {
        return users[_address].bio;
    }

    // Post an interaction with content stored on IPFS (content link)
    function postInteraction(string memory _ipfsHash) public userExists {
        interactionCount++;
        interactions[interactionCount] = Interaction({
            user: msg.sender,
            content: _ipfsHash,
            timestamp: block.timestamp
        });
        users[msg.sender].interactions.push(interactionCount);

        emit InteractionPosted(msg.sender, interactionCount);
    }

    // Like a specific interaction
    function likeInteraction(uint256 _interactionId) public userExists {
        require(
            _interactionId > 0 && _interactionId <= interactionCount,
            "Invalid interaction ID"
        );

        users[interactions[_interactionId].user].likes++;
        emit Liked(interactions[_interactionId].user, _interactionId);
    }

    function triggerCameras() public {
        // Add any necessary logic here

        // Emit the custom event
        emit CamerasTriggered(msg.sender, block.timestamp);
    }

    // **New Function to Check Time Remaining**
    function timeUntilNextEvent() public view returns (uint256) {
        if (block.timestamp >= nextEventTimestamp) {
            return 0; // Event time has passed
        } else {
            return nextEventTimestamp - block.timestamp;
        }
    }
}
