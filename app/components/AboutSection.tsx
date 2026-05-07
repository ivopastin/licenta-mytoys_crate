"use client";

import { useRef, useState, useEffect } from "react";
import { useScrollStore } from "@/app/store/useScrollStore";
import Image from "next/image";
import Grainient from "@/components/Grainient";
import BlurText from "@/components/BlurText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AboutSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const aboutOverlayRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLDivElement>(null);
  const exitOverlayRef = useRef<HTMLDivElement>(null);

  const [ended, setEnded] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const charVisible = useRef(false);

  useEffect(() => {
    // Wait for the browser to finish painting so scrollHeight is correct
    const timeout = setTimeout(() => {
      const container = containerRef.current;
      const sticky = stickyRef.current;
      const videoWrap = videoWrapRef.current;
      const aboutOverlay = aboutOverlayRef.current;
      const char = charRef.current;
      const video = videoRef.current;
      if (
        !container ||
        !sticky ||
        !videoWrap ||
        !aboutOverlay ||
        !char ||
        !video
      )
        return;

      console.log(
        "[ST] init — container height=",
        container.offsetHeight,
        "scrollHeight=",
        document.body.scrollHeight,
      );

      const scroller = document.getElementById("scroll-container");
      if (!scroller) return;

      ScrollTrigger.defaults({ scroller });

      // Force browser to load video so currentTime seeks work
      video.load();

      ScrollTrigger.refresh();

      // ScrollTrigger just for video scrubbing
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "50% bottom",
        scrub: true,
        onUpdate: (self) => {
          if (
            video.duration &&
            !isNaN(video.duration) &&
            video.readyState >= 1
          ) {
            video.currentTime = self.progress * video.duration;
          }
        },
      });

      // Timeline for visual animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const store = useScrollStore.getState();
            if (self.progress >= 0.85 && !store.aboutZoomed) {
              store.setAboutZoomed(true);
              setEnded(true);
            } else if (self.progress < 0.85 && store.aboutZoomed) {
              store.setAboutZoomed(false);
              setEnded(false);
            }
            // Track char visibility for tooltip gating (char fades in 0.78→0.95)
            const isVisible = self.progress >= 0.85;
            charVisible.current = isVisible;
            if (char) char.style.pointerEvents = isVisible ? "auto" : "none";
          },
        },
      });

      tl.to({}, { duration: 0.5 });
      tl.to(videoWrap, { scale: 0.6, duration: 0.35, ease: "none" }, 0.5);
      tl.to(
        [aboutOverlay, char],
        { opacity: 1, duration: 0.17, ease: "none" },
        0.78,
      );

      // Darken about as showcase slides up — opacity only, no filter (perf)
      const exitOverlay = exitOverlayRef.current;
      if (exitOverlay) {
        gsap.fromTo(
          exitOverlay,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              scroller,
              start: "80% top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div id="about" ref={containerRef} className="relative h-[500vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 overflow-hidden h-[calc(100vh-20px)] flex flex-col items-center justify-center"
      >
        {/* Dark overlay that appears as showcase slides up */}
        <div
          ref={exitOverlayRef}
          className="absolute inset-0 z-50 pointer-events-none"
          style={{ opacity: 0, background: "rgba(0,0,0,0.6)" }}
        />
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

        <div
          className="absolute top-0 left-0 right-0 h-48 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to top, transparent, #417c9c)",
          }}
        />

        <div className="absolute right-0 -top-20 z-[1] pointer-events-none">
          <Image
            src="/images/bunny.png"
            alt="bear"
            width={800}
            height={800}
            className="opacity-2"
          />
        </div>

        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 pointer-events-none">
          <Image
            src="/images/textures/burgundy-stripes.jpg"
            alt=""
            fill
            className="object-cover opacity-40 mix-blend-screen"
            style={{
              maskImage:
                "linear-gradient(to top right, black 0%, black 30%, transparent 70%)",
              WebkitMaskImage:
                "linear-gradient(to top right, black 0%, black 30%, transparent 70%)",
            }}
          />
        </div>

        <div className="absolute inset-y-0 right-0 w-3/4 pointer-events-none">
          <Image
            src="/images/textures/vertical-lines.jpg"
            alt=""
            fill
            className="object-cover opacity-10 mix-blend-screen"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 30%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 30%, black 100%)",
            }}
          />
        </div>

        <div
          ref={aboutOverlayRef}
          className="absolute top-[164px] bottom-[60px] left-[120px] right-[120px] flex flex-col items-end justify-between p-[30px]  rounded-[16px]"
          style={{ opacity: 0 }}
        >
          <div className="w-[500px] relative h-[64px] flex flex-row justify-end">
            <p className="text-white text-[64px] font-semibold leading-[60px]">
              About
            </p>
          </div>
          <div className="w-full h-full flex flex-row items-end gap-[40px] pb-[60px]">
            <div className="flex flex-row justify-between w-full">
              <div className="flex flex-row gap-[10px] text-white">
                <p className="text-[32px] font-semibold">1.</p>
                <div className="flex flex-col gap-[10px] max-w-[400px]">
                  <p className="text-[32px] font-semibold">
                    Design your plushie
                  </p>
                  <p className="text-[18px] font-medium leading-[21px] text-white/80">
                    You have a variety of options to choose from, for example
                    size, color, type of animal and many more.
                  </p>
                </div>
              </div>
              <div className="h-[120px] w-[1px] border border-white/50" />
              <div className="flex flex-row gap-[10px] text-white">
                <p className="text-[32px] font-semibold">2.</p>
                <div className="flex flex-col gap-[10px] max-w-[400px]">
                  <p className="text-[32px] font-semibold">
                    Download the pattern
                  </p>
                  <p className="text-[18px] font-medium leading-[21px] text-white/80">
                    Once you have selected your design, you can download the
                    pattern in PDF format.
                  </p>
                </div>
              </div>
              <div className="h-[120px] w-[1px] border border-white/50" />
              <div className="flex flex-row gap-[10px] text-white">
                <p className="text-[32px] font-semibold">3.</p>
                <div className="flex flex-col gap-[10px] max-w-[400px]">
                  <p className="text-[32px] font-semibold">Start crocheting</p>
                  <p className="text-[18px] font-medium leading-[21px] text-white/80">
                    Follow the instructions in the pattern to start crocheting
                    your plushie.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={charRef}
          className="absolute z-11"
          style={{
            opacity: 0,
            pointerEvents: "none",
            height: "220px",
            width: "220px",
            left: "calc(60vw - 120px)",
            top: "40%",
            transform: "translateY(-50%)",
            clipPath: "inset(0 0 0 35.5%)",
          }}
          onMouseEnter={() => {
            if (charVisible.current) setTooltipVisible(true);
          }}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <Image
            src="/images/bear-with-bee.png"
            alt=""
            height={200}
            width={200}
            className="object-contain"
            style={{ transform: "rotate(70deg)", transformOrigin: "center" }}
          />
        </div>
        <div
          className="absolute z-11 pointer-events-none transition-opacity duration-500 bg-white text-black text-xs font-medium text-center px-3 py-1.5 rounded-md max-w-[150px]"
          style={{
            opacity: tooltipVisible ? 1 : 0,
            left: "calc(60vw - 20px)",
            top: "calc(40% - 100px)",
            transform: "translateY(-50%)",
          }}
        >
          Scroll down to meet my friends!
        </div>

        <div className="relative z-10 flex flex-col pt-[194px] pb-[60px] px-[150px] w-full h-full">
          <div
            ref={videoWrapRef}
            className="relative flex flex-col w-full h-full bg-[#716458]/30 border border-white/40 rounded-[16px] overflow-hidden p-[10px]"
            style={{ transformOrigin: "top left" }}
          >
            <video
              ref={videoRef}
              src="/videos/rolling-ball-yarn-scrub.mp4"
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover rounded-[10px]"
            />
            <div
              className="absolute inset-[10px] rounded-[10px] flex items-center justify-center text-center transition-all duration-700 px-[120px]"
              style={{
                background: ended ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0)",
                pointerEvents: ended ? "auto" : "none",
              }}
            >
              {ended && (
                <BlurText
                  text="It's as easy as that!"
                  className="text-font-primary text-[83px] justify-center font-semibold max-w-[500px] leading-[82px]"
                  delay={120}
                  animateBy="words"
                  direction="bottom"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSection;
