"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/ui/image-uploader";
import { registerDataFiduciaryApi } from "@/services/auth/api";
import { parseApiError } from "@/lib/parse-api-errors";
import { useRouter } from "next/navigation";
import { Building2, Mail, Phone, Globe, FileText, Shield } from "lucide-react";
import { toast } from "sonner";

export const RegistrationForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    legal_name: "",
    registration_number: "",
    contact_email: "",
    contact_phone: "",
    dpo_email: "",
    dpo_phone: "",
    website_url: "",
    logo_url: "",
    privacy_policy_url: "",
    terms_url: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogoUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, logo_url: url }));
    toast.success("Logo uploaded successfully!");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Organization name is required");
      return false;
    }
    if (!formData.legal_name.trim()) {
      setError("Legal name is required");
      return false;
    }
    if (!formData.registration_number.trim()) {
      setError("Registration number is required");
      return false;
    }
    if (!formData.contact_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      setError("Valid contact email is required");
      return false;
    }
    if (!formData.contact_phone.trim()) {
      setError("Contact phone is required");
      return false;
    }
    if (!formData.dpo_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.dpo_email)) {
      setError("Valid DPO email is required");
      return false;
    }
    if (!formData.dpo_phone.trim()) {
      setError("DPO phone is required");
      return false;
    }
    if (!formData.website_url.trim() || !/^https?:\/\/.+\..+/.test(formData.website_url)) {
      setError("Valid website URL is required");
      return false;
    }
    if (!formData.privacy_policy_url.trim() || !/^https?:\/\/.+\..+/.test(formData.privacy_policy_url)) {
      setError("Valid privacy policy URL is required");
      return false;
    }
    if (!formData.terms_url.trim() || !/^https?:\/\/.+\..+/.test(formData.terms_url)) {
      setError("Valid terms & conditions URL is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerDataFiduciaryApi(formData);

      if (response.success && response.data) {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        const errorMessage =
          typeof response.message === "string"
            ? response.message
            : response.message?.error || "Registration failed";
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {/* Logo Upload */}
      <div className="space-y-2">
        <Label htmlFor="logo">Organization Logo</Label>
        <div className="flex items-center gap-4">
          <ImageUploader
            onImageUpload={handleLogoUpload}
            buttonText="Upload Logo"
            modalTitle="Upload Organization Logo"
            modalDescription="Select and crop your organization logo"
            aspectRatio={1}
            cropWidth={80}
            maxFileSize={5}
            acceptedFileTypes="image/*"
            showPreview={true}
            previewUrl={formData.logo_url}
            previewSize={{ width: 120, height: 120 }}
          />
          {formData.logo_url && (
            <p className="text-sm text-gray-600">Logo uploaded successfully</p>
          )}
        </div>
      </div>

      {/* Organization Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Organization Details
        </h3>

        <div className="space-y-2">
          <Label htmlFor="name">Organization Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Acme Corporation"
            value={formData.name}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="legal_name">Legal Name *</Label>
          <Input
            id="legal_name"
            name="legal_name"
            type="text"
            placeholder="Acme Corporation Private Limited"
            value={formData.legal_name}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registration_number">Registration Number *</Label>
          <Input
            id="registration_number"
            name="registration_number"
            type="text"
            placeholder="U12345KA2020PTC123457"
            value={formData.registration_number}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Contact Information
        </h3>

        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              placeholder="contact@acme.com"
              value={formData.contact_email}
              onChange={handleInputChange}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact Phone *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="contact_phone"
              name="contact_phone"
              type="tel"
              placeholder="+919876543210"
              value={formData.contact_phone}
              onChange={handleInputChange}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>
      </div>

      {/* DPO Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Data Protection Officer (DPO)
        </h3>

        <div className="space-y-2">
          <Label htmlFor="dpo_email">DPO Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="dpo_email"
              name="dpo_email"
              type="email"
              placeholder="dpo@acme.com"
              value={formData.dpo_email}
              onChange={handleInputChange}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dpo_phone">DPO Phone *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="dpo_phone"
              name="dpo_phone"
              type="tel"
              placeholder="+919876543211"
              value={formData.dpo_phone}
              onChange={handleInputChange}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>
      </div>

      {/* URLs */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Web Links
        </h3>

        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL *</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="website_url"
              name="website_url"
              type="url"
              placeholder="https://acme.com"
              value={formData.website_url}
              onChange={handleInputChange}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacy_policy_url">Privacy Policy URL *</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="privacy_policy_url"
              name="privacy_policy_url"
              type="url"
              placeholder="https://acme.com/privacy"
              value={formData.privacy_policy_url}
              onChange={handleInputChange}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="terms_url">Terms & Conditions URL *</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="terms_url"
              name="terms_url"
              type="url"
              placeholder="https://acme.com/terms"
              value={formData.terms_url}
              onChange={handleInputChange}
              className="pl-10"
              disabled={isLoading}
              required
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 text-base font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Register Organization"}
      </Button>
    </form>
  );
};

