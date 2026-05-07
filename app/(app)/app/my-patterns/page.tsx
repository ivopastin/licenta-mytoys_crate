"use client";

import Image from "next/image";
import GrainientFade from "../components/GrainientFade";

export default function MyPatternsPage() {
  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Grainient background */}
      <GrainientFade
        color1="#417c9c"
        color2="#2d5f7a"
        color3="#5a8fa8"
        timeSpeed={0.15}
        warpStrength={0.7}
        warpFrequency={3}
        warpSpeed={1.5}
        warpAmplitude={35}
        blendAngle={60}
        blendSoftness={0.1}
        rotationAmount={250}
        noiseScale={2}
        grainAmount={0.08}
        grainScale={2}
        contrast={1.2}
        saturation={0.85}
        zoom={0.9}
      />

      {/* Texture overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <Image
          src="/images/textures/app/wall.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.12] mix-blend-overlay"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 text-center max-w-[400px] px-8">
        <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2v6h6M9 13h6M9 17h4"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-[26px] font-bold text-white">
          No patterns yet
        </h1>
        <p className="text-[15px] text-white/70 font-medium leading-relaxed">
          Your downloaded patterns will appear here. Head to the Studio to
          design your first plushie.
        </p>
      </div>
    </div>
  );
}
