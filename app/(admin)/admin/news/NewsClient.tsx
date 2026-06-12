"use client";

import { useState } from "react";
import GrainientFade from "@/components/app/GrainientFade";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { addNews, updateNews, deleteNews } from "../actions";

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  image_url: string | null;
  date: string;
  tag: string;
};

const inputClass = "w-full bg-white/10 border border-white/20 rounded-[8px] px-3 py-2 text-[12px] text-white focus:outline-none focus:border-white/40 placeholder:text-white/30";
const labelClass = "text-[11px] font-semibold text-white/60 uppercase tracking-wider";

function NewsForm({ initial, onSubmit, onCancel }: {
  initial?: NewsItem;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (initial) formData.append("existing_image_url", initial.image_url ?? "");
    await onSubmit(formData);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 border border-white/20 rounded-[14px] p-5 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Title</label>
          <input name="title" defaultValue={initial?.title} required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Slug</label>
          <input name="slug" defaultValue={initial?.slug} required className={inputClass} placeholder="e.g. new-fox-pattern" />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Tag</label>
          <input name="tag" defaultValue={initial?.tag} required className={inputClass} placeholder="New Pattern" />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Date</label>
          <input name="date" type="date" defaultValue={initial?.date} required className={inputClass} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Summary</label>
        <textarea name="summary" defaultValue={initial?.summary} required rows={2} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Body</label>
        <textarea name="body" defaultValue={initial?.body} required rows={6} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Image</label>
        {initial?.image_url && <p className="text-[11px] text-white/40 mb-1">Current: {initial.image_url}</p>}
        <input name="image" type="file" accept="image/*" className="text-[12px] text-white/70 file:mr-3 file:px-3 file:py-1.5 file:rounded-[6px] file:bg-white/15 file:text-white file:text-[11px] file:border-0 file:cursor-pointer" />
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={loading} className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-white text-deep text-[12px] font-semibold hover:bg-white/90 disabled:opacity-50 cursor-pointer">
          <Check size={13} />{loading ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-white/15 text-white text-[12px] font-semibold hover:bg-white/25 cursor-pointer">
          <X size={13} />Cancel
        </button>
      </div>
    </form>
  );
}

export default function NewsClient({ items }: { items: NewsItem[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <div className="relative h-full w-full">
      <GrainientFade color1="#417c9c" color2="#716458" color3="#591427" timeSpeed={0.2} warpStrength={0.8} warpFrequency={4} warpSpeed={1.5} warpAmplitude={40} blendAngle={30} blendSoftness={0.1} rotationAmount={300} noiseScale={2} grainAmount={0.08} grainScale={2} contrast={1.2} saturation={0.9} zoom={0.9} />
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[24px] font-bold text-white">News</h1>
            <button onClick={() => { setAdding(true); setEditingId(null); }} className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-white text-deep text-[13px] font-semibold hover:bg-white/90 cursor-pointer">
              <Plus size={14} /> Add News
            </button>
          </div>

          {adding && (
            <NewsForm
              onSubmit={async (fd) => { await addNews(fd); setAdding(false); }}
              onCancel={() => setAdding(false)}
            />
          )}

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id}>
                {editingId === item.id ? (
                  <NewsForm
                    initial={item}
                    onSubmit={async (fd) => { await updateNews(item.id, fd); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="bg-white/10 border border-white/20 rounded-[14px] p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">{item.tag}</span>
                        <span className="text-[11px] text-white/40">{item.date}</span>
                      </div>
                      <p className="text-[14px] font-semibold text-white truncate">{item.title}</p>
                      <p className="text-[12px] text-white/50 truncate">{item.summary}</p>
                    </div>
                    <div className="flex gap-2 shrink-0 items-center">
                      <button onClick={() => setEditingId(item.id)} className="p-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white cursor-pointer"><Pencil size={13} /></button>
                      {deletingId === item.id ? (
                        <div className="flex gap-1 items-center">
                          <span className="text-[11px] text-white/60">Sure?</span>
                          <button onClick={async () => { await deleteNews(item.id); setDeletingId(null); }} className="px-2 py-1 rounded-[6px] bg-red-500/80 text-white text-[11px] font-semibold cursor-pointer">Yes</button>
                          <button onClick={() => setDeletingId(null)} className="px-2 py-1 rounded-[6px] bg-white/15 text-white text-[11px] cursor-pointer">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(item.id)} className="p-2 rounded-[8px] bg-white/10 hover:bg-red-500/30 text-white cursor-pointer"><Trash2 size={13} /></button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
