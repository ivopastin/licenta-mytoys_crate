"use client";

import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Clock } from "lucide-react";
import GrainientFade from "../components/GrainientFade";
import tutorialsData from "@/content/tutorials.json";

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-white/15 text-white",
  Intermediate: "bg-[#fff1b5]/20 text-[#fff1b5]",
  Advanced: "bg-white/15 text-white",
};

export default function TutorialsPage() {
  return (
    <div className="relative h-full w-full">
      {/* Grainient background */}
      <GrainientFade
        color1="#417c9c"
        color2="#716458"
        color3="#2d5f7a"
        timeSpeed={0.15}
        warpStrength={0.6}
        warpFrequency={3}
        warpSpeed={1.2}
        warpAmplitude={30}
        blendAngle={45}
        blendSoftness={0.1}
        rotationAmount={200}
        noiseScale={2}
        grainAmount={0.08}
        grainScale={2}
        contrast={1.2}
        saturation={0.85}
        zoom={0.9}
      />

      {/* Texture overlay */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <Image
          src="/images/textures/app/wall.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.12] mix-blend-overlay"
        />
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-[12px] bg-white/15 flex items-center justify-center shrink-0">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-[24px] font-bold text-white">Tutorials</h1>
              <p className="text-[14px] text-white/65">
                Learn the crochet techniques behind every pattern
              </p>
            </div>
          </div>

          {/* Tutorial grid */}
          <div className="grid grid-cols-2 gap-4">
            {tutorialsData.map((tutorial) => (
              <Link
                key={tutorial.slug}
                href={`/app/tutorials/${tutorial.slug}`}
                className="group flex flex-col gap-3 bg-white/10 backdrop-blur-sm rounded-[16px] p-5 border border-white/20 hover:bg-white/15 hover:border-white/35 transition-all duration-150"
              >
                {/* Top row: number + difficulty */}
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-[12px] font-bold text-white">
                    {tutorial.order}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[tutorial.difficulty] ?? "bg-white/15 text-white"}`}
                  >
                    {tutorial.difficulty}
                  </span>
                </div>

                {/* Title + description */}
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-[15px] font-semibold text-white group-hover:text-[#fff1b5] transition-colors leading-snug">
                    {tutorial.title}
                  </p>
                  <p className="text-[13px] text-white/60 leading-relaxed line-clamp-2">
                    {tutorial.description}
                  </p>
                </div>

                {/* Read time */}
                <div className="flex items-center gap-1 text-[12px] text-white/45">
                  <Clock size={12} />
                  {tutorial.readTime}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
