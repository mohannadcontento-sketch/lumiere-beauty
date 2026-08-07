"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { PageHeader, Badge, Avatar, EmptyState, StatusBadge, SectionTitle } from "@/components/shared/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatEGP, formatDateShort, formatDate } from "@/lib/format";
import { Search, Plus, Users, Star, Phone, Mail, Filter, Download } from "lucide-react";
import type { Customer, MembershipTier } from "@/lib/types";

const TIER_LABELS: Record<MembershipTier, string> = { basic: "أساسي", gold: "ذهبي", vip: "VIP" };
const TIER_COLORS: Record<MembershipTier, string> = { basic: "#5f5e5b", gold: "#cca72f", vip: "#003527" };

export function CustomersView() {
  const customers = useApp((s) => s.customers);
  const openCustomer = useApp((s) => s.openCustomer);
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<string>("all");
  const [tag, setTag] = useState<string>("all");

  const allTags = useMemo(() => {
    const s = new Set<string>();
    customers.forEach((c) => c.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [customers]);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (tier !== "all" && c.membershipTier !== tier) return false;
      if (tag !== "all" && !c.tags.includes(tag)) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(query) ||
          c.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [customers, query, tier, tag]);

  const totalSpend = filtered.reduce((s, c) => s + c.totalSpend, 0);
  const avgSpend = filtered.length > 0 ? Math.round(totalSpend / filtered.length) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="العملاء"
        subtitle={`${formatNumberLocal(customers.length)} عميل — إجمالي الإنفاق ${formatEGP(customers.reduce((s, c) => s + c.totalSpend, 0))}`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="size-4" />
              تصدير
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              عميل جديد
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <SectionTitle>إجمالي العملاء</SectionTitle>
          <p className="mt-2 font-display text-2xl font-bold">{formatNumberLocal(customers.length)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <SectionTitle>عملاء VIP</SectionTitle>
          <p className="mt-2 font-display text-2xl font-bold">{formatNumberLocal(customers.filter((c) => c.membershipTier === "vip").length)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <SectionTitle>متوسط الإنفاق</SectionTitle>
          <p className="mt-2 font-display text-2xl font-bold">{formatEGP(avgSpend)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <SectionTitle>عملاء غير نشطين</SectionTitle>
          <p className="mt-2 font-display text-2xl font-bold">{formatNumberLocal(customers.filter((c) => c.tags.includes("غير نشط")).length)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو الهاتف أو البريد..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-9"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">كل العضويات</option>
            <option value="vip">VIP</option>
            <option value="gold">ذهبي</option>
            <option value="basic">أساسي</option>
          </select>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">كل الفئات</option>
            {allTags.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="thin-scroll overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-right">العميل</th>
                <th className="hidden px-4 py-3 text-right md:table-cell">التواصل</th>
                <th className="hidden px-4 py-3 text-right lg:table-cell">العضوية</th>
                <th className="px-4 py-3 text-right">الزيارات</th>
                <th className="px-4 py-3 text-right">الإنفاق</th>
                <th className="hidden px-4 py-3 text-right lg:table-cell">النقاط</th>
                <th className="hidden px-4 py-3 text-right lg:table-cell">آخر زيارة</th>
                <th className="px-4 py-3 text-right">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-accent/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} color={TIER_COLORS[c.membershipTier]} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{c.name}</p>
                        <div className="mt-0.5 flex flex-wrap gap-1">
                          {c.tags.slice(0, 2).map((t) => (
                            <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="size-3" /> {c.phone}</span>
                      <span className="flex items-center gap-1 truncate"><Mail className="size-3" /> {c.email}</span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                      style={{ background: TIER_COLORS[c.membershipTier] }}
                    >
                      <Star className="size-3" />
                      {TIER_LABELS[c.membershipTier]}
                    </span>
                  </td>
                  <td className="px-4 py-3 tnum">{formatNumberLocal(c.visitCount)}</td>
                  <td className="px-4 py-3 tnum font-semibold">{formatEGP(c.totalSpend)}</td>
                  <td className="hidden px-4 py-3 tnum lg:table-cell">{formatNumberLocal(c.loyaltyPoints)}</td>
                  <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                    {c.lastVisit ? formatDateShort(c.lastVisit) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" onClick={() => openCustomer(c.id)}>
                      عرض
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8">
            <EmptyState icon={<Users className="size-10" />} title="لا عملاء مطابقون" description="جرّب تعديل عوامل التصفية أو البحث" />
          </div>
        )}
      </div>
    </div>
  );
}

function formatNumberLocal(n: number): string {
  return new Intl.NumberFormat("ar-EG").format(n);
}
