interface Post {
    id: string,
    image: string,
    caption: string,
    likes: number,
    userAddress: string
}

interface RegularPost extends Post {
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
}

interface ContractPost {
    content: string,
    likedBy: string[],
    timestamp: BigInt,
    user: string
}