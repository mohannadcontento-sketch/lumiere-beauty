"use client";

import { useEffect, useState, useCallback } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type NavItem = {
  id: string;
  number: string;
  label: string;
  group?: string;
};

export const NAV_ITEMS: NavItem[] = [
  { id: "overview", number: "00", label: "نظرة عامة", group: "البداية" },
  { id: "vision", number: "01", label: "رؤية المنتج", group: "الاستراتيجية" },
  { id: "roles", number: "02", label: "المستخدمون والأدوار", group: "الاستراتيجية" },
  { id: "modules", number: "03", label: "الوحدات الأساسية", group: "المنتج" },
  { id: "analytics", number: "04", label: "التحليلات", group: "المنتج" },
  { id: "multibranch", number: "05", label: "تعدد الفروع", group: "البنية" },
  { id: "multitenant", number: "06", label: "تعدد المستأجرين", group: "البنية" },
  { id: "database", number: "07", label: "تصميم قاعدة البيانات", group: "الهندسة" },
  { id: "api", number: "08", label: "تصميم الواجهات", group: "الهندسة" },
  { id: "architecture", number: "09", label: "بنية النظام", group: "الهندسة" },
  { id: "security", number: "10", label: "الأمان", group: "الهندسة" },
  { id: "nfr", number: "11", label: "المتطلبات غير الوظيفية", group: "الهندسة" },
  { id: "mvp", number: "12", label: "نطاق MVP", group: "التسليم" },
  { id: "v2", number: "13", label: "الإصدار الثاني والمستقبل", group: "التسليم" },
  { id: "roadmap", number: "14", label: "خارطة الطريق والمخاطر", group: "التسليم" },
  { id: "assumptions", number: "15", label: "الافتراضات", group: "التسليم" },
];

export function SidebarNav() {
  const [activeId, setActiveId] = useState<string>("overview");
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    // تقدّم القراءة
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);

    // كشف القسم النشط
    const offsets = NAV_ITEMS.map((item) => {
      const el = document.getElementById(item.id);
      if (!el) return { id: item.id, top: Number.POSITIVE_INFINITY };
      const rect = el.getBoundingClientRect();
      return { id: item.id, top: rect.top };
    });
    // اختر آخر قسم تصل قمته إلى 140px أو أقل
    const current =
      offsets
        .filter((o) => o.top <= 140)
        .sort((a, b) => b.top - a.top)[0] ?? offsets[0];
    if (current) setActiveId(current.id);
  }, []);

  useEffect(() => {
    const onScroll = () => handleScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // تأجيل الحساب الأولي لتجنّب استدعاء setState بشكل متزامن داخل
    // متن التأثير (ما قد يسبّب إعادة عرض متسلسلة).
    const raf = requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [handleScroll]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setOpen(false);
  };

  // تجميع العناصر
  const groups = NAV_ITEMS.reduce<Record<string, NavItem[]>>((acc, item) => {
    const g = item.group ?? "أخرى";
    (acc[g] = acc[g] ?? []).push(item);
    return acc;
  }, {});

  return (
    <>
      {/* الشريط العلوي للجوال */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/90 backdrop-blur px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="grid place-items-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm">مواصفات مركز التجميل</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} aria-label="تبديل التنقل">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* شريط تقدّم القراءة (الجوال) */}
      <div className="lg:hidden fixed top-14 left-0 right-0 z-40 h-0.5 bg-transparent">
        <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      {/* الشريط الجانبي للحاسوب — يظهر يميناً في RTL */}
      <aside className="hidden lg:flex sticky top-0 h-screen w-72 shrink-0 flex-col border-l border-border bg-sidebar/50 backdrop-blur">
        <SidebarContent
          groups={groups}
          activeId={activeId}
          onNavigate={scrollTo}
          progress={progress}
        />
      </aside>

      {/* درج الجوال */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-80 max-w-[85vw] h-full bg-background border-l border-border overflow-y-auto">
            <div className="flex items-center justify-between px-4 h-14 border-b border-border">
              <span className="font-semibold text-sm">المحتويات</span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <SidebarContent
              groups={groups}
              activeId={activeId}
              onNavigate={scrollTo}
              progress={progress}
              isMobile
            />
          </div>
        </div>
      )}
    </>
  );
}

function SidebarContent({
  groups,
  activeId,
  onNavigate,
  progress,
  isMobile = false,
}: {
  groups: Record<string, NavItem[]>;
  activeId: string;
  onNavigate: (id: string) => void;
  progress: number;
  isMobile?: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      {!isMobile && (
        <div className="px-5 pt-5 pb-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">مركز التجميل</p>
              <p className="text-[11px] text-muted-foreground leading-tight">مواصفات منصة الإدارة</p>
            </div>
          </div>
          <div className="mt-3 h-1 w-full rounded-full bg-sidebar-border overflow-hidden">
            <div className="h-full bg-primary transition-[width] duration-150" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground">تمت قراءة {Math.round(progress)}٪</p>
        </div>
      )}

      <nav className={cn("flex-1 overflow-y-auto px-3 py-4 spec-scroll", isMobile && "py-4")}>
        {Object.entries(groups).map(([group, items]) => (
          <div key={group} className="mb-5">
            <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground">
              {group}
            </p>
            <ul className="space-y-0.5">
              {items.map((item) => {
                const active = activeId === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      className={cn(
                        "w-full text-right flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                        active
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[10px] tabular-nums",
                          active ? "text-primary-foreground/70" : "text-muted-foreground/60"
                        )}
                      >
                        {item.number}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!isMobile && (
        <div className="border-t border-sidebar-border px-5 py-3">
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            نظام حتمي · بدون ميزات ذكاء اصطناعي
          </p>
        </div>
      )}
    </div>
  );
}
