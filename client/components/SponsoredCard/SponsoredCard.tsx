import React, { useState } from 'react';
import Image from 'next/image';

const SponsoredPostCard = ({ 
  image, 
  caption, 
  likes, 
  sponsorLink, 
  userPfp, 
  userAddress 
}: {
    image: any, 
    caption: any, 
    likes: any, 
    sponsorLink: any, 
    userPfp: any, 
    userAddress: any 
}) => {
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

  const shortenAddress = (address: any) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };

  return (
    <div className="relative mb-6 overflow-hidden rounded-lg border-2 border-primary bg-white/10 p-4 shadow-md transition-transform duration-300 hover:-translate-y-1">
      <div className="absolute -left-8 top-2.5 z-10 -rotate-45 transform bg-primary px-8 py-0.5 text-base text-background shadow-md">
        <span className="border-2 border-red-500">Sponsored</span>
      </div>

      <div className="relative h-48 w-full">
        <Image 
          src={image} 
          alt="Sponsored Post" 
          fill
          className="rounded image-rendering-pixelated object-cover"
        />
      </div>

      <p className="mt-3 text-base text-text">
        {caption}
      </p>

      <div className="mt-2 flex items-center">
        <div className="relative h-8 w-8">
          <Image
            src={userPfp}
            alt="User Profile"
            fill
            className="rounded-full border-2 border-primary object-cover"
          />
        </div>
        <span className="ml-2 text-sm text-secondary">
          {shortenAddress(userAddress)}
        </span>
      </div>

      <div className="mt-3 flex items-center">
        <button 
          onClick={handleLike} 
          className="p-0 mr-2"
        >
          <div className="relative h-6 w-6">
            <Image
              src={isLiked ? '/8-bit-pixel-heart-fill.png' : '/8-bit-pixel-heart.png'}
              alt="Like"
              fill
              className="image-rendering-pixelated"
            />
          </div>
        </button>

        <span className="text-sm text-secondary mr-auto">
          {likeCount}
        </span>

        <a 
          href={sponsorLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="ml-auto"
        >
          <div className="relative h-6 w-6">
            <Image
              src="/external-link.png"
              alt="External Link"
              fill
              className="image-rendering-pixelated"
            />
          </div>
        </a>
      </div>
    </div>
  );
};

export default SponsoredPostCard;