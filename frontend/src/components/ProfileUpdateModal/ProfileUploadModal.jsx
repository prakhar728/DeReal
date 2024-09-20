import React, { useState, useEffect } from 'react';

const ProfileUpdateModal = ({ walletAddress, onUpdate }) => {
  const [bio, setBio] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    // Generate a random image based on wallet address
    // This is a placeholder function and should be replaced with actual implementation
    const generateRandomImage = (address) => {
      return `https://api.dicebear.com/9.x/pixel-art/svg`;
    };

    setProfileImage(generateRandomImage(walletAddress));
  }, [walletAddress]);

  const handleBioChange = (e) => {
    const newBio = e.target.value;
    if (newBio.length <= 100) {
      setBio(newBio);
      setError('');
    } else {
      setError('Bio cannot exceed 100 characters');
    }
  };

  const handleUpdate = () => {
    setIsUpdating(true);
    // Simulate an API call
    setTimeout(() => {
      onUpdate(bio);
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Update Profile</h2>
        <div className="flex justify-center mb-6">
          <img 
            src={profileImage} 
            alt="Profile" 
            className="w-32 h-32 rounded-full border-4 border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
            Bio (100 characters max)
          </label>
          <textarea
            id="bio"
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            rows="4"
            value={bio}
            onChange={handleBioChange}
            placeholder="Tell us about yourself..."
          />
          <p className="text-sm text-gray-400 mt-1">{bio.length}/100 characters</p>
        </div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
          onClick={handleUpdate}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : (
            'Update'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileUpdateModal;