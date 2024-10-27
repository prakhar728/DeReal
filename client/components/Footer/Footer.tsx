import React, { useState } from "react";
import { Home, Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button"; // Adjust the path according to your setup
import { useWatchContractEvent } from "wagmi";
import { CONTRACT_ABI, DEPLOYED_CONTRACT } from "@/lib/contract";

interface FooterProps {
  setIsModalOpen: (state: boolean) => void;
  sethasTimer: (state: boolean) => void;
}

const contractAddress = DEPLOYED_CONTRACT;

const Footer: React.FC<FooterProps> = ({
  setIsModalOpen,
  sethasTimer,
}: FooterProps) => {
  useWatchContractEvent({
    address: contractAddress,
    abi: CONTRACT_ABI,
    eventName: "EventTriggered",
    onLogs(logs) {
      setIsModalOpen(true);
      sethasTimer(true);
    },
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="flex justify-between items-center py-2">
          <a
            className="flex items-center text-primary-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition rounded-md px-4 py-2"
            href="/home"
          >
            <Button variant="ghost" className="flex-1 text-primary-foreground">
              <Home className="w-6 h-6" />
              <span className="sr-only">Home</span>
            </Button>
          </a>

          <div className="flex-1 flex justify-center">
            <div className="rounded-full p-1 bg-primary/20">
              <Button
                onClick={() => {
                  setIsModalOpen(true);
                  sethasTimer(false);

                  console.log("Opening");
                }}
                className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg relative overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-secondary/80"
                  style={{
                    clipPath:
                      "polygon(0 0, 25% 0, 25% 25%, 50% 25%, 50% 50%, 75% 50%, 75% 75%, 100% 75%, 100% 100%, 0 100%)",
                  }}
                ></div>
                <Camera className="w-5 h-5 relative z-10" />
                <span className="sr-only">Open camera</span>
              </Button>
            </div>
          </div>

          <a
            className="flex items-center text-primary-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition rounded-md px-4 py-2"
            href="/profile"
          >
            <Button variant="ghost" className="flex-1 text-primary-foreground">
              <User className="w-6 h-6" />
              <span className="sr-only">Profile</span>
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Footer;
