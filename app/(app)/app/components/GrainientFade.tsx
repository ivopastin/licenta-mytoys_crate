"use client";

import { useEffect, useState } from "react";
import Grainient from "@/components/Grainient";

interface Props {
  color1: string;
  color2: string;
  color3: string;
  timeSpeed?: number;
  warpStrength?: number;
  warpFrequency?: number;
  warpSpeed?: number;
  warpAmplitude?: number;
  blendAngle?: number;
  blendSoftness?: number;
  rotationAmount?: number;
  noiseScale?: number;
  grainAmount?: number;
  grainScale?: number;
  contrast?: number;
  saturation?: number;
  zoom?: number;
}

export default function GrainientFade(props: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="absolute inset-0 transition-opacity duration-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <Grainient
        {...props}
        grainAnimated={false}
        gamma={1}
        centerX={0}
        centerY={0}
        colorBalance={0}
      />
    </div>
  );
}
