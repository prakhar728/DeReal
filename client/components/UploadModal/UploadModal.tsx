"use client";

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera } from "lucide-react";

import { uploadJSONToIPFS } from "@/lib/ipfs";
import styles from "./UploadModal.module.css";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACT_ABI, DEPLOYED_CONTRACT } from "@/lib/contract";

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const contractAddress = DEPLOYED_CONTRACT;

const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [capturing, setCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const { writeContract, data: hash, error } = useWriteContract();

  // Add transaction receipt hook
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // Only countdown if modal is open and we're not submitting/confirming
    if (isOpen && timeLeft > 0 && !isSubmitting && !isConfirming) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
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
      setTimeLeft(120);
      setCapturedImages([]);
      setCaption("");
      setHashtags("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const captureSequence = async () => {
    setCapturing(true);
    const images: string[] = [];

    // Capture from the front camera
    setFacingMode("user");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) images.push(imageSrc);

    // Capture from the back camera
    setFacingMode("environment");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const backImageSrc = webcamRef.current?.getScreenshot();
    if (backImageSrc) images.push(backImageSrc);

    setCapturedImages(images);
    setCapturing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const json: Record<string | number, any> = {};

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
    writeContract({
      abi: CONTRACT_ABI,
      functionName: "createPost",
      address: contractAddress,
      args: [cid],
    });
  };

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
          Time left: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
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
