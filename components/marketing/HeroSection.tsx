"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Grainient from "@/components/shared/Grainient";
import Magnet from "@/components/shared/Magnet";
import { Button } from "@/components/ui/button";
import SplitText from "@/components/shared/SplitText";
import FadeUp from "@/components/shared/FadeUp";

export default function HeroSection({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div id="hero" className="relative h-[calc(100vh-20px)] min-h-175 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
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
      <div className="absolute right-0 -top-20 z-[1] pointer-events-none">
        <Image
          src="/images/bear.png"
          alt="bear"
          width={800}
          height={800}
          className="opacity-2"
        />
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #417c9c)",
        }}
      />
      <div className="relative z-10 h-full w-full flex flex-col items-end justify-center pt-[164px] pb-[60px] px-[120px]">
        <div className="flex flex-col gap-[20px] max-w-[800px]">
          <SplitText
            text="MyToys Crate — Turn Your Plush Toy Idea into Reality"
            tag="p"
            className="text-[62px] font-semibold leading-[80px] font-cozy h-[180px]"
            splitType="words"
            from={{ opacity: 0, y: 32 }}
            to={{ opacity: 1, y: 0 }}
            duration={0.8}
            delay={60}
            ease="power3.out"
            textAlign="left"
            threshold={0.1}
            rootMargin="0px"
          />
          <FadeUp delay={400}>
            <p className="text-[24px] font-medium leading-[36px]">
              The only platform you need to design custom plushies and get the
              crochet pattern to make them yourself.
            </p>
          </FadeUp>
          <div className="w-full flex flex-row justify-end">
            <Link href="/login">
              <Button className="w-fit px-6 py-2.5 h-auto bg-[var(--color-accent)]/90 text-[var(--color-warm)] text-[18px] font-bold rounded-[16px] hover:bg-[var(--color-accent)] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-95">
                Try now
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-40 -left-10 opacity-60 transition-opacity duration-400 hover:opacity-90"
        style={{ perspective: "800px", perspectiveOrigin: "50% 50%" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            transform:
              "scale(1.55) rotateX(18deg) rotateY(12deg) rotateZ(2deg)",
            transformOrigin: "bottom left",
            position: "relative",
            display: "inline-block",
            padding: "16px 24px",
            transition: "filter 0.4s ease",
            filter: hovered
              ? "drop-shadow(0 0 24px rgba(180,220,255,0.5)) drop-shadow(0 0 8px rgba(255,255,255,0.3))"
              : "drop-shadow(0 0 0px rgba(180,220,255,0))",
          }}
        >
          {/* square grid background */}
          <div
            style={{
              position: "absolute",
              inset: "-40px -60px",
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
              transition: "opacity 0.4s ease",
              opacity: hovered ? 1.5 : 1,
              pointerEvents: "none",
            }}
          />
          <Magnet padding={80} magnetStrength={4}>
            <p
              className="text-[20px] font-semibold"
              style={{
                position: "relative",
                color: "rgba(255,255,255,0.75)",
                textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))",
              }}
            >
              Using US 7 (4.5mm) crochet hook and yarn A: <br /> (1st round) 6sc
              into a MR, sl st to first sc. 6sts <br />
              (2nd round) 2sc in each st around. 12sts <br />
              (3rd round) [1 sc, inc] around. 18sts <br />
              (4th round) 1 sc, inc, [2 sc, inc] 5 times, 1 sc. 24sts
              <br />
            </p>
          </Magnet>
        </div>
      </div>
    </div>
  );
}
