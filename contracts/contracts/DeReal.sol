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
        uint256 likes;
    }

    mapping(address => User) public users;
    mapping(uint256 => Post) public posts;
    uint256 public postCount;
    uint256 public nextEventTimestamp;

    event NextEventScheduled(uint256 timestamp);
    event EventTriggered(address triggeredBy, uint256 timestamp);

    event UserRegistered(address user);
    event UserBioUpdated(address user);
    event PostCreated(address user, uint256 postId);
    event Liked(address user, uint256 postId);
    event CamerasTriggered(address triggeredBy, uint256 timestamp);

    constructor() payable {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function registerUser(string memory _bio, address _user) public {
        users[_user] = User({bio: _bio});

        emit UserRegistered(_user);
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
            likes: 0
        });

        emit PostCreated(msg.sender, postCount);
    }

    function likePost(uint256 _postId) public {
        require(
            _postId > 0 && _postId <= postCount,
            "Invalid post ID"
        );
        posts[_postId].likes++;
        emit Liked(posts[_postId].user, _postId);
    }

    // Manual function to trigger camera events
    function triggerCameras() public onlyOwner {
        emit EventTriggered(msg.sender, block.timestamp);
    }

    function getLikes(uint256 _postId) public view returns (uint256) {
        require(
            _postId > 0 && _postId <= postCount,
            "Invalid post ID"
        );
        return posts[_postId].likes;
    }

    function getAllPosts() external view returns (Post[] memory) {
        Post[] memory _posts = new Post[](postCount);

        for (uint256 i = 1; i <= postCount; i++) {
            _posts[i - 1] = posts[i];
        }

        return _posts;
    }

    function getPost(uint256 _postId) external view returns (Post memory) {
        require(_postId < postCount, "No such post exists");

        return posts[_postId];
    }
}
