interface RegularPost  {
    id: string,
    image: string,
    caption: string,
    likes: number,
    likedBy: string[],
    userAddress: string
    postId: number,
    index: number,
    image2: string,
    hashtags : string[],
    timeStamp: bigint,
}

interface SponsorPost {
    adDomain: string,
    bannerImage: string,
    companyName: string,
    hashtags: string[],
    websiteLink: string,
    description: string
}

interface ContractPost {
    content: string,
    likedBy: string[],
    timestamp: BigInt,
    user: string
}