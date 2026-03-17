"use client";

import { useEffect, useState } from "react";
import { useScrollStore } from "@/app/store/useScrollStore";
import Image from "next/image";

const items = [
  { id: "1", img: "/images/showcase/plushie1.png", height: 300 },
  { id: "2", img: "/images/showcase/plushie2.png", height: 300 },
  { id: "3", img: "/images/showcase/plushie3.png", height: 300 },
  { id: "4", img: "/images/showcase/plushie4.png", height: 375 },
  { id: "5", img: "/images/showcase/plushie5.png", height: 375 },
  { id: "6", img: "/images/showcase/plushie6.png", height: 375 },
  { id: "7", img: "/images/showcase/plushie7.png", height: 450 },
  { id: "8", img: "/images/showcase/plushie8.png", height: 300 },
  { id: "9", img: "/images/showcase/plushie9.png", height: 400 },
  { id: "10", img: "/images/showcase/plushie10.png", height: 450 },
];

function ShowcaseSection() {
  const [visibleCount, setVisibleCount] = useState(0);
  const aboutZoomed = useScrollStore((s) => s.aboutZoomed);

  useEffect(() => {
    if (!aboutZoomed) return;
    items.forEach((_, i) => {
      setTimeout(() => setVisibleCount((n) => Math.max(n, i + 1)), i * 150);
    });
  }, [aboutZoomed]);

  if (!aboutZoomed) return null;

  return (
    <div
      className="relative flex flex-col min-h-[calc(100vh - 120px)] items-center justify-center z-20 bg-[#d5bb93] rounded-t-[24px] px-30 pt-20 pb-30"
      style={{
        boxShadow:
          "0 -40px 100px rgba(0,0,0,0.45), 0 -8px 40px rgba(0,0,0,0.3)",
      }}
    >
      <div className="relative">
        <div
          className="absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-20"
          style={{
            backgroundImage: "url('/images/textures/curvy-lines.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "top",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, black 40%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 50%, black 0%, black 40%, transparent 75%)",
          }}
        />
        <div className="relative z-10 columns-2 md:columns-3 lg:columns-4 gap-4">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="break-inside-avoid mb-4 rounded-[12px] overflow-hidden transition-all duration-500"
              style={{
                opacity: i < visibleCount ? 1 : 0,
                transform:
                  i < visibleCount ? "translateY(0)" : "translateY(24px)",
              }}
            >
              <Image
                src={item.img}
                alt=""
                width={600}
                height={item.height}
                className="w-full h-auto block rounded-[12px]"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full flex flex-col items-center justify-center py-[500px] my-20 overflow-hidden">
        <div className="absolute left-0 top-20 z-1 pointer-events-none">
          <Image
            src="/images/koala.png"
            alt="koala"
            width={700}
            height={700}
            className="opacity-2"
          />
        </div>
        {/* plastic texture rotated to landscape */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage:
              "radial-gradient(ellipse 50% 50% at 50% 50%, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 50% 50% at 50% 50%, black 0%, transparent 70%)",
          }}
        >
          <Image
            src="/images/textures/plastic-effect.jpg"
            alt=""
            fill
            className="object-cover opacity-20 mix-blend-screen"
            style={{ transform: "rotate(90deg) " }}
          />
        </div>

        <p className="relative z-10 text-[64px] text-white font-semibold leading-[1] max-w-[750px] text-center tracking-tight">
          A toy to hold dear to your <span className="font-cozy">heart</span>,
          no matter what <span className="font-cozy">age</span>.
        </p>
        <p className="z-10 text-[#716458]/80 text-[18px] font-semibold tracking-tight pt-[16px]">
          - that&apos;s what we have learned from you, our customers -
        </p>
      </div>
    </div>
  );
}

export default ShowcaseSection;
