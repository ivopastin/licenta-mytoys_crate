"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Grainient from "@/components/shared/Grainient";
import { createClient } from "@/lib/supabase/client";

function getPasswordStrength(password: string): "weak" | "medium" | "strong" {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const score = [hasLower, hasUpper, hasDigit].filter(Boolean).length;
  if (password.length < 6) return "weak";
  if (score === 3) return "strong";
  if (score === 2) return "medium";
  return "weak";
}

const strengthConfig = {
  weak: { label: "Weak", color: "bg-red-400", width: "w-1/3" },
  medium: { label: "Medium", color: "bg-yellow-400", width: "w-2/3" },
  strong: { label: "Strong", color: "bg-green-500", width: "w-full" },
};

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const passwordStrength = password ? getPasswordStrength(password) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setDone(true);
      setTimeout(() => router.push("/app"), 2000);
    }
  }

  return (
    <div className="h-[calc(100vh-20px)] grid grid-cols-2">
      {/* Left branded panel */}
      <div className="relative m-2 rounded-[16px] overflow-hidden bg-[var(--color-brand)]">
        <div className="absolute inset-0">
          <Grainient
            color1="#417c9c"
            color2="#417c9c"
            color3="#417c9c"
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1}
            gamma={1}
            saturation={1}
            warpStrength={0.001}
            timeSpeed={0}
            zoom={1}
          />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/textures/waves.jpg"
            alt=""
            fill
            className="object-cover opacity-15 mix-blend-screen"
          />
        </div>
        <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
          <Image
            src="/images/logos/logo-alb-deschis.png"
            alt="MyToys Crate"
            width={48}
            height={48}
            className="object-contain"
          />
          <span className="text-white font-bold text-[18px] leading-tight">
            MyToys Crate
          </span>
        </div>
        <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col gap-3">
          <p className="font-cozy text-[32px] text-white leading-tight">
            Every stitch starts with a dream.
          </p>
          <p className="text-[16px] text-white/70 font-medium leading-relaxed">
            Join a little world where your plush toy ideas come to life — one
            crochet row at a time.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative bg-white flex items-center justify-center overflow-hidden">
        <div
          className="absolute top-[-20px] right-[-20px] pointer-events-none opacity-10"
          style={{ transform: "rotate(8deg)" }}
        >
          <Image src="/images/bear.png" alt="" width={160} height={160} />
        </div>
        <div
          className="absolute bottom-[-20px] left-[-20px] pointer-events-none opacity-10"
          style={{ transform: "rotate(-10deg)" }}
        >
          <Image src="/images/bunny.png" alt="" width={140} height={140} />
        </div>

        <div className="relative z-10 w-full max-w-[380px] px-4">
          {done ? (
            <div className="flex flex-col gap-4 text-center">
              <h1 className="text-[32px] font-bold text-ink leading-tight">
                Password updated!
              </h1>
              <p className="text-[15px] text-warm font-medium">
                Redirecting you to the app…
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-[32px] font-bold text-ink leading-tight">
                  Set new password
                </h1>
                <p className="text-[15px] text-warm font-medium">
                  Choose a strong password for your account.
                </p>
              </div>

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {/* New password */}
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-semibold text-warm">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-border-soft rounded-[12px] px-4 py-3 pr-11 text-[15px] text-ink outline-none focus:border-brand transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-warm hover:text-ink transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {password && passwordStrength && (
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="h-1 w-full bg-border-soft rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${strengthConfig[passwordStrength].color} ${strengthConfig[passwordStrength].width}`}
                        />
                      </div>
                      <span className={`text-[11px] font-semibold ${
                        passwordStrength === "strong" ? "text-green-500" :
                        passwordStrength === "medium" ? "text-yellow-500" : "text-red-400"
                      }`}>
                        {strengthConfig[passwordStrength].label} — use uppercase, lowercase and digits
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-semibold text-warm">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-border-soft rounded-[12px] px-4 py-3 pr-11 text-[15px] text-ink outline-none focus:border-brand transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-warm hover:text-ink transition-colors cursor-pointer"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-[13px] text-red-500 font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-deep text-(--color-accent) rounded-[12px] py-3 text-[15px] font-bold hover:bg-[#7a1c35] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {loading ? "Please wait…" : "Update password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
