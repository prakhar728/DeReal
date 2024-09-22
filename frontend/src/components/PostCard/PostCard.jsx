import React, { useState } from 'react';
import './PostCard.css';
import pixelHeart from '../../assets/8-bit-pixel-heart.png';
import pixelHeartFilled from '../../assets/8-bit-pixel-heart-fill.png';
import { bigintToTimestamp } from '../../lib/Utils';

const PostCard = ({
  interactionId,
  image,
  image2,
  caption,
  likes,
  userPfp,
  userAddress,
  hashtags,
  timeStamp,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLikeCount((prevCount) => prevCount + (isLiked ? -1 : 1));
    setIsLiked(!isLiked);
  };

  const shortenAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };

  const formatRelativeTime = (timeStamp) => {
    const date = bigintToTimestamp(timeStamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo`;
    return `${Math.floor(diffInSeconds / 31536000)}y`;
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={userPfp} alt="User Profile" className="user-pfp" />
        <div className="user-info">
          <span className="user-address">{shortenAddress(userAddress)}</span>
          <span className="post-timestamp">{formatRelativeTime(timeStamp)}</span>
        </div>
      </div>
      
      <div className="post-content">
        {image && (
          <img
            src={`data:image/png;base64,${image}`}
            alt="Post"
            className="post-image"
          />
        )}
        <p className="post-caption">{caption}</p>
      </div>
      
      <div className="post-footer">
        <button onClick={handleLike} className="like-button">
          <img
            src={isLiked ? pixelHeartFilled : pixelHeart}
            alt="Like"
            className="like-icon"
          />
          <span className="like-count">{likeCount}</span>
        </button>
        <div className="post-hashtags">
          {hashtags.map((tag, index) => (
            <span key={index} className="hashtag">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;