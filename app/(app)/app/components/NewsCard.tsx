"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  body?: string;
  image: string;
  date: string;
  tag: string;
}

const TAG_COLORS: Record<string, string> = {
  "New Pattern": "bg-white/20 text-white",
  Update: "bg-white/20 text-white",
  "Limited Edition": "bg-white/20 text-white",
};

export default function NewsCard({ item }: { item: NewsItem }) {
  const [open, setOpen] = useState(false);

  const formattedDate = new Date(item.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const bodyParagraphs = item.body?.split("\n\n") ?? [];

  return (
    <>
      <style>{`
        @keyframes news-backdrop-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes news-card-in {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .news-backdrop { animation: news-backdrop-in 0.2s ease-out both; }
        .news-card-dialog { animation: news-card-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      `}</style>

      {/* Grid card */}
      <div
        onClick={() => setOpen(true)}
        className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 overflow-hidden flex flex-col cursor-pointer hover:scale-[1.02] hover:bg-white/15 transition-all duration-200"
      >
        <div className="relative w-full aspect-4/3 bg-white/10">
          <Image src={item.image} alt={item.title} fill className="object-cover" />
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <span
            className={`self-start text-[11px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[item.tag] ?? "bg-white/20 text-white"}`}
          >
            {item.tag}
          </span>
          <p className="text-[14px] font-semibold text-white leading-snug">{item.title}</p>
          <p className="text-[12px] text-white/65 leading-relaxed line-clamp-3 flex-1">
            {item.summary}
          </p>
          <p className="text-[11px] text-white/40 mt-1">{formattedDate}</p>
        </div>
      </div>

      {/* Expanded dialog portal */}
      {open &&
        createPortal(
          <div
            className="news-backdrop fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="news-card-dialog bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] max-w-lg w-full overflow-hidden max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative w-full aspect-video shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto p-6 flex flex-col gap-3">
                <span
                  className={`self-start text-[11px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[item.tag] ?? "bg-white/20 text-white"}`}
                >
                  {item.tag}
                </span>
                <p className="text-[18px] font-bold text-white leading-snug">{item.title}</p>
                <p className="text-[12px] text-white/40">{formattedDate}</p>

                {bodyParagraphs.length > 0 ? (
                  <div className="flex flex-col gap-3 mt-1">
                    {bodyParagraphs.map((para, i) => (
                      <p key={i} className="text-[14px] text-white/75 leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-[14px] text-white/75 leading-relaxed">{item.summary}</p>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
