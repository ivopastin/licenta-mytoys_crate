"use client";

import { useState } from "react";
import GrainientFade from "@/components/app/GrainientFade";
import { Trash2, Pencil, Plus, X, Check } from "lucide-react";
import {
  addPlushieTemplate, updatePlushieTemplate, deletePlushieTemplate,
  addAccessoryTemplate, updateAccessoryTemplate, deleteAccessoryTemplate,
} from "../actions";

type PlushieTemplate = {
  id: string;
  animal: string;
  skill_level: string;
  finished_size_small: string;
  finished_size_medium: string;
  finished_size_large: string;
  accent_colors: unknown;
  parts: unknown;
  assembly: unknown;
};

type AccessoryTemplate = {
  id: string;
  name: string;
  parts: unknown;
  assembly: unknown;
};

function JsonError({ text }: { text: string }) {
  try { JSON.parse(text); return null; } catch { return <p className="text-red-400 text-[11px] mt-0.5">Invalid JSON</p>; }
}

const inputClass = "w-full bg-white/10 border border-white/20 rounded-[8px] px-3 py-2 text-[12px] text-white focus:outline-none focus:border-white/40";
const labelClass = "text-[11px] font-semibold text-white/60 uppercase tracking-wider";
const btnPrimary = "flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-white text-deep text-[12px] font-semibold hover:bg-white/90 disabled:opacity-50 cursor-pointer";
const btnSecondary = "flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-white/15 text-white text-[12px] font-semibold hover:bg-white/25 cursor-pointer";

function PlushieForm({ initial, onSubmit, onCancel }: {
  initial?: PlushieTemplate;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    animal: initial?.animal ?? "",
    skill_level: initial?.skill_level ?? "beginner",
    finished_size_small: initial?.finished_size_small ?? "",
    finished_size_medium: initial?.finished_size_medium ?? "",
    finished_size_large: initial?.finished_size_large ?? "",
    accent_colors: initial ? JSON.stringify(initial.accent_colors, null, 2) : "[]",
    parts: initial ? JSON.stringify(initial.parts, null, 2) : "[]",
    assembly: initial ? JSON.stringify(initial.assembly, null, 2) : "[]",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      JSON.parse(form.accent_colors);
      JSON.parse(form.parts);
      JSON.parse(form.assembly);
    } catch {
      setError("Fix JSON errors before saving");
      setLoading(false);
      return;
    }
    await onSubmit(form);
    setLoading(false);
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="bg-white/10 border border-white/20 rounded-[14px] p-5 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Animal</label>
          <input value={form.animal} onChange={set("animal")} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Skill Level</label>
          <select value={form.skill_level} onChange={set("skill_level")} className={inputClass}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        {(["finished_size_small", "finished_size_medium", "finished_size_large"] as const).map((k) => (
          <div key={k} className="flex flex-col gap-1">
            <label className={labelClass}>{k.replace("finished_size_", "Size ").replace(/^\w/, c => c.toUpperCase())}</label>
            <input value={form[k]} onChange={set(k)} className={inputClass} />
          </div>
        ))}
      </div>
      {(["accent_colors", "parts", "assembly"] as const).map((k) => (
        <div key={k} className="flex flex-col gap-1">
          <label className={labelClass}>{k.replace("_", " ")} (JSON)</label>
          <textarea value={form[k]} onChange={set(k)} rows={5} className={`${inputClass} font-mono resize-y`} />
          <JsonError text={form[k]} />
        </div>
      ))}
      {error && <p className="text-red-400 text-[12px]">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={handleSubmit} disabled={loading} className={btnPrimary}><Check size={13} />{loading ? "Saving…" : "Save"}</button>
        <button onClick={onCancel} className={btnSecondary}><X size={13} />Cancel</button>
      </div>
    </div>
  );
}

function AccessoryForm({ initial, onSubmit, onCancel }: {
  initial?: AccessoryTemplate;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    parts: initial ? JSON.stringify(initial.parts, null, 2) : "[]",
    assembly: initial ? JSON.stringify(initial.assembly, null, 2) : "[]",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try { JSON.parse(form.parts); JSON.parse(form.assembly); } catch {
      setError("Fix JSON errors before saving"); setLoading(false); return;
    }
    await onSubmit(form);
    setLoading(false);
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="bg-white/10 border border-white/20 rounded-[14px] p-5 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Name (slug)</label>
        <input value={form.name} onChange={set("name")} className={inputClass} />
      </div>
      {(["parts", "assembly"] as const).map((k) => (
        <div key={k} className="flex flex-col gap-1">
          <label className={labelClass}>{k} (JSON)</label>
          <textarea value={form[k]} onChange={set(k)} rows={5} className={`${inputClass} font-mono resize-y`} />
          <JsonError text={form[k]} />
        </div>
      ))}
      {error && <p className="text-red-400 text-[12px]">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={handleSubmit} disabled={loading} className={btnPrimary}><Check size={13} />{loading ? "Saving…" : "Save"}</button>
        <button onClick={onCancel} className={btnSecondary}><X size={13} />Cancel</button>
      </div>
    </div>
  );
}

function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="flex gap-1 items-center">
      <span className="text-[11px] text-white/60">Sure?</span>
      <button onClick={onConfirm} className="px-2 py-1 rounded-[6px] bg-red-500/80 text-white text-[11px] font-semibold cursor-pointer">Yes</button>
      <button onClick={onCancel} className="px-2 py-1 rounded-[6px] bg-white/15 text-white text-[11px] cursor-pointer">No</button>
    </div>
  );
}

