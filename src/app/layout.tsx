import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beauty Center Management Platform — Specification",
  description:
    "A complete, production-ready specification for a modern Beauty Center Management Platform. Deterministic, rule-driven, multi-tenant ready. No AI.",
  keywords: [
    "Beauty Center",
    "Management Platform",
    "Specification",
    "SaaS",
    "Multi-tenant",
    "Appointments",
    "POS",
    "CRM",
  ],
  authors: [{ name: "Product Architecture" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Beauty Center Management Platform — Specification",
    description:
      "A production-ready specification: roles, modules, database design, API, architecture, security, MVP/V2 roadmap.",
    siteName: "Beauty Center Spec",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
