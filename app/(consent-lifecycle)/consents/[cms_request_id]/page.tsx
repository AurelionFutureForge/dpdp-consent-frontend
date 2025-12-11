"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetConsentNotice, useSubmitConsent } from "@/services/consent-lifecycle/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Info, ArrowRight, Languages, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  dpdpaTitle: {
    en: "Digital Personal Data Protection Act, 2023",
    hi: "डिजिटल व्यक्तिगत डेटा सुरक्षा अधिनियम, 2023",
    ta: "டிஜிட்டல் தனிப்பட்ட தரவு பாதுகாப்பு சட்டம், 2023",
    te: "డిజిటల్ వ్యక్తిగత డేటా రక్షణ చట్టం, 2023",
    kn: "ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ 보호 ಕಾಯಿದೆ, 2023",
  },
  consentNotice: {
    en: "Consent Notice",
    hi: "सहमति सूचना",
    ta: "சம்மத அறிவிப்பு",
    te: "సమ్మతి నోటీసు",
    kn: "ಸಮ್ಮತಿ ಸೂಚನೆ",
  },
  manageConsents: {
    en: "Manage My Consents",
    hi: "मेरी सहमतियों का प्रबंधन करें",
    ta: "எனது சம்மதங்களை நிர்வகிக்கவும்",
    te: "నా సమ్మతులను నిర్వహించండి",
    kn: "ನನ್ನ ಸಮ್ಮತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
  },
  consentDuration: {
    en: "Consent Duration: {days} Days",
    hi: "सहमति अवधि: {days} दिन",
    ta: "சம்மத காலம்: {days} நாட்கள்",
    te: "సమ్మతి వ్యవధి: {days} రోజులు",
    kn: "ಸಮ್ಮತಿ ಅವಧಿ: {days} ದಿನಗಳು",
  },
  personalData: {
    en: "Personal Data",
    hi: "व्यक्तिगत डेटा",
    ta: "தனிப்பட்ட தரவு",
    te: "వ్యక్తిగత డేటా",
    kn: "ವೈಯಕ್ತಿಕ ಡೇಟಾ",
  },
  mandatory: {
    en: "Mandatory",
    hi: "अनिवार्य",
    ta: "கட்டாயம்",
    te: "తప్పనిసరి",
    kn: "ಕಡ್ಡಾಯ",
  },
  retentionPolicy: {
    en: "Retention Policy",
    hi: "प्रतिधारण नीति",
    ta: "தக்கவைப்பு கொள்கை",
    te: "రిటెన్షన్ పాలసీ",
    kn: "ರಿಟೆನ್ಷನ್ ನೀತಿ",
  },
  dataRetention: {
    en: "Data will be retained for {days} days.",
    hi: "डेटा {days} दिनों तक रखा जाएगा।",
    ta: "தரவு {days} நாட்கள் வரை வைக்கப்படும்.",
    te: "డేటా {days} రోజులు నిలుపుతారు.",
    kn: "ಡೇಟಾವನ್ನು {days} ದಿನಗಳವರೆಗೆ ಇಡಲಾಗುತ್ತದೆ.",
  },
  agreeText: {
    en: "I agree to the terms and conditions and consent to the selected purposes. I understand that I can withdraw my consent at any time.",
    hi: "मैं नियम और शर्तों से सहमत हूं और चयनित उद्देश्यों के लिए सहमति देता हूं। मैं समझता हूं कि मैं किसी भी समय अपनी सहमति वापस ले सकता हूं।",
    ta: "நான் விதிமுறைகள் மற்றும் நிபந்தனைகளுக்கு ஒப்புக்கொள்கிறேன் மற்றும் தேர்ந்தெடுக்கப்பட்ட நோக்கங்களுக்கு சம்மதிக்கிறேன். எந்த நேரத்திலும் எனது சம்மதத்தை வாபஸ் பெறலாம் என்பதை நான் புரிந்துகொள்கிறேன்.",
    te: "నేను నిబంధనలు మరియు షరతులకు అంగీకరిస్తున్నాను మరియు ఎంచుకున్న ఉద్దేశాలకు సమ్మతి ఇస్తున్నాను. నేను ఎప్పుడైనా నా సమ్మతిని ఉపసంహరించుకోగలనని నేను అర్థం చేసుకున్నాను.",
    kn: "ನಾನು ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳಿಗೆ ಒಪ್ಪುತ್ತೇನೆ ಮತ್ತು ಆಯ್ದ ಉದ್ದೇಶಗಳಿಗೆ ಸಮ್ಮತಿಸುತ್ತೇನೆ. ನಾನು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ನನ್ನ ಸಮ್ಮತಿಯನ್ನು ಹಿಂಪಡೆಯಬಹುದು ಎಂದು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ.",
  },
  submitButton: {
    en: "I Agree & Submit Consent",
    hi: "मैं सहमत हूं और सहमति जमा करता हूं",
    ta: "நான் ஒப்புக்கொள்கிறேன் மற்றும் சம்மதத்தை சமர்ப்பிக்கிறேன்",
    te: "నేను అంగీకరిస్తున్నాను మరియు సమ్మతిని సమర్పిస్తున్నాను",
    kn: "ನಾನು ಒಪ್ಪುತ್ತೇನೆ ಮತ್ತು ಸಮ್ಮತಿಯನ್ನು ಸಲ್ಲಿಸುತ್ತೇನೆ",
  },
  submitting: {
    en: "Submitting...",
    hi: "जमा किया जा रहा है...",
    ta: "சமர்ப்பிக்கப்படுகிறது...",
    te: "సమర్పిస్తున్నారు...",
    kn: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
  },
  selectPurpose: {
    en: "Please select at least one purpose",
    hi: "कृपया कम से कम एक उद्देश्य चुनें",
    ta: "தயவுசெய்து குறைந்தது ஒரு நோக்கத்தைத் தேர்ந்தெடுக்கவும்",
    te: "దయచేసి కనీసం ఒక ఉద్దేశాన్ని ఎంచుకోండి",
    kn: "ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ಒಂದು ಉದ್ದೇಶವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
  },
  thankYou: {
    en: "Thank You!",
    hi: "धन्यवाद!",
    ta: "நன்றி!",
    te: "ధన్యవాదాలు!",
    kn: "ಧನ್ಯವಾದಗಳು!",
  },
  consentSubmitted: {
    en: "Your consent has been successfully submitted.",
    hi: "आपकी सहमति सफलतापूर्वक जमा कर दी गई है।",
    ta: "உங்கள் சம்மதம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.",
    te: "మీ సమ్మతి విజయవంతంగా సమర్పించబడింది.",
    kn: "ನಿಮ್ಮ ಸಮ್ಮತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ.",
  },
  returnToProvider: {
    en: "You can now return to {name} to continue.",
    hi: "अब आप जारी रखने के लिए {name} पर वापस जा सकते हैं।",
    ta: "தொடர, நீங்கள் இப்போது {name} க்கு திரும்பலாம்.",
    te: "మీరు ఇప్పుడు కొనసాగడానికి {name}కు తిరిగి వెళ్లవచ్చు.",
    kn: "ನೀವು ಈಗ ಮುಂದುವರಿಸಲು {name} ಗೆ ಹಿಂತಿರುಗಬಹುದು.",
  },
  returnButton: {
    en: "Return to Provider",
    hi: "प्रदाता पर वापस जाएं",
    ta: "வழங்குநருக்கு திரும்பு",
    te: "ప్రొవైడర్‌కు తిరిగి వెళ్లండి",
    kn: "ಪ್ರೊವೈಡರ್‌ಗೆ ಹಿಂತಿರುಗಿ",
  },
  goBack: {
    en: "Go Back",
    hi: "वापस जाएं",
    ta: "திரும்பிச் செல்ல",
    te: "తిరిగి వెళ్లండి",
    kn: "ಹಿಂದೆ ಹೋಗಿ",
  },
  failedToLoad: {
    en: "Failed to load consent notice",
    hi: "सहमति सूचना लोड करने में विफल",
    ta: "சம்மத அறிவிப்பை ஏற்ற முடியவில்லை",
    te: "సమ్మతి నోటీసును లోడ్ చేయడంలో విఫలమైంది",
    kn: "ಸಮ್ಮತಿ ಸೂಚನೆಯನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ",
  },
};

