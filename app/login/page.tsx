"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Grainient from "@/components/shared/Grainient";
import LoginForm from "./LoginForm";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  // the proxy.ts is doing the same thing on server - redirecting already logged in users to /app
  // BUT the middleware catches the user before any HTML is sent so they never even see the login
  // the useEffect here is not pointless because client side navigation could bypass middleware in some cases
  //when the page renders client-side withouth a fresh server check
  useEffect(() => {
    const supabase = createClient(); // reads the session from the browser's cookies
    supabase.auth.getSession().then(({ data: { session } }) => {
      // checks if there's an existing session in the cookies
      if (session) router.replace("/app"); // if the user is already logged in
    });
  }, [router]); // runs once in the browser, after the page renders (when the componets mounts)

  return (
    <div className="h-[calc(100vh-20px)] grid grid-cols-2">
      {/* ── Left panel: blue branded area ── */}
      <div className="relative m-2 rounded-[16px] overflow-hidden bg-[var(--color-brand)]">
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
            className="object-cover opacity-15 mix-blend-screen"
          />
        </div>

        {/* Child plushie photo */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/clients/child-plushie.jpg"
            alt=""
            fill
            className="object-cover opacity-20 mix-blend-screen"
          />
        </div>

        {/* Logo + wordmark — top left */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
          <Image
            src="/images/logos/logo-alb-deschis.webp"
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
        {/* Back button */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-10 flex items-center gap-1.5 px-4 py-2 rounded-[12px] border border-[var(--color-border-soft)] bg-white text-[13px] font-semibold text-[var(--color-warm)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Link>
        {/* Animal decorations */}
        <div
          className="absolute top-[-20px] right-[-20px] pointer-events-none opacity-10"
          style={{ transform: "rotate(8deg)" }}
        >
          <Image src="/images/bear.webp" alt="" width={160} height={160} />
        </div>
        <div
          className="absolute bottom-[-20px] left-[-20px] pointer-events-none opacity-10"
          style={{ transform: "rotate(-10deg)" }}
        >
          <Image src="/images/bunny.webp" alt="" width={140} height={140} />
        </div>
        <div
          className="absolute top-[-10px] left-[-10px] pointer-events-none opacity-15"
          style={{ transform: "rotate(-8deg)" }}
        >
          <Image src="/images/cat.webp" alt="" width={120} height={120} />
        </div>
        <div
          className="absolute bottom-[-20px] right-[-20px] pointer-events-none opacity-10"
          style={{ transform: "rotate(12deg)" }}
        >
          <Image src="/images/koala.webp" alt="" width={150} height={150} />
        </div>

        {/* Form */}
        <div className="relative z-10 w-full max-w-[380px] px-4">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
