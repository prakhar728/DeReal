"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateRandomImage } from "@/lib/utils";

interface SponsoredCardProps {
  image: string;
  caption: string;
  likes: number;
  sponsorLink: string;
  userPfp: string;
  userAddress: string;
}

export default function SponsoredCard({
  image,
  caption,
  likes,
  sponsorLink,
  userPfp,
  userAddress
}: SponsoredCardProps) {
  const [mounted, setMounted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Card className="mb-5 bg-gray-700 shadow-md relative">
      <div className="absolute left-0 top-0 z-10 bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground shadow-md">
        Sponsored
      </div>
      <CardHeader className="flex flex-row justify-between items-center p-3">
        <div className="flex justify-center items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={generateRandomImage(userAddress)}
              alt="User Profile"
            />
            <AvatarFallback>{userAddress.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold text-gray-200 ml-2 md:block">
            {shortenAddress(userAddress)}
          </span>
        </div>

        <Link
          href={sponsorLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-gray-200"
          aria-label="Visit sponsor's website"
        >
          <ExternalLink className="h-5 w-5" />
        </Link>
      </CardHeader>

      <CardContent className="p-3">
        <div className="relative mb-3 w-full">
          <Image
            src={image}
            alt="Sponsored image"
            width={400}
            height={300}
            className="w-full rounded"
          />
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
            className={`h-5 w-5 ${isLiked ? "fill-primary text-primary" : ""}`}
          />
          <span className="text-sm">{likeCount}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
