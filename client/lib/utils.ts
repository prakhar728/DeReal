import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function bigintToTimestamp(digit: bigint) {
  // Convert bigint to a number and multiply by 1000 to get the timestamp in milliseconds
  const timestamp = Number(digit) * 1000;
  
  // Create a Date object from the timestamp
  return new Date(timestamp);
}


export const generateRandomImage = (address: string | `0x${string}` | undefined) => {
  if (!address) address = '0x325E5Bd3d7d12cA076D0A8f9f5Be7d1De1dd4c83';
  // Generate a unique seed based on the wallet address
  const seed = address.slice(2, 10);
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;
};