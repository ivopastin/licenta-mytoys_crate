"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import GoogleIcon from "@mui/icons-material/Google";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register" | "forgot";

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

export default function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const router = useRouter();
  const supabase = createClient();
  const isLogin = mode === "login";
  const isForgot = mode === "forgot";
  const isRegister = mode === "register";

  const passwordStrength = isRegister && password ? getPasswordStrength(password) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (isForgot) {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setEmailSent(true);
      }
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Invalid email or password.");
      } else {
        router.replace("/app");
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        router.replace("/app");
      } else {
        setEmailSent(true);
      }
    }

    setLoading(false);
  }

  async function handleGoogleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setEmailSent(false);
    setPassword("");
    setConfirmPassword("");
  }

  // ── Email sent confirmation (register or forgot) ──
  if (emailSent) {
    return (
      <div className="flex flex-col gap-4 w-full text-center">
        <h1 className="text-[32px] font-bold text-ink leading-tight">
          Check your email
        </h1>
        <p className="text-[15px] text-warm font-medium leading-relaxed">
          {isForgot
            ? `We sent a password reset link to `
            : `We sent a confirmation link to `}
          <strong>{email}</strong>.{" "}
          {isForgot ? "Click it to reset your password." : "Click it to activate your account and get started."}
        </p>
        <button
          type="button"
          onClick={() => switchMode("login")}
          className="text-[13px] text-brand font-semibold hover:underline cursor-pointer"
        >
          Back to log in
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-bold text-ink leading-tight">
          {isLogin ? "Welcome back" : isRegister ? "Create an account" : "Reset password"}
        </h1>
        <p className="text-[15px] text-warm font-medium">
          {isLogin ? "Good to see you again." : isRegister ? "Let's get you started." : "We'll send you a reset link."}
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold text-warm">Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border-soft rounded-[12px] px-4 py-3 text-[15px] text-ink outline-none focus:border-brand transition-colors"
          />
        </div>

        {/* Password — hidden on forgot mode */}
        {!isForgot && (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-warm">Password</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-[12px] text-brand font-medium hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
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

            {/* Password strength — register only */}
            {isRegister && password && passwordStrength && (
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
                  {strengthConfig[passwordStrength].label} — use uppercase, lowercase and digits for a strong password
                </span>
              </div>
            )}
          </div>
        )}

        {/* Confirm Password — register only */}
        {isRegister && (
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-semibold text-warm">Confirm Password</label>
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
        )}

        {/* Error message */}
        {error && (
          <p className="text-[13px] text-red-500 font-medium">{error}</p>
        )}

        {/* Primary CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-deep text-(--color-accent) rounded-[12px] py-3 text-[15px] font-bold hover:bg-[#7a1c35] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        >
          {loading ? "Please wait…" : isLogin ? "Log in" : isRegister ? "Sign up" : "Send reset link"}
        </button>
      </form>

      {/* Divider + Google — hidden on forgot mode */}
      {!isForgot && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border-soft" />
            <span className="text-[13px] text-warm font-medium">or</span>
            <div className="flex-1 h-px bg-border-soft" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 border border-border-soft rounded-[12px] py-3 bg-white text-ink text-[15px] font-medium hover:bg-[#f5f5f5] transition-colors cursor-pointer"
          >
            <GoogleIcon style={{ fontSize: 20 }} />
            Continue with Google
          </button>
        </>
      )}

      {/* Toggle link */}
      <p className="text-center text-[14px] text-ink/60">
        {isForgot ? (
          <>
            Remember your password?{" "}
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="text-brand font-semibold cursor-pointer hover:underline"
            >
              Log in
            </button>
          </>
        ) : isLogin ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("register")}
              className="text-brand font-semibold cursor-pointer hover:underline"
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="text-brand font-semibold cursor-pointer hover:underline"
            >
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
