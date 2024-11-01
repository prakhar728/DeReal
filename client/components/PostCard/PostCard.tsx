"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { bigintToTimestamp, generateRandomImage } from "@/lib/utils";
import { CONTRACT_ABI, DEPLOYED_CONTRACT } from "@/lib/contract";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

interface PostCardProps {
  postId: number;
  image: string;
  image2?: string;
  caption: string;
  likes: number;
  likedBy: string[];
  userAddress: string;
  hashtags: string[];
  timeStamp: bigint;
}

const contractAddress = DEPLOYED_CONTRACT;

export default function PostCard({
  postId,
  image,
  image2,
  caption,
  likes,
  likedBy,
  userAddress,
  hashtags,
  timeStamp,
}: PostCardProps) {
  const [mounted, setmounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const { address } = useAccount();
  const { writeContract, data: hash } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleLike = () => {
    console.log(postId);

    writeContract({
      abi: CONTRACT_ABI,
      functionName: "likePost",
      address: contractAddress,
      args: [postId],
    });
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatRelativeTime = (timestamp: bigint) => {
    const date = bigintToTimestamp(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)}mo`;
    return `${Math.floor(diffInSeconds / 31536000)}y`;
  };

  useEffect(() => {
    setmounted(true);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (likedBy && likedBy.length && address) {
      setIsLiked(likedBy.includes(address));
    }
  }, [likedBy]);

  if (!mounted) return null;
  return (
    <Card className="mb-5 bg-gray-800 shadow-md">
      <CardHeader className="flex flex-row justify-between items-center p-3">
        <div className="flex justify-center items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={generateRandomImage(userAddress)}
              alt="User Profile"
            />
            <AvatarFallback>{userAddress.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold text-gray-200 md:block">
            {shortenAddress(userAddress)}
          </span>
        </div>

        <div className="flex items-center">
          <span className="text-xs text-gray-400">
            {formatRelativeTime(timeStamp)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <div className="relative mb-3 w-full">
          {(image2 || image) && (
            <Image
              src={`data:image/png;base64,${image2 || image}`} // If image2 exists, use it; otherwise fallback to image
              alt="Post image"
              width={400}
              height={300}
              className="w-full rounded"
            />
          )}
          {image2 && (
            <div className="absolute right-2.5 top-2.5 w-[30%]">
              <Image
                src={`data:image/png;base64,${image}`}
                alt="Front Camera"
                width={120}
                height={90}
                className="rounded-lg border-2 border-white"
              />
            </div>
          )}
        </div>
        <p className="mt-2 text-base text-gray-200">{caption}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-3">
        <Button
          size="sm"
          className="flex items-center space-x-1 p-0 text-gray-400 hover:text-gray-200"
          onClick={handleLike}
        >
          <Heart
            className={`h-5 w-5 ${isLiked ? "fill-primary text-red-800" : ""}`}
          />
          <span className="text-sm">{likeCount}</span>
        </Button>
        <div className="flex flex-wrap">
          {hashtags.map((tag, index) => (
            <span key={index} className="mr-2 text-xs text-gray-400">
              #{tag}
            </span>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
