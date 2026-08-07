"use client";

import { useMemo, useState } from "react";
import { useApp, useCurrentUser } from "@/lib/store";
import {
  PageHeader,
  SectionTitle,
  StatCard,
  Badge,
  EmptyState,
  StatusBadge,
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
import {
  formatEGP,
  formatNumber,
  formatDate,
  formatDateShort,
  formatDateTime,
  formatTime,
  isSameDay,
} from "@/lib/format";
import { toast } from "sonner";
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  Sparkles,
  Crown,
  Medal,
  Star,
  Coins,
  Gift,
  Wallet,
  Calendar,
  ShoppingBag,
  CreditCard,
  StickyNote,
  Phone,
  Mail,
  Cake,
  ArrowLeft,
  Scissors,
  Check,
  AlertCircle,
  Tag,
  Users,
  TrendingUp,
  Plus,
  TicketPercent,
  Heart,
} from "lucide-react";
import type {
  Appointment,
  Customer,
  MembershipPlan,
  MembershipTier,
  Service,
  ServiceCategory,
  Staff,
  TimelineEvent,
} from "@/lib/types";

// ============================================================
// Constants
// ============================================================
const TIER_LABELS: Record<MembershipTier, string> = {
  basic: "أساسي",
  gold: "ذهبي",
  vip: "VIP",
};

