"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import {
  PageHeader,
  SectionTitle,
  StatCard,
  Badge,
  EmptyState,
} from "@/components/shared/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatEGP, formatNumber } from "@/lib/format";
import {
  Search,
  Plus,
  Sparkles,
  Clock,
  UserCog,
  TrendingUp,
  Pencil,
  Tag,
} from "lucide-react";
import type { Service, ServiceCategory } from "@/lib/types";

// ---- Category metadata ----
const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  hair_color: "صبغات",
  hair_treatment: "علاج الشعر",
  hair_styling: "تصفيف",
  facial: "بشرة",
  manicure: "مانيكير",
  pedicure: "باديكير",
  makeup: "مكياج",
};

const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  hair_color: "#003527",
  hair_treatment: "#0b513d",
  hair_styling: "#735c00",
  facial: "#cca72f",
  manicure: "#95d3ba",
  pedicure: "#5f5e5b",
  makeup: "#404944",
};

type CategoryFilter = "all" | ServiceCategory;

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "hair_color", label: "صبغات" },
  { value: "hair_treatment", label: "علاج الشعر" },
  { value: "hair_styling", label: "تصفيف" },
  { value: "facial", label: "بشرة" },
  { value: "manicure", label: "مانيكير" },
  { value: "pedicure", label: "باديكير" },
  { value: "makeup", label: "مكياج" },
];

export function ServicesView() {
  const services = useApp((s) => s.services);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  // ---- Derived stats (computed on the full set, not the filtered one) ----
  const stats = useMemo(() => {
    const total = services.length;
    const active = services.filter((s) => s.status === "active").length;
    const avgPrice =
      total > 0 ? Math.round(services.reduce((s, x) => s + x.price, 0) / total) : 0;
    const totalBookings = services.reduce((s, x) => s + x.popularity, 0);
    return { total, active, avgPrice, totalBookings };
  }, [services]);

  // ---- Filtered list ----
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services.filter((s) => {
      if (category !== "all" && s.category !== category) return false;
      if (!q) return true;
      return s.name.toLowerCase().includes(q);
    });
  }, [services, query, category]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="الخدمات"
        subtitle={`${formatNumber(stats.total)} خدمة في كتالوج لوميير بيوتي`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Tag className="size-4" />
              تصدير القائمة
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              خدمة جديدة
            </Button>
          </>
        }
      />

      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="إجمالي الخدمات"
          value={formatNumber(stats.total)}
          icon={<Sparkles className="size-4" />}
          hint="في الكتالوج"
        />
        <StatCard
          label="الخدمات النشطة"
          value={formatNumber(stats.active)}
          icon={<Tag className="size-4" />}
          delta={`${formatNumber(stats.total - stats.active)} متوقفة`}
          deltaType="neutral"
        />
        <StatCard
          label="متوسط السعر"
          value={formatEGP(stats.avgPrice)}
          icon={<TrendingUp className="size-4" />}
          hint="للجلسة الواحدة"
        />
        <StatCard
          label="إجمالي الحجوزات"
          value={formatNumber(stats.totalBookings)}
          icon={<TrendingUp className="size-4" />}
          delta="تراكمي"
          deltaType="up"
        />
      </div>

      {/* ---- Filter bar ---- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ابحث باسم الخدمة..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="svc-cat" className="sr-only">
            الفئة
          </label>
          <select
            id="svc-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryFilter)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            {CATEGORY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {formatNumber(filtered.length)} نتيجة
          </span>
        </div>
      </div>

      {/* ---- Services grid ---- */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="size-10" />}
          title="لا خدمات مطابقة"
          description="جرّب تعديل البحث أو اختيار فئة أخرى من عوامل التصفية."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((svc) => (
            <ServiceCard key={svc.id} service={svc} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ServiceCard
// ============================================================
function ServiceCard({ service }: { service: Service }) {
  const catColor = CATEGORY_COLORS[service.category];
  const catLabel = CATEGORY_LABELS[service.category];
  const isActive = service.status === "active";

  return (
    <article className="card-hover flex flex-col rounded-lg border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-snug text-foreground">
            {service.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {service.description}
          </p>
        </div>
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
          style={{ background: catColor }}
        >
          {catLabel}
        </span>
      </div>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-primary tnum">
          {formatEGP(service.price)}
        </span>
        <span className="text-xs text-muted-foreground">/ جلسة</span>
      </div>

      {/* Meta row */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-3.5 text-primary/70" />
          <span className="tnum">{formatNumber(service.durationMin)}</span>
          <span>دقيقة</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <UserCog className="size-3.5 text-primary/70" />
          <span className="tnum">{formatNumber(service.staffIds.length)}</span>
          <span>أخصائي</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <TrendingUp className="size-3.5 text-primary/70" />
          <span className="tnum">{formatNumber(service.popularity)}</span>
          <span>حجز</span>
        </div>
        <div className="flex items-center justify-start">
          {isActive ? (
            <Badge variant="success">نشط</Badge>
          ) : (
            <Badge variant="neutral">غير نشط</Badge>
          )}
        </div>
      </div>

      {/* Footer action */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          تكلفة المواد:{" "}
          <span className="tnum text-foreground">{formatEGP(service.cost)}</span>
        </span>
        <Button variant="ghost" size="sm">
          <Pencil className="size-3.5" />
          تعديل
        </Button>
      </div>
    </article>
  );
}
