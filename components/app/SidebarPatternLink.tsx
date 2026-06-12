"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { openPatternPDF } from "@/components/app/studio/PatternPDF";
import type { PatternData } from "@/lib/pattern/types";

interface SidebarPatternLinkProps {
  patternId: string;
  label: string;
}

export default function SidebarPatternLink({ patternId, label }: SidebarPatternLinkProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("patterns")
        .select("pattern_data")
        .eq("id", patternId)
        .single<{ pattern_data: PatternData }>();

      if (data?.pattern_data) {
        await openPatternPDF(data.pattern_data);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-left text-[12px] text-warm hover:text-brand truncate py-1 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait w-full"
    >
      {loading ? "Opening…" : label}
    </button>
  );
}
