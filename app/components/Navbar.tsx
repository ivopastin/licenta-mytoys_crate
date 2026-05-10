"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import GlassSurface from "@/components/GlassSurface";
import { motion, AnimatePresence } from "motion/react";

const LINKS = ["About", "Showcase", "Testimonials", "Pricing", "Contact Us"];

function scrollToSection(id: string) {
  const container = document.getElementById("scroll-container");
  const target = document.getElementById(id);
  if (!container || !target) return;
  const offset = target.offsetTop;
  container.scrollTo({ top: offset, behavior: "smooth" });
}

export default function Navbar() {
  const [pastHero, setPastHero] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [underline, setUnderline] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.querySelector<HTMLElement>(
      ".fixed.inset-2\\.5 > div.overflow-y-auto",
    );
    if (!container) return;
    scrollContainerRef.current = container;

    const onScroll = () => {
      setPastHero(container.scrollTop > container.clientHeight * 0.8);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!hoveredLink) return;
    const el = linkRefs.current[hoveredLink];
    if (!el) return;
    setUnderline({ left: el.offsetLeft, width: el.offsetWidth });
  }, [hoveredLink]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full flex flex-row items-center px-[120px] py-[50px]">
      <button
        className="absolute left-[120px] cursor-pointer"
        onClick={() => scrollToSection("hero")}
      >
        <Image
          src="/images/logos/logo-font-principal.png"
          alt="logo"
          width={64}
          height={64}
        />
      </button>
      <GlassSurface
        borderRadius={999}
        width="auto"
        height={64}
        distortionScale={-40}
        redOffset={0}
        greenOffset={3}
        blueOffset={6}
        displace={1.5}
        blur={18}
        mixBlendMode="normal"
        className="fixed left-1/2 -translate-x-1/2"
      >
        <div
          className="relative flex flex-row items-center gap-10 px-9 h-full"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {LINKS.map((label) => {
            const id = label.toLowerCase().replace(/\s+/g, "-");
            return (
              <motion.a
                key={label}
                ref={(el) => {
                  linkRefs.current[label] = el;
                }}
                href={`#${id}`}
                className="text-[18px] text-white font-semibold"
                onHoverStart={() => setHoveredLink(label)}
                animate={{
                  opacity: hoveredLink && hoveredLink !== label ? 0.5 : 1,
                }}
                transition={{ duration: 0.15 }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(id);
                }}
              >
                {label}
              </motion.a>
            );
          })}

          <AnimatePresence>
            {hoveredLink && underline && (
              <motion.span
                className="absolute bottom-3 h-[2px] rounded-full bg-white pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  left: underline.left,
                  width: underline.width,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "spring",
                  bounce: 0.2,
                  visualDuration: 0.25,
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </GlassSurface>
      <div className="ml-auto flex flex-row items-center gap-3">
        <div
          className="transition-all duration-900 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            maxWidth: pastHero ? "160px" : "0px",
            opacity: pastHero ? 1 : 0,
          }}
        >
          <Button className="whitespace-nowrap px-6 py-2.5 h-auto bg-[var(--color-accent)] text-[var(--color-warm)] text-[18px] font-bold rounded-[16px] hover:bg-[var(--color-accent)] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-95">
            Try now
          </Button>
        </div>
        <Link href="/login">
          <Button className="px-6 py-2.5 h-auto bg-transparent border border-font-primary bg-white/30 backdrop-blur-sm text-white text-[18px] font-bold rounded-[16px] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-95">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
