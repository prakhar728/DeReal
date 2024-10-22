'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ExternalLink } from 'lucide-react'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface SponsoredPostCardProps {
  image: string
  caption: string
  likes: number
  sponsorLink: string
  userPfp: string
  userAddress: string
}

export default function SponsoredPostCard({
  image,
  caption,
  likes,
  sponsorLink,
  userPfp,
  userAddress,
}: SponsoredPostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(likes)

  const handleLike = () => {
    setIsLiked((prev) => !prev)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="relative mb-6 overflow-hidden bg-gray-800 transition-transform duration-300 hover:-translate-y-1">
      <div className="absolute -left-8 top-2.5 z-10 -rotate-45 bg-primary px-8 py-0.5 text-base text-primary-foreground shadow-md">
        <span className="border-2 border-secondary">Sponsored</span>
      </div>

      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt="Sponsored Post"
            fill
            className="rounded-t-lg object-cover"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <p className="text-base text-gray-200">{caption}</p>

        <div className="mt-2 flex items-center">
          <Avatar className="h-8 w-8 border border-gray-600">
            <AvatarImage src={userPfp} alt="User Profile" />
            <AvatarFallback className="bg-gray-700 text-gray-200">{userAddress.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="ml-2 text-sm text-gray-400">
            {shortenAddress(userAddress)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center p-4">
        <Button
          variant="ghost"
          size="sm"
          className="mr-2 p-0 text-gray-400 hover:text-gray-200"
          onClick={handleLike}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart
            className={`h-6 w-6 ${isLiked ? 'fill-primary text-primary' : ''}`}
          />
        </Button>

        <span className="text-sm text-gray-400">{likeCount}</span>

        <Link
          href={sponsorLink}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-gray-400 hover:text-gray-200"
          aria-label="Visit sponsor's website"
        >
          <ExternalLink className="h-6 w-6" />
        </Link>
      </CardFooter>
    </Card>
  )
}