"use client";

import { useEffect, useState } from "react";
import UploadPhotoModal from "@/components/UploadModal/UploadModal";
import PostCard from "@/components/PostCard/PostCard";
import SponsoredPostCard from "@/components/SponsoredCard/SponsoredCard";
import { CONTRACT_ABI, DEPLOYED_CONTRACT } from "@/lib/contract";
import { useReadContract } from "wagmi";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

var sponsoredPosts: SponsorPost[] = [
  {
    companyName: "Cool games",
    bannerImage:
      "https://m.media-amazon.com/images/I/81dwDTLOJLL._AC_UF894,1000_QL80_.jpg",
    websiteLink: "https://example.com/sponsored-game1",
    adDomain: "games",
    hashtags: ["game1"],
  },
  {
    companyName: "Cool games",
    bannerImage: "https://www.retrogames.cz/games/022/NES-gameplay.gif",
    websiteLink: "https://example.com/sponsored-game1",
    adDomain: "games",
    hashtags: ["game1"],
  },
  {
    companyName: "Cool games",
    bannerImage:
      "https://media.tenor.com/2EYlFh7m2JkAAAAM/minecraft-gameplay.gif",
    websiteLink: "https://example.com/sponsored-game1",
    adDomain: "games",
    hashtags: ["game1"],
  },
];

const contractAddress = DEPLOYED_CONTRACT;

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regularPosts, setRegularPosts] = useState<RegularPost[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [hasTimer, sethasTimer] = useState(false);
  const [eventId, seteventId] = useState<number>(0);

  // const [triggerCapture, setTriggerCapture] = useState(false);

  const { data: posts } = useReadContract({
    abi: CONTRACT_ABI,
    address: contractAddress,
    functionName: "getAllPosts",
  });

  // useEffect(() => {
  //   if (triggerCapture) setIsModalOpen(true);
  // }, [triggerCapture]);

  const getRandomSponsoredPost = () => {
    const randomIndex = Math.floor(Math.random() * sponsoredPosts.length);
    return sponsoredPosts[randomIndex];
  };

  const interleavePosts = () => {
    const result = [];
    let regularIndex = 0;
    let sponsoredIndex = 0;

    while (regularIndex < regularPosts.length) {
      // Add two regular posts if possible
      result.push(regularPosts[regularIndex++]);
      if (regularIndex < regularPosts.length) {
        result.push(regularPosts[regularIndex++]);
      }

      // Always try to add a sponsored post
      if (sponsoredPosts.length > 0) {
        // Reset sponsoredIndex if we've used all sponsored posts
        sponsoredIndex = sponsoredIndex % sponsoredPosts.length;
        result.push(getRandomSponsoredPost());
      }
    }

    return result;
  };

  const interleavedPosts = interleavePosts();

  const fetchFromIpfs = async (post: ContractPost) => {
    const res = await (
      await fetch(
        `https://plum-xerothermic-louse-526.mypinata.cloud/ipfs/${post.content}`
      )
    ).json();

    res["userAddress"] = post["user"];
    res["likes"] = post["likedBy"].length;
    res["timeStamp"] = post["timestamp"];
    res["image"] = await (
      await fetch(
        `https://plum-xerothermic-louse-526.mypinata.cloud/ipfs/${res["0"]}`
      )
    ).json();

    if (res["1"])
      res["image2"] = await (
        await fetch(
          `https://plum-xerothermic-louse-526.mypinata.cloud/ipfs/${res["1"]}`
        )
      ).json();

    return res;
  };

  useEffect(() => {
    const populateRegularPosts = async (posts: ContractPost[]) => {
      const regularPosts = await Promise.all(posts.map(fetchFromIpfs));

      setRegularPosts(regularPosts);
      setLoading(false);
    };

    if (posts && Array.isArray(posts)) {
      setLoading(true);
      populateRegularPosts(posts);
    }
  }, [posts]);

  // useEffect(() => {
  //   const getAds = async () => {
  //     var ads = await (await fetch(`http://localhost:5000/ads`)).json();
  //     ads = ads.map(async (ad: SponsorPost) => {
  //       ad["bannerImage"] = await (
  //         await fetch(
  //           `https://plum-xerothermic-louse-526.mypinata.cloud/ipfs/${ad["bannerImage"]}`
  //         )
  //       ).json();
  //     });

  //   };

  //   getAds();
  // }, []);

  // const likePost = (postId: string) => {
  //   console.log(`Dummy likePost function called for post ID: ${postId}`);
  // };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-16">
      <Header />
      <UploadPhotoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        hasTimer={hasTimer}
        eventId={eventId}
      />

      <main className="container mx-auto px-4">
        <header className="text-center my-8">
          <h1 className="text-3xl font-bold mb-2">DeReal Posts</h1>
          <p className="text-gray-600">Share your pixelated moments</p>
        </header>

        {isLoading ? (
          <h2 className="w-100 text-center">
            {" "}
            Digging through the chains to posts for you!
          </h2>
        ) : interleavedPosts.length == 0 ? (
          <h2 className="w-100 text-center">No posts to show yet!</h2>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {interleavedPosts.map((post, index) =>
              "websiteLink" in post ? (
                <SponsoredPostCard
                  key={index}
                  bannerImage={post.bannerImage}
                  websiteLink={post.websiteLink}
                  adDomain={post.adDomain}
                  hashtags={post.hashtags}
                  companyName={post.companyName}
                />
              ) : (
                <PostCard
                  key={index}
                  image={post.image || ""}
                  image2={post.image2}
                  caption={post.caption}
                  likes={post.likes}
                  userAddress={post.userAddress}
                  hashtags={post.hashtags}
                  timeStamp={post.timeStamp}
                />
              )
            )}
          </div>
        )}
      </main>
      <Footer
        setIsModalOpen={setIsModalOpen}
        sethasTimer={sethasTimer}
        setEventId={seteventId}
      />
    </div>
  );
}
