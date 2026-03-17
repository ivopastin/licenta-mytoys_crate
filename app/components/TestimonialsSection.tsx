"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Grainient from "@/components/Grainient";
import ReviewCard from "./testimonials/ReviewCard";

function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 420;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(index);
  };

  const scrollTo = (i: number) => {
    scrollRef.current?.scrollTo({ left: i * 420, behavior: "smooth" });
    setActiveIndex(i);
  };

  const reviews = [
    {
      id: 1,
      name: "Rebecca A.",
      image: "/images/clients/client1.png",
      review:
        "I designed my very first plushie — a little fox — and the PDF pattern was so clear and beginner-friendly. I finished it in a weekend and honestly cried a little when it was done. Never thought I could make something this cute from scratch!",
      rating: 5,
    },
    {
      id: 2,
      name: "Sophie M.",
      image: "/images/clients/client2.png",
      review:
        "As someone who crochets regularly, I was blown away by how detailed the generated patterns are. The color customization is spot on and the stitch counts are accurate. I've already made three plushies and gifted them all. Absolutely love this app!",
      rating: 5,
    },
    {
      id: 3,
      name: "Daniel K.",
      image: "/images/clients/client3.png",
      review:
        "My wife got me into crocheting and this app made it so easy to design something personal. I made a little bear for our anniversary and she loved it. The PDF was straightforward even for a beginner like me. Highly recommend it!",
      rating: 5,
    },
    {
      id: 4,
      name: "Laura & Mia T.",
      image: "/images/clients/client4.png",
      review:
        "My daughter and I spent an afternoon designing her dream bunny together — she chose every color and the ears herself! The pattern arrived instantly and we crocheted it together over the week. She sleeps with it every night now.",
      rating: 5,
    },
    {
      id: 5,
      name: "James & Leo P.",
      image: "/images/clients/client5.png",
      review:
        "My son wanted a dinosaur plushie, so we designed one together on the app. I had never crocheted before but the PDF pattern walked me through every step. Two weeks later, Leo had his dino. Best dad project I've ever done.",
      rating: 5,
    },
  ];

  return (
    <div className="relative h-[calc(100vh-20px)] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <Grainient
          color1="#591427"
          color2="#76a0b3"
          color3="#716458"
          timeSpeed={0}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={0}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={0}
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
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 100%)",
        }}
      >
        <Image
          src="/images/textures/colorful-lights.jpg"
          alt=""
          fill
          className="object-cover opacity-30 mix-blend-screen"
        />
      </div>
      <div
        className="absolute top-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, transparent, #591427)",
        }}
      />
      <div className="absolute right-0 -top-20 z-[1] pointer-events-none">
        <Image
          src="/images/cat.png"
          alt="cat"
          width={800}
          height={800}
          className="opacity-2"
        />
      </div>
      <div className="relative z-10 h-full w-full flex flex-col justify-center pt-[164px] pb-[60px] px-[120px]">
        <div className="absolute top-[164px] left-[120px]">
          <p className="text-[48px] font-bold text-white">Clients Reviews</p>
        </div>

        <div className="flex flex-row gap-[20px] w-full justify-between">
          <div className="flex flex-col gap-[55px]">
            <div className="flex flex-col gap-[10px] max-w-[300px]">
              <p className="text-[48px] font-bold text-font-primary leading-[50px]">
                85%
              </p>
              <p className="text-[20px] text-semibold leading-[22px] opacity-70">
                Clients return to us again or recommend us to their friends.
              </p>
            </div>

            <div className="flex flex-col gap-[10px] max-w-[300px]">
              <p className="text-[48px] font-bold text-font-primary leading-[50px]">
                +2.2k
              </p>
              <p className="text-[20px] text-semibold leading-[22px] opacity-70">
                Crochet patterns downloaded and brought to life around the
                world.
              </p>
            </div>

            <div className="flex flex-col gap-[10px] max-w-[300px]">
              <p className="text-[48px] font-bold text-font-primary leading-[50px]">
                &gt;800
              </p>
              <p className="text-[20px] text-semibold leading-[22px] opacity-70">
                Children who snuggle their dream plushie and love it.
              </p>
            </div>
          </div>
          <div
            className="relative flex-1 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)",
            }}
          >
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex flex-row gap-5 overflow-x-auto scrollbar-hide"
              style={{
                cursor: "ew-resize",
                scrollBehavior: "smooth",
                scrollSnapType: "x mandatory",
                paddingLeft: "calc(50% - 200px)",
                paddingRight: "calc(50% - 200px)",
              }}
            >
              {reviews.map((review, i) => (
                <div
                  key={review.id}
                  className="shrink-0 transition-transform duration-500 ease-out"
                  style={{
                    scrollSnapAlign: "center",
                    transform: i === activeIndex ? "scale(1)" : "scale(0.88)",
                    transformOrigin: "center center",
                  }}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
            {/* dots */}
            <div className="flex justify-center gap-2 mt-4">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? 16 : 8,
                    height: 8,
                    background: i === activeIndex ? "white" : "rgba(255,255,255,0.4)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialsSection;
