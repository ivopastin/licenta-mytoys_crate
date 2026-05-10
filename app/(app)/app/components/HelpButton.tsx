"use client";

import { useRef, useState, useEffect } from "react";
import { HelpCircle, BookOpen, Mail, Keyboard, Sparkles } from "lucide-react";

const HELP_ITEMS = [
  { label: "Documentation", icon: BookOpen, href: "#" },
  { label: "Contact Support", icon: Mail, href: "#" },
  { label: "Keyboard Shortcuts", icon: Keyboard, href: "#" },
  { label: "What's New", icon: Sparkles, href: "#" },
];

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="absolute bottom-5 right-5 z-30 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-white rounded-[12px] border border-[var(--color-border-soft)] shadow-lg py-1 w-48 mb-1">
          {HELP_ITEMS.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[var(--color-warm)] hover:bg-[var(--color-brand)]/10 hover:text-[var(--color-brand)] transition-colors"
              onClick={() => setOpen(false)}
            >
              <Icon size={15} />
              <span>{label}</span>
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border border-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Help and support"
      >
        <HelpCircle size={18} />
      </button>
    </div>
  );
}
