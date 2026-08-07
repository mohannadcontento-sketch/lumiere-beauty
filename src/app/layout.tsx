import type { Metadata } from "next";
import { Cairo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "منصة إدارة مركز التجميل — المواصفات",
  description:
    "مواصفات كاملة جاهزة للإنتاج لمنصة حديثة لإدارة مراكز التجميل. نظام حتمي قائم على القواعد، جاهز لتعدد المستأجرين. بدون ذكاء اصطناعي.",
  keywords: [
    "مركز تجميل",
    "منصة إدارة",
    "مواصفات",
    "SaaS",
    "تعدد المستأجرين",
    "مواعيد",
    "نقطة بيع",
    "CRM",
  ],
  authors: [{ name: "هندسة المنتج" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "منصة إدارة مركز التجميل — المواصفات",
    description:
      "مواصفات جاهزة للإنتاج: الأدوار، الوحدات، تصميم قاعدة البيانات، الواجهات البرمجية، البنية، الأمان، وخارطة طريق MVP/V2.",
    siteName: "مواصفات مركز التجميل",
    type: "website",
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
        className={`${cairo.variable} ${geistMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
