'use client'

import Link from "next/link";
import { ReactNode } from "react";
import {
  ShieldCheck,
  Sliders,
  History,
  FileText,
  Bell,
  Users,
} from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Consent Lifecycle Management",
      description:
        "Collect, validate, update, renew, and withdraw user consents with purpose-specific granularity under the DPDP Act.",
    },
    {
      icon: <Sliders className="h-6 w-6" />,
      title: "Cookie & Preference Controls",
      description:
        "Offer WCAG-compliant, multilingual interfaces for cookies, preferences, and granular opt-ins.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "User Dashboard & Rights",
      description:
        "Enable individuals to view history, modify/revoke consents, and raise data requests or grievances.",
    },

    {
      icon: <History className="h-6 w-6" />,
      title: "Audit & Compliance Readiness",
      description:
        "Immutable logs, retention policies, and RBAC controls to meet DPDP compliance and audit standards.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
        <div className="container h-14 flex items-center">
          <Link
            href="/"
            className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300 gap-1"
          >
            <span className="font-bold">
              <span className="text-secondary">
                DPDP Consent Management System
              </span>
            </span>
            <span className="sr-only">DPDP Consent Management System</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="grid grid-cols-1 md:grid-cols-2 flex-1">
        {/* Left side - Information */}
        <div className="relative flex flex-col justify-center overflow-hidden md:order-first order-last">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-accent animate-gradient-x"></div>

          {/* Overlay patterns */}
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.6))] -z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent"></div>

          {/* Floating shapes */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-white/5 blur-xl"></div>

          {/* Content */}
          <div className="max-w-xl mx-auto relative z-10 p-8 text-white">
            <h1 className="text-3xl font-bold mb-6">
              Centralize Consent & Compliance under the DPDP Act
            </h1>
            <p className="text-xl mb-8 opacity-90">
              A secure, user-centric platform to capture, manage, and
              demonstrate lawful consent throughout its lifecycle.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 backdrop-blur-sm bg-white/10 p-4 rounded-lg transition-all duration-300 hover:bg-white/20"
                >
                  <div className="bg-white/20 p-2 rounded-full">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="opacity-80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex items-center justify-center p-8 lg:p-12 md:order-last order-first">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 md:py-0 border-t border-border/40">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <span className="text-sm text-foreground">
            &copy; {new Date().getFullYear()} DPDP Consent Management System. All
            rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
