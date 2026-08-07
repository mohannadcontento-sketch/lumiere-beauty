"use client";

import { useMemo, useState } from "react";
import { useApp, useCurrentUser } from "@/lib/store";
import { PageHeader, Badge, Avatar, StatusBadge, SectionTitle, EmptyState } from "@/components/shared/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEGP, formatTime, formatDate, WEEKDAYS_SHORT_AR, MONTHS_AR, isSameDay, dayName } from "@/lib/format";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  CalendarDays,
  Clock,
  User,
  Scissors,
  CheckCircle2,
  XCircle,
  LogIn,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import type { Appointment, AppointmentStatus } from "@/lib/types";

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "مجدول",
  confirmed: "مؤكد",
  checked_in: "تم الوصول",
  in_progress: "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
  no_show: "لم يحضر",
};

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  scheduled: "#404944",
  confirmed: "#003527",
  checked_in: "#cca72f",
  in_progress: "#735c00",
  completed: "#0b513d",
  cancelled: "#ba1a1a",
  no_show: "#5f5e5b",
};

export function CalendarView() {
  const appointments = useApp((s) => s.appointments);
  const customers = useApp((s) => s.customers);
  const services = useApp((s) => s.services);
  const staff = useApp((s) => s.staff);
  const branches = useApp((s) => s.branches);
  const updateAppointmentStatus = useApp((s) => s.updateAppointmentStatus);
  const rescheduleAppointment = useApp((s) => s.rescheduleAppointment);
  const createAppointment = useApp((s) => s.createAppointment);
  const openCustomer = useApp((s) => s.openCustomer);
  const user = useCurrentUser()!;

  const [cursor, setCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const monthYear = `${MONTHS_AR[cursor.getMonth()]} ${cursor.getFullYear()}`;

  const daysInMonth = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    // Egyptian week starts Saturday. JS Sunday=0..Saturday=6. Sat in EG = index 0.
    const firstDayEg = (first.getDay() + 1) % 7;
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDayEg; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  }, [cursor]);

  const dayAppts = appointments
    .filter((a) => isSameDay(new Date(a.start), selectedDate))
    .sort((a, b) => (a.start < b.start ? -1 : 1));

  const navigate = (dir: number) => {
    const d = new Date(cursor);
    d.setMonth(d.getMonth() + dir);
    setCursor(d);
  };

  const goToToday = () => {
    setCursor(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="التقويم والمواعيد"
        subtitle={`${dayAppts.length} موعد في ${formatDate(selectedDate)}`}
        actions={
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="size-4" />
            موعد جديد
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Calendar grid */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">{monthYear}</h2>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                  <ChevronRight className="size-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={goToToday}>
                  اليوم
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate(1)}>
                  <ChevronLeft className="size-4" />
                </Button>
              </div>
            </div>

            {/* Weekday header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted-foreground">
              {WEEKDAYS_SHORT_AR.map((d) => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((d, i) => {
                if (!d) return <div key={i} />;
                const dayAppts = appointments.filter((a) => isSameDay(new Date(a.start), d));
                const isToday = isSameDay(d, new Date());
                const isSelected = isSameDay(d, selectedDate);
                const isWeekend = dayName(d) === "الجمعة";
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(d)}
                    className={`relative flex min-h-[64px] flex-col items-start rounded-md border p-1.5 text-right transition-all sm:min-h-[80px] ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : isToday
                          ? "border-primary/40 bg-primary/3"
                          : "border-transparent hover:border-border hover:bg-accent/40"
                    }`}
                  >
                    <span
                      className={`flex size-6 items-center justify-center rounded-full text-xs font-medium ${
                        isToday ? "bg-primary text-primary-foreground" : isWeekend ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {d.getDate()}
                    </span>
                    {dayAppts.length > 0 && (
                      <div className="mt-1 hidden w-full flex-col gap-0.5 sm:flex">
                        {dayAppts.slice(0, 2).map((a) => (
                          <span
                            key={a.id}
                            className="truncate rounded px-1 py-0.5 text-[9px] text-white"
                            style={{ background: STATUS_COLORS[a.status] }}
                          >
                            {formatTime(a.start)} {customers.find((c) => c.id === a.customerId)?.name.split(" ")[0]}
                          </span>
                        ))}
                        {dayAppts.length > 2 && (
                          <span className="px-1 text-[9px] text-muted-foreground">+{dayAppts.length - 2}</span>
                        )}
                      </div>
                    )}
                    {dayAppts.length > 0 && (
                      <span className="mt-1 flex gap-0.5 sm:hidden">
                        {dayAppts.slice(0, 3).map((a) => (
                          <span key={a.id} className="size-1.5 rounded-full" style={{ background: STATUS_COLORS[a.status] }} />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-3 rounded-lg border border-border bg-card p-3 text-xs">
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: STATUS_COLORS[k as AppointmentStatus] }} />
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Day agenda */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <SectionTitle>جدول اليوم</SectionTitle>
              <p className="mt-0.5 font-display text-base font-semibold">{formatDate(selectedDate)}</p>
            </div>
            <Badge variant="neutral">{dayAppts.length} موعد</Badge>
          </div>
          <div className="thin-scroll max-h-[560px] space-y-2 overflow-y-auto pl-1">
            {dayAppts.length === 0 ? (
              <EmptyState
                icon={<CalendarDays className="size-10" />}
                title="لا مواعيد"
                description="لا توجد مواعيد في هذا اليوم"
                action={<Button size="sm" onClick={() => setShowCreate(true)}><Plus className="size-4" />حجز موعد</Button>}
              />
            ) : (
              dayAppts.map((a) => {
                const cust = customers.find((c) => c.id === a.customerId);
                const svc = services.find((s) => s.id === a.services[0]?.serviceId);
                const stf = staff.find((s) => s.id === a.services[0]?.staffId);
                return (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAppt(a)}
                    className="flex w-full items-start gap-2 rounded-md border border-border p-2.5 text-right transition-colors hover:border-primary/30 hover:bg-accent/30"
                  >
                    <div className="flex w-12 shrink-0 flex-col items-center rounded-md py-1" style={{ background: `${STATUS_COLORS[a.status]}15` }}>
                      <span className="text-[11px] font-bold" style={{ color: STATUS_COLORS[a.status] }}>
                        {formatTime(a.start).split(" ")[0]}
                      </span>
                      <span className="text-[9px] text-muted-foreground">{formatTime(a.start).split(" ")[1]}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{cust?.name ?? "عميل"}</p>
                      <p className="truncate text-xs text-muted-foreground">{svc?.name} • {stf?.name}</p>
                      <div className="mt-1">
                        <StatusBadge status={a.status} />
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Appointment detail dialog */}
      {selectedAppt && (
        <AppointmentDetailDialog
          appt={selectedAppt}
          onClose={() => setSelectedAppt(null)}
          onUpdateStatus={(status, extra) => {
            updateAppointmentStatus(selectedAppt.id, status, extra);
            setSelectedAppt({ ...selectedAppt, status });
            toast.success(`تم تحديث الحالة إلى: ${STATUS_LABELS[status]}`);
          }}
          onOpenCustomer={(id) => {
            setSelectedAppt(null);
            openCustomer(id);
          }}
        />
      )}

      {/* Create appointment dialog */}
      {showCreate && (
        <CreateAppointmentDialog
          defaultDate={selectedDate}
          onClose={() => setShowCreate(false)}
          onCreate={(input) => {
            const res = createAppointment({ ...input, createdBy: user.id });
            if (res.ok) {
              toast.success(`تم إنشاء الموعد ${res.appointment?.code}`);
              setShowCreate(false);
            } else {
              toast.error(res.error ?? "تعذّر إنشاء الموعد");
            }
          }}
        />
      )}
    </div>
  );
}

function AppointmentDetailDialog({
  appt,
  onClose,
  onUpdateStatus,
  onOpenCustomer,
}: {
  appt: Appointment;
  onClose: () => void;
  onUpdateStatus: (status: AppointmentStatus, extra?: { cancellationReason?: string }) => void;
  onOpenCustomer: (id: string) => void;
}) {
  const customers = useApp((s) => s.customers);
  const services = useApp((s) => s.services);
  const staff = useApp((s) => s.staff);
  const transactions = useApp((s) => s.transactions);
  const setView = useApp((s) => s.setView);

  const cust = customers.find((c) => c.id === appt.customerId);
  const txn = transactions.find((t) => t.id === appt.paymentId);
  const [cancelReason, setCancelReason] = useState("");

  const actions: { label: string; status: AppointmentStatus; icon: typeof CheckCircle2; variant: "default" | "outline" | "destructive" }[] = [];
  if (appt.status === "scheduled" || appt.status === "confirmed") {
    actions.push({ label: "تأكيد", status: "confirmed", icon: CheckCircle2, variant: "outline" });
    actions.push({ label: "وصول", status: "checked_in", icon: LogIn, variant: "default" });
  }
  if (appt.status === "checked_in") {
    actions.push({ label: "بدء التنفيذ", status: "in_progress", icon: LogIn, variant: "default" });
  }
  if (appt.status === "checked_in" || appt.status === "in_progress") {
    actions.push({ label: "إتمام + دفع", status: "completed", icon: CheckCircle2, variant: "default" });
  }
  if (appt.status !== "completed" && appt.status !== "cancelled") {
    actions.push({ label: "لم يحضر", status: "no_show", icon: AlertTriangle, variant: "outline" });
    actions.push({ label: "إلغاء", status: "cancelled", icon: XCircle, variant: "destructive" });
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <span>موعد {appt.code}</span>
            <StatusBadge status={appt.status} />
          </DialogTitle>
          <DialogDescription>{formatDate(appt.start)} — {formatTime(appt.start)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Customer */}
          <button
            onClick={() => onOpenCustomer(appt.customerId)}
            className="flex w-full items-center gap-3 rounded-md border border-border p-3 text-right hover:border-primary/30 hover:bg-accent/30"
          >
            <Avatar name={cust?.name ?? "؟"} color={cust?.membershipTier === "vip" ? "#003527" : "#5f5e5b"} size="md" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{cust?.name}</p>
              <p className="text-xs text-muted-foreground">{cust?.phone}</p>
            </div>
            <User className="size-4 text-muted-foreground" />
          </button>

          {/* Services */}
          <div className="rounded-md border border-border p-3">
            <SectionTitle className="mb-2">الخدمات</SectionTitle>
            {appt.services.map((s, i) => {
              const svc = services.find((sv) => sv.id === s.serviceId);
              const stf = staff.find((st) => st.id === s.staffId);
              return (
                <div key={i} className="flex items-center justify-between py-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <Scissors className="size-3.5 text-muted-foreground" />
                    <span className="font-medium">{svc?.name}</span>
                    <span className="text-xs text-muted-foreground">• {stf?.name}</span>
                  </div>
                  <span className="tnum font-semibold">{formatEGP(s.price)}</span>
                </div>
              );
            })}
          </div>

          {/* Time */}
          <div className="flex gap-3">
            <div className="flex-1 rounded-md border border-border p-3">
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" /> البدء</p>
              <p className="mt-1 text-sm font-semibold">{formatTime(appt.start)}</p>
            </div>
            <div className="flex-1 rounded-md border border-border p-3">
              <p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" /> الانتهاء</p>
              <p className="mt-1 text-sm font-semibold">{formatTime(appt.end)}</p>
            </div>
          </div>

          {txn && (
            <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
              <p className="text-xs text-muted-foreground">فاتورة مرتبطة</p>
              <p className="mt-1 font-semibold">{txn.code} — {formatEGP(txn.total)} ({txn.paymentStatus === "paid" ? "مدفوعة" : "غير مدفوعة"})</p>
            </div>
          )}

          {appt.notes && (
            <div className="rounded-md bg-muted/30 p-3 text-sm">
              <p className="text-xs text-muted-foreground">ملاحظات</p>
              <p className="mt-1">{appt.notes}</p>
            </div>
          )}

          {appt.cancellationReason && (
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              <p className="text-xs">سبب الإلغاء</p>
              <p className="mt-1">{appt.cancellationReason}</p>
            </div>
          )}

          {/* Cancel reason input */}
          {appt.status !== "cancelled" && (
            <Input
              placeholder="سبب الإلغاء (اختياري)..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="text-sm"
            />
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            {actions.map((a) => {
              const Icon = a.icon;
              return (
                <Button
                  key={a.status}
                  variant={a.variant}
                  size="sm"
                  onClick={() => {
                    if (a.status === "completed") {
                      onClose();
                      setView("pos");
                      return;
                    }
                    onUpdateStatus(a.status, a.status === "cancelled" || a.status === "no_show" ? { cancellationReason: cancelReason || undefined } : undefined);
                  }}
                >
                  <Icon className="size-4" />
                  {a.label}
                </Button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateAppointmentDialog({
  defaultDate,
  onClose,
  onCreate,
}: {
  defaultDate: Date;
  onClose: () => void;
  onCreate: (input: {
    customerId: string;
    branchId: string;
    services: { serviceId: string; staffId: string; price: number }[];
    start: string;
    end: string;
    notes?: string;
  }) => void;
}) {
  const customers = useApp((s) => s.customers);
  const services = useApp((s) => s.services);
  const staff = useApp((s) => s.staff);
  const branches = useApp((s) => s.branches);
  const checkAvailability = useApp((s) => s.checkAvailability);
  const isStaffWorking = useApp((s) => s.isStaffWorking);

  const [customerId, setCustomerId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [date, setDate] = useState(defaultDate.toISOString().slice(0, 10));
  const [time, setTime] = useState("11:00");
  const [notes, setNotes] = useState("");

  const availableStaff = services.find((s) => s.id === serviceId)?.staffIds ?? [];
  const service = services.find((s) => s.id === serviceId);

  const computeEnd = () => {
    if (!service) return "";
    const [h, m] = time.split(":").map(Number);
    const start = new Date(date);
    start.setHours(h, m, 0, 0);
    const end = new Date(start.getTime() + service.durationMin * 60000);
    return end.toISOString();
  };

  const startISO = () => {
    const [h, m] = time.split(":").map(Number);
    const s = new Date(date);
    s.setHours(h, m, 0, 0);
    return s.toISOString();
  };

  const canCreate = customerId && serviceId && staffId;
  const conflict = staffId && service ? !checkAvailability(staffId, startISO(), computeEnd()) : false;
  const notWorking = staffId ? !isStaffWorking(staffId, new Date(startISO())) : false;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">حجز موعد جديد</DialogTitle>
          <DialogDescription>اختر العميل والخدمة والأخصائي والوقت</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">العميل</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger><SelectValue placeholder="اختر العميل" /></SelectTrigger>
              <SelectContent className="max-h-60">
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name} — {c.phone}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">الخدمة</Label>
            <Select value={serviceId} onValueChange={(v) => { setServiceId(v); setStaffId(""); }}>
              <SelectTrigger><SelectValue placeholder="اختر الخدمة" /></SelectTrigger>
              <SelectContent className="max-h-60">
                {services.filter((s) => s.status === "active").map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name} — {formatEGP(s.price)} ({s.durationMin} د)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Staff */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">الأخصائي</Label>
            <Select value={staffId} onValueChange={setStaffId} disabled={!serviceId}>
              <SelectTrigger><SelectValue placeholder="اختر الأخصائي" /></SelectTrigger>
              <SelectContent>
                {staff.filter((s) => availableStaff.includes(s.id) && s.status === "active").map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name} — {s.role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date + time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">التاريخ</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">الوقت</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          {/* Warnings */}
          {notWorking && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700">
              <AlertTriangle className="ml-1 inline size-3.5" />
              هذا الأخصائي خارج ساعات العمل في اليوم المحدد
            </div>
          )}
          {conflict && !notWorking && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
              <AlertTriangle className="ml-1 inline size-3.5" />
              تعارض: الأخصائي محجوز في هذا الوقت
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ملاحظات (اختياري)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات خاصة بالموعد..." className="min-h-[60px] resize-none" />
          </div>

          {/* Summary */}
          {service && (
            <div className="rounded-md bg-muted/30 p-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">المدة</span><span className="font-semibold">{service.durationMin} دقيقة</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">السعر</span><span className="font-semibold">{formatEGP(service.price)}</span></div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button
            disabled={!canCreate || conflict || notWorking}
            onClick={() =>
              onCreate({
                customerId,
                branchId: branches[0].id,
                services: [{ serviceId, staffId, price: service?.price ?? 0 }],
                start: startISO(),
                end: computeEnd(),
                notes: notes || undefined,
              })
            }
          >
            <Plus className="size-4" />
            تأكيد الحجز
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
