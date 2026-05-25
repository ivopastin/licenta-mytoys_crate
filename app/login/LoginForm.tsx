"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

export default function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const router = useRouter();
  const supabase = createClient();
  const isLogin = mode === "login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("Invalid email or password.");
      } else {
        router.push("/app");
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
        router.push("/app");
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

  if (emailSent) {
    return (
      <div className="flex flex-col gap-4 w-full text-center">
        <h1 className="text-[32px] font-bold text-ink leading-tight">
          Check your email
        </h1>
        <p className="text-[15px] text-warm font-medium leading-relaxed">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account and get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-bold text-ink leading-tight">
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-[15px] text-warm font-medium">
          {isLogin ? "Good to see you again." : "Let's get you started."}
        </p>
      </div>

      {/* Fields */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold text-warm">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-border-soft rounded-[12px] px-4 py-3 text-[15px] text-ink outline-none focus:border-brand transition-colors"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-warm">
              Password
            </label>
            {isLogin && (
              <button
                type="button"
                className="text-[12px] text-brand font-medium hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            )}
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-border-soft rounded-[12px] px-4 py-3 text-[15px] text-ink outline-none focus:border-brand transition-colors"
          />
        </div>

        {/* Confirm Password — register only */}
        {!isLogin && (
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-semibold text-warm">
              Confirm Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-border-soft rounded-[12px] px-4 py-3 text-[15px] text-ink outline-none focus:border-brand transition-colors"
            />
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
          {loading ? "Please wait…" : isLogin ? "Log in" : "Sign up"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border-soft" />
        <span className="text-[13px] text-warm font-medium">or</span>
        <div className="flex-1 h-px bg-border-soft" />
      </div>

      {/* Google button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 border border-border-soft rounded-[12px] py-3 bg-white text-ink text-[15px] font-medium hover:bg-[#f5f5f5] transition-colors cursor-pointer"
      >
        <GoogleIcon style={{ fontSize: 20 }} />
        Continue with Google
      </button>

      {/* Toggle link */}
      <p className="text-center text-[14px] text-ink/60">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => {
            setMode(isLogin ? "register" : "login");
            setError(null);
          }}
          className="text-brand font-semibold cursor-pointer hover:underline"
        >
          {isLogin ? "Sign up" : "Log in"}
        </button>
      </p>
    </div>
  );
}
