"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetConsentNotice, useSubmitConsent } from "@/services/consent-lifecycle/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Info, Clock, ChevronLeft, ArrowRight, Languages, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
        language_code: data?.data?.language_config?.language_code || "en",
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
    if (submittedData?.redirectUrl) {
      window.location.href = submittedData.redirectUrl;
    }
  };

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

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive">Failed to load consent notice</p>
            <Button
              onClick={() => {
                const backUrl = data?.data?.redirect_url || referrerUrl || "/";
                window.location.href = backUrl;
              }}
              className="mt-4"
            >
              Go Back
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
              <div className="rounded-full bg-green-100 p-6">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Thank You!</h2>
                <p className="text-muted-foreground">
                  Your consent has been successfully submitted.
                </p>
              </div>

              <div className="w-full pt-4 border-t space-y-4">
                <p className="text-sm text-muted-foreground">
                  You can now return to {submittedData.fiduciaryName} to continue.
                </p>

                <Button
                  onClick={handleReturnToProvider}
                  className="w-full"
                  size="lg"
                >
                  Return to Provider
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
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Digital Personal Data Protection Act, 2023
              </h1>
              <p className="text-gray-700 text-lg mb-4">
                {data_fiduciary.name} is requesting your consent for data collection and processing to enhance banking services and ensure secure transactions. Please provide consent for us to collect and process your information for the purposes outlined below.
              </p>
              <div className="text-center">
                <h2 className="text-xl font-bold text-blue-600">Consent Notice</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Manage My Consents Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Manage My Consents</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MessageSquare className="h-4 w-4 text-gray-500" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <span className="text-gray-500 text-sm">अ</span>
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
                        {category.category_name}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          Consent Duration: {maxRetentionDays} Days
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
                                  {purpose.title}
                                </h5>
                                <p className="text-sm text-gray-600 mb-4">
                                  {purpose.description}
                                </p>

                                {/* Personal Data Section */}
                                <div className="mb-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Info className="h-3 w-3 text-gray-500" />
                                    <span className="text-xs font-medium text-gray-700">
                                      Personal Data
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
                                    Mandatory
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
                            {purpose.title}
                          </h5>
                          <p className="text-sm text-gray-600 mb-4">{purpose.description}</p>
                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Info className="h-3 w-3 text-gray-500" />
                              <span className="text-xs font-medium text-gray-700">
                                Personal Data
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
                              Mandatory
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
          <h4 className="font-semibold text-gray-900 mb-2">Retention Policy</h4>
          <p className="text-sm text-gray-600 mb-2">{retention_policy.withdrawal_policy}</p>
          <p className="text-xs text-gray-500">
            Data will be retained for {retention_policy.retention_period_days} days.
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
                I agree to the terms and conditions and consent to the selected purposes. I
                understand that I can withdraw my consent at any time.
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
                  Submitting...
                </>
              ) : (
                "I Agree & Submit Consent"
              )}
            </Button>

            {selectedPurposes.size === 0 && (
              <p className="text-xs text-destructive text-center">
                Please select at least one purpose
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
