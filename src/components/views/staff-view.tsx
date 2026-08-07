"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  formatEGP,
  formatNumber,
  WEEKDAYS_AR,
} from "@/lib/format";
import {
  Search,
  Plus,
  Users,
  Star,
  Phone,
  Mail,
  MapPin,
  Scissors,
  CalendarClock,
  Clock,
  CheckCircle2,
  DollarSign,
  Eye,
} from "lucide-react";
import type { Staff, StaffStatus, WorkingHours } from "@/lib/types";

// ---- Status metadata ----
const STATUS_LABELS: Record<StaffStatus, string> = {
  active: "نشط",
  on_leave: "في إجازة",
  inactive: "غير نشط",
};

type StatusFilter = "all" | StaffStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "الكل" },
  { value: "active", label: "نشط" },
  { value: "on_leave", label: "في إجازة" },
  { value: "inactive", label: "غير نشط" },
];

export function StaffView() {
  const staff = useApp((s) => s.staff);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  // ---- Derived stats ----
  const stats = useMemo(() => {
    const total = staff.length;
    const activeSpecialists = staff.filter(
      (s) => s.status === "active" && s.serviceIds.length > 0,
    ).length;
    const ratings = staff.filter((s) => s.rating > 0);
    const avgRating =
      ratings.length > 0
        ? (ratings.reduce((sum, s) => sum + s.rating, 0) / ratings.length).toFixed(1)
        : "—";
    const totalRevenue = staff.reduce((s, x) => s + x.totalRevenue, 0);
    return { total, activeSpecialists, avgRating, totalRevenue };
  }, [staff]);

  // ---- Filtered list ----
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return staff.filter((s) => {
      if (status !== "all" && s.status !== status) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    });
  }, [staff, query, status]);

  const selectedStaff = selectedStaffId
    ? staff.find((s) => s.id === selectedStaffId) ?? null
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="الموظفون"
        subtitle={`${formatNumber(stats.total)} موظف — فريق لوميير بيوتي`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <CalendarClock className="size-4" />
              جدول المناوبات
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              موظف جديد
            </Button>
          </>
        }
      />

      {/* ---- Stat cards ---- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="إجمالي الموظفين"
          value={formatNumber(stats.total)}
          icon={<Users className="size-4" />}
          hint="في الفرعين"
        />
        <StatCard
          label="الأخصائيون النشطون"
          value={formatNumber(stats.activeSpecialists)}
          icon={<Scissors className="size-4" />}
          delta="متاحون الآن"
          deltaType="up"
        />
        <StatCard
          label="متوسط التقييم"
          value={stats.avgRating}
          icon={<Star className="size-4" />}
          hint="من ٥ نقاط"
        />
        <StatCard
          label="إجمالي الإيرادات"
          value={formatEGP(stats.totalRevenue)}
          icon={<DollarSign className="size-4" />}
          delta="تراكمي"
          deltaType="up"
        />
      </div>

      {/* ---- Filter bar ---- */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو التخصص أو البريد..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="stf-status" className="sr-only">
            الحالة
          </label>
          <select
            id="stf-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="h-9 rounded-md border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            {STATUS_OPTIONS.map((o) => (
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

      {/* ---- Staff grid ---- */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="size-10" />}
          title="لا موظفين مطابقين"
          description="جرّب تعديل البحث أو تغيير عامل التصفية."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <StaffCard
              key={s.id}
              staff={s}
              onOpenSchedule={() => setSelectedStaffId(s.id)}
            />
          ))}
        </div>
      )}

      {/* ---- Schedule / details dialog ---- */}
      <StaffScheduleDialog
        staff={selectedStaff}
        open={selectedStaff !== null}
        onOpenChange={(o) => !o && setSelectedStaffId(null)}
      />
    </div>
  );
}

