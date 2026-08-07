"use client";

import { useState } from "react";
import { useApp, useCurrentUser } from "@/lib/store";
import { PageHeader, Badge, Avatar, StatusBadge, SectionTitle, EmptyState } from "@/components/shared/ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatEGP, formatDate, formatDateTime, formatTime } from "@/lib/format";
import {
  ArrowRight,
  Phone,
  Mail,
  Cake,
  Star,
  Calendar,
  ShoppingBag,
  Gift,
  StickyNote,
  CreditCard,
  Plus,
  DollarSign,
  Clock,
} from "lucide-react";
import type { Customer, TimelineEvent } from "@/lib/types";

const TIER_LABELS = { basic: "أساسي", gold: "ذهبي", vip: "VIP" };
const TIER_COLORS: Record<string, string> = { basic: "#5f5e5b", gold: "#cca72f", vip: "#003527" };

const EVENT_ICON = {
  appointment: Calendar,
  payment: CreditCard,
  loyalty: Gift,
  note: StickyNote,
  membership: Star,
  purchase: ShoppingBag,
};

export function CustomerDetailView() {
  const customerId = useApp((s) => s.selectedCustomerId);
  const customer = useApp((s) => s.customers.find((c) => c.id === s.selectedCustomerId));
  const appointments = useApp((s) => s.appointments);
  const transactions = useApp((s) => s.transactions);
  const services = useApp((s) => s.services);
  const staff = useApp((s) => s.staff);
  const memberships = useApp((s) => s.memberships);
  const setView = useApp((s) => s.setView);
  const openAppointment = useApp((s) => s.openAppointment);
  const addCustomerNote = useApp((s) => s.addCustomerNote);
  const user = useCurrentUser()!;
  const [note, setNote] = useState("");
  const [tab, setTab] = useState<"timeline" | "appointments" | "payments" | "notes">("timeline");

  if (!customer) {
    return (
      <div>
        <PageHeader title="العميل غير موجود" />
        <EmptyState title="لم يتم اختيار عميل" action={<Button onClick={() => setView("customers")}>العودة للقائمة</Button>} />
      </div>
    );
  }

  const custAppointments = appointments
    .filter((a) => a.customerId === customer.id)
    .sort((a, b) => (a.start < b.start ? 1 : -1));
  const custTxns = transactions
    .filter((t) => t.customerId === customer.id)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const membership = memberships.find((m) => m.tier === customer.membershipTier);
  const favService = services.find((s) => s.id === customer.favoriteServiceId);
  const favStaff = staff.find((s) => s.id === customer.favoriteStaffId);

  const saveNote = () => {
    if (!note.trim()) return;
    addCustomerNote(customer.id, note.trim(), user.name);
    setNote("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setView("customers")}>
          <ArrowRight className="size-4" />
          العودة
        </Button>
      </div>

      {/* Header card */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="h-20" style={{ background: TIER_COLORS[customer.membershipTier] }} />
        <div className="px-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="-mt-10">
                <Avatar name={customer.name} color={TIER_COLORS[customer.membershipTier]} size="lg" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">{customer.name}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ background: TIER_COLORS[customer.membershipTier] }}
                  >
                    <Star className="size-3" />
                    {TIER_LABELS[customer.membershipTier]}
                  </span>
                  {customer.tags.map((t) => (
                    <Badge key={t} variant="neutral">{t}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setView("pos")}>
                <DollarSign className="size-4" />
                فاتورة جديدة
              </Button>
              <Button size="sm" onClick={() => setView("calendar")}>
                <Calendar className="size-4" />
                حجز موعد
              </Button>
            </div>
          </div>

          {/* Contact + stats */}
          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            <div className="space-y-2 lg:col-span-1">
              <SectionTitle>معلومات التواصل</SectionTitle>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-3.5" />
                  <span dir="ltr">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5" />
                  <span className="truncate" dir="ltr">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Cake className="size-3.5" />
                  {formatDate(customer.birthday)}
                </div>
              </div>
            </div>

            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">إجمالي الإنفاق</p>
              <p className="mt-1 font-display text-xl font-bold">{formatEGP(customer.totalSpend)}</p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">عدد الزيارات</p>
              <p className="mt-1 font-display text-xl font-bold">{formatNumberLocal(customer.visitCount)}</p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground">نقاط الولاء</p>
              <p className="mt-1 font-display text-xl font-bold text-primary">{formatNumberLocal(customer.loyaltyPoints)}</p>
            </div>
          </div>

          {/* Favorites */}
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-md bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">الخدمة المفضلة</p>
              <p className="mt-1 text-sm font-semibold">{favService?.name ?? "—"}</p>
            </div>
            <div className="rounded-md bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">الأخصائي المفضل</p>
              <p className="mt-1 text-sm font-semibold">{favStaff?.name ?? "—"}</p>
            </div>
            <div className="rounded-md bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">آخر زيارة</p>
              <p className="mt-1 text-sm font-semibold">{customer.lastVisit ? formatDate(customer.lastVisit) : "—"}</p>
            </div>
          </div>

          {/* Membership perks */}
          {membership && (
            <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center gap-2">
                <Star className="size-4 text-primary" />
                <span className="text-sm font-semibold text-primary">عضوية {membership.name}</span>
                {customer.membershipExpiry && (
                  <span className="text-xs text-muted-foreground">تنتهي {formatDate(customer.membershipExpiry)}</span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {membership.perks.map((p) => (
                  <span key={p} className="rounded-full bg-background px-2 py-0.5 text-xs text-foreground">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {([
          ["timeline", "السجل الزمني"],
          ["appointments", `المواعيد (${custAppointments.length})`],
          ["payments", `المدفوعات (${custTxns.length})`],
          ["notes", `الملاحظات (${customer.notes.length})`],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "timeline" && <Timeline events={customer.timeline} />}
      {tab === "appointments" && (
        <div className="space-y-2">
          {custAppointments.length === 0 ? (
            <EmptyState icon={<Calendar className="size-10" />} title="لا مواعيد" />
          ) : (
            custAppointments.map((a) => {
              const svc = services.find((s) => s.id === a.services[0]?.serviceId);
              const stf = staff.find((s) => s.id === a.services[0]?.staffId);
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-md border border-border bg-card p-3">
                  <div className="flex w-16 shrink-0 flex-col items-center rounded-md bg-primary/8 py-1.5">
                    <span className="text-xs font-semibold text-primary">{formatTime(a.start).split(" ")[0]}</span>
                    <span className="text-[10px] text-muted-foreground">{formatDate(a.start).slice(0, 6)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{svc?.name ?? "خدمة"}</p>
                    <p className="text-xs text-muted-foreground">{stf?.name} • {a.code}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              );
            })
          )}
        </div>
      )}
      {tab === "payments" && (
        <div className="space-y-2">
          {custTxns.length === 0 ? (
            <EmptyState icon={<CreditCard className="size-10" />} title="لا مدفوعات" />
          ) : (
            custTxns.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-md border border-border bg-card p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/8 text-primary">
                  <CreditCard className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{t.code}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(t.createdAt)} • {t.items.length} عنصر
                  </p>
                </div>
                <div className="text-left">
                  <p className="font-semibold tnum">{formatEGP(t.total)}</p>
                  <StatusBadge status={t.paymentStatus} />
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {tab === "notes" && (
        <div className="space-y-3">
          <div className="rounded-md border border-border bg-card p-3">
            <Textarea
              placeholder="أضف ملاحظة عن العميل (تفضيلات، حساسية، ملاحظات خاصة)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[80px] resize-none border-0 p-0 focus-visible:ring-0"
            />
            <div className="mt-2 flex justify-end">
              <Button size="sm" onClick={saveNote} disabled={!note.trim()}>
                <Plus className="size-4" />
                حفظ الملاحظة
              </Button>
            </div>
          </div>
          {customer.notes.length === 0 ? (
            <EmptyState icon={<StickyNote className="size-10" />} title="لا ملاحظات" description="أضف ملاحظة لبدء التتبع" />
          ) : (
            customer.notes.map((n) => (
              <div key={n.id} className="rounded-md border border-border bg-card p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{n.author}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(n.date)}</span>
                </div>
                <p className="mt-1.5 text-sm text-foreground">{n.text}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function Timeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <EmptyState icon={<Clock className="size-10" />} title="لا سجل" description="سيظهر هنا سجل نشاط العميل" />;
  }
  return (
    <div className="relative space-y-4 before:absolute before:right-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
      {events.map((e) => {
        const Icon = EVENT_ICON[e.type];
        return (
          <div key={e.id} className="relative flex gap-4 pr-2">
            <div className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary">
              <Icon className="size-4" />
            </div>
            <div className="flex-1 rounded-md border border-border bg-card p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{e.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{formatDateTime(e.date)}</span>
              </div>
              {e.description && <p className="mt-1 text-xs text-muted-foreground">{e.description}</p>}
              {(e.amount || e.points) && (
                <div className="mt-2 flex gap-3">
                  {e.amount && <span className="text-xs font-semibold text-primary">{formatEGP(e.amount)}</span>}
                  {e.points && <span className="text-xs font-semibold text-amber-700">+{e.points} نقطة</span>}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatNumberLocal(n: number): string {
  return new Intl.NumberFormat("ar-EG").format(n);
}
