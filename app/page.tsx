"use client";

import { useState, useEffect } from "react";
import Timeline from "./components/Timeline";

const QUALITIES = [
  { word: "Laugh", reveal: "Like petals opening to sunlight — impossible not to smile back." },
  { word: "Humor", reveal: "You find the funny in everything, like a sunflower always finds the light." },
  { word: "Strength", reveal: "You stand tall in storms, never bending where it matters." },
  { word: "Honesty", reveal: "You say what you mean. No filters, no games. That's rare." },
  { word: "Depth", reveal: "When it matters, you're all in. Depth behind the light." },
  { word: "Wise", reveal: "You follow your own sun. You don't need anyone to point the way." },
  { word: "Moments", reveal: "Small things with you become the ones I remember." },
  {
    word: "",
    reveal:
      "I'll always help you as much as I can. I'll be there whenever you need me — no matter what, no matter how people treat you. I'll always try to treat you the best way possible. This world may not be the way we want it. But what we have is our future in our hands. Let's make it like this sunflower — always turning toward the light, always growing, always ours.",
    isFinal: true,
  },
];

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 4200);
    return () => clearTimeout(t);
  }, []);

  return (
    <main>
      {showIntro && (
        <div className="intro">
          <div className="intro-text">For Sakshii</div>
        </div>
      )}

      <div className="stage">
        <Timeline
          qualities={QUALITIES}
          onLightClick={() => {}}
          allRevealed={false}
        />
      </div>
    </main>
  );
}