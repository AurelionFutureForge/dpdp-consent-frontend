import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";


export const metadata: Metadata = {
  title: "DPDP Consent",
  description: "DPDP Consent",
};

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
