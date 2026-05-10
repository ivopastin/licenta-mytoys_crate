import { ChevronLeft } from "lucide-react";

interface WizardShellProps {
  title: string;
  stepLabel: string;
  onBack: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  direction?: "forward" | "backward";
  children: React.ReactNode;
}

export default function WizardShell({
  title,
  stepLabel,
  onBack,
  onNext,
  nextDisabled,
  direction = "forward",
  children,
}: WizardShellProps) {
  const animClass = direction === "backward" ? "wizard-enter-backward" : "wizard-enter-forward";
  return (
    <div className={`w-full max-w-130 bg-white rounded-[24px] p-8 flex flex-col gap-6 shadow-2xl ${animClass}`}>
      {/* Counter + title */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-[22px] font-bold text-ink leading-snug">{title}</h2>
        <span className="text-[12px] text-black/30 shrink-0 mt-1">{stepLabel}</span>
      </div>

      {/* Options */}
      <div>{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[14px] text-black/40 hover:text-black transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="px-6 py-2.5 rounded-[12px] bg-deep text-white text-[14px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-black hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-deep cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
