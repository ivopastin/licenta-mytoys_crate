"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [pastHero, setPastHero] = useState(false);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // The scroll container is the overflow-y-auto div wrapping the content
    const container = document.querySelector<HTMLElement>(
      ".fixed.inset-2\\.5 > div.overflow-y-auto",
    );
    if (!container) return;
    scrollContainerRef.current = container;

    const onScroll = () => {
      // Hero is ~100vh tall, trigger when scrolled past ~80% of it
      setPastHero(container.scrollTop > container.clientHeight * 0.8);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full flex flex-row items-center px-[120px] py-[50px]">
      <div className="absolute left-[120px]">
        <Image
          src="/images/logos/logo-font-principal.png"
          alt="logo"
          width={64}
          height={64}
        />
      </div>
      <div className="fixed left-1/2 -translate-x-1/2 glass-navbar min-w-[200px] h-[64px] rounded-full flex flex-row px-[36px] gap-[40px] py-[6px] items-center">
        {["About", "Showcase", "Testimonials", "Pricing", "Contact Us"].map(
          (label) => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[18px] text-white font-semibold hover:text-white/80 transition-colors"
            >
              {label}
            </a>
          ),
        )}
      </div>
      <div className="ml-auto flex flex-row items-center gap-3">
        <div
          className="transition-all duration-900 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            maxWidth: pastHero ? "160px" : "0px",
            opacity: pastHero ? 1 : 0,
          }}
        >
          <Button className="whitespace-nowrap px-6 py-2.5 h-auto bg-[#fff1b5]/90 text-[#716458] text-[18px] font-bold rounded-[16px] hover:bg-[#fff1b5] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-95">
            Try now
          </Button>
        </div>
        <Button className="px-6 py-2.5 h-auto bg-transparent border border-font-primary text-white text-[18px] font-bold rounded-[16px] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-95">
          Login
        </Button>
      </div>
    </div>
  );
}
