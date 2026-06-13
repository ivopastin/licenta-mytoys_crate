"use client";

import Image from "next/image";
import Link from "next/link";
import Grainient from "@/components/shared/Grainient";
import SplitText from "@/components/shared/SplitText";
import FadeUp from "@/components/shared/FadeUp";

const animals = [
  {
    src: "/images/bear.webp",
    alt: "bear",
    width: 130,
    rotate: "-14deg",
    translateX: "-195px",
  },
  {
    src: "/images/bunny.webp",
    alt: "bunny",
    width: 130,
    rotate: "8deg",
    translateX: "-60px",
  },
  {
    src: "/images/cat.webp",
    alt: "cat",
    width: 130,
    rotate: "-6deg",
    translateX: "60px",
  },
  {
    src: "/images/koala.webp",
    alt: "koala",
    width: 130,
    rotate: "12deg",
    translateX: "195px",
  },
];

export default function Footer() {
  return (
    <div
      id="contact-us"
      className="relative w-full h-[calc(100vh-20px)] flex flex-col"
    >
      {/* top 2/3: colored section with rounded bottom corners */}
      <div className="relative flex-2 overflow-hidden rounded-b-[16px]">
        {/* top fade from pricing */}
        <div
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to bottom, #417c9c, transparent)",
          }}
        />

        {/* grainient background */}
        <div className="absolute inset-0">
          <Grainient
            color1="#417c9c"
            color2="#2d5f7a"
            color3="#5a8fa8"
            timeSpeed={0}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={4}
            warpSpeed={0}
            warpAmplitude={60}
            blendAngle={30}
            blendSoftness={0.08}
            rotationAmount={0}
            noiseScale={2}
            grainAmount={0.12}
            grainScale={2}
            grainAnimated={false}
            contrast={1.3}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>

        {/* yarn texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "url('/images/textures/yarn.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
            mixBlendMode: "multiply",
          }}
        />

        {/* glass texture fading in from the right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 75%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 75%, black 100%)",
          }}
        >
          <Image
            src="/images/textures/glass-effect.jpg"
            alt=""
            fill
            className="object-cover opacity-15 mix-blend-screen"
          />
        </div>

        {/* soft vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 50% 0%, transparent 40%, rgba(0,0,0,0.2) 100%)",
          }}
        />

        {/* content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {/* scattered bubbles */}
          {[
            {
              title: "Design freely",
              body: "Pick any animal, size, and color combination.",
              top: "17%",
              left: "4%",
              rotate: "-6deg",
              width: 220,
            },
            {
              title: "Get your pattern",
              body: "Receive a PDF pattern instantly after checkout.",
              top: "55%",
              left: "2%",
              rotate: "4deg",
              width: 235,
            },
            {
              title: "Make it yours",
              body: "Crochet it yourself or gift it to someone who will.",
              top: "25%",
              right: "3%",
              rotate: "-3deg",
              width: 228,
            },
          ].map((p) => (
            <div
              key={p.title}
              className="absolute flex flex-col gap-1.5 px-9 py-3.5 items-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 hover:brightness-125 cursor-default hover:cursor-pointer"
              style={{
                top: p.top,
                left: p.left,
                right: p.right,
                width: p.width,
                transform: `rotate(${p.rotate})`,
                borderRadius: "50% 50% 50% 50% / 55% 55% 45% 45%",
                background:
                  "radial-gradient(ellipse at 28% 22%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.07) 55%, rgba(255,255,255,0.02) 100%)",
                boxShadow:
                  "inset 0 1.5px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.08), 0 8px 28px rgba(0,0,0,0.12)",
                border: "1px solid rgba(255,255,255,0.28)",
                backdropFilter: "blur(6px)",
              }}
            >
              <p className="text-white font-semibold text-[13px]">{p.title}</p>
              <p className="text-white/60 text-[12px] font-medium leading-snug text-center">
                {p.body}
              </p>
            </div>
          ))}

          {/* center: tagline + cta */}
          <div className="flex flex-col items-center gap-5 text-center max-w-lg">
            <SplitText
              text="Your next plushie is waiting to be made."
              tag="p"
              className="text-[54px] font-bold text-white leading-15 font-cozy h-35"
              splitType="words"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              duration={0.7}
              delay={70}
              ease="power3.out"
              textAlign="center"
              threshold={0.2}
              rootMargin="0px"
            />
            <FadeUp delay={200}>
              <p className="text-white/65 text-[18px] font-medium leading-relaxed">
                Design a custom crochet pattern in minutes — no experience
                needed. Your imagination is the only limit.
              </p>
            </FadeUp>
            <FadeUp delay={350}>
              <Link href="/login">
                <button className="px-8 py-3 rounded-[14px] bg-[var(--color-accent)] text-[var(--color-deep)] text-[16px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 active:scale-95 cursor-pointer">
                  Create your plushie
                </button>
              </Link>
            </FadeUp>
          </div>
        </div>
      </div>

      {/* bottom 1/3: white links bar with animals grouped in the center */}
      <div className="relative flex-1 bg-white overflow-hidden">
        {/* animals grouped in the center, peeking from the bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none">
          {animals.map((a) => (
            <div
              key={a.alt}
              className="absolute opacity-15"
              style={{
                bottom: "-55px",
                transform: `translateX(${a.translateX}) rotate(${a.rotate})`,
              }}
            >
              <Image src={a.src} alt={a.alt} width={a.width} height={a.width} />
            </div>
          ))}
        </div>

        {/* links + logo */}
        <div className="relative z-10 w-full h-full flex flex-row items-center justify-between px-20 gap-8">
          {/* links columns */}
          <div className="flex flex-row gap-16">
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--color-warm)]">
                Product
              </p>
              {[
                { label: "How it works", href: "/#about" },
                { label: "Showcase", href: "/#showcase" },
                { label: "Pricing", href: "/#pricing" },
                { label: "Testimonials", href: "/#testimonials" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[14px] text-[var(--color-ink)]/60 hover:text-[var(--color-deep)] font-medium transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--color-warm)]">
                Get Started
              </p>
              {[
                { label: "Try for free", href: "/login" },
                { label: "Log in", href: "/login" },
                { label: "Go to Studio", href: "/app/studio" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[14px] text-[var(--color-ink)]/60 hover:text-[var(--color-deep)] font-medium transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-bold uppercase tracking-widest text-[var(--color-warm)]">
                Support
              </p>
              {[
                { label: "Contact us", href: "/#contact-us" },
                { label: "Tutorials", href: "/app/tutorials" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[14px] text-[var(--color-ink)]/60 hover:text-[var(--color-deep)] font-medium transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* logo + copyright */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <Image
              src="/images/logos/logo-black.webp"
              alt="MyToys Crate"
              width={120}
              height={40}
              className="object-contain opacity-80"
            />
            <p className="text-[12px] text-[var(--color-ink)]/35 font-medium">
              © 2026 MyToys Crate. All rights reserved.
            </p>
            <p className="text-[11px] text-[var(--color-ink)]/30 font-medium text-right max-w-100 leading-snug">
              The outlines of our mascots were illustrated in Affinity, based on
              references from{" "}
              <a
                href="https://www.meshy.ai/3d-models/Patchwork-Bear-v2-019bade6-17f2-77a5-9f5f-b7fe43b8a8ee"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[var(--color-deep)] transition-colors"
              >
                bear
              </a>
              ,{" "}
              <a
                href="https://sketchfab.com/3d-models/bunny-standing-light-lp-stylized-7dcde200f4f14c9eb3bd807be797a815"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[var(--color-deep)] transition-colors"
              >
                bunny
              </a>
              ,{" "}
              <a
                href="https://pikbest.com/png-images/3d-stuffed-animal-cat-toy-isolated-on-transparent-background_11326234.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[var(--color-deep)] transition-colors"
              >
                cat
              </a>{" "}
              and{" "}
              <a
                href="https://sketchfab.com/3d-models/koalakoalas-march-ac0c08ce03ba4707b6b347a68439be25"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[var(--color-deep)] transition-colors"
              >
                koala
              </a>{" "}
              3D models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
