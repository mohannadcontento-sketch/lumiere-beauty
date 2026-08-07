"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import {
  PageHeader,
  SectionTitle,
  Badge,
} from "@/components/shared/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Store,
  MapPin,
  Shield,
  Zap,
  Bell,
  Plus,
  Pencil,
  Phone,
  Mail,
  Check,
  Minus,
  Save,
  CheckCheck,
  Hash,
  Globe,
  Building2,
  Crown,
  Briefcase,
  ConciergeBell,
  UserRound,
} from "lucide-react";
import { WEEKDAYS_AR } from "@/lib/format";

// ============================================================
// Role × Module matrix
// ============================================================

const MODULES = [
  "dashboard",
  "calendar",
  "customers",
  "appointments",
  "services",
  "staff",
  "pos",
  "inventory",
  "loyalty",
  "marketing",
  "reports",
  "settings",
] as const;

type ModuleId = (typeof MODULES)[number];

const MODULE_LABELS: Record<ModuleId, string> = {
  dashboard: "لوحة القيادة",
  calendar: "التقويم",
  customers: "العملاء",
  appointments: "المواعيد",
  services: "الخدمات",
  staff: "الموظفون",
  pos: "نقطة البيع",
  inventory: "المخزون",
  loyalty: "الولاء",
  marketing: "التسويق",
  reports: "التقارير",
  settings: "الإعدادات",
};

interface RoleRow {
  id: string;
  label: string;
  desc: string;
  icon: typeof Crown;
  access: ModuleId[];
  portal?: string;
}

const ROLES: RoleRow[] = [
  {
    id: "owner",
    label: "المالك",
    desc: "صلاحيات كاملة على النظام",
    icon: Crown,
    access: [...MODULES],
  },
  {
    id: "manager",
    label: "المدير",
    desc: "إدارة العمليات اليومية",
    icon: Briefcase,
    access: [
      "dashboard", "calendar", "customers", "appointments", "services",
      "staff", "pos", "inventory", "loyalty", "marketing", "reports",
    ],
  },
  {
    id: "reception",
    label: "الاستقبال",
    desc: "استقبال العملاء والمبيعات",
    icon: ConciergeBell,
    access: ["dashboard", "calendar", "customers", "appointments", "pos"],
  },
  {
    id: "staff",
    label: "الأخصائي",
    desc: "بوابة الأخصائي",
    icon: UserRound,
    access: [],
    portal: "بوابة الأخصائي: مواعيد اليوم، العملاء، الجدول، الأداء",
  },
  {
    id: "customer",
    label: "العميل",
    desc: "بوابة العميل",
    icon: UserRound,
    access: [],
    portal: "بوابة العميل: حجز موعد، مواعيدي، حسابي، عروضي",
  },
];

// ============================================================
// Default business data (visual form)
// ============================================================

const DEFAULT_BUSINESS = {
  name: "لوميير بيوتي",
  legalName: "شركة لوميير للجمال ش.م.م",
  taxNumber: "٣٠٠-٤٢١-٨٨٩",
  currency: "ج.م",
  timezone: "Africa/Cairo",
  phone: "+20 2 2735 0001",
  email: "info@lumiere-beauty.com",
  address: "١٦ شارع ٢٦ يوليو، زمالك، القاهرة",
};

const DEFAULT_HOURS = [
  { day: 0, from: "10:00", to: "22:00", off: false },
  { day: 1, from: "10:00", to: "22:00", off: false },
  { day: 2, from: "10:00", to: "22:00", off: false },
  { day: 3, from: "10:00", to: "22:00", off: false },
  { day: 4, from: "10:00", to: "22:00", off: false },
  { day: 5, from: "10:00", to: "22:00", off: false },
  { day: 6, from: "14:00", to: "22:00", off: false },
];

interface NotifRule {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
  channels: {
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  };
}

const INITIAL_NOTIF_RULES: NotifRule[] = [
  {
    id: "nr1",
    name: "تذكير قبل الموعد",
    desc: "إرسال تذكير قبل الموعد بساعة",
    enabled: true,
    channels: { sms: true, email: false, whatsapp: true, push: true },
  },
  {
    id: "nr2",
    name: "تأكيد الحجز",
    desc: "تأكيد فوري عند إنشاء الحجز",
    enabled: true,
    channels: { sms: true, email: true, whatsapp: true, push: false },
  },
  {
    id: "nr3",
    name: "تنبيه المخزون المنخفض",
    desc: "تنبيه المدير عند انخفاض المخزون",
    enabled: true,
    channels: { sms: false, email: true, whatsapp: false, push: true },
  },
  {
    id: "nr4",
    name: "عيد ميلاد العميل",
    desc: "تهنئة وخصم في عيد الميلاد",
    enabled: true,
    channels: { sms: true, email: true, whatsapp: true, push: false },
  },
  {
    id: "nr5",
    name: "العميل غير النشط",
    desc: "تنبيه بعد ٦٠ يوماً من آخر زيارة",
    enabled: false,
    channels: { sms: true, email: false, whatsapp: true, push: false },
  },
  {
    id: "nr6",
    name: "إنجاز الولاء",
    desc: "إشعار عند الوصول لمستوى نقاط",
    enabled: true,
    channels: { sms: true, email: true, whatsapp: false, push: true },
  },
];

