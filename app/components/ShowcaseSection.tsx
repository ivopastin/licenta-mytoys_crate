"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const items = [
  { id: "1", img: "/images/showcase/plushie1.webp", height: 300 },
  { id: "2", img: "/images/showcase/plushie2.webp", height: 300 },
  { id: "3", img: "/images/showcase/plushie3.webp", height: 300 },
  { id: "4", img: "/images/showcase/plushie4.webp", height: 375 },
  { id: "5", img: "/images/showcase/plushie5.webp", height: 375 },
  { id: "6", img: "/images/showcase/plushie6.webp", height: 375 },
  { id: "7", img: "/images/showcase/plushie7.webp", height: 450 },
  { id: "8", img: "/images/showcase/plushie8.webp", height: 300 },
  { id: "9", img: "/images/showcase/plushie9.webp", height: 400 },
  { id: "10", img: "/images/showcase/plushie10.webp", height: 450 },
];

function ShowcaseSection() {
  const [visibleCount, setVisibleCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = items.map((_, i) =>
      setTimeout(() => setVisibleCount((n) => Math.max(n, i + 1)), i * 150),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const scroller = document.getElementById("scroll-container");
    if (!scroller) return;

    gsap.fromTo(
      card,
      { y: "100vh" },
      {
        y: "0vh",
        ease: "none",
        scrollTrigger: {
          id: "showcase-slide",
          trigger: card,
          scroller,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      },
    );

    return () => {
      ScrollTrigger.getById("showcase-slide")?.kill();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col min-h-[calc(100vh - 120px)] items-center justify-center z-20 bg-[#d5bb93] rounded-t-[24px] px-30 pt-20 pb-30"
      style={{
        willChange: "transform",
      }}
    >
      {/* Shadow simulation — cheaper than boxShadow during transform animation */}
      <div
        className="absolute -top-20 left-0 right-0 h-20 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.45))",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-64 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 0% 100%, #591427 0%, transparent 90%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #591427)",
        }}
      />
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
