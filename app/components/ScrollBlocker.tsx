"use client";

import { useEffect } from "react";
import { useScrollStore } from "@/app/store/useScrollStore";

export default function ScrollBlocker() {
  const scrollLocked = useScrollStore((s) => s.scrollLocked);

  useEffect(() => {
    console.log("[ScrollBlocker] scrollLocked:", scrollLocked);
    if (!scrollLocked) return;

    const heroHeight = window.innerHeight;

    // Snap back on any scroll attempt past hero
    const onScroll = () => {
      if (window.scrollY > heroHeight) {
        window.scrollTo({ top: heroHeight, behavior: "instant" });
      }
    };

    // Also block wheel and touch directly
    const prevent = (e: Event) => {
      if (window.scrollY >= heroHeight) e.preventDefault();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
    };
  }, [scrollLocked]);

  return null;
}