export default function TemplatesClient({ plushieTemplates, accessoryTemplates }: {
  plushieTemplates: PlushieTemplate[];
  accessoryTemplates: AccessoryTemplate[];
}) {
  const [tab, setTab] = useState<"plushie" | "accessory">("plushie");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <div className="relative h-full w-full">
      <GrainientFade color1="#417c9c" color2="#716458" color3="#591427" timeSpeed={0.2} warpStrength={0.8} warpFrequency={4} warpSpeed={1.5} warpAmplitude={40} blendAngle={30} blendSoftness={0.1} rotationAmount={300} noiseScale={2} grainAmount={0.08} grainScale={2} contrast={1.2} saturation={0.9} zoom={0.9} />
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[24px] font-bold text-white">Templates</h1>
            <button onClick={() => { setAdding(true); setEditingId(null); }} className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-white text-deep text-[13px] font-semibold hover:bg-white/90 cursor-pointer">
              <Plus size={14} /> Add New
            </button>
          </div>

          <div className="flex gap-2">
            {(["plushie", "accessory"] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setAdding(false); setEditingId(null); }}
                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors cursor-pointer ${tab === t ? "bg-white text-deep" : "bg-white/15 text-white/70 hover:bg-white/25"}`}>
                {t === "plushie" ? "Plushie" : "Accessory"}
              </button>
            ))}
          </div>

          {adding && tab === "plushie" && (
            <PlushieForm onSubmit={async (d) => { await addPlushieTemplate(d as Parameters<typeof addPlushieTemplate>[0]); setAdding(false); }} onCancel={() => setAdding(false)} />
          )}
          {adding && tab === "accessory" && (
            <AccessoryForm onSubmit={async (d) => { await addAccessoryTemplate(d as Parameters<typeof addAccessoryTemplate>[0]); setAdding(false); }} onCancel={() => setAdding(false)} />
          )}

          <div className="flex flex-col gap-3">
            {tab === "plushie" && plushieTemplates.map((t) => (
              <div key={t.id}>
                {editingId === t.id ? (
                  <PlushieForm initial={t} onSubmit={async (d) => { await updatePlushieTemplate(t.id, d as Parameters<typeof updatePlushieTemplate>[1]); setEditingId(null); }} onCancel={() => setEditingId(null)} />
                ) : (
                  <div className="bg-white/10 border border-white/20 rounded-[14px] p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-semibold text-white capitalize">{t.animal}</p>
                      <p className="text-[12px] text-white/50">{t.skill_level} · S:{t.finished_size_small} M:{t.finished_size_medium} L:{t.finished_size_large}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => setEditingId(t.id)} className="p-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white cursor-pointer"><Pencil size={13} /></button>
                      {deletingId === t.id
                        ? <DeleteConfirm onConfirm={async () => { await deletePlushieTemplate(t.id); setDeletingId(null); }} onCancel={() => setDeletingId(null)} />
                        : <button onClick={() => setDeletingId(t.id)} className="p-2 rounded-[8px] bg-white/10 hover:bg-red-500/30 text-white cursor-pointer"><Trash2 size={13} /></button>}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {tab === "accessory" && accessoryTemplates.map((t) => (
              <div key={t.id}>
                {editingId === t.id ? (
                  <AccessoryForm initial={t} onSubmit={async (d) => { await updateAccessoryTemplate(t.id, d as Parameters<typeof updateAccessoryTemplate>[1]); setEditingId(null); }} onCancel={() => setEditingId(null)} />
                ) : (
                  <div className="bg-white/10 border border-white/20 rounded-[14px] p-4 flex items-center justify-between">
                    <p className="text-[14px] font-semibold text-white capitalize">{t.name}</p>
                    <div className="flex gap-2 items-center">
                      <button onClick={() => setEditingId(t.id)} className="p-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white cursor-pointer"><Pencil size={13} /></button>
                      {deletingId === t.id
                        ? <DeleteConfirm onConfirm={async () => { await deleteAccessoryTemplate(t.id); setDeletingId(null); }} onCancel={() => setDeletingId(null)} />
                        : <button onClick={() => setDeletingId(t.id)} className="p-2 rounded-[8px] bg-white/10 hover:bg-red-500/30 text-white cursor-pointer"><Trash2 size={13} /></button>}
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
