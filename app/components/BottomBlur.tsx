"use client";

import { useEffect, useState } from "react";
import GradualBlur from "@/components/GradualBlur";

export default function BottomBlur() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("contact-us");
    const container = document.getElementById("scroll-container");
    if (!footer || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { root: container, threshold: 0.01 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (hidden) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-50">
      <GradualBlur
        target="parent"
        position="bottom"
        height="7rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
      />
    </div>
  );
}
