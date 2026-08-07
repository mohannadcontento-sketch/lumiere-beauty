"use client";

import { useMemo, useState } from "react";
import { useApp, useCurrentUser } from "@/lib/store";
import {
  PageHeader,
  SectionTitle,
  StatCard,
  Badge,
  EmptyState,
  Avatar,
} from "@/components/shared/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatEGP, formatNumber, formatDateTime } from "@/lib/format";
import { toast } from "sonner";
import {
  Coins,
  Gift,
  Users,
  TrendingUp,
  Sparkles,
  Check,
  X,
  Crown,
  Medal,
  Star,
  Award,
  Filter,
  Pencil,
} from "lucide-react";
import type {
  Customer,
  LoyaltyLedgerEntry,
  LoyaltyRule,
  MembershipPlan,
  MembershipTier,
  Segment,
} from "@/lib/types";

const TIER_LABELS: Record<MembershipTier, string> = {
  basic: "أساسي",
  gold: "ذهبي",
  vip: "VIP",
};

const TIER_BADGE_VARIANT: Record<MembershipTier, "neutral" | "warning" | "primary"> = {
  basic: "neutral",
  gold: "warning",
  vip: "primary",
};

const TIER_ICON: Record<MembershipTier, React.ReactNode> = {
  basic: <Star className="size-3.5" />,
  gold: <Medal className="size-3.5" />,
  vip: <Crown className="size-3.5" />,
};

