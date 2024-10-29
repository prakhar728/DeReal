// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract DeReal {
    address public owner;

    struct User {
        string bio;
    }

    struct Post {
        address user;
        string content;
        uint256 timestamp;
        address[] likedBy; // Array of users who liked the post
    }

    struct lastCameraEvent {
        uint256 timestamp;
        uint256 eventId;
    }

    mapping(address => User) public users;
    mapping(uint256 => Post) public posts;
    uint256 public postCount;
    uint256 public nextEventTimestamp;
    uint256 public eventId;
    lastCameraEvent lastEvent;

    event NextEventScheduled(uint256 timestamp);
    event EventTriggered(
        address triggeredBy,
        uint256 timestamp,
        uint256 eventId
    );
    event UserRegistered(address user);
    event UserBioUpdated(address user);
    event PostCreated(address user, uint256 postId);
    event LikeToggled(address user, uint256 postId, bool isLiked);
    event CamerasTriggered(address triggeredBy, uint256 timestamp);

    constructor() payable {
        owner = msg.sender;
        nextEventTimestamp = block.timestamp + 1 days;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function registerUser(string memory _bio) public {
        require(
            bytes(users[msg.sender].bio).length == 0,
            "User already registered"
        );
        users[msg.sender] = User({bio: _bio});
        emit UserRegistered(msg.sender);
    }

    function getUser() public view returns (User memory) {
        return users[msg.sender];
    }

    function updateBio(string memory _bio) public {
        users[msg.sender].bio = _bio;
        emit UserBioUpdated(msg.sender);
    }

    function viewBio(address _address) public view returns (string memory) {
        return users[_address].bio;
    }

    function createPost(string memory _ipfsHash) public {
        postCount++;
        posts[postCount] = Post({
            user: msg.sender,
            content: _ipfsHash,
            timestamp: block.timestamp,
            likedBy: new address[](0x0)
        });
        emit PostCreated(msg.sender, postCount);
    }

    function createPostDuringEvent(
        string memory _ipfsHash,
        uint256 _eventId
    ) external {
        require(
            block.timestamp <= (lastEvent.timestamp + 120),
            "The time period for event is over"
        );
        require(_eventId == lastEvent.eventId, "Not the same event id");

        postCount++;
        posts[postCount] = Post({
            user: msg.sender,
            content: _ipfsHash,
            timestamp: block.timestamp,
            likedBy: new address[](0x0)
        });
        emit PostCreated(msg.sender, postCount);
    }

    function likePost(uint256 _postId) public {
        require(_postId > 0 && _postId <= postCount, "Invalid post ID");

        Post storage post = posts[_postId];
        bool isLiked = false;

        // Check if the user already liked the post
        for (uint256 i = 0; i < post.likedBy.length; i++) {
            if (post.likedBy[i] == msg.sender) {
                // Remove the user from the likedBy array
                post.likedBy[i] = post.likedBy[post.likedBy.length - 1];
                post.likedBy.pop();
                isLiked = true;
                break;
            }
        }

        // If not liked, add the user to likedBy array
        if (!isLiked) {
            post.likedBy.push(msg.sender);
        }

        emit LikeToggled(msg.sender, _postId, !isLiked);
    }

    function getLikes(uint256 _postId) public view returns (uint256) {
        require(_postId > 0 && _postId <= postCount, "Invalid post ID");
        return posts[_postId].likedBy.length;
    }

    function getAllPosts() external view returns (Post[] memory) {
        Post[] memory _posts = new Post[](postCount);
        for (uint256 i = 1; i <= postCount; i++) {
            _posts[i - 1] = posts[i];
        }
        return _posts;
    }

    function getPost(uint256 _postId) external view returns (Post memory) {
        require(_postId > 0 && _postId <= postCount, "No such post exists");
        return posts[_postId];
    }

    function triggerCamera() external {
        eventId++;
        lastEvent = lastCameraEvent({
            timestamp: block.timestamp,
            eventId: eventId
        });

        emit EventTriggered(msg.sender, block.timestamp, eventId);
    }
}