// ============================================================
// StaffCard
// ============================================================
function StaffCard({
  staff,
  onOpenSchedule,
}: {
  staff: Staff;
  onOpenSchedule: () => void;
}) {
  const branches = useApp((s) => s.branches);
  const services = useApp((s) => s.services);
  const branch = branches.find((b) => b.id === staff.branchId);
  const staffServices = services.filter((s) => staff.serviceIds.includes(s.id));
  const summary = summarizeWorkingHours(staff.workingHours);
  const filledStars = Math.round(staff.rating);

  return (
    <article
      onClick={onOpenSchedule}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenSchedule();
        }
      }}
      className="card-hover flex cursor-pointer flex-col rounded-lg border border-border bg-card p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar name={staff.name} color={staff.color} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
            {staff.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{staff.role}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={staff.status} />
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {branch?.name ?? "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={
                i < filledStars
                  ? "size-4 fill-[#cca72f] text-[#cca72f]"
                  : "size-4 text-muted-foreground/30"
              }
            />
          ))}
          <span className="ms-1 text-sm font-semibold tnum">
            {staff.rating.toFixed(1)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          نسبة العمولة:{" "}
          <span className="tnum font-medium text-foreground">
            {formatNumber(staff.commissionPct)}٪
          </span>
        </span>
      </div>

      {/* Contact */}
      <div className="mt-4 grid grid-cols-1 gap-1.5 text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground" dir="ltr">
          <Phone className="size-3 shrink-0" />
          <span className="truncate text-right">{staff.phone}</span>
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground" dir="ltr">
          <Mail className="size-3 shrink-0" />
          <span className="truncate text-right">{staff.email}</span>
        </span>
      </div>

      {/* Services + working hours summary */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Scissors className="size-3.5 text-primary/70" />
          <span className="tnum text-foreground">{formatNumber(staffServices.length)}</span>
          <span>خدمة</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarClock className="size-3.5 text-primary/70" />
          <span className="truncate text-foreground">{summary.range}</span>
        </div>
        <div className="col-span-2 flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-3.5 text-primary/70" />
          <span className="tnum text-foreground" dir="ltr">
            {summary.timeRange}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
        <div>
          <SectionTitle>مواعيد مكتملة</SectionTitle>
          <p className="mt-1 font-display text-lg font-bold tnum">
            {formatNumber(staff.completedAppointments)}
          </p>
        </div>
        <div>
          <SectionTitle>إجمالي الإيرادات</SectionTitle>
          <p className="mt-1 font-display text-lg font-bold text-primary tnum">
            {formatEGP(staff.totalRevenue)}
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="mt-4 border-t border-border pt-4">
        <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
          e.stopPropagation();
          onOpenSchedule();
        }}>
          <Eye className="size-3.5" />
          عرض الجدول
        </Button>
      </div>
    </article>
  );
}

