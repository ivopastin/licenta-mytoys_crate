"use client";

import Link from "next/link";
import Grainient from "@/components/Grainient";

export default function NotFound() {
  return (
    <div className="relative h-[calc(100vh-20px)] overflow-hidden flex flex-col items-center justify-center gap-6">
      <div className="absolute inset-0">
        <Grainient
          color1="#417c9c"
          color2="#716458"
          color3="#591427"
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 text-center px-8">
        <p className="font-cozy text-[160px] text-white leading-none">404</p>
        <p className="text-[22px] font-semibold text-white leading-snug">
          Oops — this page got lost in the yarn.
        </p>
        <p className="text-[16px] font-medium text-white/65 max-w-[400px] leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-4 px-6 py-3 rounded-[14px] bg-[#fff1b5] text-[#591427] text-[15px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-95"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
