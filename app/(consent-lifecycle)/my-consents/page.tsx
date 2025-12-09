"use client";

import { useState, useEffect, useRef } from "react";
import { useGetUserConsents, useWithdrawConsent, useRenewConsent } from "@/services/consent-lifecycle/queries";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  RotateCcw,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

// Default values
const DEFAULT_DATA_FIDUCIARY_ID = "99d8e106-9ed6-4698-8db0-71c0aa91ab24";
const LIMIT = 100000;

const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

const UI_COPY: Record<string, Record<string, string>> = {
  header: {
    en: "My Consents",
    hi: "मेरी सहमतियाँ",
    ta: "என் சம்மதங்கள்",
    te: "నా సమ్మతులు",
    kn: "ನನ್ನ ಸಮ್ಮತಿಗಳು",
  },
  subtitle: {
    en: "Manage and view all your consent artifacts",
    hi: "अपनी सभी सहमति आर्टिफैक्ट्स देखें और प्रबंधित करें",
    ta: "உங்கள் அனைத்து சம்மதி ஆவணங்களையும் காணவும் மேலாண்மை செய்யவும்",
    te: "మీ అన్ని సమ్మతి పత్రాలను చూడండి మరియు నిర్వహించండి",
    kn: "ನಿಮ್ಮ ಎಲ್ಲಾ ಸಮ್ಮತಿ ಆರ್ಥಿಫ್ಯಾಕ್ಟ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ",
  },
  purposes: {
    en: "Purposes",
    hi: "उद्देश्यों",
    ta: "நோக்கங்கள்",
    te: "ఉద్దేశాలు",
    kn: "ಉದ್ದೇಶಗಳು",
  },
  withdraw: {
    en: "Withdraw Consent",
    hi: "सहमति वापस लें",
    ta: "சம்மதத்தை வாபஸ் பெறவும்",
    te: "సమ్మతిని ఉపసంహరించండి",
    kn: "ಸಮ್ಮತಿಯನ್ನು ಹಿಂಪಡೆಯಿರಿ",
  },
  renew: {
    en: "Renew Consent",
    hi: "सहमति नवीनीकृत करें",
    ta: "சம்மதத்தை புதுப்பிக்கவும்",
    te: "సమ్మతిని పునరుద్ధరించండి",
    kn: "ಸಮ್ಮತಿಯನ್ನು ನವೀಕರಿಸಿ",
  },
  grievance: {
    en: "Report Grievance",
    hi: "शिकायत दर्ज करें",
    ta: "புகார் அளிக்கவும்",
    te: "ఫిర్యాదు చేయండి",
    kn: "ದೂರು ನೀಡಿ",
  },
  noConsentsTitle: {
    en: "No Consents Found",
    hi: "कोई सहमति नहीं मिली",
    ta: "சம்மதங்கள் எதுவும் இல்லை",
    te: "ఏ సమ్మతులు కనబడలేదు",
    kn: "ಯಾವುದೇ ಸಮ್ಮತಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
  },
  noConsentsText: {
    en: "You don't have any consent artifacts yet. Consents will appear here once you grant them.",
    hi: "अभी तक आपके पास कोई सहमति आर्टिफैक्ट नहीं है। सहमतियाँ यहां प्रदर्शित होंगी।",
    ta: "உங்களிடம் இன்னும் சம்மதி ஆவணங்கள் இல்லை. நீங்கள் சம்மதித்தவுடன் அவை இங்கே தோன்றும்.",
    te: "మీ వద్ద ఇంకా సమ్మతి పత్రాలు లేవు. మీరు సమ్మతి ఇచ్చిన తర్వాత అవి ఇక్కడ కనిపిస్తాయి.",
    kn: "ನಿಮ್ಮಲ್ಲಿ ಇನ್ನೂ ಯಾವುದೇ ಸಮ್ಮತಿ ಆರ್ಥಿಫ್ಯಾಕ್ಟ್‌ಗಳಿಲ್ಲ. ನೀವು ಸಮ್ಮತಿ ನೀಡಿದ ನಂತರ ಅವು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.",
  },
};

// Helper function to get or create user ID from localStorage
const getOrCreateUserId = (): string => {
  if (typeof window === "undefined") return "";

  const storedUserId = localStorage.getItem("consent_user_id");
  if (storedUserId) {
    return storedUserId;
  }

  // Generate a new UUID if not found
  const newUserId = generateUUID();
  localStorage.setItem("consent_user_id", newUserId);
  return newUserId;
};

