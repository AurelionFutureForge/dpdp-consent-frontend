"use client";

import React from "react";
import { RegistrationForm } from "./_components/registration-form";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DataFiduciaryRegister() {
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

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl space-y-8">
          {/* Back to Login Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              DPDP Consent Management
            </h1>
            <p className="text-gray-600">
              Ministry of Electronics and Information Technology, Government of India
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm max-h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Register as Data Fiduciary
              </h2>
              <p className="text-gray-600">
                Join the DPDP compliance framework and manage user consents effectively
              </p>
            </div>

            <RegistrationForm />
          </div>

          <p className="text-center text-xs text-gray-500">
            By registering, you agree to comply with the{" "}
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

