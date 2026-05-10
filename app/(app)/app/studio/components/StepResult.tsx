import { Download } from "lucide-react";
import { PlushieConfig, COLOR_PALETTE } from "../types";

interface StepResultProps {
  config: PlushieConfig;
  onReset: () => void;
}

function colorName(hex: string | null): string {
  if (!hex) return "—";
  return COLOR_PALETTE.find((c) => c.hex === hex)?.name ?? hex;
}

const SUMMARY_ROWS: { label: string; getValue: (c: PlushieConfig) => string | null }[] = [
  { label: "Mode",            getValue: (c) => c.mode },
  { label: "Animal",          getValue: (c) => c.animal },
  { label: "Size",            getValue: (c) => c.size },
  { label: "Color",           getValue: (c) => colorName(c.color) },
  { label: "Eyes",            getValue: (c) => c.eyes },
  { label: "Name",            getValue: (c) => c.name },
  { label: "Accessory",       getValue: (c) => c.accessory },
  { label: "Accessory Color", getValue: (c) => colorName(c.accessoryColor) },
];

export default function StepResult({ config, onReset }: StepResultProps) {
  return (
    <div className="w-full max-w-lg flex flex-col gap-6">
      <div>
        <h2 className="text-[26px] font-bold text-white">Your pattern is ready!</h2>
        <p className="text-[14px] text-white/60 mt-1">Here&apos;s a summary of your design.</p>
      </div>

      <div className="bg-white/10 border border-white/20 rounded-[16px] overflow-hidden">
        {SUMMARY_ROWS.filter(({ getValue }) => getValue(config) !== null).map(({ label, getValue }) => (
          <div
            key={label}
            className="flex items-center justify-between px-4 py-3 border-b border-white/10 last:border-0"
          >
            <span className="text-[13px] text-white/50">{label}</span>
            <span className="text-[13px] font-semibold text-white capitalize">{getValue(config)}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => alert("PDF download coming soon")}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[12px] bg-[var(--color-accent)] text-[var(--color-deep)] text-[15px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-white hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <Download size={16} />
          Download PDF
        </button>
        <button
          onClick={onReset}
          className="w-full text-[14px] text-white/60 hover:text-white transition-colors py-2 cursor-pointer"
        >
          Design another
        </button>
      </div>
    </div>
  );
}
