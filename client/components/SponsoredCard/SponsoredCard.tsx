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
  bannerImage: string;
  adDomain: string;
  companyName: string;
  hashtags: string[];
  websiteLink: string;
}

export default function SponsoredCard({
  bannerImage,
  adDomain,
  companyName,
  hashtags,
  websiteLink
}: SponsoredCardProps) {
  const [mounted, setMounted] = useState(false);

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
              src={generateRandomImage("0x1234455")}
              alt="User Profile"
            />
          </Avatar>
          <span className="text-sm font-bold text-gray-200 ml-2 md:block">
            {companyName}
          </span>
        </div>

        <Link
          href={websiteLink}
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
            src={bannerImage}
            alt="Sponsored image"
            width={400}
            height={300}
            className="w-full rounded"
          />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-3">
      </CardFooter>
    </Card>
  );
}
