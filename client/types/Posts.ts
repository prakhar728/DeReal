interface Post {
    id: string,
    image: string,
    caption: string,
    likes: number,
    userPfp: string,
    userAddress: string
}

interface RegularPost extends Post {
    index: number,
    image2: string,
    hashtags : string[],
    timeStamp: string,
}

interface SponsorPost extends Post {
    sponsorLink: string
}