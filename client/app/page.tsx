"use client";

import React, { useEffect, useState } from "react";
import styles from "./HomePage.module.css";
import Image from "next/image";
import Link from "next/link";

const HomePage: React.FC = () => {
  const [userCount, setUserCount] = useState(0);

  const features = [
    { name: "Random Time Event Scheduling", image: "/pixel-art-clock.gif" },
    { name: "On-Chain Randomness", image: "/8-bit-on-chain.png" },
    {
      name: "User Authentication and Bot Prevention",
      image: "/8-bit-no-bot.png",
    },
    { name: "Token-Gated Community", image: "/8-bit-token-gated.png" },
    { name: "AI Content Moderation", image: "/8-bit-ai-moderation.webp" },
  ];

  const techStack = [
    { name: "Solidity", logo: "/solidity.png" },
    { name: "Near Chain", logo: "/near.png" },
    { name: "Aurora Chain", logo: "/aurora.png" },
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
    <div className={styles.homePage}>
      <div className={styles.container}>
        <section className={styles.landing}>
          <div className={styles.header}>
            <h1 className={styles.headerTitle}>DeReal</h1>
            <p className={styles.headerSubtitle}>
              Share spontaneous moments, triggered by smart contracts
            </p>
          </div>
          <h2 className={styles.sectionTitle}>
            Ready for spontaneous sharing?
          </h2>
          <button className={styles.ctaButton}>
            <Link href="/home" className="flex items-center">
              Go to App
              <Image
                src="/8-bit-right-arrow.gif"
                alt="right-arrow"
                width={24}
                height={24}
                className={styles.rightArrow}
              />
            </Link>
          </button>
          <div className={styles.userCount}>
            Users De Realed: {userCount.toLocaleString()}
          </div>
        </section>

        <section className={styles.section}></section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Features</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featuresGridInner}>
              {features.concat(features).map((feature, index) => (
                <div key={index} className={styles.imageCard}>
                  <Image
                    src={feature.image}
                    alt={feature.name}
                    width={128}
                    height={128}
                    quality={100}
                    className={styles.imageCardImage}
                  />
                  <p className={styles.imageCardText}>{feature.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Built using</h2>
          <div className={styles.techGrid}>
            {techStack.map((tech, index) => (
              <div key={index} className={styles.techCard}>
                <Image
                  src={tech.logo}
                  alt={tech.name}
                  width={64}
                  height={64}
                  className={styles.techCardImage}
                  quality={100}
                />
                <p className={styles.techCardText}>{tech.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About Our App</h2>
          <p className={styles.aboutSectionText}>
            Our decentralized DeReal application revolutionizes social sharing
            by leveraging blockchain technology. Users engage in simultaneous,
            spontaneous content creation triggered by smart contracts, ensuring
            authenticity and excitement. With features like on-chain randomness,
            bot prevention, and AI moderation, we provide a secure and engaging
            platform for genuine human interaction.
          </p>
        </section>

        <footer className={styles.footer}>
          <p>&copy; 2024 DeReal Decentralized App. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
