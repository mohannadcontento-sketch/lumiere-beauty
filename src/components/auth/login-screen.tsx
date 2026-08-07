"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import salonHero from "../../../public/salon-hero.png";

const DEMO_ACCOUNTS = [
  { role: "المالك", email: "owner@beauty-demo.com", color: "#003527", desc: "صلاحية كاملة على كل الوحدات" },
  { role: "الاستقبال", email: "reception@beauty-demo.com", color: "#735c00", desc: "لوحة القيادة، التقويم، العملاء، المواعيد، نقطة البيع" },
  { role: "الأخصائي", email: "staff@beauty-demo.com", color: "#0b513d", desc: "مواعيد اليوم، العملاء، السجل، الجدول، الأداء" },
  { role: "العميل", email: "customer@beauty-demo.com", color: "#5f5e5b", desc: "الملف، الحجز، المواعيد، السجل، الولاء، العروض" },
];

export function LoginScreen() {
  const login = useApp((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      if (!res.ok) {
        setError(res.error ?? "تعذّر تسجيل الدخول");
        setLoading(false);
      } else {
        toast.success("مرحباً بك في لوميير بيوتي");
      }
    }, 350);
  };

  const quickLogin = (em: string) => {
    setEmail(em);
    setPassword("Demo123!");
    setError("");
    setLoading(true);
    setTimeout(() => {
      const res = login(em, "Demo123!");
      if (!res.ok) {
        setError(res.error ?? "تعذّر تسجيل الدخول");
        setLoading(false);
      } else {
        toast.success("مرحباً بك في لوميير بيوتي");
      }
    }, 250);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Right side (visually in RTL): form */}
      <div className="flex w-full flex-col items-center justify-center bg-background p-6 lg:w-1/2 lg:p-16">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary">
              <Sparkles className="size-6 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl font-bold text-primary">لوميير بيوتي</h1>
            <p className="mt-1 text-sm text-muted-foreground">إدارة النخبة لمراكز التجميل</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@beauty-demo.com"
                  className="h-11 pr-9 text-right"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-9 pl-9 text-right"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="size-4 accent-primary" defaultChecked />
                تذكّرني
              </label>
              <button type="button" className="text-sm text-primary hover:underline">
                هل نسيت كلمة المرور؟
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full text-sm font-semibold uppercase tracking-wider"
            >
              {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                حسابات تجريبية
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  onClick={() => quickLogin(a.email)}
                  disabled={loading}
                  className="group rounded-md border border-border bg-card p-3 text-right transition-all hover:border-primary/40 hover:shadow-sm disabled:opacity-50"
                  title={a.desc}
                >
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: a.color }} />
                    <span className="text-sm font-semibold text-foreground">{a.role}</span>
                  </div>
                  <p className="mt-1 truncate text-[11px] text-muted-foreground ltr" dir="ltr">
                    {a.email}
                  </p>
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              كلمة المرور لكل الحسابات: <span className="font-mono" dir="ltr">Demo123!</span>
            </p>
          </div>
        </div>
      </div>

      {/* Left side (visually in RTL): brand imagery */}
      <div className="relative hidden lg:block lg:w-1/2">
        <img
          src={salonHero.src}
          alt="صالون لوميير بيوتي الفاخر"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
        <div className="absolute bottom-16 right-12 max-w-md text-white">
          <h2 className="font-display text-3xl font-semibold leading-tight">ارتقاءٌ بالفخامة</h2>
          <p className="mt-2 text-base opacity-90">
            منصّة إدارة احترافية مصمّمة لملاذات العافية الحديثة — مواعيد، عملاء، نقطة بيع، ولاء، وتقارير في مكان واحد.
          </p>
          <div className="mt-6 flex gap-6">
            <div>
              <div className="font-display text-2xl font-bold">+١٢٠٠</div>
              <div className="text-xs opacity-80">موعد شهرياً</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold">٤٫٩</div>
              <div className="text-xs opacity-80">تقييم العملاء</div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold">+٣٠</div>
              <div className="text-xs opacity-80">عميل نشط</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
