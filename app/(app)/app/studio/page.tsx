"use client";

import Image from "next/image";
import GrainientFade from "../components/GrainientFade";

export default function StudioPage() {
  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Grainient background */}
      <GrainientFade
        color1="#591427"
        color2="#76a0b3"
        color3="#716458"
        timeSpeed={0.2}
        warpStrength={1}
        warpFrequency={5}
        warpSpeed={2}
        warpAmplitude={50}
        blendAngle={0}
        blendSoftness={0.05}
        rotationAmount={400}
        noiseScale={2}
        grainAmount={0.08}
        grainScale={2}
        contrast={1.3}
        saturation={0.9}
        zoom={0.9}
      />

      {/* Texture overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <Image
          src="/images/textures/app/black-sand.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.12] mix-blend-overlay"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-[480px] px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[40px] font-bold text-white leading-tight">
            Let&apos;s start creating.
          </h1>
          <p className="text-[16px] text-white/70 font-medium leading-relaxed">
            Design your custom plushie step by step — pick your animal, size,
            colors, and accessories. Your pattern will be ready in minutes.
          </p>
        </div>
        <button className="px-8 py-3.5 rounded-[14px] bg-[#fff1b5] text-[#591427] text-[16px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-white hover:scale-105 active:scale-95 cursor-pointer">
          Start designing
        </button>
      </div>
    </div>
  );
}
