import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getSigner } from "@dynamic-labs/ethers-v6";
import { FaUserCircle } from "react-icons/fa"; // Import profile icon from React Icons
import { encodeFunctionData } from "viem";

import "./App.css";
import UploadPhotoModal from "@/components/UploadModal/UploadModal.jsx";
import ProfileUpdateModal from "@/components/ProfileUpdateModal/ProfileUploadModal.jsx";
import { useBiconomyAccount } from "../../useBiconomyAccount.js";
import PostCard from "@/components/PostCard/PostCard.jsx";
import SponsoredPostCard from "@/components/SponsoredCard/SponsoredCard.jsx";
import dummy from "../../assets/dummy-image.jpg";
import ContractData from "../../assets/contracts/DeReal.json";
import { PaymasterMode } from "@biconomy/account";
import { initListeners } from "../../lib/Contract.js";

function App() {
  const { smartAccount } = useBiconomyAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setwalletAddress] = useState("");
  const [userBio, setuserBio] = useState();
  const [regularPosts, setRegularPosts] = useState([]);
  const [triggerCapture, settriggerCapture] = useState(false);
  const { primaryWallet } = useDynamicContext();

  const contractAddress = process.env.REACT_APP_DEPLOYED_CONTRACT;
  const [showProfileModal, setshowProfileModal] = useState(false);

 useEffect(() => {
  if (triggerCapture)
    setIsModalOpen(true);
 }, [triggerCapture])
 

  useEffect(() => {
    async function walletPopulate() {
      setwalletAddress(await smartAccount.getAccountAddress());
    }

    if (smartAccount) {
      walletPopulate();
    }
  }, [smartAccount]);

  useEffect(() => {
    async function me() {
      const signer = await getSigner(primaryWallet);
      let c = new ethers.Contract(contractAddress, ContractData.abi, signer);

      initListeners(settriggerCapture);
      try {
        let u = await c.viewBio(await smartAccount.getAccountAddress());

        if (u) {
          setuserBio(u);
        } else {
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

          await userOpResponse.waitForTxHash();

          await userOpResponse.wait();
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (smartAccount && smartAccount.signer) me();
  }, [smartAccount]);

  useEffect(() => {
    async function fetchPosts() {
      const signer = await getSigner(primaryWallet);
      let c = new ethers.Contract(contractAddress, ContractData.abi, signer);
      try {
        let posts = [];
        for (let i = 2; i <= (await c.interactionCount()); i++) {
          let u = await c.interactions(i);

          let res = await (
            await fetch(
              `https://plum-xerothermic-louse-526.mypinata.cloud/ipfs/${u[1]}`
            )
          ).json();
          if (res) {
            console.log(res);
            
            res["user"] = u[0];
            res["timestamp"] = u[2];
            res["image"] = await (
              await fetch(
                `https://plum-xerothermic-louse-526.mypinata.cloud/ipfs/${res[0]}`
              )
            ).json();
            res["image2"] = (res[1] ? await (
              await fetch(
                `https://plum-xerothermic-louse-526.mypinata.cloud/ipfs/${res[1]}`
              )
            ).json() : "");
            res["index"] = i;
            posts.push(res);
          }
        }

        setRegularPosts(posts);
      } catch (error) {
        console.log(error);
      }
    }

    if (smartAccount) {
      fetchPosts();
    }
  }, [smartAccount]);

  const likePost = async (id) => {
    try {
      // Assuming you have already imported the ABI and necessary setup
      const transactionData = encodeFunctionData({
        abi: ContractData.abi, // ABI of the contract
        functionName: "likeInteraction", // Name of the function you're calling
        args: [id], // Arguments for the function
      });

      // Build the transaction object
      const tx = {
        to: contractAddress, // The contract address you're interacting with
        data: transactionData, // The encoded function data
      };
      const userOpResponse = await smartAccount.sendTransaction(tx, {
        paymasterServiceData: { mode: PaymasterMode.SPONSORED },
      });

      await userOpResponse.waitForTxHash();

      await userOpResponse.wait();
    } catch (error) {
      console.log(error);
    }
  }

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

      await userOpResponse.waitForTxHash();

      await userOpResponse.wait();
    } catch (error) {
      console.log(error);
    }
  };

  const postPhotoOnChain = async (cid) => {
    try {
      // Assuming you have already imported the ABI and necessary setup
      const transactionData = encodeFunctionData({
        abi: ContractData.abi, // ABI of the contract
        functionName: "postInteraction", // Name of the function you're calling
        args: [cid], // Arguments for the function
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
      if (userOpReceipt.success === "true") {
        console.log("UserOp receipt", userOpReceipt);
        console.log("Transaction receipt", userOpReceipt.receipt);
      }
    } catch (error) {
      console.log(error);
    }
  };


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

      <UploadPhotoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        postPhotoOnChain={postPhotoOnChain}
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
      </div>
    </div>
  );
}

export default App;
