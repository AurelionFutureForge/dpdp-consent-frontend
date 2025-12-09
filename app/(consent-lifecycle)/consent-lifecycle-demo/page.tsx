"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInitiateConsent } from "@/services/consent-lifecycle/queries";
import { useGetActivePurposesByFiduciary } from "@/services/df/purpose/hooks";
import { Loader2, CheckCircle2, Languages } from "lucide-react";

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

// Supported languages
const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", libreCode: "en" },
  { code: "hi", label: "हिंदी", libreCode: "hi" },
  { code: "ta", label: "தமிழ்", libreCode: "ta" },
  { code: "te", label: "తెలుగు", libreCode: "te" },
  { code: "kn", label: "ಕನ್ನಡ", libreCode: "kn" },
];

// UI copy translations
const UI_COPY: Record<string, Record<string, string>> = {
  welcome: {
    en: "Welcome to Our Platform",
    hi: "हमारे प्लेटफॉर्म में आपका स्वागत है",
    ta: "எங்கள் தளத்திற்கு வரவேற்கிறோம்",
    te: "మా ప్లాట్‌ఫారమ్‌కు స్వాగతం",
    kn: "ನಮ್ಮ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗೆ ಸ್ವಾಗತ",
  },
  subtitle: {
    en: "Experience seamless data management with privacy-first approach",
    hi: "गोपनीयता-प्रथम दृष्टिकोण के साथ निर्बाध डेटा प्रबंधन का अनुभव करें",
    ta: "தனியுரிமை-முதல் அணுகுமுறையுடன் தடையற்ற தரவு மேலாண்மையை அனுபவிக்கவும்",
    te: "గోప్యత-మొదటి విధానంతో నిరంతర డేటా నిర్వహణను అనుభవించండి",
    kn: "ಗೌಪ್ಯತೆ-ಮೊದಲ ವಿಧಾನದೊಂದಿಗೆ ನಿರಂತರ ಡೇಟಾ ನಿರ್ವಹಣೆಯನ್ನು ಅನುಭವಿಸಿ",
  },
  gettingStarted: {
    en: "Getting Started",
    hi: "शुरुआत करना",
    ta: "தொடங்குதல்",
    te: "ప్రారంభించడం",
    kn: "ಪ್ರಾರಂಭಿಸುವುದು",
  },
  consentMessage: {
    en: "To continue, please review and accept our consent terms. This ensures transparency and compliance with data protection regulations.",
    hi: "जारी रखने के लिए, कृपया हमारी सहमति शर्तों की समीक्षा करें और स्वीकार करें। यह पारदर्शिता और डेटा सुरक्षा नियमों के अनुपालन को सुनिश्चित करता है।",
    ta: "தொடர, தயவுசெய்து எங்கள் சம்மத விதிமுறைகளை மதிப்பாய்வு செய்து ஏற்கவும். இது வெளிப்படைத்தன்மை மற்றும் தரவு பாதுகாப்பு விதிமுறைகளுடன் இணங்குதலை உறுதி செய்கிறது।",
    te: "కొనసాగడానికి, దయచేసి మా సమ్మతి నిబంధనలను సమీక్షించి అంగీకరించండి. ఇది పారదర్శకత మరియు డేటా రక్షణ నిబంధనలకు అనుగుణంగా ఉండేలా నిర్ధారిస్తుంది.",
    kn: "ಮುಂದುವರಿಸಲು, ದಯವಿಟ್ಟು ನಮ್ಮ ಸಮ್ಮತಿ ನಿಬಂಧನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸ್ವೀಕರಿಸಿ. ಇದು ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಡೇಟಾ 보호 ನಿಬಂಧನೆಗಳಿಗೆ ಅನುಗುಣವಾಗಿರುವುದನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.",
  },
  loadingPurposes: {
    en: "Loading purposes...",
    hi: "उद्देश्य लोड हो रहे हैं...",
    ta: "நோக்கங்கள் ஏற்றப்படுகின்றன...",
    te: "ఉద్దేశాలు లోడ్ అవుతున్నాయి...",
    kn: "ಉದ್ದೇಶಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
  },
  initiatingConsent: {
    en: "Initiating consent request...",
    hi: "सहमति अनुरोध शुरू किया जा रहा है...",
    ta: "சம்மத கோரிக்கை தொடங்கப்படுகிறது...",
    te: "సమ్మతి అభ్యర్థన ప్రారంభించబడుతోంది...",
    kn: "ಸಮ್ಮತಿ ವಿನಂತಿಯನ್ನು ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ...",
  },
  preparingForm: {
    en: "Preparing your consent form...",
    hi: "आपका सहमति फॉर्म तैयार किया जा रहा है...",
    ta: "உங்கள் சம்மத படிவம் தயாரிக்கப்படுகிறது...",
    te: "మీ సమ్మతి ఫారమ్ సిద్ధం చేయబడుతోంది...",
    kn: "ನಿಮ್ಮ ಸಮ್ಮತಿ ಫಾರ್ಮ್ ಅನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...",
  },
  foundPurposes: {
    en: "Found {count} purpose(s) to review",
    hi: "समीक्षा के लिए {count} उद्देश्य मिले",
    ta: "மதிப்பாய்வுக்கு {count} நோக்கங்கள் கண்டறியப்பட்டன",
    te: "సమీక్షించడానికి {count} ఉద్దేశాలు కనుగొనబడ్డాయి",
    kn: "ಪರಿಶೀಲಿಸಲು {count} ಉದ್ದೇಶಗಳು ಕಂಡುಬಂದಿವೆ",
  },
  footer: {
    en: "© 2025 Our Platform. All rights reserved.",
    hi: "© 2025 हमारा प्लेटफॉर्म। सभी अधिकार सुरक्षित।",
    ta: "© 2025 எங்கள் தளம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    te: "© 2025 మా ప్లాట్‌ఫారమ్. అన్ని హక్కులు రక్షించబడ్డాయి.",
    kn: "© 2025 ನಮ್ಮ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳು ಕಾಪಾಡಲ್ಪಟ್ಟಿವೆ.",
  },
};

export default function ConsentLifecycleDemoPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [isInitiated, setIsInitiated] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>("en");

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

  // Translation helper
  const t = (key: keyof typeof UI_COPY, params?: { count?: number }): string => {
    let text = UI_COPY[key]?.[selectedLang] || UI_COPY[key]?.en || "";
    if (params?.count !== undefined) {
      text = text.replace("{count}", params.count.toString());
    }
    return text;
  };

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
        {/* Language Selector - Fixed position at top right */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium text-gray-700" htmlFor="language-select">
              Language:
            </label>
            <select
              id="language-select"
              className="border rounded-md px-3 py-1.5 text-sm bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary cursor-pointer"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8">

          {/* Logo/Header */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900">
              {t("welcome")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-lg p-8 shadow-sm border mt-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <p className="text-lg font-medium text-gray-900">
                {t("gettingStarted")}
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              {t("consentMessage")}
            </p>

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {isLoadingPurposes
                    ? t("loadingPurposes")
                    : initiateMutation.isPending
                    ? t("initiatingConsent")
                    : t("preparingForm")}
                </p>
              </div>
            )}

            {/* Ready State */}
            {!isLoading && allPurposeIds.length > 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>{t("foundPurposes", { count: allPurposeIds.length })}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-sm text-gray-500">
            <p>{t("footer")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
