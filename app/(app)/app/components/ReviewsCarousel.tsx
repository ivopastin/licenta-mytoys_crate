"use client";

import { Star } from "lucide-react";

export type ReviewItem = {
  id: string;
  user_name: string;
  stars: number;
  description: string;
  pattern_label: string | null;
};

function StarRow({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          fill={s <= stars ? "#c9a96e" : "none"}
          stroke={s <= stars ? "#c9a96e" : "rgba(255,255,255,0.25)"}
        />
      ))}
    </div>
  );
}

export default function ReviewsCarousel({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) return null;

  const items = [...reviews, ...reviews];

  return (
    <div
      className="overflow-hidden w-full"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className="flex gap-4"
        style={{
          animation: `carousel-scroll ${reviews.length * 4}s linear infinite`,
          width: "max-content",
        }}
      >
        {items.map((r, i) => (
          <div
            key={`${r.id}-${i}`}
            className="w-[240px] shrink-0 bg-white/10 backdrop-blur-sm rounded-[14px] border border-white/15 p-4 flex flex-col gap-2"
          >
            <StarRow stars={r.stars} />
            <p className="text-[12px] text-white/85 leading-relaxed line-clamp-3">
              {r.description}
            </p>
            <div className="mt-auto pt-1">
              <p className="text-[11px] font-semibold text-white/70">{r.user_name}</p>
              {r.pattern_label && (
                <p className="text-[10px] text-white/40">{r.pattern_label}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes carousel-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
