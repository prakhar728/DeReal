'use client';

import { useEffect, useState } from "react";

import UploadPhotoModal from "@/components/UploadModal/UploadModal";
import ProfileUpdateModal from "@/components/ProfileUpdateModal/ProfileUpdateModal";
import PostCard from "@/components/PostCard/PostCard";
import SponsoredPostCard from "@/components/SponsoredCard/SponsoredCard";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [userBio, setUserBio] = useState("");
  const [regularPosts, setRegularPosts] = useState([]);
  const [triggerCapture, setTriggerCapture] = useState(false);

  const contractAddress = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT;
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (triggerCapture) setIsModalOpen(true);
  }, [triggerCapture]);

  const sponsoredPosts = [
    {
      id: "s1",
      image: 'https://m.media-amazon.com/images/I/81dwDTLOJLL._AC_UF894,1000_QL80_.jpg',
      caption: "Check out our new 8-bit inspired game!",
      likes: 45,
      sponsorLink: "https://example.com/sponsored-game1",
      userPfp: '',
      userAddress: "0x12312321313134555",
    },
    {
      id: "s2",
      image: 'https://www.retrogames.cz/games/022/NES-gameplay.gif',
      caption: "Check out our new co-op game!",
      likes: 45,
      sponsorLink: "https://example.com/sponsored-game1",
      userPfp: '/dummy-image.jpg',
      userAddress: "0x12312321313134555",
    },
  ];

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

  const handleUpdate = (updatedWalletAddress: string, updatedUserBio: string) => {
    setWalletAddress(updatedWalletAddress);
    setUserBio(updatedUserBio);
    console.log("Dummy handleUpdate function called with:", updatedWalletAddress, updatedUserBio);
  };

  const likePost = (postId: string) => {
    console.log(`Dummy likePost function called for post ID: ${postId}`);
  };

  return (
    <div className="min-h-screen">
      <header className="grid items-center justify-items-end p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center"
          >
            {/* <FaUserCircle size={30} className="cursor-pointer" /> */}
          </button>
        </div>
      </header>

      <UploadPhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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
            post.sponsorLink ? (
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
                userAddress={post.user}
                hashtags={post.hashtags}
                userPfp={post.userPfp}
                timeStamp={post.timestamp}
                interactionId={post.index}
                likePost={likePost}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
}
