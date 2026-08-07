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
import { toast } from "sonner";
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  Boxes,
  Warehouse,
  Minus,
  Download,
} from "lucide-react";
import type { Product, ProductCategory } from "@/lib/types";

// ---- Category metadata ----
const CATEGORY_LABELS: Record<ProductCategory, string> = {
  hair_color: "صبغات",
  shampoo: "شامبو",
  conditioner: "بلسم",
  facial_mask: "ماسك",
  serum: "سيروم",
  nail_polish: "طلاء أظافر",
  tools: "أدوات",
};

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  hair_color: "#003527",
  shampoo: "#0b513d",
  conditioner: "#735c00",
  facial_mask: "#cca72f",
  serum: "#95d3ba",
  nail_polish: "#5f5e5b",
  tools: "#404944",
};

type CategoryFilter = "all" | ProductCategory;

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "كل الفئات" },
  { value: "hair_color", label: "صبغات" },
  { value: "shampoo", label: "شامبو" },
  { value: "conditioner", label: "بلسم" },
  { value: "facial_mask", label: "ماسك" },
  { value: "serum", label: "سيروم" },
  { value: "nail_polish", label: "طلاء أظافر" },
  { value: "tools", label: "أدوات" },
];

export function InventoryView() {
  const products = useApp((s) => s.products);
  const adjustStock = useApp((s) => s.adjustStock);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  // ---- Derived stats (on full set) ----
  const stats = useMemo(() => {
    const total = products.length;
    const stockValue = products.reduce((s, p) => s + p.stock * p.unitCost, 0);
    const lowCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;
    return { total, stockValue, lowCount };
  }, [products]);

  // ---- Filtered list ----
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    });
  }, [products, query, category]);

  // ---- Stock adjustment handler ----
  const handleAdjust = (product: Product, delta: number) => {
    const next = Math.max(0, product.stock + delta);
    if (next === product.stock) {
      toast.error("لا يمكن تقليل المخزون عن صفر");
      return;
    }
    adjustStock(product.id, delta);
    if (delta > 0) {
      toast.success(`تمت إضافة وحدة لـ ${product.name} • المخزون: ${formatNumber(next)}`);
    } else {
      toast.success(`تم خصم وحدة من ${product.name} • المخزون: ${formatNumber(next)}`);
    }
    if (next <= product.lowStockThreshold) {
      toast.warning(`رصيد منخفض: ${product.name} — ${formatNumber(next)} وحدة متبقية`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="المخزون"
        subtitle="إدارة المنتجات والمستلزمات"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              تصدير المخزون
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              منتج جديد
            </Button>
          </>
        }
      />

      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="إجمالي المنتجات"
          value={formatNumber(stats.total)}
          icon={<Package className="size-4" />}
          hint="أصناف في المخزون"
        />
        <StatCard
          label="قيمة المخزون"
          value={formatEGP(stats.stockValue)}
          icon={<Warehouse className="size-4" />}
          hint="بالتكلفة الإجمالية"
        />
        <StatCard
          label="منتجات منخفضة"
          value={formatNumber(stats.lowCount)}
          icon={<Boxes className="size-4" />}
          delta="تحتاج إعادة طلب"
          deltaType="down"
        />
        <StatCard
          label="تنبيهات"
          value={formatNumber(stats.lowCount)}
          icon={<AlertTriangle className="size-4" />}
          delta="تنبيه نشط"
          deltaType="neutral"
        />
      </div>

      {/* ---- Filter bar ---- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ابحث باسم المنتج أو رمز SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="inv-cat" className="sr-only">
            الفئة
          </label>
          <select
            id="inv-cat"
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

      {/* ---- Inventory table ---- */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="size-10" />}
          title="لا منتجات مطابقة"
          description="جرّب تعديل البحث أو اختيار فئة أخرى من عوامل التصفية."
        />
      ) : (
        <div className="card-hover rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] divide-y divide-border text-sm">
              <thead>
                <tr className="text-right">
                  <Th>المنتج</Th>
                  <Th>SKU</Th>
                  <Th className="text-center">المخزون</Th>
                  <Th className="text-center">الحالة</Th>
                  <Th className="text-end">التكلفة</Th>
                  <Th className="text-end">السعر</Th>
                  <Th className="text-end">الربح</Th>
                  <Th>المورد</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => {
                  const isLow = p.stock <= p.lowStockThreshold;
                  const profit = p.unitPrice - p.unitCost;
                  return (
                    <tr
                      key={p.id}
                      className={isLow ? "bg-amber-50/60 transition-colors hover:bg-amber-50" : "transition-colors hover:bg-muted/40"}
                    >
                      {/* Product */}
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-white"
                            style={{ background: CATEGORY_COLORS[p.category] }}
                          >
                            <Package className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground line-clamp-1">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[p.category]}</p>
                          </div>
                        </div>
                      </td>
                      {/* SKU */}
                      <td className="px-4 py-3 align-middle">
                        <span
                          dir="ltr"
                          className="inline-block rounded bg-muted px-2 py-0.5 font-mono text-xs text-foreground"
                        >
                          {p.sku}
                        </span>
                      </td>
                      {/* Stock controls */}
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() => handleAdjust(p, -1)}
                            disabled={p.stock === 0}
                            aria-label="خصم وحدة"
                          >
                            <Minus className="size-3.5" />
                          </Button>
                          <span className="min-w-[2.5rem] text-center font-display text-base font-bold text-foreground tnum">
                            {formatNumber(p.stock)}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-7"
                            onClick={() => handleAdjust(p, 1)}
                            aria-label="إضافة وحدة"
                          >
                            <Plus className="size-3.5" />
                          </Button>
                        </div>
                        <p className="mt-1 text-center text-[10px] text-muted-foreground">
                          الحد: <span className="tnum">{formatNumber(p.lowStockThreshold)}</span>
                        </p>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3 text-center align-middle">
                        {isLow ? (
                          <Badge variant="warning">
                            <AlertTriangle className="size-3" />
                            مخزون منخفض
                          </Badge>
                        ) : (
                          <Badge variant="success">متوفر</Badge>
                        )}
                      </td>
                      {/* Cost */}
                      <td className="px-4 py-3 text-end align-middle tnum text-muted-foreground">
                        {formatEGP(p.unitCost)}
                      </td>
                      {/* Price */}
                      <td className="px-4 py-3 text-end align-middle tnum font-semibold text-foreground">
                        {formatEGP(p.unitPrice)}
                      </td>
                      {/* Profit */}
                      <td className="px-4 py-3 text-end align-middle">
                        <span className="tnum font-semibold text-emerald-700">
                          {formatEGP(profit)}
                        </span>
                      </td>
                      {/* Supplier */}
                      <td className="px-4 py-3 align-middle text-xs text-muted-foreground">
                        {p.supplier}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---- Low stock summary ---- */}
      {stats.lowCount > 0 && (
        <div className="card-hover rounded-lg border border-amber-200 bg-amber-50/40 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-amber-100 text-amber-700">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <SectionTitle>تنبيهات المخزون المنخفض</SectionTitle>
                <p className="mt-1 text-sm text-foreground">
                  يوجد <span className="font-bold tnum">{formatNumber(stats.lowCount)}</span> منتج يحتاج إلى إعادة طلب في أقرب وقت.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-amber-300 text-amber-800 hover:bg-amber-100">
              إنشاء أمر شراء
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Table header cell ----
function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground ${className}`}
    >
      {children}
    </th>
  );
}
