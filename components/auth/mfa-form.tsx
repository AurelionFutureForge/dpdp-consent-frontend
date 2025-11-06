"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { loginApi } from "@/services/auth/api";
import { useAuthStore } from "@/store/auth-store";
import { parseApiError } from "@/lib/parse-api-errors";

interface MFAFormProps {
  onSubmit?: (email: string) => void;
  onSuccess?: () => void;
  initialEmail?: string;
}

export const MFAForm: React.FC<MFAFormProps> = ({
  onSubmit,
  onSuccess,
  initialEmail = "",
}) => {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setOtpData = useAuthStore((state) => state.setOtpData);

  React.useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      // Call the login API to send OTP
      const response = await loginApi({
        email: email.trim(),
        type: "MFA",
      });

      if (response.success && response.data) {
        // Store OTP data in Zustand store
        setOtpData(
          response.data.email,
          response.data.otp_id,
          response.data.expires_in
        );

        // Call onSubmit callback if provided
        if (onSubmit) {
          onSubmit(email);
        }

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorMessage =
          typeof response.message === "string"
            ? response.message
            : response.message?.error || "Failed to send OTP";
        setError(errorMessage);
      }
    } catch (err) {
      console.error("MFA login error:", err);
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 text-base font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Continue with Email"}
      </Button>
    </form>
  );
};
