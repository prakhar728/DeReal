import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function bigintToTimestamp(bigint: BigInt) {
  // Convert bigint to a number and multiply by 1000 to get the timestamp in milliseconds
  const timestamp = Number(bigint) * 1000;
  
  // Create a Date object from the timestamp
  return new Date(timestamp);
}
