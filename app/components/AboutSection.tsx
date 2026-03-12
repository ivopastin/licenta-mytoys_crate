"use client";

import Grainient from "@/components/Grainient";

function AboutSection() {
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Grainient
          color1="#417c9c"
          color2="#417c9c"
          color3="#417c9c"
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1}
          gamma={1}
          saturation={1}
          warpStrength={0.001}
          timeSpeed={0}
          zoom={1}
        />
      </div>
      <div className="relative z-10">
        AboutSection
      </div>
    </div>
  );
}

export default AboutSection;
