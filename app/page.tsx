"use client";

import React, { useState, useEffect } from "react";
import { MFATabs } from "@/components/auth/mfa-tabs";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const [mfaStep, setMfaStep] = useState<"email" | "otp">("email");
  const [googleError, setGoogleError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Check for error in query params using window.location
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const error = params.get("error");

      if (error === "AccessDenied") {
      // Fetch the backend error message from our API
      const fetchError = async () => {
        try {
          // Fetch the most recent error (no errorId needed)
          const response = await fetch("/api/auth/error");
          const data = await response.json();

          if (data.success && data.message) {
            setGoogleError(data.message);
          } else {
            // If no specific error found, show generic message
            setGoogleError("Access denied. Please check your email or contact support.");
          }

          // Redirect to clean URL
          router.replace("/");
        } catch (err) {
          console.error("Failed to fetch error:", err);
          setGoogleError("An error occurred during authentication. Please try again.");
          router.replace("/");
        }
      };

      fetchError();
      }
    }
  }, [router]);

  const handleGoogleError = (error: string) => {
    console.error("Google login error:", error);
    setGoogleError(error);
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-12 flex-col items-center justify-between relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200 rounded-full opacity-10 blur-3xl"></div>
        </div>

        {/* Title */}
        <div className="relative z-10 w-full text-center">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            DPDP Consent Management System
          </h1>
        </div>

        {/* SVG Illustration */}
        <div className="relative z-10 flex-1 flex items-center justify-center w-full py-8">
          <div className="w-full max-w-xl h-full flex items-center justify-center">
            <Image
              src="/preference_popup.svg"
              alt="DPDP Consent Management Illustration"
              width={800}
              height={714}
              className="w-full h-auto max-h-full object-contain"
              priority
            />
          </div>
        </div>

        {/* Bottom branding */}
        <div className="relative z-10 w-full text-center">
          <p className="text-sm text-gray-600 font-medium">
            Ministry of Electronics and Information Technology
          </p>
          <p className="text-xs text-gray-500 mt-1">Government of India</p>
        </div>
      </div>

      {/* Right Side - Login Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              DPDP Consent Management
            </h1>
            <p className="text-gray-600">
              Ministry of Electronics and Information Technology, Government of India
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to access your consent management dashboard
              </p>
            </div>

            <div className="space-y-6">
              {/* MFA Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Multi-Factor Authentication
                  </h3>
                  {mfaStep === "email" && (
                    <p className="text-xs text-gray-500 mb-4">
                      Enter your email to receive a verification code
                    </p>
                  )}
                </div>
                <MFATabs onStepChange={setMfaStep} />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* SSO Section */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Single Sign-On (SSO)
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Continue with your organization account
                  </p>
                </div>
                {googleError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{googleError}</p>
                  </div>
                )}
                <GoogleLoginButton
                  onError={handleGoogleError}
                />
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500">
            By continuing, you agree to comply with the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              DPDP Act, 2023
            </a>{" "}
            and our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>

          <p className="text-center text-xs text-gray-400 mt-4">
            Built for the people by{" "}
            <span className="font-medium text-gray-500">
              Aurelion Future Forge Private Limited
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
