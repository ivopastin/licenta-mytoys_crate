"use client";

import Image from "next/image";

// Same style as the landing page sections: large, very low opacity, positioned off the edges.
const SLOTS = [
  {
    src: "/images/bear.png",
    alt: "bear",
    size: 800,
    top: "-80px",
    right: "-60px",
  },
  {
    src: "/images/bunny.png",
    alt: "bunny",
    size: 800,
    top: "-80px",
    left: "-60px",
  },
  {
    src: "/images/cat.png",
    alt: "cat",
    size: 750,
    bottom: "-60px",
    right: "-60px",
  },
  {
    src: "/images/koala.png",
    alt: "koala",
    size: 750,
    bottom: "-60px",
    left: "-60px",
  },
];

// 32s total. Each slot active for 8s (0–25%), then silent for 24s.
// Slot N is delayed by N×8s so only one appears at a time.
const TOTAL_MS = 32000;
const SLOT_MS = TOTAL_MS / SLOTS.length; // 8000

export default function WizardPlushiesBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
      {SLOTS.map((slot, slotIdx) => (
        <div
          key={slotIdx}
          style={{
            position: "absolute",
            top: "top" in slot ? slot.top : undefined,
            bottom: "bottom" in slot ? slot.bottom : undefined,
            left: "left" in slot ? slot.left : undefined,
            right: "right" in slot ? slot.right : undefined,
            animation: `plushie-slot ${TOTAL_MS}ms linear ${slotIdx * SLOT_MS}ms infinite backwards`,
          }}
        >
          <Image
            src={slot.src}
            alt={slot.alt}
            width={slot.size}
            height={slot.size}
            className=""
          />
        </div>
      ))}
    </div>
  );
}
