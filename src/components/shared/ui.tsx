"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}>
      {children}
    </h2>
  );
}

export function StatCard({
  label,
  value,
  delta,
  deltaType = "neutral",
  icon,
  hint,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  deltaType?: "up" | "down" | "neutral";
  icon?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="card-hover rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground tnum">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {icon && (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/8 text-primary">
            {icon}
          </div>
        )}
      </div>
      {delta && (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 text-xs font-semibold",
            deltaType === "up" && "text-emerald-700",
            deltaType === "down" && "text-destructive",
            deltaType === "neutral" && "text-muted-foreground",
          )}
        >
          {deltaType === "up" && "▲"}
          {deltaType === "down" && "▼"}
          {delta}
        </div>
      )}
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral" | "primary";
  className?: string;
}) {
  const variants = {
    default: "bg-primary/8 text-primary",
    primary: "bg-primary text-primary-foreground",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-sky-50 text-sky-700 border border-sky-200",
    neutral: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      {icon && <div className="mb-3 text-muted-foreground/50">{icon}</div>}
      <p className="font-display text-lg font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" | "primary" }> = {
    scheduled: { label: "مجدول", variant: "info" },
    confirmed: { label: "مؤكد", variant: "primary" },
    checked_in: { label: "تم الوصول", variant: "warning" },
    in_progress: { label: "قيد التنفيذ", variant: "warning" },
    completed: { label: "مكتمل", variant: "success" },
    cancelled: { label: "ملغي", variant: "danger" },
    no_show: { label: "لم يحضر", variant: "neutral" },
    paid: { label: "مدفوع", variant: "success" },
    partial: { label: "مدفوع جزئياً", variant: "warning" },
    unpaid: { label: "غير مدفوع", variant: "danger" },
    refunded: { label: "مسترد", variant: "neutral" },
    active: { label: "نشط", variant: "success" },
    inactive: { label: "غير نشط", variant: "neutral" },
    on_leave: { label: "في إجازة", variant: "warning" },
    draft: { label: "مسودة", variant: "neutral" },
    running: { label: "جارية", variant: "info" },
  };
  const s = map[status] ?? { label: status, variant: "neutral" as const };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export function Avatar({
  name,
  color,
  size = "md",
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
  const sizes = {
    sm: "size-7 text-xs",
    md: "size-9 text-sm",
    lg: "size-12 text-base",
  };
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full font-semibold text-white", sizes[size])}
      style={{ background: color ?? "#003527" }}
    >
      {initials}
    </div>
  );
}
