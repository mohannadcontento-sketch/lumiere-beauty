import type { Metadata } from "next";
import { Cairo, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "لوميير بيوتي — منصة إدارة مراكز التجميل",
  description:
    "نظام إدارة احترافي لمراكز التجميل: المواعيد، العملاء، نقطة البيع، المخزون، الولاء، التقارير. تجربة كاملة قائمة على قواعد حتمية.",
  keywords: [
    "مركز تجميل",
    "إدارة",
    "مواعيد",
    "نقطة بيع",
    "CRM",
    "ولاء",
    "تقارير",
  ],
  authors: [{ name: "Lumière Beauty" }],
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${playfair.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
