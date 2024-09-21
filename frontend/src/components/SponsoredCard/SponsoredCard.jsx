import React, { useState } from 'react';
import './SponsoredCard.css';
import pixelHeart from '../../assets/8-bit-pixel-heart.png';
import pixelHeartFilled from '../../assets/8-bit-pixel-heart-fill.png';
import pixelExternalLink from '../../assets/external-link.png';

const SponsoredPostCard = ({ image, caption, likes, sponsorLink, userPfp, userAddress }) => {
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

  return (
    <div className="post-card sponsored-post-card">
      <div className="sponsored-label">Sponsored</div>
      <img src={image} alt="Sponsored Post" className="post-image" />
      <p className="post-caption">{caption}</p>
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
        <a href={sponsorLink} target="_blank" rel="noopener noreferrer" className="external-link-button">
          <img src={pixelExternalLink} alt="External Link" className="external-link-icon" />
        </a>
      </div>
    </div>
  );
};

export default SponsoredPostCard;
