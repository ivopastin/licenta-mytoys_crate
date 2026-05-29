"use client";

import Image from "next/image";
import GrainientFade from "@/components/app/GrainientFade";

export default function GrainientBackground() {
  return (
    <>
      <GrainientFade
        color1="#417c9c"
        color2="#716458"
        color3="#2d5f7a"
        timeSpeed={0.15}
        warpStrength={0.6}
        warpFrequency={3}
        warpSpeed={1.2}
        warpAmplitude={30}
        blendAngle={45}
        blendSoftness={0.1}
        rotationAmount={200}
        noiseScale={2}
        grainAmount={0.08}
        grainScale={2}
        contrast={1.2}
        saturation={0.85}
        zoom={0.9}
      />
      <div className="absolute inset-0 pointer-events-none z-1">
        <Image
          src="/images/textures/app/wall.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.12] mix-blend-overlay"
        />
      </div>
    </>
  );
}
