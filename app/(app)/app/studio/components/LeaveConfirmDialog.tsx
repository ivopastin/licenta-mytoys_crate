"use client";

import { TriangleAlert } from "lucide-react";

interface LeaveConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LeaveConfirmDialog({ onConfirm, onCancel }: LeaveConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onCancel}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm news-backdrop" />

      {/* Dialog */}
      <div
        className="relative z-10 bg-white rounded-[24px] shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col gap-5 news-card-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-deep/10 flex items-center justify-center">
            <TriangleAlert size={22} className="text-deep" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] font-bold text-ink">Leave the Studio?</h2>
            <p className="text-[14px] text-black/50 leading-relaxed">
              Your pattern isn&apos;t finished yet. If you leave now, your progress will be lost.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onCancel}
            className="w-full px-6 py-3 rounded-[12px] bg-deep text-white text-[14px] font-bold transition-all duration-200 hover:bg-black hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            Keep designing
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-6 py-2.5 rounded-[12px] text-[14px] text-black/40 hover:text-ink transition-colors cursor-pointer"
          >
            Leave anyway
          </button>
        </div>
      </div>
    </div>
  );
}
