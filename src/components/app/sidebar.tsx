"use client";

import { useApp, type ViewId } from "@/lib/store";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  UserCog,
  ShoppingCart,
  Package,
  Gift,
  Megaphone,
  BarChart3,
  Settings,
  Bell,
  CalendarCheck,
  UserCircle,
  Clock,
  TrendingUp,
  TicketPercent,
  Sparkles,
  X,
} from "lucide-react";

interface NavItem {
  id: ViewId;
  label: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "الرئيسية",
    items: [
      { id: "dashboard", label: "لوحة القيادة", icon: LayoutDashboard, roles: ["owner", "reception"] },
      { id: "calendar", label: "التقويم والمواعيد", icon: CalendarDays, roles: ["owner", "reception"] },
      { id: "staff_today", label: "مواعيد اليوم", icon: CalendarCheck, roles: ["staff"] },
      { id: "my_profile", label: "ملفي", icon: UserCircle, roles: ["customer"] },
    ],
  },
  {
    title: "العمليات",
    items: [
      { id: "customers", label: "العملاء", icon: Users, roles: ["owner", "reception"] },
      { id: "staff_customers", label: "عملائي", icon: Users, roles: ["staff"] },
      { id: "pos", label: "نقطة البيع", icon: ShoppingCart, roles: ["owner", "reception"] },
      { id: "my_appointments", label: "مواعيدي", icon: CalendarDays, roles: ["customer"] },
      { id: "book_appointment", label: "حجز موعد", icon: CalendarCheck, roles: ["customer"] },
    ],
  },
  {
    title: "الإدارة",
    items: [
      { id: "services", label: "الخدمات", icon: Scissors, roles: ["owner"] },
      { id: "staff", label: "الموظفون", icon: UserCog, roles: ["owner"] },
      { id: "inventory", label: "المخزون", icon: Package, roles: ["owner"] },
      { id: "loyalty", label: "الولاء والعضويات", icon: Gift, roles: ["owner"] },
      { id: "marketing", label: "التسويق", icon: Megaphone, roles: ["owner"] },
      { id: "reports", label: "التقارير", icon: BarChart3, roles: ["owner"] },
      { id: "settings", label: "الإعدادات", icon: Settings, roles: ["owner"] },
    ],
  },
  {
    title: "الأداء",
    items: [
      { id: "staff_schedule", label: "الجدول", icon: Clock, roles: ["staff"] },
      { id: "staff_performance", label: "الأداء", icon: TrendingUp, roles: ["staff"] },
    ],
  },
  {
    title: "حسابي",
    items: [
      { id: "my_offers", label: "العروض", icon: TicketPercent, roles: ["customer"] },
      { id: "loyalty", label: "ولائي", icon: Gift, roles: ["customer"] },
    ],
  },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const role = useApp((s) => s.users.find((u) => u.id === s.currentUserId)?.role ?? "owner");
  const view = useApp((s) => s.view);
  const setView = useApp((s) => s.setView);
  const notifications = useApp((s) => s.notifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <aside className="flex h-full w-72 flex-col border-l border-border bg-sidebar">
      {/* Brand */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display text-lg font-bold leading-none text-primary">لوميير</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Beauty Suite</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent lg:hidden">
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="thin-scroll flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter((it) => it.roles.includes(role));
          if (items.length === 0) return null;
          return (
            <div key={group.title} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = view === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setView(item.id);
                        onClose?.();
                      }}
                      className={cn(
                        "relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                      )}
                    >
                      {active && <span className="nav-active-bar" />}
                      <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
                      <span className="flex-1 text-right">{item.label}</span>
                      {item.id === "notifications" && unreadCount > 0 && (
                        <span className="rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Notifications shortcut — always visible */}
        <div className="mb-5">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            التنبيهات
          </p>
          <button
            onClick={() => {
              setView("notifications");
              onClose?.();
            }}
            className={cn(
              "relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              view === "notifications"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            {view === "notifications" && <span className="nav-active-bar" />}
            <Bell className={cn("size-4 shrink-0", view === "notifications" && "text-primary")} />
            <span className="flex-1 text-right">مركز التنبيهات</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="rounded-md bg-sidebar-accent/50 p-3 text-center">
          <p className="text-[11px] text-muted-foreground">الإصدار التجريبي ٢٫٠</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground/70">© لوميير بيوتي</p>
        </div>
      </div>
    </aside>
  );
}
