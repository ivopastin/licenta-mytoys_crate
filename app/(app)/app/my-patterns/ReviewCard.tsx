"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "./actions";
import type { PatternRow } from "./PatternCard";

interface ReviewCardProps {
  patterns: PatternRow[];
}

function patternLabel(p: PatternRow): string {
  if (p.animal && p.pattern_data?.accessoryName) {
    const animal = p.animal.charAt(0).toUpperCase() + p.animal.slice(1);
    return `${animal} + ${p.pattern_data.accessoryName}`;
  }
  if (p.animal) {
    const animal = p.animal.charAt(0).toUpperCase() + p.animal.slice(1);
    const size = p.size ? ` · ${p.size.charAt(0).toUpperCase() + p.size.slice(1)}` : "";
    return `${animal}${size}`;
  }
  return p.pattern_data?.accessoryName ?? "Accessory";
}

export default function ReviewCard({ patterns }: ReviewCardProps) {
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (stars === 0 || description.trim().length < 5) return;
    setLoading(true);
    setError(null);

    const chosen = patterns.find((p) => p.id === selectedPattern);
    const label = chosen ? patternLabel(chosen) : null;

    const result = await submitReview(stars, description.trim(), label);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 p-5 flex flex-col items-center justify-center gap-2 text-center min-h-[180px]">
        <span className="text-[22px]">🎉</span>
        <p className="text-[14px] font-bold text-white">Thank you for your review!</p>
        <p className="text-[12px] text-white/60">Come back tomorrow to leave another one.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 p-5 flex flex-col gap-4">
      <div>
        <p className="text-[13px] font-bold text-white">Leave a review</p>
        <p className="text-[11px] text-white/50 mt-0.5">How are you liking MyToys Crate?</p>
      </div>

      {/* Stars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => setStars(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="cursor-pointer transition-transform hover:scale-110"
          >
            <Star
              size={20}
              fill={(hovered || stars) >= s ? "#c9a96e" : "none"}
              stroke={(hovered || stars) >= s ? "#c9a96e" : "rgba(255,255,255,0.3)"}
            />
          </button>
        ))}
      </div>

      {/* Optional pattern picker */}
      {patterns.length > 0 && (
        <select
          value={selectedPattern}
          onChange={(e) => setSelectedPattern(e.target.value)}
          className="w-full bg-white/10 border border-white/20 rounded-[10px] px-3 py-2 text-[12px] text-white focus:outline-none focus:border-white/40 transition-colors"
        >
          <option value="">No specific pattern (optional)</option>
          {patterns.map((p) => (
            <option key={p.id} value={p.id} className="text-ink bg-white">
              {patternLabel(p)}
            </option>
          ))}
        </select>
      )}

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Share your thoughts…"
        rows={3}
        className="w-full bg-white/10 border border-white/20 rounded-[10px] px-3 py-2 text-[12px] text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-colors resize-none"
      />

      {error && <p className="text-[11px] text-red-300">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={stars === 0 || description.trim().length < 5 || loading}
        className="w-full py-2 rounded-[10px] bg-white text-deep text-[13px] font-bold hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
}
