"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SplitText from "@/components/shared/SplitText";
import FadeUp from "@/components/shared/FadeUp";

const items = [
  {
    id: "1",
    img: "/images/showcase/plushie1.webp",
    height: 300,
    source: "https://www.alwaysfreeamigurumi.com/crochet-bear-amigurumi-free-pattern/",
    credit: "Always Free Amigurumi",
  },
  {
    id: "2",
    img: "/images/showcase/plushie2.webp",
    height: 300,
    source: "https://amigurumicat.com/elya-the-crochet-bunny-amigurumi-free-pattern/",
    credit: "Amigurumi Cat",
  },
  {
    id: "3",
    img: "/images/showcase/plushie3.webp",
    height: 300,
    source: "https://www.cuddlystitchescraft.com/free-crochet-cat-pattern-low-sew-amigurumi-cat/",
    credit: "Cuddly Stitches Craft",
  },
  {
    id: "4",
    img: "/images/showcase/plushie4.webp",
    height: 375,
    source: "https://jesshuff.com/crochet-dog-free-amigurumi-pattern/",
    credit: "Jess Huff",
  },
  {
    id: "5",
    img: "/images/showcase/plushie5.webp",
    height: 375,
    source: "https://kristitullus.com/products/pattern-sheep",
    credit: "Kristi Tullus",
  },
  {
    id: "6",
    img: "/images/showcase/plushie6.webp",
    height: 375,
    source: "https://jesshuff.com/heidi-horse-free-amigurumi-pattern/",
    credit: "Jess Huff",
  },
  {
    id: "7",
    img: "/images/showcase/plushie7.webp",
    height: 450,
    source: "https://jesshuff.com/crochet-jaguar-free-amigurumi-pattern/",
    credit: "Jess Huff",
  },
  {
    id: "8",
    img: "/images/showcase/plushie8.webp",
    height: 300,
    source: "https://www.lovecrafts.com/en-gb/p/happy-duck-amigurumi-crochet-pattern-by-piggiesagogo",
    credit: "Piggiesagogo / LoveCrafts",
  },
  {
    id: "9",
    img: "/images/showcase/plushie9.webp",
    height: 400,
    source: "https://dailydoll.shop/shop/penguin-crochet-pattern-amigurumi-pattern/",
    credit: "Daily Doll",
  },
  {
    id: "10",
    img: "/images/showcase/plushie10.webp",
    height: 450,
    source: "https://www.polushkabunny.com/crochet-mouse-pattern-polushkabunny",
    credit: "Polushka Bunny",
  },
];

function ShowcaseSection() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers = items.map((_, i) =>
      setTimeout(() => setVisibleCount((n) => Math.max(n, i + 1)), i * 150),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center z-20 bg-[#d5bb93] px-30 pt-20 pb-30">
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
              className="group relative break-inside-avoid mb-4 rounded-[12px] overflow-hidden transition-all duration-500"
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
              <a
                href={item.source}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-end justify-center rounded-[12px] bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              >
                <span className="mb-4 flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium text-white">
                  Pattern by {item.credit}
                  <ArrowUpRight className="size-4" />
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full flex flex-col items-center justify-center py-125 my-20 overflow-hidden">
        <div className="absolute left-0 top-20 z-1 pointer-events-none">
          <Image
            src="/images/koala.png"
            alt="koala"
            width={700}
            height={700}
            className="opacity-2"
          />
        </div>
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
            style={{ transform: "rotate(90deg)" }}
          />
        </div>

        <SplitText
          text="A toy to hold dear to your heart, no matter what age."
          tag="p"
          className="relative z-10 text-[64px] text-white font-semibold leading-none max-w-187.5 text-center tracking-tight"
          splitType="words"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          duration={0.9}
          delay={80}
          ease="power3.out"
          textAlign="center"
          threshold={0.2}
          rootMargin="0px"
        />
        <FadeUp delay={500}>
          <p className="z-10 text-[var(--color-warm)]/80 text-[18px] font-semibold tracking-tight pt-4">
            - that&apos;s what we have learned from you, our customers -
          </p>
        </FadeUp>
      </div>
    </div>
  );
}

export default ShowcaseSection;
