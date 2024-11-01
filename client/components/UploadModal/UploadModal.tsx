"use client";

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera, Infinity } from "lucide-react";

import { uploadJSONToIPFS } from "@/lib/ipfs";
import styles from "./UploadModal.module.css";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ABI, DEPLOYED_CONTRACT } from "@/lib/contract";
import { toast } from "@/hooks/use-toast";

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasTimer: boolean;
  eventId: number;
}

const contractAddress = DEPLOYED_CONTRACT;

const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({
  isOpen,
  onClose,
  hasTimer,
  eventId,
}) => {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [capturing, setCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const { writeContract, data: hash, error: writeContractError } = useWriteContract();

  // Add transaction receipt hook
  const { isLoading: isConfirming, isSuccess, error } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // Only countdown if modal is open and we're not submitting/confirming
    if (isOpen && timeLeft >= 0 && !isSubmitting && !isConfirming && hasTimer) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === -1 && hasTimer) {
      onClose();
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft, onClose, isSubmitting, isConfirming]);

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess) {
      setIsSubmitting(false);
      onClose();
    }
  }, [isSuccess, onClose]);

  useEffect(() => {
    if (isOpen) {
      if (hasTimer) setTimeLeft(120);

      setCapturedImages([]);
      setCaption("");
      setHashtags("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const captureSequence = async () => {
    setCapturing(true);
    const images: string[] = [];

    try {
      // Capture from the front camera
    setFacingMode("user");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) images.push(imageSrc);

    // Capture from the back camera
    setFacingMode("environment");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const backImageSrc = webcamRef.current?.getScreenshot();
    if (backImageSrc) images.push(backImageSrc);

    setCapturedImages(images);
    setCapturing(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: `There was an error creating your ad. Please try again.${error}`,
        variant: "destructive",
      });
      
    }
    
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const json: Record<string | number, string | string[]> = {};

      const uploadCIDs = await Promise.all(
        capturedImages.map(async (imageData, index) => {
          if (imageData) {
            const [, imageContent] = imageData.split(",");
            const cid = await uploadJSONToIPFS(imageContent);
            return { index, cid: cid.IpfsHash };
          }
          return null;
        })
      );

      uploadCIDs.forEach((item) => {
        if (item) {
          json[item.index] = item.cid;
        }
      });

      json["caption"] = caption;
      json["hashtags"] = hashtags.split(",");

      const cid = await uploadJSONToIPFS(json);
      await postPhotoOnChain(cid.IpfsHash);
    } catch (error) {
      console.error("Error submitting photo:", error);
      setIsSubmitting(false);
    }
  };

  const postPhotoOnChain = async (cid: string) => {
    if (hasTimer) {
      writeContract({
        abi: CONTRACT_ABI,
        functionName: "createPostDuringEvent",
        address: contractAddress,
        args: [cid, eventId],
      });
    } else {
      writeContract({
        abi: CONTRACT_ABI,
        functionName: "createPost",
        address: contractAddress,
        args: [cid],
      });
    }
  };

  useEffect(() => {
    if (error || writeContractError)
      toast({
        title: "Error",
        description: `There was an error creating your ad. Please try again.${error || writeContractError}`,
        variant: "destructive",
      });

      console.log(error || writeContractError);
      
  }, [error, writeContractError])
  

  if (!isOpen) return null;

  const isDisabled = isSubmitting || isConfirming;
  const buttonText = isConfirming
    ? "Confirming..."
    : isSubmitting
    ? "Posting..."
    : "Post";


  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Upload Photo</h2>
        <div className={styles.timer}>
          Time left
          {hasTimer ? (
            <div>
              {Math.floor(timeLeft / 60)} :
              {(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          ) : (
            <Infinity />
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.photoContainer}>
            {capturedImages.length ? (
              <div className={styles.previewContainer}>
                <img
                  src={capturedImages[1] || capturedImages[0]}
                  alt="Back Camera"
                  className={styles.backCameraPreview}
                />
                {capturedImages.length > 1 && (
                  <img
                    src={capturedImages[0]}
                    alt="Front Camera"
                    className={styles.frontCameraPreview}
                  />
                )}
              </div>
            ) : (
              <>
                <Webcam
                  key={facingMode}
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode }}
                  className={styles.webcam}
                />

                <button
                  type="button"
                  onClick={captureSequence}
                  disabled={capturing || isDisabled}
                  className={styles.captureButton}
                >
                  {capturing ? (
                    <div className={styles.loadingSpinner} />
                  ) : (
                    <Camera className={styles.cameraIcon} />
                  )}
                </button>
              </>
            )}
          </div>
          <input
            type="text"
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className={styles.inputField}
            disabled={isDisabled}
          />
          <input
            type="text"
            placeholder="Add hashtags..."
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className={styles.inputField}
            disabled={isDisabled}
          />
          <div className={styles.buttonContainer}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isDisabled}
            >
              {buttonText}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={isDisabled}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPhotoModal;
