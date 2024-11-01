"use client";

import { useState, useEffect } from "react";
import { Edit, Loader2 } from "lucide-react";

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
  const [openProfileEditModal, setOpenProfileEditModal] = useState(false);
  const [regularPosts, setRegularPosts] = useState<RegularPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [hasTimer, setHasTimer] = useState(false);
  const [eventId, setEventId] = useState<number>(0);
  const { address } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: userBio } = useReadContract({
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

  useEffect(() => {
    const fetchFromIpfs = async (post: ContractPost, index: number) => {
      const res = await (
        await fetch(
          `https://plum-xerothermic-louse-526.mypinata.cloud/ipfs/${post.content}`
        )
      ).json();

      res["postId"] = index;
      res["userAddress"] = post["user"];
      res["likes"] = post["likedBy"].length;
      res["likedBy"] = post["likedBy"];
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

    const populateRegularPosts = async (posts: ContractPost[]) => {
      var regularPosts = await Promise.all(posts.map(fetchFromIpfs));
      regularPosts = regularPosts.filter((p) => p);
      console.log(regularPosts);

      setRegularPosts(regularPosts);
      setLoading(false);
    };

    if (posts && Array.isArray(posts)) {
      populateRegularPosts(posts);
    }
  }, [posts, address]);

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
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <UploadPhotoModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          hasTimer={hasTimer}
          eventId={eventId}
        />
        <Card className="mb-8 bg-gray-800 text-gray-200">
          <CardHeader className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                <AvatarImage
                  src={generateRandomImage(address)}
                  alt="User Profile"
                />
                <AvatarFallback>{address?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </h1>
                <p className="text-sm text-gray-400">@username</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 sm:mt-0"
              onClick={() => setOpenProfileEditModal(true)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-center sm:text-left">
              {userBio?.toString() || "Your Bio is Empty!"}
            </p>
            <div className="flex justify-center sm:justify-start text-sm text-gray-400">
              <span>{regularPosts && regularPosts.length} Posts</span>
              {/* Add more stats here if needed */}
            </div>
          </CardContent>
        </Card>

        <h2 className="mb-4 text-xl font-bold text-gray-200">My Posts</h2>

        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Searching for your posts...</span>
          </div>
        ) : regularPosts.length === 0 ? (
          <p className="text-center text-gray-400">No posts to show yet!</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post, index) => (
              <PostCard
                key={index}
                likedBy={post.likedBy}
                postId={post.postId}
                image={post.image || ""}
                image2={post.image2}
                caption={post.caption}
                likes={post.likes}
                userAddress={post.userAddress}
                hashtags={post.hashtags}
                timeStamp={post.timeStamp}
              />
            ))}
          </div>
        )}
      </main>

      <Footer
        setIsModalOpen={setIsModalOpen}
        sethasTimer={setHasTimer}
        setEventId={setEventId}
      />

      {openProfileEditModal && (
        <ProfileUpdateModal
          walletAddress={address}
          onUpdate={updateUserProfile}
          userBio={userBio}
          onClose={() => setOpenProfileEditModal(false)}
          isPending={isPending}
        />
      )}
    </div>
  );
}
