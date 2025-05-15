import React, { useEffect, useState } from "react";

const HERO_TEXTS = [
  "HERO",
  "BOOM!",
  "WOW!",
  "CRASH!",
  "BANG!",
  "SWITCH!",
  "SWAP!",
  "EXCHANGE!",
];

const HeroEffect = ({ show }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [heroText, setHeroText] = useState("HERO");

  useEffect(() => {
    if (show) {
      setIsAnimating(true);

      setHeroText(HERO_TEXTS[Math.floor(Math.random() * HERO_TEXTS.length)]);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show && !isAnimating) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none
                     ${show ? "animate-fadeIn" : "animate-fadeOut"}`}
      style={{
        background:
          "radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)",
        transition: "all 0.5s ease-in-out",
      }}
    >
      <div className="absolute inset-0 bg-white opacity-50 animate-flash"></div>
      <div
        className={`text-center ${
          show ? "animate-zoomIn" : "animate-zoomOut"
        } relative z-10`}
        style={{ transition: "all 0.5s ease-in-out" }}
      >
        <h1
          className="text-9xl font-bold text-white"
          style={{
            textShadow:
              "0 0 10px #fff, 0 0 20px #fff, 0 0 30px #e60073, 0 0 40px #e60073, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073",
            fontFamily: "'Press Start 2P', cursive, sans-serif",
          }}
        >
          {heroText}
        </h1>
        <div className="mt-6 flex justify-center">
          <div className="animate-ping absolute h-16 w-16 rounded-full bg-purple-500 opacity-75"></div>
          <div className="animate-pulse h-16 w-16 rounded-full bg-purple-500"></div>
        </div>
        <div className="mt-4">
          <p className="text-white animate-pulse text-xl">
            COLLISION DETECTED!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroEffect;
