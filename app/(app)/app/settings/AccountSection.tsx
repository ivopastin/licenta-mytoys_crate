"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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

export default function AccountSection() {
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const supabase = createClient();
  const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null;

  async function handleEmailChange() {
    setEmailError(null);
    setEmailSuccess(false);
    setEmailLoading(true);

    const { error } = await supabase.auth.updateUser({ email: newEmail });

    setEmailLoading(false);

    if (error) {
      setEmailError(error.message);
      return;
    }

    setEmailSuccess(true);
    setNewEmail("");
  }

  async function handlePasswordChange() {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setPasswordSuccess(true);
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(false), 3000);
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-[18px] font-bold text-ink">Account</h2>

      {/* Change Email */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-semibold text-ink">Change Email</h3>
          <p className="text-[13px] text-warm">
            A confirmation link will be sent to your new email address.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-warm">New Email</label>
          <input
            type="email"
            placeholder="new@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border border-border-soft rounded-[12px] px-4 py-3 text-[15px] text-ink outline-none focus:border-brand transition-colors"
          />
        </div>

        {emailError && <p className="text-[13px] text-red-500 font-medium">{emailError}</p>}
        {emailSuccess && (
          <p className="text-[13px] text-green-600 font-medium">
            A confirmation link has been sent to your new email. Click it to apply the change.
          </p>
        )}

        <button
          type="button"
          onClick={handleEmailChange}
          disabled={!newEmail.trim() || emailLoading}
          className="self-start px-6 py-2.5 bg-deep text-(--color-accent) rounded-[12px] text-[14px] font-bold hover:bg-[#7a1c35] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        >
          {emailLoading ? "Sending…" : "Send confirmation"}
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-soft" />

      {/* Change Password */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-semibold text-ink">Change Password</h3>
          <p className="text-[13px] text-warm">
            Choose a strong password with uppercase, lowercase and digits.
          </p>
        </div>

        {/* New password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-warm">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
          {newPassword && passwordStrength && (
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
                {strengthConfig[passwordStrength].label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-warm">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
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

        {passwordError && <p className="text-[13px] text-red-500 font-medium">{passwordError}</p>}
        {passwordSuccess && <p className="text-[13px] text-green-600 font-medium">Password updated!</p>}

        <button
          type="button"
          onClick={handlePasswordChange}
          disabled={!newPassword.trim() || passwordLoading}
          className="self-start px-6 py-2.5 bg-deep text-(--color-accent) rounded-[12px] text-[14px] font-bold hover:bg-[#7a1c35] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        >
          {passwordLoading ? "Updating…" : "Update password"}
        </button>
      </div>
    </div>
  );
}
