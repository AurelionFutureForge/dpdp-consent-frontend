import React, { useState } from "react";
import { MFAForm } from "@/components/auth/mfa-form";
import { OTPForm } from "@/components/auth/otp-form";

interface MFATabsProps {
  onStepChange?: (step: "email" | "otp") => void;
}

export const MFATabs: React.FC<MFATabsProps> = ({ onStepChange }) => {
  const [activeTab, setActiveTab] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState<string>("");

  React.useEffect(() => {
    onStepChange?.(activeTab);
  }, [activeTab, onStepChange]);

  const handleEmailSuccess = () => {
    setActiveTab("otp");
  };

  const handleEditEmail = () => {
    setActiveTab("email");
  };

  return (
    <div className="w-full">
      {activeTab === "email" ? (
        <MFAForm
          onSubmit={(value) => setEmail(value)}
          onSuccess={handleEmailSuccess}
          initialEmail={email}
        />
      ) : (
        <div className="space-y-4">
          <OTPForm email={email} onEditEmail={handleEditEmail} />
        </div>
      )}
    </div>
  );
};
