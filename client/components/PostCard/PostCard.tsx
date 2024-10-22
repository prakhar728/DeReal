import React, { useState } from 'react';
import Image from 'next/image';
import { bigintToTimestamp } from '@/lib/utils';

const PostCard = ({
  image,
  image2,
  caption,
  likes,
  userPfp,
  userAddress,
  hashtags,
  timeStamp,
}: {
    image: any,
    image2: any,
    caption: any,
    likes: any,
    userPfp: any,
    userAddress: any,
    hashtags: any,
    timeStamp: any,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLikeCount((prevCount:any) => prevCount + (isLiked ? -1 : 1));
    setIsLiked(!isLiked);
  };

  const shortenAddress = (address:any) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };

  const formatRelativeTime = (timeStamp:any) => {
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
    <div className="bg-white/10 border border-accent rounded-lg p-3 mb-5 shadow-md">
      <div className="flex items-center mb-3">
        <div className="relative w-8 h-8 mr-2">
          <Image
            src={userPfp}
            alt="User Profile"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-text md:block">
            {shortenAddress(userAddress)}
          </span>
          <span className="text-xs text-secondary">
            {formatRelativeTime(timeStamp)}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="relative w-full">
          <Image
            src={`data:image/png;base64,${image2 || image}`}
            alt="Back Camera"
            width={400}
            height={300}
            className="w-full rounded"
          />
          {image2 && (
            <div className="absolute top-2.5 right-2.5 w-[30%]">
              <Image
                src={`data:image/png;base64,${image}`}
                alt="Front Camera"
                width={120}
                height={90}
                className="border-2 border-white rounded-lg"
              />
            </div>
          )}
        </div>
        <p className="text-base text-text mt-2">{caption}</p>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleLike}
          className="flex items-center bg-transparent border-0 cursor-pointer p-0"
        >
          <Image
            src={isLiked ? '/heart-filled.png' : '/heart.png'}
            alt="Like"
            width={20}
            height={20}
            className="mr-1"
          />
          <span className="text-sm text-text">{likeCount}</span>
        </button>
        <div className="flex flex-wrap">
          {hashtags.map((tag:any, index:any) => (
            <span key={index} className="text-xs text-secondary mr-2">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;