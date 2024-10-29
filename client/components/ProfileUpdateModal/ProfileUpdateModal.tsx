// ProfileUpdateModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { generateRandomImage } from '@/lib/utils';

interface ProfileUpdateModalProps {
  walletAddress: string | undefined | `0x${string}`;
  onUpdate: (bio: string) => void;
  userBio: string | unknown;
  onClose: () => void;
  isPending: boolean;
}

const ProfileUpdateModal: React.FC<ProfileUpdateModalProps> = ({
  walletAddress,
  onUpdate,
  userBio = "",
  onClose,
  isPending
}) => {
  const [bio, setBio] = useState(typeof(userBio) == "string" ? userBio : "");
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    setProfileImage(generateRandomImage(walletAddress));
  }, [walletAddress]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newBio = e.target.value;
    const MAX_BIO_LENGTH = 100;

    if (newBio.length <= MAX_BIO_LENGTH) {
      setBio(newBio);
      setError('');
    } else {
      setError(`Bio cannot exceed ${MAX_BIO_LENGTH} characters`);
    }
  };

  const handleUpdate = async () => {
    try {
      onUpdate(bio);
    } catch (err) {
      console.log(err);
      
      setError('Failed to update profile. Please try again.');
    } finally {
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-white">Update Profile</h2>

        <div className="flex justify-center mb-6">
          {/* Next.js Image component isn't used here since the source is dynamic and external */}
          <img 
            src={profileImage} 
            alt="Profile" 
            className="w-32 h-32 rounded-full border-4 border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label 
            htmlFor="bio" 
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Bio (100 characters max)
          </label>
          
          <textarea
            id="bio"
            className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            value={bio}
            onChange={handleBioChange}
            placeholder="Tell us about yourself..."
          />

          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">
              {bio.length}/100 characters
            </span>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleUpdate}
          disabled={!!error}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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