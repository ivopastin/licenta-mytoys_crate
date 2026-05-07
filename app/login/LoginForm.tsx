"use client";

import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";

type Mode = "login" | "register";

export default function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");

  const isLogin = mode === "login";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-bold text-[#1a1a1a] leading-tight">
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-[15px] text-[#716458] font-medium">
          {isLogin ? "Good to see you again." : "Let's get you started."}
        </p>
      </div>

      {/* Fields */}
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold text-[#716458]">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full border border-[#e0d9d5] rounded-[12px] px-4 py-3 text-[15px] text-[#1a1a1a] outline-none focus:border-[#417c9c] transition-colors"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#716458]">
              Password
            </label>
            {isLogin && (
              <button
                type="button"
                className="text-[12px] text-[#417c9c] font-medium hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            )}
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="w-full border border-[#e0d9d5] rounded-[12px] px-4 py-3 text-[15px] text-[#1a1a1a] outline-none focus:border-[#417c9c] transition-colors"
          />
        </div>

        {/* Confirm Password — register only */}
        {!isLogin && (
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-semibold text-[#716458]">
              Confirm Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full border border-[#e0d9d5] rounded-[12px] px-4 py-3 text-[15px] text-[#1a1a1a] outline-none focus:border-[#417c9c] transition-colors"
            />
          </div>
        )}

        {/* Primary CTA */}
        <button
          type="submit"
          className="w-full bg-[#591427] text-[#fff1b5] rounded-[12px] py-3 text-[15px] font-bold hover:bg-[#7a1c35] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          {isLogin ? "Log in" : "Sign up"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#e0d9d5]" />
        <span className="text-[13px] text-[#716458] font-medium">or</span>
        <div className="flex-1 h-px bg-[#e0d9d5]" />
      </div>

      {/* Google button — visual only */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 border border-[#e0d9d5] rounded-[12px] py-3 bg-white text-[#1a1a1a] text-[15px] font-medium hover:bg-[#f5f5f5] transition-colors cursor-pointer"
      >
        <GoogleIcon style={{ fontSize: 20 }} />
        Continue with Google
      </button>

      {/* Toggle link */}
      <p className="text-center text-[14px] text-[#1a1a1a]/60">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => setMode(isLogin ? "register" : "login")}
          className="text-[#417c9c] font-semibold cursor-pointer hover:underline"
        >
          {isLogin ? "Sign up" : "Log in"}
        </button>
      </p>
    </div>
  );
}