const CHANNELS = [
  { id: "sms", label: "SMS" },
  { id: "email", label: "بريد" },
  { id: "whatsapp", label: "واتساب" },
  { id: "push", label: "داخل التطبيق" },
] as const;

type ChannelId = (typeof CHANNELS)[number]["id"];

// ============================================================
// Main component
// ============================================================

export function SettingsView() {
  const branches = useApp((s) => s.branches);
  const automationRules = useApp((s) => s.automationRules);
  const toggleAutomation = useApp((s) => s.toggleAutomation);

  const [business, setBusiness] = useState(DEFAULT_BUSINESS);
  const [hours, setHours] = useState(DEFAULT_HOURS);
  const [vatEnabled, setVatEnabled] = useState(true);
  const [vatPct, setVatPct] = useState("14");
  const [notifRules, setNotifRules] = useState<NotifRule[]>(INITIAL_NOTIF_RULES);

  // ---- handlers ----
  const handleSaveBusiness = () => {
    toast.success("تم حفظ معلومات المركز بنجاح");
  };

  const handleSaveHours = () => {
    toast.success("تم حفظ ساعات العمل");
  };

  const handleSaveVat = () => {
    toast.success("تم حفظ إعدادات ضريبة القيمة المضافة");
  };

  const handleToggleAutomation = (id: string, name: string) => {
    const rule = automationRules.find((r) => r.id === id);
    const next = !rule?.enabled;
    toggleAutomation(id);
    toast.success(`${name} — ${next ? "تم التفعيل" : "تم الإيقاف"}`);
  };

  const toggleNotifRule = (id: string) => {
    setNotifRules((rs) =>
      rs.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  };

  const toggleNotifChannel = (id: string, ch: ChannelId) => {
    setNotifRules((rs) =>
      rs.map((r) =>
        r.id === id ? { ...r, channels: { ...r.channels, [ch]: !r.channels[ch] } } : r,
      ),
    );
  };

  // ---- render ----
  return (
    <div className="space-y-6">
      <PageHeader
        title="الإعدادات"
        subtitle="إدارة النظام والقواعد"
        actions={
          <Button variant="outline" size="sm" className="gap-2">
            <Save className="size-4" />
            حفظ الكل
          </Button>
        }
      />

      <Tabs defaultValue="business" className="w-full">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-muted/60 p-1">
          <TabsTrigger value="business" className="gap-1.5">
            <Store className="size-4" />
            النشاط التجاري
          </TabsTrigger>
          <TabsTrigger value="branches" className="gap-1.5">
            <MapPin className="size-4" />
            الفروع
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-1.5">
            <Shield className="size-4" />
            الأدوار والصلاحيات
          </TabsTrigger>
          <TabsTrigger value="automation" className="gap-1.5">
            <Zap className="size-4" />
            قواعد الأتمتة
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="size-4" />
            قواعد الإشعارات
          </TabsTrigger>
        </TabsList>

        {/* ===== Tab 1: Business ===== */}
        <TabsContent value="business" className="space-y-5 pt-2">
          {/* Business info */}
          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <SectionTitle>معلومات المركز</SectionTitle>
                <p className="mt-1 font-display text-lg font-semibold text-foreground">
                  هوية النشاط التجاري
                </p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/8 text-primary">
                <Building2 className="size-5" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="اسم المركز" className="sm:col-span-2">
                <Input
                  value={business.name}
                  onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                />
              </Field>
              <Field label="الاسم القانوني" className="sm:col-span-2">
                <Input
                  value={business.legalName}
                  onChange={(e) => setBusiness({ ...business, legalName: e.target.value })}
                />
              </Field>
              <Field label="الرقم الضريبي">
                <Input
                  dir="ltr"
                  className="text-right tnum"
                  value={business.taxNumber}
                  onChange={(e) => setBusiness({ ...business, taxNumber: e.target.value })}
                />
              </Field>
              <Field label="العملة">
                <Input
                  value={business.currency}
                  onChange={(e) => setBusiness({ ...business, currency: e.target.value })}
                />
              </Field>
              <Field label="المنطقة الزمنية">
                <div className="relative">
                  <Globe className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    dir="ltr"
                    className="pr-9 text-right"
                    value={business.timezone}
                    onChange={(e) => setBusiness({ ...business, timezone: e.target.value })}
                  />
                </div>
              </Field>
              <Field label="النسبة الضريبية">
                <div className="relative">
                  <Hash className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    dir="ltr"
                    className="px-9 text-right tnum"
                    value={vatPct}
                    onChange={(e) => setVatPct(e.target.value)}
                  />
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">٪</span>
                </div>
              </Field>
              <Field label="الهاتف">
                <div className="relative">
                  <Phone className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    dir="ltr"
                    className="pr-9 text-right"
                    value={business.phone}
                    onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                  />
                </div>
              </Field>
              <Field label="البريد الإلكتروني">
                <div className="relative">
                  <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    dir="ltr"
                    className="pr-9 text-right"
                    value={business.email}
                    onChange={(e) => setBusiness({ ...business, email: e.target.value })}
                  />
                </div>
              </Field>
              <Field label="العنوان" className="sm:col-span-2">
                <Input
                  value={business.address}
                  onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                />
              </Field>
            </div>

            <div className="mt-5 flex justify-end">
              <Button onClick={handleSaveBusiness} className="gap-2">
                <Save className="size-4" />
                حفظ التغييرات
              </Button>
            </div>
          </section>

          {/* Working hours */}
          <section className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <SectionTitle>ساعات العمل</SectionTitle>
                <p className="mt-1 font-display text-lg font-semibold text-foreground">
                  أوقات فتح وأغلاق الفروع
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSaveHours} className="gap-2">
                <Save className="size-4" />
                حفظ
              </Button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-2 text-right font-medium">اليوم</th>
                    <th className="px-2 py-2 text-right font-medium">من</th>
                    <th className="px-2 py-2 text-right font-medium">إلى</th>
                    <th className="px-2 py-2 text-right font-medium">مغلق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {hours.map((h, idx) => (
                    <tr key={h.day}>
                      <td className="py-2.5 pr-2 font-medium text-foreground">{WEEKDAYS_AR[h.day]}</td>
                      <td className="px-2 py-2">
                        <Input
                          type="time"
                          dir="ltr"
                          disabled={h.off}
                          value={h.from}
                          onChange={(e) =>
                            setHours((prev) =>
                              prev.map((x) => (x.day === h.day ? { ...x, from: e.target.value } : x)),
                            )
                          }
                          className="h-8 w-28 tnum"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Input
                          type="time"
                          dir="ltr"
                          disabled={h.off}
                          value={h.to}
                          onChange={(e) =>
                            setHours((prev) =>
                              prev.map((x) => (x.day === h.day ? { ...x, to: e.target.value } : x)),
                            )
                          }
                          className="h-8 w-28 tnum"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Switch
                          checked={!h.off}
                          onCheckedChange={(checked) =>
                            setHours((prev) =>
                              prev.map((x) => (x.day === h.day ? { ...x, off: !checked } : x)),
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* VAT */}
          <section className="rounded-lg border border-border bg-card p-5">
            <SectionTitle>ضريبة القيمة المضافة</SectionTitle>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Switch checked={vatEnabled} onCheckedChange={setVatEnabled} />
                <div>
                  <p className="font-medium text-foreground">تفعيل ضريبة القيمة المضافة</p>
                  <p className="text-xs text-muted-foreground">
                    تطبيق الضريبة على جميع الفواتير تلقائياً
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">النسبة</Label>
                <div className="relative w-28">
                  <Input
                    dir="ltr"
                    disabled={!vatEnabled}
                    value={vatPct}
                    onChange={(e) => setVatPct(e.target.value)}
                    className="px-8 text-right tnum"
                  />
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">٪</span>
                </div>
                <Button onClick={handleSaveVat} variant="outline" size="sm" className="gap-2">
                  <Save className="size-4" />
                  حفظ
                </Button>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* ===== Tab 2: Branches ===== */}
        <TabsContent value="branches" className="space-y-5 pt-2">
          <div className="flex items-center justify-between">
            <SectionTitle>قائمة الفروع ({branches.length})</SectionTitle>
            <Button size="sm" className="gap-2">
              <Plus className="size-4" />
              إضافة فرع
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {branches.map((b) => (
              <div
                key={b.id}
                className="card-hover rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 items-center justify-center rounded-md bg-primary/8 text-primary">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {b.name}
                        </h3>
                        {b.isMain && <Badge variant="primary">الفرع الرئيسي</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{b.address}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">المدير</p>
                    <p className="mt-0.5 font-medium text-foreground">{b.manager}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">الهاتف</p>
                    <p className="mt-0.5 font-medium text-foreground tnum" dir="ltr">
                      {b.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Pencil className="size-3.5" />
                    تعديل
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Building2 className="size-3.5" />
                    إدارة
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ===== Tab 3: Roles & Permissions ===== */}
        <TabsContent value="roles" className="space-y-5 pt-2">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <SectionTitle>مصفوفة الصلاحيات</SectionTitle>
                <p className="mt-1 font-display text-lg font-semibold text-foreground">
                  أدوار المستخدمين وصلاحيات الوصول للوحدات
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Pencil className="size-4" />
                تعديل الصلاحيات
              </Button>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[920px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border bg-primary/5 text-xs uppercase tracking-wider text-primary">
                    <th className="py-2.5 pr-3 text-right font-semibold">الدور</th>
                    {MODULES.map((m) => (
                      <th key={m} className="px-1 py-2.5 text-center font-semibold whitespace-nowrap">
                        {MODULE_LABELS[m]}
                      </th>
                    ))}
                    <th className="px-3 py-2.5 text-right font-semibold">ملاحظات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ROLES.map((role) => {
                    const RoleIcon = role.icon;
                    return (
                      <tr key={role.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <div className="flex size-7 items-center justify-center rounded-md bg-primary/8 text-primary">
                              <RoleIcon className="size-3.5" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{role.label}</p>
                              <p className="text-xs text-muted-foreground">{role.desc}</p>
                            </div>
                          </div>
                        </td>
                        {MODULES.map((m) => {
                          const has = role.access.includes(m);
                          return (
                            <td key={m} className="px-1 py-3 text-center">
                              {has ? (
                                <Check className="mx-auto size-4 text-emerald-600" />
                              ) : (
                                <Minus className="mx-auto size-4 text-muted-foreground/40" />
                              )}
                            </td>
                          );
                        })}
                        <td className="px-3 py-3 text-right">
                          {role.portal ? (
                            <span className="text-xs text-muted-foreground">{role.portal}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground/40">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Check className="size-3.5 text-emerald-600" />
                <span>صلاحية وصول</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Minus className="size-3.5 text-muted-foreground/40" />
                <span>لا توجد صلاحية</span>
              </div>
              <div className="text-muted-foreground/70">
                الأخصائي والعميل لهم بوابات مخصصة منفصلة عن لوحة الإدارة
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ===== Tab 4: Automation Rules ===== */}
        <TabsContent value="automation" className="space-y-5 pt-2">
          <div className="flex items-center justify-between">
            <SectionTitle>قواعد الأتمتة ({automationRules.length})</SectionTitle>
            <Button size="sm" className="gap-2">
              <Plus className="size-4" />
              قاعدة جديدة
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-card">
            <div className="divide-y divide-border">
              {automationRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{rule.name}</p>
                      <Badge variant={rule.enabled ? "success" : "neutral"}>
                        {rule.enabled ? "نشطة" : "متوقفة"}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
                      <span className="text-muted-foreground">
                        المشغل: <span className="text-foreground/80">{rule.trigger}</span>
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        الإجراء: <span className="text-foreground/80">{rule.action}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Label className="text-xs text-muted-foreground">
                      {rule.enabled ? "مفعّلة" : "متوقفة"}
                    </Label>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => handleToggleAutomation(rule.id, rule.name)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ===== Tab 5: Notification Rules ===== */}
        <TabsContent value="notifications" className="space-y-5 pt-2">
          <div className="flex items-center justify-between">
            <SectionTitle>قواعد الإشعارات ({notifRules.length})</SectionTitle>
            <Button size="sm" variant="outline" className="gap-2">
              <CheckCheck className="size-4" />
              حفظ القواعد
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-card">
            <div className="divide-y divide-border">
              {notifRules.map((rule) => (
                <div key={rule.id} className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{rule.name}</p>
                        <Badge variant={rule.enabled ? "success" : "neutral"}>
                          {rule.enabled ? "نشطة" : "متوقفة"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{rule.desc}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Label className="text-xs text-muted-foreground">
                        {rule.enabled ? "مفعّلة" : "متوقفة"}
                      </Label>
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleNotifRule(rule.id)}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-3">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      قنوات الإرسال
                    </span>
                    {CHANNELS.map((ch) => (
                      <label
                        key={ch.id}
                        className="flex cursor-pointer select-none items-center gap-1.5 text-sm text-foreground"
                      >
                        <Checkbox
                          checked={rule.enabled && rule.channels[ch.id]}
                          disabled={!rule.enabled}
                          onCheckedChange={() => toggleNotifChannel(rule.id, ch.id)}
                        />
                        {ch.label}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================
// Field wrapper
// ============================================================

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
