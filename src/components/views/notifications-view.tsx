"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import {
  PageHeader,
  SectionTitle,
  EmptyState,
} from "@/components/shared/ui";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Bell,
  Clock,
  CheckCircle,
  Package,
  Cake,
  UserX,
  Gift,
  Megaphone,
  CheckCheck,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { relativeTime } from "@/lib/format";
import type { AppNotification, NotificationType } from "@/lib/types";

// ============================================================
// Type → Icon mapping
// ============================================================

const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  appointment_reminder: Clock,
  booking_confirmation: CheckCircle,
  low_stock: Package,
  customer_birthday: Cake,
  inactive_customer: UserX,
  loyalty_milestone: Gift,
  campaign_sent: Megaphone,
};

// ============================================================
// Severity → hex color
// ============================================================

const SEVERITY_COLORS: Record<AppNotification["severity"], string> = {
  info: "#404944",
  success: "#0b513d",
  warning: "#cca72f",
  error: "#ba1a1a",
};

// ============================================================
// Filter pills
// ============================================================

type FilterId = "all" | "unread" | "appointment" | "stock" | "loyalty" | "customers";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "unread", label: "غير مقروء" },
  { id: "appointment", label: "تذكير موعد" },
  { id: "stock", label: "مخزون" },
  { id: "loyalty", label: "ولاء" },
  { id: "customers", label: "عملاء" },
];

function matchesFilter(n: AppNotification, filter: FilterId): boolean {
  switch (filter) {
    case "all":
      return true;
    case "unread":
      return !n.read;
    case "appointment":
      return n.type === "appointment_reminder";
    case "stock":
      return n.type === "low_stock";
    case "loyalty":
      return n.type === "loyalty_milestone";
    case "customers":
      return (
        n.type === "customer_birthday" ||
        n.type === "inactive_customer" ||
        n.type === "booking_confirmation" ||
        n.type === "campaign_sent"
      );
  }
}

// ============================================================
// Main component
// ============================================================

export function NotificationsView() {
  const notifications = useApp((s) => s.notifications);
  const markNotificationRead = useApp((s) => s.markNotificationRead);
  const markAllNotificationsRead = useApp((s) => s.markAllNotificationsRead);

  const [filter, setFilter] = useState<FilterId>("all");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const filtered = useMemo(
    () => notifications.filter((n) => matchesFilter(n, filter)),
    [notifications, filter],
  );

  const handleMarkAllRead = () => {
    if (unreadCount === 0) {
      toast.info("لا توجد إشعارات غير مقروءة");
      return;
    }
    markAllNotificationsRead();
    toast.success("تم تحديد جميع الإشعارات كمقروءة");
  };

  const handleClickNotification = (n: AppNotification) => {
    if (!n.read) {
      markNotificationRead(n.id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="مركز التنبيهات"
        subtitle={
          unreadCount > 0
            ? `لديك ${unreadCount} إشعار غير مقروء`
            : "كل الإشعارات مقروءة"
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="gap-2"
            disabled={unreadCount === 0}
          >
            <CheckCheck className="size-4" />
            تحديد الكل كمقروء
          </Button>
        }
      />

      {/* Filter pills */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const count =
            f.id === "all"
              ? notifications.length
              : notifications.filter((n) => matchesFilter(n, f.id)).length;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors " +
                (active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted/60")
              }
            >
              <span>{f.label}</span>
              <span
                className={
                  "tnum rounded-full px-1.5 py-0.5 text-xs " +
                  (active ? "bg-primary-foreground/15 text-primary-foreground" : "bg-muted text-muted-foreground")
                }
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-10" />}
          title="لا توجد إشعارات"
          description={
            filter === "all"
              ? "ستظهر هنا جميع التنبيهات الجديدة من النظام"
              : "لا توجد إشعارات في هذه الفئة حالياً"
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <ul className="divide-y divide-border">
            {filtered.map((n) => {
              const Icon = TYPE_ICON[n.type] ?? Bell;
              const color = SEVERITY_COLORS[n.severity];
              const isUnread = !n.read;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleClickNotification(n)}
                    className={
                      "flex w-full items-start gap-3 px-4 py-4 text-right transition-colors hover:bg-muted/40 " +
                      (isUnread ? "bg-primary/[0.03]" : "")
                    }
                    style={{ borderRightWidth: 4, borderRightColor: color, borderRightStyle: "solid" }}
                  >
                    {/* Icon circle (leading edge in RTL) */}
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${color}1a`, color }}
                      aria-hidden
                    >
                      <Icon className="size-5" />
                    </div>

                    {/* Body */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {isUnread && (
                            <span
                              className="mt-1 size-2 shrink-0 rounded-full bg-primary"
                              aria-label="غير مقروء"
                            />
                          )}
                          <p
                            className={
                              "truncate font-semibold " +
                              (isUnread ? "text-foreground" : "text-foreground/90")
                            }
                          >
                            {n.title}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {relativeTime(n.date)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {n.body}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Footer summary */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            عرض {filtered.length} من أصل {notifications.length} إشعار
          </span>
          {unreadCount > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary" />
              {unreadCount} غير مقروء
            </span>
          )}
        </div>
      )}
    </div>
  );
}
