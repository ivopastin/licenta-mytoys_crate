"use client";

import { useEffect, useState } from "react";
import { CheckCheck, BookMarked, X } from "lucide-react";

interface PatternReadyToastProps {
  onDismiss: () => void;
}

export default function PatternReadyToast({ onDismiss }: PatternReadyToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation on mount
    const show = requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss after 6s
    const timer = setTimeout(() => handleDismiss(), 6000);
    return () => { cancelAnimationFrame(show); clearTimeout(timer); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDismiss() {
    setVisible(false);
    setTimeout(onDismiss, 350); // wait for exit animation
  }

  return (
    <div
      className="absolute bottom-6 left-1/2 z-50 transition-all duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={{
        transform: visible
          ? "translateX(-50%) translateY(0)"
          : "translateX(-50%) translateY(120%)",
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="relative flex flex-col bg-white rounded-[18px] shadow-2xl overflow-hidden min-w-[320px] max-w-100">
        {/* Content row */}
        <div className="flex items-center gap-4 px-5 py-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-full bg-deep/10 flex items-center justify-center shrink-0">
            <CheckCheck size={18} className="text-deep" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-0.5 flex-1">
            <p className="text-[14px] font-bold text-ink">Your pattern is ready!</p>
            <p className="text-[12px] text-black/40 flex items-center gap-1">
              <BookMarked size={11} />
              Find it in the My Patterns tab
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="text-black/25 hover:text-black/60 transition-colors cursor-pointer shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* Progress bar — inside the card so overflow-hidden clips it cleanly */}
        <div className="h-0.75 w-full bg-black/5">
          <div
            className="h-full bg-deep/40"
            style={{
              width: visible ? "0%" : "100%",
              transition: visible ? "width 6s linear" : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
