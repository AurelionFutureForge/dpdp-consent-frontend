import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import QueryProvider from "@/components/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Consent Management Panel",
  description:
    "A powerful and intuitive admin panel for managing Consents.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/",
    title: "Consent Management Panel",
    description:
      "A powerful and intuitive admin panel for managing Consents.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Consent Management Panel",
    description:
      "A powerful and intuitive admin panel for managing Consents."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.ico" />
      </head>
      <body className={GeistSans.className}>
          <AuthProvider>
            <QueryProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </QueryProvider>
          </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}