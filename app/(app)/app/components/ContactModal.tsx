"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { sendSupportEmail } from "./actions";

interface ContactModalProps {
  onClose: () => void;
}

export default function ContactModal({ onClose }: ContactModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await sendSupportEmail({ subject, message });
    setLoading(false);
    if (result.success) {
      setSent(true);
    } else {
      setError(result.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[16px] shadow-xl w-full max-w-md mx-4 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[var(--color-deep)]">Contact Support</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--color-border-soft)] transition-colors cursor-pointer"
          >
            <X size={15} className="text-[var(--color-warm)]" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center mb-1">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-[15px] font-bold text-[var(--color-deep)]">Message sent!</p>
            <p className="text-[12px] text-[var(--color-warm)] leading-relaxed max-w-[260px]">
              We received your message and will get back to you at your email address.
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-8 py-2.5 rounded-[10px] bg-[var(--color-brand)] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[var(--color-warm)] uppercase tracking-wide">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What's your question about?"
                className="w-full px-3 py-2.5 rounded-[10px] border border-[var(--color-border-soft)] text-[13px] text-[var(--color-deep)] placeholder:text-[var(--color-warm)]/50 focus:outline-none focus:border-[var(--color-brand)] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-[var(--color-warm)] uppercase tracking-wide">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question…"
                rows={5}
                className="w-full px-3 py-2.5 rounded-[10px] border border-[var(--color-border-soft)] text-[13px] text-[var(--color-deep)] placeholder:text-[var(--color-warm)]/50 focus:outline-none focus:border-[var(--color-brand)] transition-colors resize-none"
              />
            </div>
            {error && <p className="text-[12px] text-red-500 font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading || !subject.trim() || !message.trim()}
              className="w-full py-2.5 rounded-[10px] bg-[var(--color-brand)] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
