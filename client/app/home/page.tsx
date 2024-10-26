"use client";

import { useEffect, useState } from "react";
import UploadPhotoModal from "@/components/UploadModal/UploadModal";
import PostCard from "@/components/PostCard/PostCard";
import SponsoredPostCard from "@/components/SponsoredCard/SponsoredCard";
import { CONTRACT_ABI, DEPLOYED_CONTRACT } from "@/lib/contract";
import { useReadContract, useWriteContract } from "wagmi";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const sponsoredPosts: SponsorPost[] = [
  {
    id: "s1",
    image:
      "https://m.media-amazon.com/images/I/81dwDTLOJLL._AC_UF894,1000_QL80_.jpg",
    caption: "Check out our new 8-bit inspired game!",
    likes: 45,
    sponsorLink: "https://example.com/sponsored-game1",
    userPfp: "",
    userAddress: "0x12312321313134555",
  },
  {
    id: "s2",
    image: "https://www.retrogames.cz/games/022/NES-gameplay.gif",
    caption: "Check out our new co-op game!",
    likes: 45,
    sponsorLink: "https://example.com/sponsored-game1",
    userPfp: "/dummy-image.jpg",
    userAddress: "0x12312321313134555",
  },
];

const contractAddress = DEPLOYED_CONTRACT;

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regularPosts, setRegularPosts] = useState<RegularPost[]>([]);
  // const [triggerCapture, setTriggerCapture] = useState(false);

  const {
    writeContract,
  } = useWriteContract();

  const {
    data: posts,
  } = useReadContract({
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
      result.push(regularPosts[regularIndex++]);
      if (regularIndex < regularPosts.length) {
        result.push(regularPosts[regularIndex++]);
      }

      if (sponsoredIndex < sponsoredPosts.length) {
        result.push(getRandomSponsoredPost());
        sponsoredIndex++;
      }
    }

    return result;
  };

  const interleavedPosts = interleavePosts();

  const postPhotoOnChain = async (cid: string) => {
    writeContract({
      abi: CONTRACT_ABI,
      functionName: "createPost",
      address: contractAddress,
      args: [cid],
    });
  };

  const fetchFromIpfs = async (post: ContractPost) => {
    const res = await (
      await fetch(
        `https://plum-xerothermic-louse-526.mypinata.cloud/ipfs/${post.content}`
      )
    ).json();

    res["userAddress"] = post["user"];
    res["likes"] = post["likes"];
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
    };

    if (posts && Array.isArray(posts)) {
      populateRegularPosts(posts);
    }
  }, [posts]);

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
        postPhotoOnChain={postPhotoOnChain}
      />

      <main className="container mx-auto px-4">
        <header className="text-center my-8">
          <h1 className="text-3xl font-bold mb-2">DeReal Posts</h1>
          <p className="text-gray-600">Share your pixelated moments</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {interleavedPosts.map((post, index) =>
            "sponsorLink" in post ? (
              <SponsoredPostCard
                key={post.id}
                image={post.image}
                caption={post.caption}
                likes={post.likes}
                sponsorLink={post.sponsorLink}
                userAddress={post.userAddress}
                userPfp={post.userPfp}
              />
            ) : (
              <PostCard
                key={index}
                image={post.image}
                image2={post.image2}
                caption={post.caption}
                likes={post.likes}
                userAddress={post.userAddress}
                hashtags={post.hashtags}
                userPfp={post.userPfp}
                timeStamp={post.timeStamp}
              />
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
