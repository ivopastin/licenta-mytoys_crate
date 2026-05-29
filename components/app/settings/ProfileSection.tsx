"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const AVATAR_COLORS = [
  { name: "Brand blue", hex: "#417c9c" },
  { name: "Deep burgundy", hex: "#8b1a33" },
  { name: "Warm brown", hex: "#716458" },
  { name: "Soft green", hex: "#4a7c59" },
  { name: "Muted purple", hex: "#6b5b8a" },
  { name: "Coral", hex: "#c4614a" },
  { name: "Dusty pink", hex: "#d4829a" },
  { name: "Slate", hex: "#4a5568" },
  { name: "Sand", hex: "#b8956a" },
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

type ExperienceLevel = "beginner" | "intermediate" | "advanced";

function getInitials(name: string): string {
  if (!name.trim()) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

interface ProfileSectionProps {
  userId: string;
  initialDisplayName: string | null;
  initialAvatarColor: string | null;
  initialExperienceLevel: string | null;
}

export default function ProfileSection({
  userId,
  initialDisplayName,
  initialAvatarColor,
  initialExperienceLevel,
}: ProfileSectionProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
  const [avatarColor, setAvatarColor] = useState(initialAvatarColor ?? "#417c9c");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(
    (initialExperienceLevel as ExperienceLevel) ?? null
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  async function handleSave() {
    setError(null);
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim(),
        avatar_color: avatarColor,
        experience_level: experienceLevel,
        onboarding_completed: true,
      })
      .eq("id", userId);

    setLoading(false);

    if (error) {
      setError("Failed to save. Please try again.");
      return;
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[18px] font-bold text-ink">Profile</h2>

      {/* Avatar preview */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200"
          style={{ backgroundColor: avatarColor }}
        >
          <span className="text-white text-[22px] font-bold">
            {getInitials(displayName)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold text-ink">
            {displayName.trim() || "Your name"}
          </span>
          <span className="text-[12px] text-warm">Avatar preview</span>
        </div>
      </div>

      {/* Display name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-warm">Display Name</label>
        <input
          type="text"
          placeholder="How should we call you?"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full border border-border-soft rounded-[12px] px-4 py-3 text-[15px] text-ink outline-none focus:border-brand transition-colors"
        />
      </div>

      {/* Avatar color */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-warm">Avatar Color</label>
        <div className="flex gap-2 flex-wrap">
          {AVATAR_COLORS.map(({ name, hex }) => (
            <button
              key={hex}
              type="button"
              title={name}
              onClick={() => setAvatarColor(hex)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
              style={{ backgroundColor: hex }}
            >
              {avatarColor === hex && (
                <Check size={14} className="text-white" strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Experience level */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-warm">
          Crochet Experience <span className="font-normal text-warm/60">(optional)</span>
        </label>
        <div className="flex gap-2">
          {EXPERIENCE_LEVELS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setExperienceLevel(experienceLevel === value ? null : value)}
              className={`flex-1 py-2 rounded-[10px] text-[13px] font-semibold border transition-colors cursor-pointer ${
                experienceLevel === value
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-warm border-border-soft hover:border-brand hover:text-brand"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {error && <p className="text-[13px] text-red-500 font-medium">{error}</p>}
      {success && <p className="text-[13px] text-green-600 font-medium">Profile updated!</p>}

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="self-start px-6 py-2.5 bg-deep text-(--color-accent) rounded-[12px] text-[14px] font-bold hover:bg-[#7a1c35] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
