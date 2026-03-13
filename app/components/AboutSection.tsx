"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Grainient from "@/components/Grainient";
import BlurText from "@/components/BlurText";

function AboutSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ended, setEnded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    if (!ended) return;
    const timer = setTimeout(() => setZoomed(true), 3000);
    return () => clearTimeout(timer);
  }, [ended]);

  useEffect(() => {
    if (!zoomed) return;
    const cycle = setInterval(() => {
      setTooltipVisible(true);
      setTimeout(() => setTooltipVisible(false), 3000);
    }, 5000);
    return () => clearInterval(cycle);
  }, [zoomed]);

  return (
    <div className="relative overflow-hidden h-[calc(100vh-20px)] flex flex-col items-center justify-center">
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

      <div className="absolute right-0 -top-20 z-[1] pointer-events-none">
        <Image
          src="/images/bunny.png"
          alt="bear"
          width={800}
          height={800}
          className="opacity-2"
        />
      </div>

      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 pointer-events-none">
        <Image
          src="/images/textures/burgundy-stripes.jpg"
          alt=""
          fill
          className="object-cover opacity-40 mix-blend-screen"
          style={{
            maskImage:
              "linear-gradient(to top right, black 0%, black 30%, transparent 70%)",
            WebkitMaskImage:
              "linear-gradient(to top right, black 0%, black 30%, transparent 70%)",
          }}
        />
      </div>

      <div className="absolute inset-y-0 right-0 w-3/4 pointer-events-none">
        <Image
          src="/images/textures/vertical-lines.jpg"
          alt=""
          fill
          className="object-cover opacity-10 mix-blend-screen"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 30%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 30%, black 100%)",
          }}
        />
      </div>

      <div
        className="absolute top-[164px] bottom-[60px] left-[120px] right-[120px] flex flex-col items-end justify-between p-[30px] bg-black/30 rounded-[16px] transition-opacity duration-700"
        style={{ opacity: zoomed ? 1 : 0 }}
      >
        <div className="w-[500px] relative h-[64px] flex flex-row justify-end">
          <p className="text-white text-[64px] font-semibold leading-[60px]">
            About
          </p>
        </div>
        <div className="w-full h-full flex flex-row items-end gap-[40px] pb-[60px]">
          <div className="flex flex-row justify-between w-full">
            <div className="flex flex-row gap-[10px] text-white">
              <p className="text-[32px] font-semibold">1.</p>
              <div className="flex flex-col gap-[10px] max-w-[400px]">
                <p className="text-[32px] font-semibold">Design your plushie</p>
                <p className="text-[18px] font-medium leading-[21px] text-white/80">
                  You have a variety of options to choose from, for example
                  size, color, type of animal and many more.
                </p>
              </div>
            </div>

            <div className="h-[120px] w-[1px] border border-white/50"></div>
            <div className="flex flex-row gap-[10px] text-white">
              <p className="text-[32px] font-semibold">2.</p>
              <div className="flex flex-col gap-[10px] max-w-[400px]">
                <p className="text-[32px] font-semibold">
                  Download the pattern
                </p>
                <p className="text-[18px] font-medium leading-[21px] text-white/80">
                  Once you have selected your design, you can download the
                  pattern in PDF format.
                </p>
              </div>
            </div>
            <div className="h-[120px] w-[1px] border border-white/50"></div>

            <div className="flex flex-row gap-[10px] text-white">
              <p className="text-[32px] font-semibold">3.</p>
              <div className="flex flex-col gap-[10px] max-w-[400px]">
                <p className="text-[32px] font-semibold">Start crocheting</p>
                <p className="text-[18px] font-medium leading-[21px] text-white/80">
                  Follow the instructions in the pattern to start crocheting
                  your plushie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute z-11 transition-opacity duration-700 cursor-pointer"
        style={{
          opacity: zoomed ? 1 : 0,
          pointerEvents: zoomed ? "auto" : "none",
          height: "220px",
          width: "220px",
          left: "calc(60vw - 120px)",
          top: "40%",
          transform: "translateY(-50%)",
          clipPath: "inset(0 0 0 35.5%)",
        }}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
      >
        <Image
          src="/images/bear-with-bee.png"
          alt=""
          height={200}
          width={200}
          className="object-contain"
          style={{ transform: "rotate(70deg)", transformOrigin: "center" }}
        />
      </div>
      <div
        className="absolute z-11 pointer-events-none transition-opacity duration-500 bg-white text-black text-xs font-medium text-center px-3 py-1.5 rounded-md max-w-[150px]"
        style={{
          opacity: tooltipVisible ? 1 : 0,
          left: "calc(60vw - 20px)",
          top: "calc(40% - 100px)",
          transform: "translateY(-50%)",
        }}
      >
        Scroll down to meet my friends!
      </div>

      <div className="relative z-10 flex flex-col pt-[194px] pb-[60px] px-[150px] w-full h-full">
        <div
          className="relative flex flex-col w-full h-full bg-[#716458]/30 border border-white/40 rounded-[16px] overflow-hidden p-[10px] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top-left"
          style={{
            transform: zoomed ? "scale(0.60)" : "scale(1)",
            boxShadow: zoomed
              ? "20px 20px 60px rgba(0,0,0,0.5), 8px 8px 20px rgba(0,0,0,0.3)"
              : "none",
          }}
        >
          <video
            ref={videoRef}
            src="/videos/rolling-ball-yarn.mp4"
            autoPlay
            muted
            playsInline
            onEnded={() => setEnded(true)}
            className="w-full h-full object-cover rounded-[10px]"
          />
          <div
            className="absolute inset-[10px] rounded-[10px] flex items-center justify-transition-all duration-700 px-[120px]"
            style={{
              background: ended ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
              pointerEvents: ended ? "auto" : "none",
            }}
          >
            {ended && (
              <BlurText
                text="It's as easy as that!"
                className="text-font-primary text-[83px] font-semibold text-center max-w-[500px] leading-[82px]"
                delay={120}
                animateBy="words"
                direction="bottom"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
