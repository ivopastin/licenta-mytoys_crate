"use client";

import { useState } from "react";
import GrainientFade from "@/components/app/GrainientFade";
import { Star, Trash2 } from "lucide-react";
import { deleteReview } from "../actions";

type Review = {
  id: string;
  user_name: string;
  stars: number;
  description: string;
  pattern_label: string | null;
  created_at: string;
};

function StarRow({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={11} fill={s <= stars ? "#c9a96e" : "none"} stroke={s <= stars ? "#c9a96e" : "rgba(255,255,255,0.25)"} />
      ))}
    </div>
  );
}

export default function ReviewsClient({ reviews }: { reviews: Review[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <div className="relative h-full w-full">
      <GrainientFade color1="#417c9c" color2="#716458" color3="#591427" timeSpeed={0.2} warpStrength={0.8} warpFrequency={4} warpSpeed={1.5} warpAmplitude={40} blendAngle={30} blendSoftness={0.1} rotationAmount={300} noiseScale={2} grainAmount={0.08} grainScale={2} contrast={1.2} saturation={0.9} zoom={0.9} />
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10 flex flex-col gap-6">
          <h1 className="text-[24px] font-bold text-white">
            Reviews <span className="text-white/40 font-normal text-[18px]">({reviews.length})</span>
          </h1>

          <div className="bg-white/10 border border-white/20 rounded-[16px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["User", "Stars", "Description", "Pattern", "Date", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-white/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-[12px] font-semibold text-white">{r.user_name}</td>
                    <td className="px-4 py-3"><StarRow stars={r.stars} /></td>
                    <td className="px-4 py-3 text-[12px] text-white/70 max-w-[220px]">
                      <span title={r.description}>{r.description.length > 80 ? r.description.slice(0, 80) + "…" : r.description}</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-white/50">{r.pattern_label ?? "—"}</td>
                    <td className="px-4 py-3 text-[11px] text-white/40 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3">
                      {deletingId === r.id ? (
                        <div className="flex gap-1 items-center">
                          <button onClick={async () => { await deleteReview(r.id); setDeletingId(null); }} className="px-2 py-1 rounded-[6px] bg-red-500/80 text-white text-[11px] font-semibold cursor-pointer">Delete</button>
                          <button onClick={() => setDeletingId(null)} className="px-2 py-1 rounded-[6px] bg-white/15 text-white text-[11px] cursor-pointer">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(r.id)} className="p-1.5 rounded-[6px] text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-[13px] text-white/40">No reviews yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
