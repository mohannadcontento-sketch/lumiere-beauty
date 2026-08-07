import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function SectionHeader({
  number,
  title,
  subtitle,
  kicker,
}: {
  number: string;
  title: string;
  subtitle?: string;
  kicker?: string;
}) {
  return (
    <header className="mb-8">
      {kicker && (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">
          {kicker}
        </p>
      )}
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-muted-foreground/70 tabular-nums">{number}</span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      {subtitle && (
        <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </header>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-10 sm:py-14 border-t border-border/60 first:border-t-0", className)}
    >
      {children}
    </section>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "rose" | "amber" | "emerald" | "violet" | "slate";
}) {
  const tones: Record<string, string> = {
    default: "bg-secondary text-secondary-foreground border-border",
    rose: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
    amber:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
    emerald:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
    violet:
      "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900",
    slate:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function YesNo({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-grid place-items-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-[11px] font-bold">
      ✓
    </span>
  ) : (
    <span className="inline-grid place-items-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-[11px]">
      —
    </span>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed">
          <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
          <span className="text-foreground/90">{item}</span>
        </li>
      ))}
    </ul>
  );
}
