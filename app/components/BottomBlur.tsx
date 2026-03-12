"use client";

import GradualBlur from "@/components/GradualBlur";

export default function BottomBlur() {
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
