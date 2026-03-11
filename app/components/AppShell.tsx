"use client";

import Grainient from "@/components/Grainient";
import Navbar from "./Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative text-font-primary px-[120px] py-[50px] rounded-[16px] h-[calc(100vh-20px)] overflow-hidden">
      <div className="absolute inset-0 rounded-[16px] overflow-hidden">
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
      <div className="relative z-10 h-full flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
