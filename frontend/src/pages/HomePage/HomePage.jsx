import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Clock, Lock, Shield, Bot, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/card"

// Assume these imports are correct and the assets are available
import clock from "../../assets/pixel-art-clock.gif"
import onchain from "../../assets/8-bit-on-chain.png"
import nobot from "../../asssets/8-bit-no-bot.png"
import tokengated from "../../assets/8-bit-token-gated.png"
import moderation from "../../assets/8-bit-ai-moderation.webp"
import rightarrow from "../../assets/8-bit-right-arrow.gif"
import pyth from "../../assets/techs/pyth.png"
import dynamic from "../../assets/techs/dynamic.png"
import solidity from "../../assets/techs/solidity.png"
import chainlink from "../../assets/techs/chainlink.png"

const features = [
  { name: "Random Time Event Scheduling", image: clock, icon: Clock },
  { name: "On-Chain Randomness", image: onchain, icon: Lock },
  { name: "User Authentication and Bot Prevention", image: nobot, icon: Shield },
  { name: "Token-Gated Community", image: tokengated, icon: Bot },
  { name: "AI Content Moderation", image: moderation, icon: MessageSquare },
]

const techStack = [
  { name: "Solidity", logo: solidity },
  { name: "Pyth Network", logo: pyth },
  { name: "Dynamic SDK", logo: dynamic },
  { name: "ChainLink Automation", logo: chainlink },
]

export default function HomePage() {
  const [userCount, setUserCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserCount = () => {
      setTimeout(() => {
        const count = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000
        setUserCount(count)
      }, 1000)
    }

    fetchUserCount()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-pixel">
      {/* <div className="absolute inset-0 bg-[url('/path-to-your-background.gif')] opacity-20 z-0"></div> */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl mb-2">DeReal</h1>
          <p className="text-xl">Share spontaneous moments, triggered by smart contracts</p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl mb-4">Ready for spontaneous sharing?</h2>
          <Button
            onClick={() => navigate("/app")}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Go to App
            <img src={rightarrow} alt="right-arrow" className="inline-block ml-2 w-6 h-6" />
          </Button>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
            className="mt-4 text-xl"
          >
            Users De Realed: {userCount.toLocaleString()}
          </motion.div>
        </motion.section>

        <section className="mb-16">
          <h2 className="text-3xl text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-gray-800 border-gray-700 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <img src={feature.image} alt={feature.name} className="w-16 h-16 object-contain" />
                    </div>
                    <h3 className="text-xl mb-2 text-center">{feature.name}</h3>
                    <feature.icon className="w-6 h-6 mx-auto text-primary" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl text-center mb-8">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4 flex flex-col items-center">
                    <img src={tech.logo} alt={tech.name} className="w-16 h-16 object-contain mb-2" />
                    <p className="text-center">{tech.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl text-center mb-4">About Our App</h2>
          <p className="text-center max-w-2xl mx-auto">
            Our decentralized DeReal application revolutionizes social sharing by leveraging blockchain technology.
            Users engage in simultaneous, spontaneous content creation triggered by smart contracts, ensuring
            authenticity and excitement. With features like on-chain randomness, bot prevention, and AI moderation, we
            provide a secure and engaging platform for genuine human interaction.
          </p>
        </motion.section>

        <footer className="text-center text-sm">
          <p>&copy; 2024 DeReal Decentralized App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}