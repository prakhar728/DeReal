import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";

import "./UploadModal.css";
import { uploadJSONToIPFS } from "../../Ipfs";

const UploadPhotoModal = ({ isOpen, onClose }) => {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [capturedImages, setCapturedImages] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const webcamRef = useRef(null);
  
  const captureSequence = async () => {
    setCapturing(true);
    const images = [];

    // Capture from the front camera
    setFacingMode("user");
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for the camera to initialize
    let imageSrc = webcamRef.current.getScreenshot();
    images.push(imageSrc);

    // Capture from the back camera
    setFacingMode("environment");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    imageSrc = webcamRef.current.getScreenshot();
    images.push(imageSrc);

    setCapturedImages(images);
    setCapturing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let json = {};
    for (let [index, value] of capturedImages.entries()) {
      if (value) {
        let cid = await uploadJSONToIPFS(value.split(",")[1]);
        json[index] = cid.IpfsHash;
      }
    }
    json["caption"] = caption;
    json["hashtags"] = hashtags.split(',');


    let cid = await uploadJSONToIPFS(json);
    console.log(cid);
    
    setCapturedImages([]);
    setCaption("");
    setHashtags("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload Photo</h2>
        <form onSubmit={handleSubmit}>
          <div className="photo-container">
            {capturedImages.length ? (
              <div className="preview-container">
                <img 
                  src={capturedImages[1] || capturedImages[0]} 
                  alt="Back Camera" 
                  className="back-camera-preview"
                />
                {capturedImages.length > 1 && (
                  <img 
                    src={capturedImages[0]} 
                    alt="Front Camera" 
                    className="front-camera-preview"
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
                  videoConstraints={{ facingMode: facingMode }}
                  style={{ width: "100%", maxWidth: 400 }}
                />
                
                <button
                  onClick={captureSequence}
                  disabled={capturing}
                  className="capture-button"
                >
                  {capturing ? (
                    <img
                      src="https://media.tenor.com/On7kvXhzml4AAAAj/loading-gif.gif"
                      style={{ width: "20px" }}
                      alt="loading"
                    />
                  ) : (
                    <FaCamera />
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
            className="input-field"
          />
          <input
            type="text"
            placeholder="Add hashtags..."
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="input-field"
          />
          <div className="button-container">
            <button type="submit" className="submit-button">
              Post
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPhotoModal;