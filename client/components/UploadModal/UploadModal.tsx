// UploadModal.tsx
'use client';

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Camera } from "lucide-react";

import { uploadJSONToIPFS } from "@/lib/ipfs";
import styles from "./UploadModal.module.css";

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  postPhotoOnChain: (hash: string) => void;
}

const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({ 
  isOpen, 
  onClose, 
  postPhotoOnChain 
}) => {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [capturing, setCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [timeLeft, setTimeLeft] = useState(120);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onClose();
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeLeft(120);
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
    const json: Record<string | number, any> = {};
    
    for (const [index, value] of capturedImages.entries()) {
      if (value) {
        const cid = await uploadJSONToIPFS(value.split(",")[1]);
        json[index] = cid.IpfsHash;
      }
    }
    
    json["caption"] = caption;
    json["hashtags"] = hashtags.split(',');

    const cid = await uploadJSONToIPFS(json);
    postPhotoOnChain(cid.IpfsHash);
    
    setCapturedImages([]);
    setCaption("");
    setHashtags("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Upload Photo</h2>
        <div className={styles.timer}>
          Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
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
                  disabled={capturing}
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
          />
          <input
            type="text"
            placeholder="Add hashtags..."
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className={styles.inputField}
          />
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>
              Post
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className={styles.cancelButton}
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