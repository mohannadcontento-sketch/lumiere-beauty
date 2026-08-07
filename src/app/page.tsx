"use client";

import { useApp } from "@/lib/store";
import { LoginScreen } from "@/components/auth/login-screen";
import { AppShell } from "@/components/app/app-shell";

export default function Page() {
  const currentUserId = useApp((s) => s.currentUserId);

  if (!currentUserId) return <LoginScreen />;
  return <AppShell />;
}
