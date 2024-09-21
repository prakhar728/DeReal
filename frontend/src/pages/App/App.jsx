import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getWeb3Provider, getSigner } from "@dynamic-labs/ethers-v6";

import "./App.css";

import rightarrow from "../../assets/8-bit-right-arrow.gif";
import UploadPhotoModal from "../../components/UploadModal/UploadModal.jsx";
import ProfileUpdateModal from "../../components/ProfileUpdateModal/ProfileUploadModal.jsx";
import { useBiconomyAccount } from "../../useBiconomyAccount.js";
import PostCard from "../../components/PostCard/PostCard.jsx";
import SponsoredPostCard from "../../components/SponsoredCard/SponsoredCard.jsx";
import dummy from "../../assets/dummy-image.jpg";
import ContractData from "../../assets/contracts/DeReal.json";

function App() {
  const { smartAccount } = useBiconomyAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setwalletAddress] = useState("");
  const [contract, setcontract] = useState();
  const { primaryWallet } = useDynamicContext();

  const contractAddress = process.env.REACT_APP_DEPLOYED_CONTRACT;
  const [showProfileModal, setshowProfileModal] = useState(false);

  useEffect(() => {
    async function walletPopulate() {
      setwalletAddress(await smartAccount.getAccountAddress());
    }

    if (smartAccount) {
      walletPopulate();
    }
  }, [smartAccount]);

  useEffect(() => {
    async function fetchContract() {
      let c;
      try {
        if (contract) return;

        const signer = await getSigner(primaryWallet);

        console.log("here");

        c = new ethers.Contract(contractAddress, ContractData.abi, signer);
        setcontract(c);
        await c.getUser();
      } catch (error) {
        if (error.code == "CALL_EXCEPTION") {
          let tx = await c.registerUser("");
          await tx;
          setshowProfileModal(false);
        }
      }
    }

    if (primaryWallet) {
      fetchContract();
    }
  }, [primaryWallet]);

  const handleUpdate = async (bio) => {
    try {
      console.log("Updating profile");
    } catch (error) {
      console.log(error);
    }
  };

  const regularPosts = [
    {
      id: 1,
      image: dummy,
      caption: "Exploring the pixel world!",
      likes: 42,
      userPfp: dummy,
      userAddress: "0x12312321313134555",
    },
    {
      id: 2,
      image: dummy,
      caption: "Retro gaming night",
      likes: 28,
      userPfp: dummy,
      userAddress: "0x12312321313134555",
    },
    {
      id: 3,
      image: dummy,
      caption: "8-bit art creation in progress",
      likes: 35,
      userPfp: dummy,
      userAddress: "0x12312321313134555",
    },
    // Add more posts as needed
  ];

  const sponsoredPosts = [
    {
      id: "s1",
      image: dummy,
      caption: "Check out our new 8-bit inspired game!",
      likes: 45,
      sponsorLink: "https://example.com/sponsored-game1",
      userPfp: dummy,
      userAddress: "0x12312321313134555",
    },
    {
      id: "s2",
      image: dummy,
      caption: "Retro-style energy drinks now available!",
      likes: 30,
      sponsorLink: "https://example.com/sponsored-drink",
      userPfp: dummy,
      userAddress: "0x12312321313134555",
    },
    {
      id: "s3",
      image: dummy,
      caption: "Join our pixel art workshop this weekend",
      likes: 55,
      sponsorLink: "https://example.com/pixel-art-workshop",
      userPfp: dummy,
      userAddress: "0x12312321313134555",
    },
    // Add more sponsored posts as needed
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
      // Add two regular posts
      result.push(regularPosts[regularIndex++]);
      if (regularIndex < regularPosts.length) {
        result.push(regularPosts[regularIndex++]);
      }

      // Add one sponsored post if available
      if (sponsoredIndex < sponsoredPosts.length) {
        result.push(getRandomSponsoredPost());
        sponsoredIndex++;
      }
    }

    return result;
  };

  const interleavedPosts = interleavePosts();

  return (
    <div className="App">
      <header className="grid items-center justify-items-end">
        <div className="grid items-center justify-items-end">
          <DynamicWidget />
        </div>
      </header>

      <div className="cta-section">
        <h2>Ready for spontaneous sharing?</h2>
        <button className="cta-button" onClick={() => setIsModalOpen(true)}>
          Upload Photo
          <img src={rightarrow} alt="right-arrow" className="right-arrow" />
        </button>
      </div>
      <UploadPhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {showProfileModal && (
        <ProfileUpdateModal
          walletAddress={walletAddress}
          onUpdate={handleUpdate}
        />
      )}

      <div className="posts-page">
        <header className="posts-header">
          <h1>DeReal Posts</h1>
          <p>Share your pixelated moments</p>
        </header>
        <div className="posts-container">
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
                key={post.id}
                image={post.image}
                caption={post.caption}
                likes={post.likes}
                userAddress={post.userAddress}
                userPfp={post.userPfp}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
