import React, { useState } from 'react';
import './PostCard.css';
import pixelHeart from '../../assets/8-bit-pixel-heart.png';
import pixelHeartFilled from '../../assets/8-bit-pixel-heart-fill.png';
import { bigintToTimestamp } from '../../lib/Utils';

const PostCard = ({ image, caption, likes, userPfp, userAddress, hashtags, timeStamp }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const shortenAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };

  const formatRelativeTime = (timeStamp) => {
    const date = bigintToTimestamp(timeStamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  return (
    <div className="post-card">
      <div className="post-content">
        <span className="post-timestamp">{formatRelativeTime(timeStamp)}</span>
        <img src={`data:image/png;base64,${image}`} alt="Post" className="post-image" />
        <p className="post-caption">{caption}</p>
        <div className="post-hashtags">
          {hashtags.map((tag, index) => (
            <span key={index} className="hashtag">#{tag}</span>
          ))}
        </div>
      </div>
      <div className="post-user-info">
        <img src={userPfp} alt="User Profile" className="user-pfp" />
        <span className="user-address">{shortenAddress(userAddress)}</span>
      </div>
      <div className="post-actions">
        <button onClick={handleLike} className="like-button">
          <img
            src={isLiked ? pixelHeartFilled : pixelHeart}
            alt="Like"
            className="like-icon"
          />
        </button>
        <span className="like-count">{likeCount}</span>
      </div>
    </div>
  );
};

export default PostCard;