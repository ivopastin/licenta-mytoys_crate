"use client";

import Image from "next/image";
import Grainient from "@/components/Grainient";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="h-[calc(100vh-20px)] grid grid-cols-2">
      {/* ── Left panel: blue branded area ── */}
      <div className="relative m-2 rounded-[16px] overflow-hidden bg-[#417c9c]">
        {/* Grainient background */}
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

        {/* Waves texture overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/textures/waves.jpg"
            alt=""
            fill
            className="object-cover opacity-20 mix-blend-screen"
          />
        </div>

        {/* Child plushie photo */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/clients/child-plushie.jpg"
            alt=""
            fill
            className="object-cover opacity-15 mix-blend-screen"
          />
        </div>

        {/* Logo + wordmark — top left */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
          <Image
            src="/images/logos/logo-alb-deschis.png"
            alt="MyToys Crate"
            width={48}
            height={48}
            className="object-contain"
          />
          <span className="text-white font-bold text-[18px] leading-tight">
            MyToys Crate
          </span>
        </div>

        {/* Bottom text block */}
        <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col gap-3">
          <p className="font-cozy text-[32px] text-white leading-tight">
            Every stitch starts with a dream.
          </p>
          <p className="text-[16px] text-white/70 font-medium leading-relaxed">
            Join a little world where your plush toy ideas come to life — one
            crochet row at a time.
          </p>
        </div>
      </div>

      {/* ── Right panel: white form area ── */}
      <div className="relative bg-white flex items-center justify-center overflow-hidden">
        {/* Animal decorations */}
        <div
          className="absolute top-[-20px] right-[-20px] pointer-events-none opacity-10"
          style={{ transform: "rotate(8deg)" }}
        >
          <Image src="/images/bear.png" alt="" width={160} height={160} />
        </div>
        <div
          className="absolute bottom-[-20px] left-[-20px] pointer-events-none opacity-10"
          style={{ transform: "rotate(-10deg)" }}
        >
          <Image src="/images/bunny.png" alt="" width={140} height={140} />
        </div>
        <div
          className="absolute top-[-10px] left-[-10px] pointer-events-none opacity-15"
          style={{ transform: "rotate(-8deg)" }}
        >
          <Image src="/images/cat.png" alt="" width={120} height={120} />
        </div>
        <div
          className="absolute bottom-[-20px] right-[-20px] pointer-events-none opacity-10"
          style={{ transform: "rotate(12deg)" }}
        >
          <Image src="/images/koala.png" alt="" width={150} height={150} />
        </div>

        {/* Form */}
        <div className="relative z-10 w-full max-w-[380px] px-4">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
