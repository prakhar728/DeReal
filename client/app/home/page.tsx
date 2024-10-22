"use client";

import { useEffect, useState } from "react";
import { Camera, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadPhotoModal from "@/components/UploadModal/UploadModal";
import ProfileUpdateModal from "@/components/ProfileUpdateModal/ProfileUpdateModal";
import PostCard from "@/components/PostCard/PostCard";
import SponsoredPostCard from "@/components/SponsoredCard/SponsoredCard";
import { DEPLOYED_CONTRACT } from "@/lib/contract";

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

const regularPostDummyData: RegularPost[] = [
  {
    index: 0,
    id: "s1",
    image:
      "https://m.media-amazon.com/images/I/81dwDTLOJLL._AC_UF894,1000_QL80_.jpg",
    image2:
      "https://m.media-amazon.com/images/I/81dwDTLOJLL._AC_UF894,1000_QL80_.jpg",
    caption: "Check out our new 8-bit inspired game!",
    likes: 45,
    userAddress: "0x12312321313134555",
    hashtags: ["hash1", "hash2"],
    userPfp: "",
    timeStamp: BigInt(0),
  },
];

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [userBio, setUserBio] = useState("");
  const [regularPosts, setRegularPosts] = useState<RegularPost[]>([]);
  const [triggerCapture, setTriggerCapture] = useState(false);

  const contractAddress = DEPLOYED_CONTRACT;
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (triggerCapture) setIsModalOpen(true);
  }, [triggerCapture]);

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

  const postPhotoOnChain = () => {
    console.log("Dummy postPhotoOnChain function called");
  };

  const handleUpdate = (updatedUserBio: string) => {
    setUserBio(updatedUserBio);
    console.log("Dummy handleUpdate function called with:", updatedUserBio);
  };

  const likePost = (postId: string) => {
    console.log(`Dummy likePost function called for post ID: ${postId}`);
  };

  return (
    <div className="min-h-screen pb-16">
      <header className="grid items-center justify-items-end p-4">
        <div className="flex items-center gap-4">
          <w3m-button />
        </div>
      </header>

      <UploadPhotoModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false) }}
        postPhotoOnChain={postPhotoOnChain}
      />

      {showProfileModal && (
        <ProfileUpdateModal
          walletAddress={walletAddress}
          onUpdate={handleUpdate}
          userBio={userBio}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      <main className="container mx-auto px-4">
        <header className="text-center my-8">
          <h1 className="text-3xl font-bold mb-2">DeReal Posts</h1>
          <p className="text-gray-600">Share your pixelated moments</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {interleavedPosts.map((post) =>
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
                key={post.index}
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

      <nav className="fixed bottom-0 left-0 right-0 bg-background/10 backdrop-blur-sm ">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="flex justify-between items-center py-2">
            <Button variant="ghost" className="flex-1 text-primary-foreground">
              <Home className="w-6 h-6" />
              <span className="sr-only">Home</span>
            </Button>
            <div className="flex-1 flex justify-center">
              <div className="rounded-full p-1 bg-primary/20">
                <Button
                  onClick={() => {
                    setIsModalOpen(true);
                    console.log("Opening");
                  }}
                  className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-secondary/80" style={{
                    clipPath: 'polygon(0 0, 25% 0, 25% 25%, 50% 25%, 50% 50%, 75% 50%, 75% 75%, 100% 75%, 100% 100%, 0 100%)'
                  }}></div>
                  <Camera className="w-5 h-5 relative z-10" />
                  <span className="sr-only">Open camera</span>
                </Button>
              </div>
            </div>
            <Button variant="ghost" className="flex-1 text-primary-foreground" onClick={() => setShowProfileModal(true)}>
              <User className="w-6 h-6" />
              <span className="sr-only">Profile</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}