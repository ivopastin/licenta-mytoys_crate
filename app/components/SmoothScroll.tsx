"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const scroller = document.getElementById("scroll-container");
    if (!scroller) return;

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.firstElementChild as HTMLElement,
      lerp: 0.1,
      smoothWheel: true,
    });

    // Sync Lenis scroll position to GSAP ScrollTrigger
    lenis.on("scroll", () => ScrollTrigger.update());

    // Tell ScrollTrigger how to get/set scroll position on the custom scroller
    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return scroller.scrollTop;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    // Drive Lenis via gsap ticker
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      ScrollTrigger.clearScrollMemory();
    };
  }, []);

  return null;
}