const TIER_COLORS: Record<MembershipTier, string> = {
  basic: "#5f5e5b",
  gold: "#cca72f",
  vip: "#003527",
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

const CATEGORY_ICONS: Record<ServiceCategory, React.ReactNode> = {
  hair_color: <Scissors className="size-5" />,
  hair_treatment: <Sparkles className="size-5" />,
  hair_styling: <Scissors className="size-5" />,
  facial: <Heart className="size-5" />,
  manicure: <Scissors className="size-5" />,
  pedicure: <Scissors className="size-5" />,
  makeup: <Sparkles className="size-5" />,
};

const EVENT_ICON: Record<TimelineEvent["type"], typeof Calendar> = {
  appointment: Calendar,
  payment: CreditCard,
  loyalty: Gift,
  note: StickyNote,
  membership: Crown,
  purchase: ShoppingBag,
};

// ============================================================
// Main component — switches on `view`
// ============================================================
export function CustomerPortal() {
  const view = useApp((s) => s.view);
  const user = useCurrentUser();

  if (!user || user.role !== "customer" || !user.customerId) {
    return (
      <div className="space-y-6">
        <PageHeader title="بوابة العميل" subtitle="يرجى تسجيل الدخول كعميل" />
        <EmptyState
          icon={<Users className="size-10" />}
          title="غير مصرّح"
          description="هذه البوابة مخصصة لعملاء لوميير بيوتي فقط"
        />
      </div>
    );
  }

  switch (view) {
    case "book_appointment":
      return <BookAppointmentView />;
    case "my_appointments":
      return <MyAppointmentsView />;
    case "my_offers":
      return <MyOffersView />;
    case "my_profile":
    default:
      return <MyProfileView />;
  }
}

// ============================================================
// 1) My Profile
// ============================================================
function MyProfileView() {
  const user = useCurrentUser()!;
  const customers = useApp((s) => s.customers);
  const memberships = useApp((s) => s.memberships);
  const setView = useApp((s) => s.setView);

  const me = customers.find((c) => c.id === user.customerId);
  if (!me) {
    return (
      <div className="space-y-6">
        <PageHeader title="ملفي" />
        <EmptyState title="لم يتم العثور على بيانات العميل" />
      </div>
    );
  }

  const membership = memberships.find((m) => m.tier === me.membershipTier);
  const tierColor = TIER_COLORS[me.membershipTier];
  const recentEvents = (me.timeline ?? []).slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader
        title="ملفي"
        subtitle="مرحباً بكِ في لوميير بيوتي — مساحتكِ الخاصة للعناية"
      />

      {/* ---- Hero card ---- */}
      <section className="card-hover overflow-hidden rounded-lg border border-border bg-card p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={me.name} color={tierColor} size="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-2xl font-semibold text-foreground">{me.name}</h2>
              <Badge variant={TIER_BADGE_VARIANT[me.membershipTier]}>
                {TIER_ICON[me.membershipTier]}
                عضوية {TIER_LABELS[me.membershipTier]}
              </Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Phone className="size-3.5" />
                <span dir="ltr" className="tnum">{me.phone}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5" />
                <span dir="ltr">{me.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Cake className="size-3.5" />
                {formatDate(me.birthday)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Stats row ---- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="نقاط الولاء"
          value={formatNumber(me.loyaltyPoints)}
          icon={<Coins className="size-4" />}
          hint="قابلة للاستبدال"
        />
        <StatCard
          label="إجمالي الزيارات"
          value={formatNumber(me.visitCount)}
          icon={<CalendarCheck className="size-4" />}
          hint="منذ انضمامك"
        />
        <StatCard
          label="إجمالي الإنفاق"
          value={formatEGP(me.totalSpend)}
          icon={<Wallet className="size-4" />}
        />
        <StatCard
          label="العضوية"
          value={TIER_LABELS[me.membershipTier]}
          icon={<Crown className="size-4" />}
          hint={membership?.name}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---- Membership card ---- */}
        {membership && (
          <section className="card-hover rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <SectionTitle>عضويتك الحالية</SectionTitle>
              <span
                className="inline-flex size-2.5 rounded-full"
                style={{ background: membership.color }}
              />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span
                className="flex size-10 items-center justify-center rounded-md text-white"
                style={{ background: membership.color }}
              >
                {TIER_ICON[membership.tier]}
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">{membership.name}</p>
                <p className="text-xs text-muted-foreground">
                  ينتهي في:{" "}
                  <span className="tnum">{me.membershipExpiry ? formatDateShort(me.membershipExpiry) : "—"}</span>
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 border-t border-border pt-4">
              {membership.perks.map((perk, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() => setView("my_offers")}
            >
              <Sparkles className="size-3.5" />
              ترقية العضوية
            </Button>
          </section>
        )}

        {/* ---- Quick actions ---- */}
        <section className="card-hover rounded-lg border border-border bg-card p-5">
          <SectionTitle>إجراءات سريعة</SectionTitle>
          <div className="mt-4 grid grid-cols-1 gap-2.5">
            <QuickAction
              icon={<CalendarCheck className="size-4" />}
              title="حجز موعد"
              desc="احجزي خدمتكِ القادمة"
              onClick={() => setView("book_appointment")}
            />
            <QuickAction
              icon={<TicketPercent className="size-4" />}
              title="عرض العروض"
              desc="خصومات وعروض مخصصة لكِ"
              onClick={() => setView("my_offers")}
            />
            <QuickAction
              icon={<CalendarDays className="size-4" />}
              title="مواعيدي"
              desc="متابعة المواعيد القادمة والسابقة"
              onClick={() => setView("my_appointments")}
            />
          </div>
        </section>

        {/* ---- Recent activity ---- */}
        <section className="card-hover rounded-lg border border-border bg-card p-5">
          <SectionTitle>آخر الأنشطة</SectionTitle>
          {recentEvents.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">لا يوجد نشاط حتى الآن</p>
          ) : (
            <ol className="mt-4 space-y-4">
              {recentEvents.map((ev) => {
                const Icon = EVENT_ICON[ev.type] ?? Calendar;
                return (
                  <li key={ev.id} className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{ev.title}</p>
                      {ev.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{ev.description}</p>
                      )}
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatDateShort(ev.date)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5 text-right transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/8 text-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
    </button>
  );
}

// ============================================================
// 2) Book Appointment
// ============================================================
function BookAppointmentView() {
  const user = useCurrentUser()!;
  const services = useApp((s) => s.services);
  const branches = useApp((s) => s.branches);

  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("hair_color");
  const [bookingService, setBookingService] = useState<Service | null>(null);

  const categories = Object.keys(CATEGORY_LABELS) as ServiceCategory[];
  const categoryServices = services.filter((s) => s.category === activeCategory && s.status === "active");
  const topServices = useMemo(
    () => [...services].sort((a, b) => b.popularity - a.popularity).slice(0, 5),
    [services],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="حجز موعد جديد"
        subtitle="اختاري الخدمة والأخصائية والوقت المناسب لكِ"
      />

      {/* ---- Category cards ---- */}
      <section>
        <SectionTitle>تصفّحي حسب الفئة</SectionTitle>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count = services.filter((s) => s.category === cat && s.status === "active").length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`card-hover flex flex-col items-center gap-2 rounded-lg border bg-card p-4 text-center transition-colors ${
                  isActive ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <span
                  className="flex size-11 items-center justify-center rounded-md text-white"
                  style={{ background: CATEGORY_COLORS[cat] }}
                >
                  {CATEGORY_ICONS[cat]}
                </span>
                <span className="text-sm font-semibold text-foreground">{CATEGORY_LABELS[cat]}</span>
                <span className="text-[11px] text-muted-foreground tnum">{formatNumber(count)} خدمة</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---- Service list for selected category ---- */}
      <section>
        <SectionTitle>
          خدمات فئة {CATEGORY_LABELS[activeCategory]}
        </SectionTitle>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoryServices.map((svc) => (
            <ServiceCard key={svc.id} service={svc} onBook={() => setBookingService(svc)} />
          ))}
          {categoryServices.length === 0 && (
            <div className="col-span-full">
              <EmptyState
                icon={<Scissors className="size-10" />}
                title="لا توجد خدمات في هذه الفئة"
                description="جرّبي فئة أخرى"
              />
            </div>
          )}
        </div>
      </section>

      {/* ---- Top services ---- */}
      <section>
        <SectionTitle>خدماتنا الأكثر طلباً</SectionTitle>
        <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card">
          <ul className="divide-y divide-border">
            {topServices.map((svc, i) => (
              <li
                key={svc.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/30"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/8 text-xs font-bold text-primary tnum">
                  {formatNumber(i + 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{svc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[svc.category]} · مدة{" "}
                    <span className="tnum">{formatNumber(svc.durationMin)}</span> دقيقة
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground tnum">
                  <TrendingUp className="size-3.5" />
                  {formatNumber(svc.popularity)}
                </span>
                <span className="font-display text-base font-bold text-primary tnum">
                  {formatEGP(svc.price)}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                  onClick={() => setBookingService(svc)}
                >
                  احجزي
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- Booking dialog ---- */}
      {bookingService && (
        <BookingDialog
          service={bookingService}
          onClose={() => setBookingService(null)}
          customerId={user.customerId!}
          branchId={branches[0]?.id ?? "br1"}
          createdBy={user.id}
        />
      )}
    </div>
  );
}

function ServiceCard({ service, onBook }: { service: Service; onBook: () => void }) {
  return (
    <article className="card-hover flex flex-col rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold text-foreground">{service.name}</h3>
          <span
            className="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{
              background: `${CATEGORY_COLORS[service.category]}1a`,
              color: CATEGORY_COLORS[service.category],
            }}
          >
            {CATEGORY_LABELS[service.category]}
          </span>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{service.description}</p>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" />
          <span className="tnum">{formatNumber(service.durationMin)}</span> دقيقة
        </span>
        <span className="flex items-center gap-1">
          <Users className="size-3.5" />
          <span className="tnum">{formatNumber(service.staffIds.length)}</span> أخصائية
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="font-display text-xl font-bold text-primary tnum">
          {formatEGP(service.price)}
        </span>
        <Button size="sm" onClick={onBook}>
          <Plus className="size-3.5" />
          احجزي
        </Button>
      </div>
    </article>
  );
}

function BookingDialog({
  service,
  onClose,
  customerId,
  branchId,
  createdBy,
}: {
  service: Service;
  onClose: () => void;
  customerId: string;
  branchId: string;
  createdBy: string;
}) {
  const staff = useApp((s) => s.staff);
  const checkAvailability = useApp((s) => s.checkAvailability);
  const isStaffWorking = useApp((s) => s.isStaffWorking);
  const createAppointment = useApp((s) => s.createAppointment);
  const setView = useApp((s) => s.setView);

  const eligibleStaff = staff.filter((s) => service.staffIds.includes(s.id));
  const defaultStaffId = eligibleStaff[0]?.id ?? "";
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [staffId, setStaffId] = useState(defaultStaffId);
  const [dateStr, setDateStr] = useState(tomorrow.toISOString().slice(0, 10));
  const [timeStr, setTimeStr] = useState("11:00");
  const [submitting, setSubmitting] = useState(false);

  // Compute ISO start/end
  const startIso = useMemo(() => {
    if (!dateStr || !timeStr) return "";
    const d = new Date(`${dateStr}T${timeStr}:00`);
    return d.toISOString();
  }, [dateStr, timeStr]);

  const endIso = useMemo(() => {
    if (!startIso) return "";
    const d = new Date(startIso);
    d.setMinutes(d.getMinutes() + service.durationMin);
    return d.toISOString();
  }, [startIso, service.durationMin]);

  // Warnings
  const selectedStaff = staff.find((s) => s.id === staffId);
  const startJsDate = startIso ? new Date(startIso) : null;
  const workingOk = !!(selectedStaff && startJsDate && isStaffWorking(selectedStaff.id, startJsDate));
  const availableOk = !!(selectedStaff && startIso && endIso && checkAvailability(selectedStaff.id, startIso, endIso));
  const hasWarnings = !!startIso && (!workingOk || !availableOk);

  const handleConfirm = () => {
    if (!staffId) {
      toast.error("يرجى اختيار الأخصائية");
      return;
    }
    if (!dateStr || !timeStr) {
      toast.error("يرجى تحديد التاريخ والوقت");
      return;
    }
    setSubmitting(true);
    const result = createAppointment({
      customerId,
      branchId,
      services: [{ serviceId: service.id, staffId, price: service.price }],
      start: startIso,
      end: endIso,
      createdBy,
    });
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error ?? "تعذّر إنشاء الحجز");
      return;
    }
    toast.success(`تم حجز موعدك بنجاح — ${result.appointment?.code ?? ""}`);
    onClose();
    setView("my_appointments");
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">حجز: {service.name}</DialogTitle>
          <DialogDescription>
            مدة الجلسة <span className="tnum">{formatNumber(service.durationMin)}</span> دقيقة ·{" "}
            <span className="font-semibold text-primary tnum">{formatEGP(service.price)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Staff select */}
          <div className="space-y-1.5">
            <Label>الأخصائية</Label>
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger>
                <SelectValue placeholder="اختاري الأخصائية" />
              </SelectTrigger>
              <SelectContent>
                {eligibleStaff.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} — {s.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date + time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>التاريخ</Label>
              <Input
                type="date"
                dir="ltr"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="text-right tnum"
              />
            </div>
            <div className="space-y-1.5">
              <Label>الوقت</Label>
              <Input
                type="time"
                dir="ltr"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="text-right tnum"
              />
            </div>
          </div>

          {/* Summary */}
          {selectedStaff && startIso && (
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">الأخصائية</span>
                <span className="font-medium text-foreground">{selectedStaff.name}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-muted-foreground">الموعد</span>
                <span className="font-medium text-foreground tnum" dir="ltr">
                  {formatDateTime(startIso)}
                </span>
              </div>
            </div>
          )}

          {/* Warnings */}
          {hasWarnings && (
            <div className="space-y-1.5 rounded-md border border-amber-200 bg-amber-50/60 px-3 py-2.5 text-xs text-amber-800">
              {!workingOk && (
                <p className="flex items-center gap-1.5">
                  <AlertCircle className="size-3.5 shrink-0" />
                  الأخصائية خارج ساعات العمل في هذا اليوم/الوقت
                </p>
              )}
              {workingOk && !availableOk && (
                <p className="flex items-center gap-1.5">
                  <AlertCircle className="size-3.5 shrink-0" />
                  تعارض — الأخصائية لديها موعد آخر في هذا الوقت
                </p>
              )}
              <p className="text-[11px] text-amber-700">يمكنكِ تغيير الوقت أو اختيار أخصائية أخرى</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            إلغاء
          </Button>
          <Button onClick={handleConfirm} disabled={submitting || hasWarnings}>
            {submitting ? "جارٍ الحجز..." : "تأكيد الحجز"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// 3) My Appointments
// ============================================================
type ApptTab = "upcoming" | "past" | "cancelled";

function MyAppointmentsView() {
  const user = useCurrentUser()!;
  const appointments = useApp((s) => s.appointments);
  const services = useApp((s) => s.services);
  const staff = useApp((s) => s.staff);
  const updateAppointmentStatus = useApp((s) => s.updateAppointmentStatus);
  const setView = useApp((s) => s.setView);
  const [tab, setTab] = useState<ApptTab>("upcoming");

  const mine = useMemo(
    () =>
      appointments
        .filter((a) => a.customerId === user.customerId)
        .sort((a, b) => (a.start < b.start ? 1 : -1)),
    [appointments, user.customerId],
  );

  const now = new Date();
  const upcoming = mine.filter(
    (a) =>
      (a.status === "scheduled" ||
        a.status === "confirmed" ||
        a.status === "checked_in" ||
        a.status === "in_progress") &&
      new Date(a.start) >= now,
  );
  const past = mine.filter((a) => a.status === "completed" || new Date(a.end) < now && a.status !== "cancelled" && a.status !== "no_show");
  const cancelled = mine.filter((a) => a.status === "cancelled" || a.status === "no_show");

  const counts = {
    upcoming: upcoming.length,
    past: past.length,
    cancelled: cancelled.length,
  };

  const handleCancel = (id: string) => {
    updateAppointmentStatus(id, "cancelled", { cancellationReason: "بناءً على طلب العميل" });
    toast.success("تم إلغاء الموعد بنجاح");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="مواعيدي"
        subtitle="تابعي مواعيدكِ القادمة والسابقة"
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as ApptTab)}>
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-card p-1 sm:w-auto">
          <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">
            القادمة
            <span className="mr-1 rounded-full bg-primary/10 px-1.5 text-[10px] tnum">
              {formatNumber(counts.upcoming)}
            </span>
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1 sm:flex-none">
            السابقة
            <span className="mr-1 rounded-full bg-primary/10 px-1.5 text-[10px] tnum">
              {formatNumber(counts.past)}
            </span>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex-1 sm:flex-none">
            الملغاة
            <span className="mr-1 rounded-full bg-primary/10 px-1.5 text-[10px] tnum">
              {formatNumber(counts.cancelled)}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-3">
          {upcoming.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="size-10" />}
              title="لا توجد مواعيد قادمة"
              description="احجزي خدمتكِ القادمة الآن"
              action={
                <Button size="sm" onClick={() => setView("book_appointment")}>
                  <Plus className="size-4" />
                  حجز موعد جديد
                </Button>
              }
            />
          ) : (
            upcoming.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                services={services}
                staff={staff}
                onAction={
                  a.status === "scheduled" || a.status === "confirmed"
                    ? () => handleCancel(a.id)
                    : undefined
                }
                actionLabel={a.status === "scheduled" || a.status === "confirmed" ? "إلغاء الموعد" : undefined}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6 space-y-3">
          {past.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="size-10" />}
              title="لا توجد مواعيد سابقة"
              description="ستظهر هنا مواعيدكِ المكتملة"
            />
          ) : (
            past.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                services={services}
                staff={staff}
                onAction={a.status === "completed" ? () => setView("book_appointment") : undefined}
                actionLabel={a.status === "completed" ? "إعادة الحجز" : undefined}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6 space-y-3">
          {cancelled.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="size-10" />}
              title="لا توجد مواعيد ملغاة"
              description="كل مواعيدكِ سليمة"
            />
          ) : (
            cancelled.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                services={services}
                staff={staff}
                onAction={() => setView("book_appointment")}
                actionLabel="إعادة الحجز"
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AppointmentCard({
  appointment,
  services,
  staff,
  onAction,
  actionLabel,
}: {
  appointment: Appointment;
  services: Service[];
  staff: Staff[];
  onAction?: () => void;
  actionLabel?: string;
}) {
  const firstService = appointment.services[0];
  const svc = services.find((s) => s.id === firstService?.serviceId);
  const stf = staff.find((s) => s.id === firstService?.staffId);
  const start = new Date(appointment.start);
  const end = new Date(appointment.end);
  const totalPrice = appointment.services.reduce((sum, s) => sum + s.price, 0);

  return (
    <article className="card-hover flex flex-col gap-4 rounded-lg border border-border bg-card p-5 sm:flex-row sm:items-center">
      {/* Time block */}
      <div className="flex shrink-0 flex-row items-center gap-4 sm:flex-col sm:items-center sm:justify-center sm:border-l sm:border-border sm:pl-5">
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-foreground tnum" dir="ltr">
            {formatTime(start)}
          </p>
          <p className="text-[11px] text-muted-foreground">{formatDateShort(start)}</p>
        </div>
        <div className="text-[11px] text-muted-foreground" dir="ltr">
          {formatTime(start)} — {formatTime(end)}
        </div>
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {svc?.name ?? "خدمة"}
          </h3>
          <StatusBadge status={appointment.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {appointment.services.length > 1
            ? `${formatNumber(appointment.services.length)} خدمات · `
            : ""}
          مع {stf?.name ?? "—"} · {stf?.role ?? ""}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span dir="ltr" className="tnum">{appointment.code}</span>
          {appointment.cancellationReason && (
            <span className="text-destructive">السبب: {appointment.cancellationReason}</span>
          )}
        </div>
      </div>

      {/* Price + action */}
      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
        <span className="font-display text-lg font-bold text-primary tnum">
          {formatEGP(totalPrice)}
        </span>
        {actionLabel && onAction && (
          <Button
            size="sm"
            variant={actionLabel === "إلغاء الموعد" ? "outline" : "default"}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </article>
  );
}

// ============================================================
// 4) My Offers
// ============================================================
function MyOffersView() {
  const user = useCurrentUser()!;
  const customers = useApp((s) => s.customers);
  const campaigns = useApp((s) => s.campaigns);
  const memberships = useApp((s) => s.memberships);
  const setView = useApp((s) => s.setView);

  const me = customers.find((c) => c.id === user.customerId);
  const availableCampaigns = campaigns.filter((c) => c.status === "running" || c.status === "scheduled");
  const nextTier: MembershipTier | null =
    me?.membershipTier === "basic" ? "gold" : me?.membershipTier === "gold" ? "vip" : null;
  const nextMembership = nextTier ? memberships.find((m) => m.tier === nextTier) : null;

  // Birthday within 30 days?
  const isBirthdaySoon = useMemo(() => {
    if (!me) return false;
    const today = new Date();
    const bd = new Date(me.birthday);
    bd.setFullYear(today.getFullYear());
    if (bd < today) bd.setFullYear(today.getFullYear() + 1);
    const diffDays = Math.ceil((bd.getTime() - today.getTime()) / 86400000);
    return diffDays <= 30;
  }, [me]);

  if (!me) {
    return (
      <div className="space-y-6">
        <PageHeader title="العروض والخصومات" />
        <EmptyState title="لم يتم العثور على بيانات العميل" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="العروض والخصومات"
        subtitle="عروض مخصصة لكِ من لوميير بيوتي"
      />

      {/* ---- Personalized offers ---- */}
      <section>
        <SectionTitle>عروض مخصصة لكِ</SectionTitle>
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isBirthdaySoon && (
            <OfferCard
              icon={<Cake className="size-5" />}
              color="#cca72f"
              title="خصم عيد الميلاد"
              desc="بمناسبة قرب عيد ميلادك — استمتعي بخصم ٢٠٪ على أي خدمة"
              code="BDAY20"
              discount="٢٠٪"
              tag="هديتك السنوية"
            />
          )}
          {me.membershipTier !== "vip" && (
            <OfferCard
              icon={<Crown className="size-5" />}
              color="#003527"
              title="عرض العضوية الذهبية"
              desc="ترقية عضويتك إلى VIP مع خصم ٣٠٪ على رسوم الاشتراك"
              code="VIP30"
              discount="٣٠٪"
              tag="ترقية العضوية"
              onClick={() => setView("loyalty")}
            />
          )}
          {me.visitCount <= 2 && (
            <OfferCard
              icon={<TicketPercent className="size-5" />}
              color="#0b513d"
              title="كوبون أول حجز"
              desc="خصم ١٥٪ على أول حجز لكِ في أي خدمة من خدماتنا"
              code="WELCOME15"
              discount="١٥٪"
              tag="للعملاء الجدد"
              onClick={() => setView("book_appointment")}
            />
          )}
          <OfferCard
            icon={<Gift className="size-5" />}
            color="#735c00"
            title="خدمة مجانية عند الإحالة"
            desc="أحضري صديقة واحصلا معاً على جلسة مجانية عند حجزها الأول"
            code="REFER"
            discount="مجاناً"
            tag="دعوة صديقة"
          />
        </div>
      </section>

      {/* ---- Active campaigns ---- */}
      {availableCampaigns.length > 0 && (
        <section>
          <SectionTitle>الحملات الجارية</SectionTitle>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            {availableCampaigns.map((c) => (
              <article
                key={c.id}
                className="card-hover rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-semibold text-foreground">{c.name}</h3>
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{c.message}</p>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="text-muted-foreground">
                    مجدولة: <span className="tnum">{formatDateShort(c.scheduledAt)}</span>
                  </span>
                  <span className="font-semibold text-primary tnum">
                    {formatNumber(c.sentCount)} رسالة
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ---- Membership upgrade CTA ---- */}
      {nextMembership && (
        <section className="card-hover rounded-lg border border-primary/30 bg-primary/5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span
                className="flex size-12 items-center justify-center rounded-md text-white"
                style={{ background: nextMembership.color }}
              >
                <Crown className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  ترقية إلى {nextMembership.name}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  استمتعي بخصم{" "}
                  <span className="tnum font-semibold text-primary">{formatNumber(nextMembership.discountPct)}٪</span>{" "}
                  على كل الخدمات و{formatNumber(nextMembership.freeServicesPerMonth)} خدمة مجانية شهرياً
                </p>
              </div>
            </div>
            <Button onClick={() => setView("loyalty")}>
              <Sparkles className="size-4" />
              ترقية الآن
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

function OfferCard({
  icon,
  color,
  title,
  desc,
  code,
  discount,
  tag,
  onClick,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
  code: string;
  discount: string;
  tag: string;
  onClick?: () => void;
}) {
  return (
    <article className="card-hover relative flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="h-1.5 w-full" style={{ background: color }} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <span
            className="flex size-10 items-center justify-center rounded-md text-white"
            style={{ background: color }}
          >
            {icon}
          </span>
          <Badge variant="neutral">{tag}</Badge>
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 flex-1 text-xs text-muted-foreground">{desc}</p>
        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">الخصم</p>
            <p className="font-display text-2xl font-bold text-primary tnum">{discount}</p>
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">كود الخصم</p>
            <code
              dir="ltr"
              className="rounded bg-muted px-2 py-1 font-mono text-xs font-semibold text-foreground"
            >
              {code}
            </code>
          </div>
        </div>
        {onClick && (
          <Button size="sm" variant="outline" className="mt-3 w-full" onClick={onClick}>
            استخدم العرض
          </Button>
        )}
      </div>
    </article>
  );
}