export default function ConsentNoticePage() {
  const params = useParams();
  const router = useRouter();
  const cmsRequestId = params.cms_request_id as string;

  const { data, isLoading, error } = useGetConsentNotice(cmsRequestId);
  const submitMutation = useSubmitConsent();

  const [selectedPurposes, setSelectedPurposes] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [agree, setAgree] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ redirectUrl: string; fiduciaryName: string } | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [translationCache, setTranslationCache] = useState<Record<string, string>>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTranslating, setIsTranslating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Initialize referrer URL from localStorage or document.referrer
  const [referrerUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const referrer = document.referrer || localStorage.getItem("consent_referrer") || "";
      if (referrer) {
        localStorage.setItem("consent_referrer", referrer);
      }
      return referrer;
    }
    return "";
  });

  // Get purposes by category or flat purposes array
  const purposesByCategory = data?.data?.purposes_by_category || [];
  const flatPurposes = data?.data?.purposes || [];

  // Use purposes_by_category if available, otherwise use flat purposes
  const hasCategoryStructure = purposesByCategory.length > 0;

  // Translate text via LibreTranslate (open-source, free tier)
  const translateText = async (text: string, targetLang: string): Promise<string> => {
    const cacheKey = `${targetLang}:${text}`;
    if (translationCache[cacheKey]) return translationCache[cacheKey];
    if (targetLang === "en" || !text.trim()) return text;

    try {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;
      setIsTranslating(true);

      const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);
      const libreCode = langConfig?.libreCode || targetLang;

      const response = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "auto",
          target: libreCode,
          format: "text",
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Translation failed");

      const result = await response.json();
      const translated = result.translatedText || text;

      setTranslationCache((prev) => ({ ...prev, [cacheKey]: translated }));
      return translated;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        return text;
      }
      console.warn("Translation failed:", error);
      return text;
    } finally {
      setIsTranslating(false);
      abortRef.current = null;
    }
  };

  // Translation helper for UI copy
  const t = (key: keyof typeof UI_COPY, params?: { days?: number; name?: string }): string => {
    let text = UI_COPY[key]?.[selectedLang] || UI_COPY[key]?.en || "";
    if (params?.days !== undefined) {
      text = text.replace("{days}", params.days.toString());
    }
    if (params?.name !== undefined) {
      text = text.replace("{name}", params.name);
    }
    return text;
  };

  // Get translated text (for dynamic content)
  const getTranslated = (text: string) => {
    if (selectedLang === "en") return text;
    const key = `${selectedLang}:${text}`;
    return translationCache[key] || text;
  };

  // Translate purposes and withdrawal policy when language changes
  useEffect(() => {
    if (selectedLang === "en" || !data?.data) return;

    const translateContent = async () => {
      const textsToTranslate: string[] = [];

      // Add withdrawal policy
      if (data.data.retention_policy?.withdrawal_policy) {
        textsToTranslate.push(data.data.retention_policy.withdrawal_policy);
      }

      // Add fiduciary description text
      const fiduciaryDescription = `${data.data.data_fiduciary.name} is requesting your consent for data collection and processing to enhance banking services and ensure secure transactions. Please provide consent for us to collect and process your information for the purposes outlined below.`;
      textsToTranslate.push(fiduciaryDescription);

      // Add category names and purposes
      if (hasCategoryStructure) {
        purposesByCategory.forEach((category) => {
          textsToTranslate.push(category.category_name);
          category.purposes.forEach((purpose) => {
            textsToTranslate.push(purpose.title);
            textsToTranslate.push(purpose.description);
          });
        });
      } else {
        flatPurposes.forEach((purpose) => {
          textsToTranslate.push(purpose.title);
          textsToTranslate.push(purpose.description);
        });
      }

      // Translate all texts
      for (const text of textsToTranslate) {
        await translateText(text, selectedLang);
      }
    };

    translateContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLang, data?.data]);

  const handleCategoryToggle = (categoryId: string, purposeIds: string[]) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        // Deselect category - remove all purposes in this category
        newSet.delete(categoryId);
        setSelectedPurposes((prevPurposes) => {
          const newPurposeSet = new Set(prevPurposes);
          purposeIds.forEach((id) => newPurposeSet.delete(id));
          return newPurposeSet;
        });
      } else {
        // Select category - add all purposes in this category
        newSet.add(categoryId);
        setSelectedPurposes((prevPurposes) => {
          const newPurposeSet = new Set(prevPurposes);
          purposeIds.forEach((id) => newPurposeSet.add(id));
          return newPurposeSet;
        });
      }
      return newSet;
    });
  };

  const handlePurposeToggle = (purposeId: string, categoryId: string, isMandatory: boolean) => {
    if (isMandatory) return; // Can't deselect mandatory purposes

    setSelectedPurposes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(purposeId)) {
        newSet.delete(purposeId);
        // If purpose is deselected, also deselect category
        setSelectedCategories((prevCats) => {
          const newCatSet = new Set(prevCats);
          newCatSet.delete(categoryId);
          return newCatSet;
        });
      } else {
        newSet.add(purposeId);
        // Check if all purposes in category are selected
        const category = purposesByCategory.find((cat) => cat.category_id === categoryId);
        if (category) {
          const allSelected = category.purposes.every((p) =>
            p.is_mandatory || newSet.has(p.purpose_id)
          );
          if (allSelected) {
            setSelectedCategories((prevCats) => {
              const newCatSet = new Set(prevCats);
              newCatSet.add(categoryId);
              return newCatSet;
            });
          }
        }
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!agree || selectedPurposes.size === 0) {
      return;
    }

    try {
      const result = await submitMutation.mutateAsync({
        cms_request_id: cmsRequestId,
        selected_purposes: Array.from(selectedPurposes),
        agree: true,
        language_code: selectedLang,
        ip_address: undefined,
        user_agent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      });

      if (result.success && result.data) {
        const redirectUrl =
          result.data.redirect_url ||
          data?.data?.redirect_url ||
          referrerUrl ||
          data?.data?.data_fiduciary?.website_url ||
          "/";

        setIsSubmitted(true);
        setSubmittedData({
          redirectUrl,
          fiduciaryName: data?.data?.data_fiduciary?.name || "the provider",
        });
      }
    } catch (error) {
      console.error("Failed to submit consent:", error);
    }
  };

  const handleReturnToProvider = () => {
    router.push("/my-consents");
  };

  // Auto-navigate to my-consents after 3 seconds
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        router.push("/my-consents");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Translation helper for error page (needs to be accessible)
  const tError = (key: keyof typeof UI_COPY): string => {
    return UI_COPY[key]?.[selectedLang] || UI_COPY[key]?.en || "";
  };

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">{tError("failedToLoad")}</p>
            <Button
              onClick={() => {
                const backUrl = data?.data?.redirect_url || referrerUrl || "/";
                window.location.href = backUrl;
              }}
              className="mt-4"
            >
              {tError("goBack")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const consentData = data.data;
  const { data_fiduciary, retention_policy } = consentData;

  const canSubmit = agree && selectedPurposes.size > 0 && !submitMutation.isPending;

  // Show success page after submission
  if (isSubmitted && submittedData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
              {/* Language Selector for success page */}
              <div className="w-full flex justify-end mb-4">
                <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 shadow-sm border">
                  <Languages className="h-3 w-3 text-muted-foreground" />
                  <select
                    className="border rounded-md px-2 py-1 text-xs bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary cursor-pointer"
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

              <div className="rounded-full bg-green-100 p-6">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{t("thankYou")}</h2>
                <p className="text-muted-foreground">
                  {t("consentSubmitted")}
                </p>
              </div>

              <div className="w-full pt-4 border-t space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t("returnToProvider", { name: submittedData.fiduciaryName })}
                </p>

                <Button
                  onClick={handleReturnToProvider}
                  className="w-full"
                  size="lg"
                >
                  {t("returnButton")}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
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

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {t("dpdpaTitle")}
              </h1>
              <p className="text-gray-700 text-lg mb-4">
                {getTranslated(`${data_fiduciary.name} is requesting your consent for data collection and processing to enhance banking services and ensure secure transactions. Please provide consent for us to collect and process your information for the purposes outlined below.`)}
              </p>
              <div className="text-center">
                <h2 className="text-xl font-bold text-blue-600">{t("consentNotice")}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Manage My Consents Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{t("manageConsents")}</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MessageSquare className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            {hasCategoryStructure ? (
              purposesByCategory.map((category) => {
                const categorySelected = selectedCategories.has(category.category_id);
                const categoryPurposeIds = category.purposes.map((p) => p.purpose_id);
                const maxRetentionDays = Math.max(
                  ...category.purposes.map((p) => p.retention_period_days)
                );

                return (
                  <div key={category.category_id} className="bg-white rounded-lg p-6 border">
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {getTranslated(category.category_name)}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {t("consentDuration", { days: maxRetentionDays })}
                        </span>
                        <Info className="h-4 w-4 text-gray-400" />
                        <Checkbox
                          checked={categorySelected}
                          onCheckedChange={() =>
                            handleCategoryToggle(category.category_id, categoryPurposeIds)
                          }
                        />
                      </div>
                    </div>

                    {/* Purposes in Category */}
                    <div className="space-y-6">
                      {category.purposes.map((purpose) => {
                        const isSelected = selectedPurposes.has(purpose.purpose_id);
                        const isMandatory = purpose.is_mandatory;

                        return (
                          <div
                            key={purpose.purpose_id}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <h5 className="font-semibold text-gray-900 mb-2">
                                  {getTranslated(purpose.title)}
                                </h5>
                                <p className="text-sm text-gray-600 mb-4">
                                  {getTranslated(purpose.description)}
                                </p>

                                {/* Personal Data Section */}
                                <div className="mb-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Info className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs font-medium text-gray-700">
                                      {t("personalData")}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {purpose.data_fields.map((field) => (
                                      <Badge
                                        key={field}
                                        variant="outline"
                                        className="text-xs bg-white"
                                      >
                                        {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Purpose Checkbox */}
                              <div className="flex-shrink-0">
                                {isMandatory ? (
                                  <Badge variant="destructive" className="text-xs">
                                    {t("mandatory")}
                                  </Badge>
                                ) : (
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() =>
                                      handlePurposeToggle(
                                        purpose.purpose_id,
                                        category.category_id,
                                        isMandatory
                                      )
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback to flat purposes structure
              <div className="space-y-4">
                {flatPurposes.map((purpose) => {
                  const isSelected = selectedPurposes.has(purpose.purpose_id);
                  const isMandatory = purpose.is_mandatory;

                  return (
                    <div
                      key={purpose.purpose_id}
                      className={`p-4 rounded-lg border-2 ${
                        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-2">
                            {getTranslated(purpose.title)}
                          </h5>
                          <p className="text-sm text-gray-600 mb-4">{getTranslated(purpose.description)}</p>
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Info className="h-3 w-3 text-gray-500" />
                              <span className="text-xs font-medium text-gray-700">
                                {t("personalData")}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {purpose.data_fields.map((field) => (
                                <Badge
                                  key={field}
                                  variant="outline"
                                  className="text-xs bg-white"
                                >
                                  {field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {isMandatory ? (
                            <Badge variant="destructive" className="text-xs">
                              {t("mandatory")}
                            </Badge>
                          ) : (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() =>
                                handlePurposeToggle(purpose.purpose_id, "", isMandatory)
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Retention Policy */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">{t("retentionPolicy")}</h4>
          <p className="text-sm text-gray-600 mb-2">{getTranslated(retention_policy.withdrawal_policy)}</p>
          <p className="text-xs text-gray-500">
            {t("dataRetention", { days: retention_policy.retention_period_days })}
          </p>
        </div>

        {/* Agreement and Submit */}
        <div className="bg-white rounded-lg p-6 border">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="agree"
                checked={agree}
                onCheckedChange={(checked) => setAgree(checked === true)}
              />
              <label htmlFor="agree" className="text-sm cursor-pointer flex-1">
                {t("agreeText")}
              </label>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full"
              size="lg"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submitButton")
              )}
            </Button>

            {selectedPurposes.size === 0 && (
              <p className="text-xs text-destructive text-center">
                {t("selectPurpose")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
