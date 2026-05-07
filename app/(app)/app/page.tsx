"use client";

import Image from "next/image";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import GrainientFade from "./components/GrainientFade";
import newsData from "@/content/news.json";
import tutorialsData from "@/content/tutorials.json";

const TAG_COLORS: Record<string, string> = {
  "New Pattern": "bg-white/20 text-white",
  Update: "bg-white/20 text-white",
  "Limited Edition": "bg-white/20 text-white",
};

export default function AppHomePage() {
  const firstTutorial = tutorialsData[0];

  return (
    <div className="relative h-full w-full">
      {/* Grainient background */}
      <GrainientFade
        color1="#417c9c"
        color2="#716458"
        color3="#591427"
        timeSpeed={0.2}
        warpStrength={0.8}
        warpFrequency={4}
        warpSpeed={1.5}
        warpAmplitude={40}
        blendAngle={30}
        blendSoftness={0.1}
        rotationAmount={300}
        noiseScale={2}
        grainAmount={0.08}
        grainScale={2}
        contrast={1.2}
        saturation={0.9}
        zoom={0.9}
      />

      {/* Texture overlay */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <Image
          src="/images/textures/app/smooth-flow.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.08] mix-blend-overlay"
        />
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-10">
          {/* Welcome header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold text-white leading-tight">
                Welcome back!
              </h1>
              <p className="text-[15px] text-white/70 mt-1">
                Ready to bring a new plushie to life?
              </p>
            </div>
            <Link
              href="/app/studio"
              className="shrink-0 px-6 py-2.5 rounded-[14px] bg-[#fff1b5] text-[#591427] text-[14px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-white hover:scale-105 active:scale-95"
            >
              Go to Studio
            </Link>
          </div>

          {/* News section */}
          <section>
            <h2 className="text-[16px] font-bold text-white mb-4">
              What&apos;s New
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {newsData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-4/3 bg-white/10">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Content */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <span
                      className={`self-start text-[11px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[item.tag] ?? "bg-white/20 text-white"}`}
                    >
                      {item.tag}
                    </span>
                    <p className="text-[14px] font-semibold text-white leading-snug">
                      {item.title}
                    </p>
                    <p className="text-[12px] text-white/65 leading-relaxed line-clamp-3 flex-1">
                      {item.summary}
                    </p>
                    <p className="text-[11px] text-white/40 mt-1">
                      {new Date(item.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tutorial reminder */}
          <section>
            <h2 className="text-[16px] font-bold text-white mb-4">
              Learn the Basics
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 p-5 flex items-center gap-5">
              <div className="w-12 h-12 rounded-[14px] bg-white/15 flex items-center justify-center shrink-0">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-white">
                  New to crochet?
                </p>
                <p className="text-[13px] text-white/65 mt-0.5">
                  Start with the tutorials — {tutorialsData.length} technique
                  guides from the magic ring to full assembly.
                </p>
              </div>
              <Link
                href={`/app/tutorials/${firstTutorial.slug}`}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white text-[#417c9c] text-[13px] font-semibold hover:bg-white/90 transition-colors"
              >
                Start Learning
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