// ============================================================
// StaffScheduleDialog
// ============================================================
function StaffScheduleDialog({
  staff,
  open,
  onOpenChange,
}: {
  staff: Staff | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const branches = useApp((s) => s.branches);
  const services = useApp((s) => s.services);

  if (!staff) return null;

  const branch = branches.find((b) => b.id === staff.branchId);
  const staffServices = services.filter((s) => staff.serviceIds.includes(s.id));
  const summary = summarizeWorkingHours(staff.workingHours);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <Avatar name={staff.name} color={staff.color} size="lg" />
            <div className="min-w-0 flex-1">
              <DialogTitle className="font-display text-xl">
                {staff.name}
              </DialogTitle>
              <DialogDescription className="mt-0.5">
                {staff.role} — {branch?.name ?? "—"}
              </DialogDescription>
            </div>
            <StatusBadge status={staff.status} />
          </div>
        </DialogHeader>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 rounded-md border border-border bg-muted/30 p-3 text-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              التقييم
            </p>
            <p className="mt-1 flex items-center justify-center gap-1 font-display text-lg font-bold tnum">
              <Star className="size-3.5 fill-[#cca72f] text-[#cca72f]" />
              {staff.rating.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              مواعيد مكتملة
            </p>
            <p className="mt-1 font-display text-lg font-bold tnum">
              {formatNumber(staff.completedAppointments)}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              الإيرادات
            </p>
            <p className="mt-1 font-display text-lg font-bold text-primary tnum">
              {formatEGP(staff.totalRevenue)}
            </p>
          </div>
        </div>

        {/* Working hours summary banner */}
        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs">
          <CalendarClock className="size-4 text-primary" />
          <span className="text-muted-foreground">أيام العمل:</span>
          <span className="font-medium text-foreground">{summary.range}</span>
          <span className="mx-1 text-muted-foreground">·</span>
          <span className="text-muted-foreground">التوقيت:</span>
          <span className="font-medium text-foreground tnum" dir="ltr">
            {summary.timeRange}
          </span>
        </div>

        {/* Weekly schedule table */}
        <div className="overflow-hidden rounded-md border border-border">
          <SectionTitle className="border-b border-border bg-muted/30 px-3 py-2">
            الجدول الأسبوعي
          </SectionTitle>
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/20">
              <tr className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2 text-right">اليوم</th>
                <th className="px-3 py-2 text-right">الحالة</th>
                <th className="px-3 py-2 text-right">ساعات العمل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staff.workingHours
                .slice()
                .sort((a, b) => a.day - b.day)
                .map((wh) => (
                  <tr key={wh.day} className="hover:bg-accent/30">
                    <td className="px-3 py-2 font-medium text-foreground">
                      {WEEKDAYS_AR[wh.day]}
                    </td>
                    <td className="px-3 py-2">
                      {wh.off ? (
                        <Badge variant="neutral">إجازة</Badge>
                      ) : (
                        <Badge variant="success">عمل</Badge>
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground tnum" dir="ltr">
                      {wh.off ? "—" : `${wh.start} — ${wh.end}`}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Services list */}
        <div className="overflow-hidden rounded-md border border-border">
          <SectionTitle className="border-b border-border bg-muted/30 px-3 py-2">
            الخدمات المقدمة ({formatNumber(staffServices.length)})
          </SectionTitle>
          {staffServices.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              لا توجد خدمات مرتبطة بهذا الموظف.
            </p>
          ) : (
            <ul className="thin-scroll max-h-56 divide-y divide-border overflow-y-auto">
              {staffServices.map((svc) => (
                <li
                  key={svc.id}
                  className="flex items-center justify-between gap-3 px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <CheckCircle2 className="size-3.5 shrink-0 text-primary/70" />
                    <span className="truncate text-sm font-medium text-foreground">
                      {svc.name}
                    </span>
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      {formatNumber(svc.durationMin)} د
                    </span>
                  </div>
                  <span className="font-display text-sm font-bold text-primary tnum">
                    {formatEGP(svc.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Contact footer */}
        <div className="grid grid-cols-1 gap-1.5 border-t border-border pt-3 text-xs sm:grid-cols-2">
          <span className="flex items-center gap-1.5 text-muted-foreground" dir="ltr">
            <Phone className="size-3 shrink-0" />
            <span className="truncate text-right">{staff.phone}</span>
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground" dir="ltr">
            <Mail className="size-3 shrink-0" />
            <span className="truncate text-right">{staff.email}</span>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// Helpers
// ============================================================
function summarizeWorkingHours(workingHours: WorkingHours[]): {
  range: string;
  timeRange: string;
} {
  const sorted = workingHours.slice().sort((a, b) => a.day - b.day);
  const working = sorted.filter((w) => !w.off);

  if (working.length === 0) {
    return { range: "إجازة طوال الأسبوع", timeRange: "—" };
  }

  // Consecutive range detection (Egypt week Sat..Fri, indices 0..6)
  const workingSet = new Set(working.map((w) => w.day));
  // Find longest consecutive run
  let bestStart = working[0].day;
  let bestLen = 1;
  let curStart = working[0].day;
  let curLen = 1;
  for (let i = 1; i < working.length; i++) {
    const prev = working[i - 1].day;
    const cur = working[i].day;
    if (cur === prev + 1) {
      curLen++;
      if (curLen > bestLen) {
        bestLen = curLen;
        bestStart = curStart;
      }
    } else {
      curStart = cur;
      curLen = 1;
    }
  }

  const bestEnd = (bestStart + bestLen - 1) % 7;
  const rangeLabel =
    bestLen === 1
      ? WEEKDAYS_AR[bestStart]
      : bestLen === working.length && bestLen === 7
        ? "طوال الأسبوع"
        : `${WEEKDAYS_AR[bestStart]} — ${WEEKDAYS_AR[bestEnd]}`;

  // Time range: use the most common start/end pair
  const byPair = new Map<string, number>();
  working.forEach((w) => {
    const key = `${w.start}-${w.end}`;
    byPair.set(key, (byPair.get(key) ?? 0) + 1);
  });
  let bestPair = "";
  let bestCount = 0;
  byPair.forEach((count, key) => {
    if (count > bestCount) {
      bestCount = count;
      bestPair = key;
    }
  });
  const [start, end] = bestPair.split("-");
  const timeRange = working.length > 0 ? `${start} - ${end}` : "—";

  return { range: rangeLabel, timeRange };
}

// ============================================================
// Local StatusBadge wrapper (reuses shared variant)
// ============================================================
function StatusBadge({ status }: { status: StaffStatus }) {
  const variant =
    status === "active"
      ? "success"
      : status === "on_leave"
        ? "warning"
        : "neutral";
  return <Badge variant={variant}>{STATUS_LABELS[status]}</Badge>;
}