"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "./actions";
import type { PatternRow } from "./PatternCard";

interface ReviewCardProps {
  patterns: PatternRow[];
  onClose?: () => void;
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

export default function ReviewCard({ patterns, onClose }: ReviewCardProps) {
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
      <div className="w-[400px] bg-white rounded-[20px] p-8 flex flex-col items-center justify-center gap-3 text-center">
        <span className="text-[32px]">🎉</span>
        <p className="text-[16px] font-bold text-ink">Thank you for your review!</p>
        <p className="text-[13px] text-warm">Come back tomorrow to leave another one.</p>
        <button
          onClick={onClose}
          className="mt-2 px-6 py-2 rounded-[10px] bg-deep text-white text-[13px] font-bold hover:bg-black transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="w-[400px] bg-white rounded-[20px] p-6 flex flex-col gap-4 shadow-2xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[15px] font-bold text-ink">Leave a review</p>
          <p className="text-[12px] text-warm mt-0.5">How are you liking MyToys Crate?</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-warm/50 hover:text-ink transition-colors cursor-pointer text-[18px] leading-none">×</button>
        )}
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
              stroke={(hovered || stars) >= s ? "#c9a96e" : "#d1c5bc"}
            />
          </button>
        ))}
      </div>

      {/* Optional pattern picker */}
      {patterns.length > 0 && (
        <select
          value={selectedPattern}
          onChange={(e) => setSelectedPattern(e.target.value)}
          className="w-full bg-black/5 border border-black/10 rounded-[10px] px-3 py-2 text-[12px] text-ink focus:outline-none focus:border-black/30 transition-colors"
        >
          <option value="">No specific pattern (optional)</option>
          {patterns.map((p) => (
            <option key={p.id} value={p.id}>
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
        className="w-full bg-black/5 border border-black/10 rounded-[10px] px-3 py-2 text-[12px] text-ink placeholder:text-black/30 focus:outline-none focus:border-black/30 transition-colors resize-none"
      />

      {error && <p className="text-[11px] text-red-500">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={stars === 0 || description.trim().length < 5 || loading}
        className="w-full py-2 rounded-[10px] bg-deep text-white text-[13px] font-bold hover:bg-black transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </div>
  );
}
