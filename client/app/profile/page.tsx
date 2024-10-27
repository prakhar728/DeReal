"use client";

import { useState, useEffect } from "react";
import { Edit } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateRandomImage } from "@/lib/utils";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import Header from "@/components/Header/Header";
import ProfileUpdateModal from "@/components/ProfileUpdateModal/ProfileUpdateModal";
import { CONTRACT_ABI, DEPLOYED_CONTRACT } from "@/lib/contract";
import PostCard from "@/components/PostCard/PostCard";
import Footer from "@/components/Footer/Footer";
import UploadPhotoModal from "@/components/UploadModal/UploadModal";

const contractAddress = DEPLOYED_CONTRACT;

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [openProfileEditModal, setopenProfileEditModal] = useState(false);
  const [regularPosts, setRegularPosts] = useState<RegularPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { address } = useAccount();

  useEffect(() => {
    setMounted(true);
    // Simulating fetching posts
  }, []);

  const { data: userBio, isPending: LoadingBio } = useReadContract({
    abi: CONTRACT_ABI,
    address: contractAddress,
    functionName: "viewBio",
    args: [address],
  });

  const { data: posts } = useReadContract({
    abi: CONTRACT_ABI,
    address: contractAddress,
    functionName: "getAllPosts",
  });

  const { writeContract, isPending } = useWriteContract();

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

    if (res["userAddress"] == address) return res;
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

  const updateUserProfile = async (bio: string) => {
    console.log(bio);

    writeContract({
      abi: CONTRACT_ABI,
      functionName: "updateBio",
      address: contractAddress,
      args: [bio],
    });
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <UploadPhotoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
      <Card className="mb-8 bg-gray-800 text-gray-200">
        <CardHeader className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
              <AvatarImage
                src={generateRandomImage(address)}
                alt="User Profile"
              />
              <AvatarFallback>{address?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </h1>
              <p className="text-sm text-gray-400">@username</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="hover:text-gray-900"
              onClick={() => setopenProfileEditModal(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{userBio?.toString() || "Your Bio is Empty!"}</p>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{regularPosts && regularPosts.length} Posts</span>
            {/* <span>1.5K Followers</span>
            <span>500 Following</span> */}
          </div>
        </CardContent>
      </Card>

      <h2 className="mb-4 text-xl font-bold text-gray-200">My Posts</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <h2> Searching for your posts....</h2>
        ) : regularPosts.length == 0 ? (
          <h2> No posts to show yet!</h2>
        ) : (
          regularPosts &&
          regularPosts.map((post, index) => (
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
          ))
        )}
      </div>

      <Footer setIsModalOpen={setIsModalOpen} />

      {openProfileEditModal && (
        <ProfileUpdateModal
          walletAddress={address}
          onUpdate={updateUserProfile}
          userBio={userBio}
          onClose={() => setopenProfileEditModal(false)}
          isPending={isPending}
        />
      )}
    </div>
  );
}
