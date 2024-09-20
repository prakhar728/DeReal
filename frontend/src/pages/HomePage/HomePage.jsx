import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./HomePage.css";
import clock from "../../assets/pixel-art-clock.gif";
import onchain from "../../assets/8-bit-on-chain.png";
import nobot from "../../assets/8-bit-no-bot.png";
import tokengated from "../../assets/8-bit-token-gated.png";
import moderation from "../../assets/8-bit-ai-moderation.webp";
import rightarrow from "../../assets/8-bit-right-arrow.gif";
import pyth from "../../assets/techs/pyth.png";
import dynamic from "../../assets/techs/dynamic.png";
import solidity from "../../assets/techs/solidity.png";
// import backgroundGif from "./assets/background.gif"; // Import your background GIF

const HomePage = () => {
  const [userCount, setUserCount] = useState(0);
  const navigate = useNavigate();

  const features = [
    { name: "Random Time Event Scheduling", image: clock },
    { name: "On-Chain Randomness", image: onchain },
    { name: "User Authentication and Bot Prevention", image: nobot },
    { name: "Token-Gated Community", image: tokengated },
    { name: "AI Content Moderation", image: moderation },
  ];
  const techStack = [
    { name: "Solidity", logo: solidity },
    { name: "Pyth Network", logo: pyth },
    { name: "Dynamic SDK", logo: dynamic },
  ];

  useEffect(() => {
    const fetchUserCount = () => {
      setTimeout(() => {
        const count = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
        setUserCount(count);
      }, 1000);
    };

    fetchUserCount();
  }, []);

  return (
    <div className="home-page">
      <div className="background-gif"></div>
      <div className="content">
        <section className="section landing">
          <header className="header">
            <h1>DeReal</h1>
            <p>Share spontaneous moments, triggered by smart contracts</p>
          </header>
          <div className="cta-section">
            <h2>Ready for spontaneous sharing?</h2>
            <button className="cta-button" onClick={(e) => navigate('/app')}>
              Go to App
              <img src={rightarrow} alt="right-arrow" className="right-arrow" />
            </button>
            <div className="user-count">
              Users Berealed: {userCount.toLocaleString()}
            </div>
          </div>
        </section>
        <section className="section features">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="features-grid-inner">
              {features.concat(features).map((feature, index) => (
                <div key={index} className="card image-card">
                  <img src={feature.image} alt={feature.name} />
                  <p>{feature.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section tech-stack">
          <h2>Technology Stack</h2>
          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div key={index} className="card tech-card">
                <img src={tech.logo} alt={tech.name} />
                <p>{tech.name}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="section about">
          <h2>About Our App</h2>
          <p>
            Our decentralized BeReal-like application revolutionizes social
            sharing by leveraging blockchain technology. Users engage in
            simultaneous, spontaneous content creation triggered by smart
            contracts, ensuring authenticity and excitement. With features like
            on-chain randomness, bot prevention, and AI moderation, we provide a
            secure and engaging platform for genuine human interaction.
          </p>
        </section>
        <footer>
          <p>&copy; 2024 BeReal-like Decentralized App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;