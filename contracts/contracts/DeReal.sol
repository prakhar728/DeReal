// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DeReal {
    address public owner;

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
        uint256 likes; // New field
    }

    mapping(address => User) public users;
    mapping(uint256 => Interaction) public interactions;
    uint256 public interactionCount;
    uint256 public nextEventTimestamp;

    event NextEventScheduled(uint256 timestamp);
    event EventTriggered(address triggeredBy, uint256 timestamp);

    event UserRegistered(address user);
    event InteractionPosted(address user, uint256 interactionId);
    event Liked(address user, uint256 interactionId);
    event CamerasTriggered(address triggeredBy, uint256 timestamp);

    constructor() payable {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier userExists() {
        require(users[msg.sender].exists, "User not registered");
        _;
    }

    // Register a new user with an optional bio
    function registerUser(string memory _bio, address _user) public {
        require(!users[_user].exists, "User already exists");
        users[_user] = User({
            bio: _bio,
            likes: 0,
            interactions: new uint256[](0) ,
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
            timestamp: block.timestamp,
            likes: 0
        });
        users[msg.sender].interactions.push(interactionCount);

        emit InteractionPosted(msg.sender, interactionCount);
    }

    function likeInteraction(uint256 _interactionId) public userExists {
        require(
            _interactionId > 0 && _interactionId <= interactionCount,
            "Invalid interaction ID"
        );
        interactions[_interactionId].likes++;
        emit Liked(interactions[_interactionId].user, _interactionId);
    }

    // Manual function to trigger camera events
    function triggerCameras() public onlyOwner {
        // Manually trigger the camera event and schedule a new event time
        emit EventTriggered(msg.sender, block.timestamp);
    }

    // **New Function to Check Time Remaining**
    function timeUntilNextEvent() public view returns (uint256) {
        if (block.timestamp >= nextEventTimestamp) {
            return 0; // Event time has passed
        } else {
            return nextEventTimestamp - block.timestamp;
        }
    }

    function getLikes(uint256 _interactionId) public view returns (uint256) {
        require(
            _interactionId > 0 && _interactionId <= interactionCount,
            "Invalid interaction ID"
        );
        return interactions[_interactionId].likes;
    }
}
