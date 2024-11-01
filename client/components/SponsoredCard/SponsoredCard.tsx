'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Tag } from "lucide-react"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { generateRandomImage } from "@/lib/utils"

interface SponsoredCardProps {
  bannerImage: string
  adDomain: string
  description: string
  companyName: string
  hashtags: string[]
  websiteLink: string
}

export default function SponsoredCard({
  bannerImage,
  adDomain,
  description,
  companyName,
  hashtags,
  websiteLink,
}: SponsoredCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Card className="mb-5 bg-gray-700 shadow-md relative">
      <CardHeader className="flex flex-row justify-between items-center p-3">
        <div className="flex justify-center items-center">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={generateRandomImage("0x1234455")}
              alt="Company logo"
            />
            <AvatarFallback>{companyName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-bold text-gray-200 ml-2 md:block">
            {companyName}
          </span>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-200"
                aria-label="Visit sponsor's website"
              >
                <ExternalLink className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visit website</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>

      <CardContent className="p-3">
        <div className="relative mb-3 w-full">
          <Image
            src={`data:image/png;base64,${bannerImage}`}
            alt="Sponsored image"
            width={400}
            height={300}
            className="w-full rounded"
          />
        </div>
        <p className="text-sm text-gray-300 mb-2">{description}</p>
        <div className="flex items-center mb-2">
          <Tag className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-xs text-gray-400">{adDomain}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {hashtags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-3">
        <div className="bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground rounded">
          Paid promotion
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-200">
          Create your own  <ExternalLink className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  )
}