export default function MyConsentsPage() {
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);
  // Use lazy initialization to get userId from localStorage
  const [userId] = useState<string>(() => getOrCreateUserId());
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [translationCache, setTranslationCache] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const { data, isLoading, error } = useGetUserConsents(
    DEFAULT_DATA_FIDUCIARY_ID,
    userId,
    LIMIT
  );

  const withdrawMutation = useWithdrawConsent();
  const renewMutation = useRenewConsent();

  const handleWithdrawConsent = (artifactId: string) => {
    setSelectedArtifactId(artifactId);
    setWithdrawDialogOpen(true);
  };

  const handleWithdrawConfirm = () => {
    if (!selectedArtifactId) return;

    withdrawMutation.mutate(
      {
        dataFiduciaryId: DEFAULT_DATA_FIDUCIARY_ID,
        artifactId: selectedArtifactId,
      },
      {
        onSuccess: () => {
          setWithdrawDialogOpen(false);
          setSelectedArtifactId(null);
        },
      }
    );
  };

  const handleWithdrawCancel = () => {
    setWithdrawDialogOpen(false);
    setSelectedArtifactId(null);
  };

  const handleRenewConsent = (artifactId: string) => {
    setSelectedArtifactId(artifactId);
    setRenewDialogOpen(true);
  };

  const handleRenewConfirm = () => {
    if (!selectedArtifactId) return;

    renewMutation.mutate(
      {
        artifact_id: selectedArtifactId,
        requested_extension: "+180d",
        initiated_by: "USER",
      },
      {
        onSuccess: () => {
          setRenewDialogOpen(false);
          setSelectedArtifactId(null);
        },
      }
    );
  };

  const handleRenewCancel = () => {
    setRenewDialogOpen(false);
    setSelectedArtifactId(null);
  };

  const handleReportGrievance = (consentId: string) => {
    // TODO: Integrate report grievance API
    console.log("Report grievance:", consentId);
  };

  // Translate text via LibreTranslate (open-source, free tier). Best-effort; caches results.
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

      const response = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "auto",
          target: targetLang,
          format: "text",
        }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Translation failed");
      const result = await response.json();
      const translated = result?.translatedText || text;

      setTranslationCache((prev) => ({ ...prev, [cacheKey]: translated }));
      return translated;
    } catch (err) {
      console.error("Translation error:", err);
      return text;
    } finally {
      setIsTranslating(false);
    }
  };

  // Pre-translate dynamic purpose titles when language changes
  useEffect(() => {
    const pretranslate = async () => {
      if (selectedLang === "en" || !data?.data?.data?.length) return;
      setIsTranslating(true);

      const titles = new Set<string>();
      data.data.data.forEach((consent) => {
        consent.purposes.forEach((p: { title: string }) => titles.add(p.title));
      });

      await Promise.all(
        Array.from(titles).map((title) => translateText(title, selectedLang))
      );

      setIsTranslating(false);
    };

    pretranslate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLang, data?.data?.data]);

  const getTranslated = (text: string) => {
    if (selectedLang === "en") return text;
    const key = `${selectedLang}:${text}`;
    return translationCache[key] || text;
  };

  const t = (key: keyof typeof UI_COPY) => {
    return UI_COPY[key]?.[selectedLang] || UI_COPY[key]?.en || "";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return <Badge className="bg-green-600 text-white" aria-label="Active consent">Active</Badge>;
      case "EXPIRED":
        return <Badge variant="destructive" aria-label="Expired consent">Expired</Badge>;
      case "REVOKED":
        return <Badge variant="secondary" aria-label="Revoked consent">Revoked</Badge>;
      default:
        return <Badge variant="outline" aria-label={`Consent status: ${status}`}>{status}</Badge>;
    }
  };

  // Show loading while retrieving userId or fetching consents
  if (!userId || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-96" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive font-semibold mb-2">Failed to load consents</p>
            <p className="text-sm text-muted-foreground">
              Please try again later or contact support if the issue persists.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const consents = data?.data?.data || [];
  const pagination = data?.data?.meta?.pagination;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t("header")}</h1>
                <p className="text-muted-foreground mt-1">
                  {t("subtitle")}
                  {pagination && (
                    <span className="ml-2 text-sm font-medium">
                      ({pagination.total} total consent{pagination.total !== 1 ? "s" : ""})
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground" htmlFor="language-select">
                Language
              </label>
              <select
                id="language-select"
                className="border rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
              {isTranslating && (
                <span className="text-xs text-muted-foreground">Translating…</span>
              )}
            </div>
          </div>
        </div>

        {/* Consents Grid */}
        {consents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consents.map((consent) => {
              const isExpired = new Date(consent.expires_at) < new Date();
              const status = consent.status.toUpperCase();
              // Show withdraw/renew buttons for ACTIVE (even if expired) or EXPIRED status
              const canWithdrawOrRenew = status === "ACTIVE" || status === "EXPIRED";

              return (
                <Card
                  key={consent.consent_artifact_id}
                  className="hover:shadow-xl transition-all duration-200 border-2 hover:border-primary/20"
                >
                  {/* <CardHeader className="">

                  </CardHeader> */}

                  <CardContent className="space-y-3">
                  <div className="flex items-start justify-between gap-3 pb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" aria-hidden="true">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{getTranslated("Consent Artifact")}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {getStatusBadge(consent.status)}
                          {consent.is_deleted && (
                            <Badge variant="destructive" aria-label="Deleted consent">Deleted</Badge>
                          )}
                          {isExpired && consent.status.toUpperCase() === "ACTIVE" && (
                            <Badge variant="destructive" aria-label="Expired consent">Expired</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Purposes */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span className="text-sm font-semibold text-gray-900">
                          {t("purposes")} ({consent.purposes.length})
                        </span>
                      </div>
                      <div className="space-y-1">
                        {consent.purposes.slice(0, 3).map((purpose, idx) => (
                          <div
                            key={purpose.purpose_id}
                            className="text-sm text-gray-700 flex items-start gap-2"
                          >
                            <span className="font-semibold text-primary shrink-0" aria-hidden="true">{idx + 1}.</span>
                            <span className="line-clamp-2">{getTranslated(purpose.title)}</span>
                          </div>
                        ))}
                        {consent.purposes.length > 3 && (
                          <div className="text-xs text-muted-foreground italic pt-0.5">
                            +{consent.purposes.length - 3} more purpose{consent.purposes.length - 3 !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <span className="text-muted-foreground">Requested: </span>
                          <span className="font-medium text-gray-900">{formatDate(consent.requested_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <span className="text-muted-foreground">Granted: </span>
                          <span className="font-medium text-gray-900">{formatDate(consent.granted_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Clock className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <span className="text-muted-foreground">Expires: </span>
                          <span className={`font-medium ${isExpired ? "text-red-600" : "text-gray-900"}`}>
                            {formatDate(consent.expires_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t space-y-2">
                      {canWithdrawOrRenew && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start focus-visible:ring-2 focus-visible:ring-offset-2"
                            onClick={() => handleWithdrawConsent(consent.consent_artifact_id)}
                            aria-label={`Withdraw consent for artifact ${consent.consent_artifact_id.slice(0, 8)}`}
                          >
                            <XCircle className="h-4 w-4" aria-hidden="true" />
                            {t("withdraw")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start focus-visible:ring-2 focus-visible:ring-offset-2"
                            onClick={() => handleRenewConsent(consent.consent_artifact_id)}
                            aria-label={`Renew consent for artifact ${consent.consent_artifact_id.slice(0, 8)}`}
                          >
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            {t("renew")}
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-orange-200 text-orange-700 hover:bg-orange-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-500"
                        onClick={() => handleReportGrievance(consent.consent_artifact_id)}
                        aria-label={`Report grievance for consent artifact ${consent.consent_artifact_id.slice(0, 8)}`}
                      >
                        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                        {t("grievance")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("noConsentsTitle")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("noConsentsText")}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Withdraw Consent Confirmation Dialog */}
        <Dialog open={withdrawDialogOpen} onOpenChange={handleWithdrawCancel}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-destructive/10 p-3">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <DialogTitle>Withdraw Consent</DialogTitle>
              </div>
            </DialogHeader>
            <DialogDescription className="text-base py-4">
              Are you sure you want to withdraw this consent? This action will revoke your consent and may affect the services you receive. This action cannot be undone.
            </DialogDescription>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleWithdrawCancel}
                disabled={withdrawMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleWithdrawConfirm}
                disabled={withdrawMutation.isPending}
              >
                {withdrawMutation.isPending ? "Withdrawing..." : "Withdraw Consent"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Renew Consent Confirmation Dialog */}
        <Dialog open={renewDialogOpen} onOpenChange={handleRenewCancel}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <RotateCcw className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle>Renew Consent</DialogTitle>
              </div>
            </DialogHeader>
            <DialogDescription className="text-base py-4">
              Are you sure you want to renew this consent? This will extend the expiration date by 180 days. The consent will remain active with the same purposes and data fields.
            </DialogDescription>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleRenewCancel}
                disabled={renewMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={handleRenewConfirm}
                disabled={renewMutation.isPending}
              >
                {renewMutation.isPending ? "Renewing..." : "Renew Consent"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

