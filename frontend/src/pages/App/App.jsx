import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getSigner } from "@dynamic-labs/ethers-v6";
import { FaUserCircle } from "react-icons/fa"; // Import profile icon from React Icons
import { encodeFunctionData } from "viem";

import "./App.css";
import rightarrow from "../../assets/8-bit-right-arrow.gif";
import UploadPhotoModal from "../../components/UploadModal/UploadModal.jsx";
import ProfileUpdateModal from "../../components/ProfileUpdateModal/ProfileUploadModal.jsx";
import { useBiconomyAccount } from "../../useBiconomyAccount.js";
import PostCard from "../../components/PostCard/PostCard.jsx";
import SponsoredPostCard from "../../components/SponsoredCard/SponsoredCard.jsx";
import dummy from "../../assets/dummy-image.jpg";
import ContractData from "../../assets/contracts/DeReal.json";
import { PaymasterMode } from "@biconomy/account";

function App() {
  const { smartAccount } = useBiconomyAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setwalletAddress] = useState("");
  const [contract, setcontract] = useState();
  const [userBio, setuserBio] = useState();
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
    let c;
    async function me() {
      const signer = await getSigner(primaryWallet);
      c = new ethers.Contract(contractAddress, ContractData.abi, signer);
      setcontract(c);
      try {
        console.log(c);

        let u = await c.viewBio(await smartAccount.getAccountAddress());
        if (u) {
          setuserBio(u);
        }
      } catch (error) {
        console.log(error);
        // Assuming you have already imported the ABI and necessary setup

        console.log(primaryWallet);

        try {
          const transactionData = encodeFunctionData({
            abi: ContractData.abi, // ABI of the contract
            functionName: "registerUser", // Name of the function you're calling
            args: ["Initial bio", await smartAccount.getAccountAddress()], // Arguments for the function
          });

          // Build the transaction object
          const tx = {
            to: contractAddress, // The contract address you're interacting with
            data: transactionData, // The encoded function data
          };

          const userOpResponse = await smartAccount.sendTransaction(tx, {
            paymasterServiceData: { mode: PaymasterMode.SPONSORED },
          });

          const { transactionHash } = await userOpResponse.waitForTxHash();

          await userOpResponse.wait();
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (smartAccount && smartAccount.signer) me();
  }, [smartAccount]);

  const handleUpdate = async (bio) => {
    try {
      // Assuming you have already imported the ABI and necessary setup
      const transactionData = encodeFunctionData({
        abi: ContractData.abi, // ABI of the contract
        functionName: "updateBio", // Name of the function you're calling
        args: [bio], // Arguments for the function
      });

      // Build the transaction object
      const tx = {
        to: contractAddress, // The contract address you're interacting with
        data: transactionData, // The encoded function data
      };
      const userOpResponse = await smartAccount.sendTransaction(tx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });

      const { transactionHash } = await userOpResponse.waitForTxHash();

      console.log("Transaction Hash", transactionHash);
      const userOpReceipt = await userOpResponse.wait();
      if (userOpReceipt.success == "true") {
        console.log("UserOp receipt", userOpReceipt);
        console.log("Transaction receipt", userOpReceipt.receipt);
      }
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
      caption: "Exploring the pixel world!",
      likes: 42,
      userPfp: dummy,
      userAddress: "0x12312321313134555",
    },
    // More posts...
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
      caption: "Check out our new 8-bit inspired game!",
      likes: 45,
      sponsorLink: "https://example.com/sponsored-game1",
      userPfp: dummy,
      userAddress: "0x12312321313134555",
    },
    // More sponsored posts...
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

  return (
    <div className="App">
      <header className="grid items-center justify-items-end">
        <div className="flex items-center justify-items-end">
          {/* Profile Icon */}
          <div
            className="profile-icon-container"
            onClick={() => setshowProfileModal(true)}
          >
            <FaUserCircle size={30} style={{ cursor: "pointer" }} />
          </div>
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

      {/* Profile Update Modal */}
      {showProfileModal && (
        <ProfileUpdateModal
          walletAddress={walletAddress}
          onUpdate={handleUpdate}
          userBio={userBio}
          onClose={() => setshowProfileModal(false)}
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
