"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { signIn } from "next-auth/react";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

interface OTPFormProps {
  email?: string;
  onEditEmail?: () => void;
}

export const OTPForm: React.FC<OTPFormProps> = ({ email, onEditEmail }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const otp_id = useAuthStore((state) => state.otp_id);
  const clearOtpData = useAuthStore((state) => state.clearOtpData);

  const validateCode = (value: string) => {
    return /^\d{6}$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateCode(code)) {
      setError("Enter the 6-digit code sent to your email");
      return;
    }

    if (!email || !otp_id) {
      setError("Session expired. Please request a new code.");
      return;
    }

    setIsLoading(true);
    try {
      // Use NextAuth signIn with credentials provider
      const result = await signIn("credentials", {
        email,
        otp: code,
        otp_id,
        redirect: false,
      });

      if (result?.error) {
        console.error("❌ [OTP Form] Authentication error:", result.error);
        setError(result.error);
      } else if (result?.ok) {
        // Clear OTP data from store after successful login
        clearOtpData();
        // Redirect to dashboard or home page
        router.push("/dashboard");
      } else {
        console.warn("⚠️ [OTP Form] Unexpected result state:", result);
        setError("Unexpected authentication response. Please try again.");
      }
    } catch (err) {
      console.error("💥 [OTP Form] Exception during authentication:", err);
      const error = err as Error;
      console.error("💥 [OTP Form] Error details:", {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
      });
      setError(error?.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {email && (
        <p className="text-xs text-gray-500">
          Enter the code sent to{" "}
          <button
            type="button"
            onClick={onEditEmail}
            className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-black"
            aria-label="Edit email"
            title="Edit email"
          >
            <span>{email}</span>
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="otp">One-Time Password (OTP)</Label>
        <Input
          id="otp"
          inputMode="numeric"
          pattern="\d*"
          placeholder="000000"
          maxLength={6}
          value={code}
          onChange={(e) => {
            const value = e.target.value.replace(/[^\d]/g, "");
            setCode(value);
            setError("");
          }}
          disabled={isLoading}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>
    </form>
  );
};