export function LoyaltyView() {
  const user = useCurrentUser();
  const customers = useApp((s) => s.customers);
  const ledger = useApp((s) => s.loyaltyLedger);
  const rule = useApp((s) => s.loyaltyRule);
  const memberships = useApp((s) => s.memberships);
  const segments = useApp((s) => s.segments);

  // ---- Customer-context narrowing ----
  // If the current user is a customer, only show their own loyalty info.
  const isCustomerUser = user?.role === "customer" && !!user?.customerId;
  const me: Customer | undefined = isCustomerUser
    ? customers.find((c) => c.id === user?.customerId)
    : undefined;

  const scopedCustomers: Customer[] = isCustomerUser && me ? [me] : customers;
  const scopedLedger: LoyaltyLedgerEntry[] = isCustomerUser && me
    ? ledger.filter((l) => l.customerId === me.id)
    : ledger;

  return (
    <div className="space-y-6">
      <PageHeader
        title="الولاء والعضويات"
        subtitle={isCustomerUser ? "متابعة نقاطك وعضويتك في برنامج لوميير بيوتي" : "برنامج النقاط وعضويات العملاء"}
        actions={
          !isCustomerUser ? (
            <RedeemDialogButton customers={customers} rule={rule} />
          ) : undefined
        }
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-card p-1">
          <TabsTrigger value="overview" className="flex-1 sm:flex-none">نظرة عامة</TabsTrigger>
          <TabsTrigger value="memberships" className="flex-1 sm:flex-none">العضويات</TabsTrigger>
          <TabsTrigger value="ledger" className="flex-1 sm:flex-none">سجل النقاط</TabsTrigger>
        </TabsList>

        {/* ===== Tab 1: Overview ===== */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <OverviewTab
            customers={scopedCustomers}
            ledger={scopedLedger}
            rule={rule}
            segments={isCustomerUser ? [] : segments}
            isCustomerUser={isCustomerUser}
            me={me}
          />
        </TabsContent>

        {/* ===== Tab 2: Memberships ===== */}
        <TabsContent value="memberships" className="mt-6">
          <MembershipsTab memberships={memberships} currentTier={me?.membershipTier} />
        </TabsContent>

        {/* ===== Tab 3: Ledger ===== */}
        <TabsContent value="ledger" className="mt-6">
          <LedgerTab ledger={scopedLedger} customers={scopedCustomers} isReadOnly={isCustomerUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================
// Tab 1 — Overview
// ============================================================
function OverviewTab({
  customers,
  ledger,
  rule,
  segments,
  isCustomerUser,
  me,
}: {
  customers: Customer[];
  ledger: LoyaltyLedgerEntry[];
  rule: LoyaltyRule;
  segments: Segment[];
  isCustomerUser: boolean;
  me?: Customer;
}) {
  const stats = useMemo(() => {
    const totalEarned = ledger
      .filter((l) => l.points > 0)
      .reduce((s, l) => s + l.points, 0);
    const totalRedeemed = Math.abs(
      ledger.filter((l) => l.points < 0).reduce((s, l) => s + l.points, 0),
    );
    const activeCount = customers.filter((c) => c.loyaltyPoints > 0).length;
    const totalPoints = customers.reduce((s, c) => s + c.loyaltyPoints, 0);
    const avg = activeCount > 0 ? Math.round(totalPoints / activeCount) : 0;
    return { totalEarned, totalRedeemed, activeCount, avg };
  }, [customers, ledger]);

  const topCustomers = useMemo(
    () => [...customers].sort((a, b) => b.loyaltyPoints - a.loyaltyPoints).slice(0, 5),
    [customers],
  );

  return (
    <div className="space-y-6">
      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="إجمالي النقاط الموزعة"
          value={formatNumber(stats.totalEarned)}
          icon={<Coins className="size-4" />}
          hint="تراكمي للمكتسب"
        />
        <StatCard
          label="نقاط مستبدلة"
          value={formatNumber(stats.totalRedeemed)}
          icon={<Gift className="size-4" />}
          delta="تم استبدالها"
          deltaType="neutral"
        />
        <StatCard
          label="عملاء نشطون"
          value={formatNumber(stats.activeCount)}
          icon={<Users className="size-4" />}
          hint="في برنامج الولاء"
        />
        <StatCard
          label="متوسط النقاط/عميل"
          value={formatNumber(stats.avg)}
          icon={<TrendingUp className="size-4" />}
          delta="للعميل النشط"
          deltaType="up"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---- Loyalty rule card ---- */}
        <div className="card-hover rounded-lg border border-border bg-card p-5">
          <SectionTitle>قواعد الولاء</SectionTitle>
          <div className="mt-4 space-y-3">
            <RuleRow icon={<Coins className="size-4 text-primary" />} label="معدل الكسب" value="نقطة لكل ١٠٠ ج.م" />
            <RuleRow
              icon={<Award className="size-4 text-primary" />}
              label="الحد الأدنى للاستبدال"
              value={`${formatNumber(rule.minRedeemPoints)} نقطة`}
            />
            <RuleRow
              icon={<Gift className="size-4 text-primary" />}
              label="قيمة النقطة"
              value={formatEGP(rule.pointsToEgpRate)}
            />
          </div>
        </div>

        {/* ---- Personal card (customer-context) ---- */}
        {isCustomerUser && me ? (
          <div className="card-hover rounded-lg border border-primary/30 bg-primary/5 p-5 lg:col-span-2">
            <SectionTitle>رصيدك الحالي</SectionTitle>
            <div className="mt-3 flex items-end gap-3">
              <span className="font-display text-5xl font-bold text-primary tnum">
                {formatNumber(me.loyaltyPoints)}
              </span>
              <span className="pb-1 text-sm text-muted-foreground">نقطة</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-xs">
              <Badge variant={TIER_BADGE_VARIANT[me.membershipTier]}>
                {TIER_ICON[me.membershipTier]}
                عضوية {TIER_LABELS[me.membershipTier]}
              </Badge>
              <span className="text-muted-foreground">
                إجمالي الإنفاق:{" "}
                <span className="font-semibold text-foreground tnum">{formatEGP(me.totalSpend)}</span>
              </span>
              <span className="text-muted-foreground">
                عدد الزيارات:{" "}
                <span className="font-semibold text-foreground tnum">{formatNumber(me.visitCount)}</span>
              </span>
              <span className="text-muted-foreground">
                قيمة رصيدك:{" "}
                <span className="font-semibold text-foreground tnum">{formatEGP(me.loyaltyPoints * rule.pointsToEgpRate)}</span>
              </span>
            </div>
          </div>
        ) : (
          /* ---- Top customers list ---- */
          <div className="card-hover rounded-lg border border-border bg-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <SectionTitle>أعلى ٥ عملاء بالنقاط</SectionTitle>
              <Badge variant="primary">
                <Sparkles className="size-3" />
                الأكثر ولاءً
              </Badge>
            </div>
            <ul className="mt-4 space-y-3">
              {topCustomers.map((c, i) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-border bg-card px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground tnum">
                      {formatNumber(i + 1)}
                    </span>
                    <Avatar name={c.name} color={c.membershipTier === "vip" ? "#003527" : c.membershipTier === "gold" ? "#cca72f" : "#5f5e5b"} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        عضوية {TIER_LABELS[c.membershipTier]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold text-primary tnum">
                      {formatNumber(c.loyaltyPoints)}
                    </span>
                    <span className="text-xs text-muted-foreground">نقطة</span>
                    <Badge variant={TIER_BADGE_VARIANT[c.membershipTier]}>{TIER_LABELS[c.membershipTier]}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ---- Segments panel (staff/owner only) ---- */}
      {!isCustomerUser && segments.length > 0 && (
        <div className="space-y-3">
          <SectionTitle>شرائح العملاء</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {segments.map((s) => (
              <SegmentCard key={s.id} segment={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RuleRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2.5">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground tnum">{value}</span>
    </div>
  );
}

function SegmentCard({ segment }: { segment: Segment }) {
  return (
    <article
      className="card-hover overflow-hidden rounded-lg border border-border bg-card p-5"
      style={{ borderRightWidth: 4, borderRightColor: segment.color }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold text-foreground">{segment.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{segment.description}</p>
        </div>
        <span
          className="inline-flex size-3 shrink-0 rounded-full"
          style={{ background: segment.color }}
        />
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="font-display text-3xl font-bold text-foreground tnum">
            {formatNumber(segment.count)}
          </p>
          <p className="text-xs text-muted-foreground">عميل</p>
        </div>
        <code
          dir="ltr"
          className="rounded bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground"
        >
          {segment.rule}
        </code>
      </div>
    </article>
  );
}

// ============================================================
// Tab 2 — Memberships
// ============================================================
function MembershipsTab({
  memberships,
  currentTier,
}: {
  memberships: MembershipPlan[];
  currentTier?: MembershipTier;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {memberships.map((m) => (
        <MembershipCard key={m.tier} plan={m} isCurrent={currentTier === m.tier} />
      ))}
    </div>
  );
}

function MembershipCard({ plan, isCurrent }: { plan: MembershipPlan; isCurrent: boolean }) {
  const isVip = plan.tier === "vip";
  return (
    <article
      className={`card-hover relative flex flex-col overflow-hidden rounded-lg border bg-card ${
        isVip ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      {/* Color strip */}
      <div className="h-1.5 w-full" style={{ background: plan.color }} />

      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="flex size-9 items-center justify-center rounded-md text-white"
              style={{ background: plan.color }}
            >
              {plan.tier === "vip" ? (
                <Crown className="size-4" />
              ) : plan.tier === "gold" ? (
                <Medal className="size-4" />
              ) : (
                <Star className="size-4" />
              )}
            </span>
            <h3 className="font-display text-lg font-semibold text-foreground">{plan.name}</h3>
          </div>
          {isVip && (
            <Badge variant="primary">
              <Sparkles className="size-3" />
              الأكثر شعبية
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-4xl font-bold text-foreground tnum">
            {formatEGP(plan.price)}
          </span>
          <span className="text-xs text-muted-foreground">/سنة</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          المدة: <span className="tnum">{formatNumber(plan.durationMonths)}</span> شهر
        </p>

        {/* Discount + free services */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-md border border-border bg-background px-3 py-2 text-center">
            <p className="font-display text-xl font-bold text-primary tnum">
              {formatNumber(plan.discountPct)}٪
            </p>
            <p className="text-[10px] text-muted-foreground">خصم الخدمات</p>
          </div>
          <div className="rounded-md border border-border bg-background px-3 py-2 text-center">
            <p className="font-display text-xl font-bold text-primary tnum">
              {formatNumber(plan.freeServicesPerMonth)}
            </p>
            <p className="text-[10px] text-muted-foreground">خدمة مجانية/شهر</p>
          </div>
        </div>

        {/* Priority booking */}
        <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
          <span className="text-xs text-muted-foreground">حجز أولوية</span>
          {plan.priorityBooking ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <Check className="size-3.5" />
              متاح
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <X className="size-3.5" />
              غير متاح
            </span>
          )}
        </div>

        {/* Perks list */}
        <ul className="mt-4 flex-1 space-y-2 border-t border-border pt-4">
          {plan.perks.map((perk, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-foreground">
              <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
              <span>{perk}</span>
            </li>
          ))}
        </ul>

        {/* Action */}
        <Button
          variant={isVip ? "default" : "outline"}
          size="sm"
          className="mt-5 w-full"
        >
          <Pencil className="size-3.5" />
          {isCurrent ? "خطتك الحالية" : "تعديل الخطة"}
        </Button>
      </div>
    </article>
  );
}

// ============================================================
// Tab 3 — Ledger
// ============================================================
type LedgerTypeFilter = "all" | "earn" | "redeem";

function LedgerTab({
  ledger,
  customers,
  isReadOnly,
}: {
  ledger: LoyaltyLedgerEntry[];
  customers: Customer[];
  isReadOnly: boolean;
}) {
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<LedgerTypeFilter>("all");

  const customerName = (id: string) =>
    customers.find((c) => c.id === id)?.name ?? "—";

  const filtered = useMemo(() => {
    return ledger.filter((l) => {
      if (customerFilter !== "all" && l.customerId !== customerFilter) return false;
      if (typeFilter === "earn" && l.type !== "earn") return false;
      if (typeFilter === "redeem" && l.type !== "redeem" && l.type !== "adjust") return false;
      return true;
    });
  }, [ledger, customerFilter, typeFilter]);

  return (
    <div className="space-y-4">
      {/* ---- Filter bar ---- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <Select value={customerFilter} onValueChange={setCustomerFilter}>
            <SelectTrigger size="sm" className="w-full sm:w-60">
              <SelectValue placeholder="كل العملاء" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل العملاء</SelectItem>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1">
          {(["all", "earn", "redeem"] as LedgerTypeFilter[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                typeFilter === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "all" ? "الكل" : t === "earn" ? "مكتسب" : "مستبدل"}
            </button>
          ))}
        </div>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {formatNumber(filtered.length)} سجل
        </span>
      </div>

      {/* ---- Table ---- */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Coins className="size-10" />}
          title="لا سجلات مطابقة"
          description="لا توجد حركات نقاط مطابقة لعوامل التصفية الحالية."
        />
      ) : (
        <div className="card-hover rounded-lg border border-border bg-card">
          <div className="max-h-[600px] overflow-y-auto thin-scroll">
            <table className="w-full min-w-[720px] divide-y divide-border text-sm">
              <thead className="sticky top-0 z-10 bg-card">
                <tr className="text-right">
                  <Th>التاريخ</Th>
                  <Th>العميل</Th>
                  <Th className="text-center">النوع</Th>
                  <Th className="text-center">النقاط</Th>
                  <Th>السبب</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((l) => {
                  const isEarn = l.type === "earn";
                  const isRedeem = l.type === "redeem";
                  const isAdjust = l.type === "adjust";
                  return (
                    <tr key={l.id} className="transition-colors hover:bg-muted/40">
                      {/* Date */}
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                        {formatDateTime(l.date)}
                      </td>
                      {/* Customer */}
                      <td className="px-4 py-3 font-medium text-foreground">
                        {customerName(l.customerId)}
                      </td>
                      {/* Type */}
                      <td className="px-4 py-3 text-center">
                        {isEarn ? (
                          <Badge variant="success">مكتسب</Badge>
                        ) : isRedeem ? (
                          <Badge variant="warning">مستبدل</Badge>
                        ) : (
                          <Badge variant="neutral">تعديل</Badge>
                        )}
                      </td>
                      {/* Points */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`tnum font-display text-base font-bold ${
                            isEarn || (isAdjust && l.points > 0)
                              ? "text-emerald-700"
                              : "text-amber-700"
                          }`}
                        >
                          {l.points > 0 ? "+" : ""}
                          {formatNumber(l.points)}
                        </span>
                      </td>
                      {/* Reason */}
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {l.reason}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---- Customer-context note ---- */}
      {isReadOnly && (
        <p className="text-center text-xs text-muted-foreground">
          هذه قائمة بحركات نقاطك فقط. للاستبدال، تواصلي مع الاستقبال.
        </p>
      )}
    </div>
  );
}

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

// ============================================================
// Redeem dialog (owner / reception only)
// ============================================================
function RedeemDialogButton({
  customers,
  rule,
}: {
  customers: Customer[];
  rule: LoyaltyRule;
}) {
  const redeemPoints = useApp((s) => s.redeemPoints);
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState<string>("");
  const [points, setPoints] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const selectedCustomer = customers.find((c) => c.id === customerId);
  const pointsToRedeem = Number(points) || 0;
  const canRedeem =
    !!customerId &&
    pointsToRedeem >= rule.minRedeemPoints &&
    selectedCustomer &&
    pointsToRedeem <= selectedCustomer.loyaltyPoints &&
    reason.trim().length > 0;

  const eligibleCustomers = useMemo(
    () => customers.filter((c) => c.loyaltyPoints >= rule.minRedeemPoints),
    [customers, rule.minRedeemPoints],
  );

  const reset = () => {
    setCustomerId("");
    setPoints("");
    setReason("");
  };

  const handleConfirm = () => {
    if (!canRedeem || !selectedCustomer) return;
    const res = redeemPoints(selectedCustomer.id, pointsToRedeem, reason.trim());
    if (res.ok) {
      toast.success(
        `تم استبدال ${formatNumber(pointsToRedeem)} نقطة لـ ${selectedCustomer.name}`,
      );
      setOpen(false);
      reset();
    } else {
      toast.error(res.error ?? "تعذّر الاستبدال");
    }
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Gift className="size-4" />
        استبدال نقاط
      </Button>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) reset();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>استبدال نقاط الولاء</DialogTitle>
            <DialogDescription>
              استبدل نقاط عميل بمبلغ خصم. الحد الأدنى {formatNumber(rule.minRedeemPoints)} نقطة، وقيمة النقطة {formatEGP(rule.pointsToEgpRate)}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Customer */}
            <div className="space-y-1.5">
              <Label htmlFor="redeem-customer">العميل</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger id="redeem-customer" className="w-full">
                  <SelectValue placeholder="اختاري العميل" />
                </SelectTrigger>
                <SelectContent>
                  {eligibleCustomers.length === 0 ? (
                    <SelectItem value="__none" disabled>
                      لا يوجد عملاء مؤهلون
                    </SelectItem>
                  ) : (
                    eligibleCustomers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} — {formatNumber(c.loyaltyPoints)} نقطة
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedCustomer && (
                <p className="text-xs text-muted-foreground">
                  الرصيد الحالي:{" "}
                  <span className="font-semibold text-foreground tnum">
                    {formatNumber(selectedCustomer.loyaltyPoints)}
                  </span>{" "}
                  نقطة
                </p>
              )}
            </div>

            {/* Points */}
            <div className="space-y-1.5">
              <Label htmlFor="redeem-points">عدد النقاط للاستبدال</Label>
              <Input
                id="redeem-points"
                type="number"
                inputMode="numeric"
                min={rule.minRedeemPoints}
                max={selectedCustomer?.loyaltyPoints ?? 0}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder={`الحد الأدنى ${rule.minRedeemPoints}`}
                dir="ltr"
                className="text-end"
              />
              {pointsToRedeem > 0 && (
                <p className="text-xs text-muted-foreground">
                  قيمة الخصم:{" "}
                  <span className="font-semibold text-foreground tnum">
                    {formatEGP(pointsToRedeem * rule.pointsToEgpRate)}
                  </span>
                </p>
              )}
            </div>

            {/* Reason */}
            <div className="space-y-1.5">
              <Label htmlFor="redeem-reason">السبب</Label>
              <Input
                id="redeem-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="مثال: استبدال مقابل خصم فاتورة"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleConfirm} disabled={!canRedeem}>
              تأكيد الاستبدال
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
