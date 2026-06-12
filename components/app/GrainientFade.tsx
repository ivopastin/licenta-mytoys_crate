"use client";

import { useEffect, useRef, useState } from "react";
import Grainient from "@/components/shared/Grainient";

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

// Border radius of the app-shell panel (Tailwind rounded-[16px]); the clip
// is rounded to match so the gradient hugs the panel's corners.
const SHELL_RADIUS = 16;

export default function GrainientFade(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // The gradient is fixed to the viewport so it never resizes (and never
  // flickers) when the sidebar toggles. To keep it visually confined to the
  // app shell, we clip it to the shell panel's rectangle. The panel animates
  // its width on sidebar toggle, so we re-measure it on every resize tick;
  // updating clip-path is compositor-only and never touches the WebGL canvas.
  useEffect(() => {
    const el = ref.current;
    const shell = document.querySelector<HTMLElement>("[data-app-shell], [data-admin-shell]");
    if (!el || !shell) return;

    const update = () => {
      const r = shell.getBoundingClientRect();
      const top = Math.max(0, r.top);
      const left = Math.max(0, r.left);
      const right = Math.max(0, window.innerWidth - r.right);
      const bottom = Math.max(0, window.innerHeight - r.bottom);
      el.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round ${SHELL_RADIUS}px)`;
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(shell);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-0 transition-opacity duration-700"
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
