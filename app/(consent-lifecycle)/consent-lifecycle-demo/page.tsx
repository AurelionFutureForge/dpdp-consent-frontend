"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInitiateConsent } from "@/services/consent-lifecycle/queries";
import { useGetActivePurposesByFiduciary } from "@/services/df/purpose/hooks";
import { Loader2, CheckCircle2 } from "lucide-react";

// Generate UUID using browser's crypto API
const generateUUID = (): string => {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export default function ConsentLifecycleDemoPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [isInitiated, setIsInitiated] = useState(false);

  // Default values for consent initiation
  const DEFAULT_DATA_FIDUCIARY_ID = "99d8e106-9ed6-4698-8db0-71c0aa91ab24";
  const duration = 365;
  const language = "en";
  const DEFAULT_EMAIL = "venkatesangunaraj@gmail.com";
  const DEFAULT_PHONE = "8925454607";

  // Get redirect URL from environment variable
  const redirectUrl = typeof window !== "undefined"
    ? `${process.env.NEXT_PUBLIC_URL || window.location.origin}/consent-lifecycle-demo`
    : "";

  const initiateMutation = useInitiateConsent();

  // Fetch all active purposes for the data fiduciary
  const { data: activePurposesData, isLoading: isLoadingPurposes } =
    useGetActivePurposesByFiduciary(DEFAULT_DATA_FIDUCIARY_ID);

  // Extract purpose IDs from the active purposes response
  const allPurposeIds = useMemo(() => {
    if (!activePurposesData?.data) {
      return [];
    }
    // The API returns an array of purposes directly
    return activePurposesData.data.map((purpose: { purpose_id: string }) => purpose.purpose_id);
  }, [activePurposesData]);

  const isLoading = isLoadingPurposes || initiateMutation.isPending;

  const handleInitiateConsent = async () => {
    if (!DEFAULT_DATA_FIDUCIARY_ID || allPurposeIds.length === 0 || !userId) {
      return;
    }

    try {
      const result = await initiateMutation.mutateAsync({
        data_fiduciary_id: DEFAULT_DATA_FIDUCIARY_ID,
        user_id: userId,
        purposes: allPurposeIds,
        duration: duration,
        language: language,
        metadata: {},
        redirect_url: redirectUrl,
        email: DEFAULT_EMAIL,
        phone: DEFAULT_PHONE,
      });

      if (result.success && result.data) {
        setIsInitiated(true);
        // Navigate to consent notice page using cms_request_id
        router.push(`/consents/${result.data.cms_request_id}`);
      }
    } catch (error) {
      console.error("Failed to initiate consent:", error);
    }
  };

  // Generate UUID on mount and store in localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("consent_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = generateUUID();
      setUserId(newUserId);
      localStorage.setItem("consent_user_id", newUserId);
    }
  }, []);

  // Auto-initiate consent when user ID is ready and purposes are loaded
  useEffect(() => {
    if (userId && allPurposeIds.length > 0 && !isLoadingPurposes && !isInitiated) {
      handleInitiateConsent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, allPurposeIds.length, isLoadingPurposes, isInitiated]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Header */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900">
              Welcome to Our Platform
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience seamless data management with privacy-first approach
                </p>
              </div>

          {/* CTA Section */}
          <div className="bg-white rounded-lg p-8 shadow-sm border mt-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <p className="text-lg font-medium text-gray-900">
                Getting Started
                  </p>
                </div>
            <p className="text-gray-600 mb-6">
              To continue, please review and accept our consent terms. This ensures
              transparency and compliance with data protection regulations.
            </p>

              {/* Loading State */}
              {isLoading && (
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                  {isLoadingPurposes
                      ? "Loading purposes..."
                      : initiateMutation.isPending
                      ? "Initiating consent request..."
                    : "Preparing your consent form..."}
                  </p>
                </div>
              )}

            {/* Ready State */}
            {!isLoading && allPurposeIds.length > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>Found {allPurposeIds.length} purpose(s) to review</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-sm text-gray-500">
            <p>© 2025 Our Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
