// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
    }

    mapping(address => User) public users;
    mapping(uint256 => Interaction) public interactions;
    uint256 public interactionCount;

    event UserRegistered(address user);
    event InteractionPosted(address user, uint256 interactionId);
    event Liked(address user, uint256 interactionId);
    event CamerasTriggered(address triggeredBy, uint256 timestamp);

    constructor() {
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
        require(!users[msg.sender].exists, "User already exists");
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
            timestamp: block.timestamp
        });
        users[msg.sender].interactions.push(interactionCount);

        emit InteractionPosted(msg.sender, interactionCount);
    }

    // Like a specific interaction
    function likeInteraction(uint256 _interactionId) public userExists {
        require(_interactionId > 0 && _interactionId <= interactionCount, "Invalid interaction ID");

        users[interactions[_interactionId].user].likes++;
        emit Liked(interactions[_interactionId].user, _interactionId);
    }

    function triggerCameras() public {
        // Add any necessary logic here
        
        // Emit the custom event
        emit CamerasTriggered(msg.sender, block.timestamp);
    }

}
