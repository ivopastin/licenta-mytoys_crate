"use client";

import Image from "next/image";
import Grainient from "@/components/shared/Grainient";
import TestimonialCard from "./TestimonialCard";
import LogoLoop from "@/components/shared/LogoLoop";
import SplitText from "@/components/shared/SplitText";
import FadeUp from "@/components/shared/FadeUp";

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

const logoItems = reviews.map((review) => ({
  node: <TestimonialCard review={review} />,
}));

function TestimonialsSection() {
  return (
    <div id="testimonials" className="relative min-h-screen overflow-hidden">
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
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          maskImage:
            "radial-gradient(ellipse 60% 55% at 50% 38%, black 0%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 55% at 50% 38%, black 0%, transparent 100%)",
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
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #591427)",
        }}
      />
      <div className="absolute right-0 -top-20 z-1 pointer-events-none">
        <Image
          src="/images/cat.png"
          alt="cat"
          width={800}
          height={800}
          className="opacity-2"
        />
      </div>

      <div className="relative z-10 w-full flex flex-col pt-41 pb-15 gap-12.5">
        <SplitText
          text="Clients Reviews"
          tag="p"
          className="text-[48px] font-bold text-white px-30"
          splitType="words"
          from={{ opacity: 0, y: 30 }}
          to={{ opacity: 1, y: 0 }}
          duration={0.7}
          delay={80}
          ease="power3.out"
          textAlign="left"
          threshold={0.2}
          rootMargin="0px"
        />

        <div className="flex flex-col w-full gap-3">
        <div className="flex flex-row items-center w-full gap-16">
          {/* stats pinned to the left with fixed padding */}
          <div className="flex flex-col gap-13.75 shrink-0 pl-30">
            <FadeUp delay={0}>
              <div className="flex flex-col gap-2.5 max-w-75">
                <p className="text-[42px] font-bold text-font-primary leading-12.5">
                  85%
                </p>
                <p className="text-[20px] text-semibold leading-5.5 opacity-70">
                  Clients return to us again or recommend us to their friends.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={120}>
              <div className="flex flex-col gap-2.5 max-w-75">
                <p className="text-[42px] font-bold text-font-primary leading-12.5">
                  +2.2k
                </p>
                <p className="text-[20px] text-semibold leading-5.5 opacity-70">
                  Crochet patterns downloaded and brought to life around the
                  world.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={240}>
              <div className="flex flex-col gap-2.5 max-w-75">
                <p className="text-[42px] font-bold text-font-primary leading-12.5">
                  &gt;800
                </p>
                <p className="text-[20px] text-semibold leading-5.5 opacity-70">
                  Children who snuggle their dream plushie and love it.
                </p>
              </div>
            </FadeUp>
          </div>

          <div
            className="flex-1 min-w-0"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          >
            <LogoLoop
              logos={logoItems}
              speed={60}
              direction="left"
              gap={20}
              pauseOnHover
              ariaLabel="Client reviews"
            />
          </div>
        </div>

          <p className="text-[12px] text-white/40 text-right pr-30">
            Client portraits sourced from{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors hover:text-white/70"
            >
              Unsplash.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestimonialsSection;
