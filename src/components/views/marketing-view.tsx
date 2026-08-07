"use client";

import { useMemo, useState } from "react";
import { useApp, useCurrentUser } from "@/lib/store";
import {
  PageHeader,
  SectionTitle,
  StatCard,
  Badge,
  EmptyState,
} from "@/components/shared/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { formatEGP, formatNumber, formatDate } from "@/lib/format";
import { toast } from "sonner";
import {
  Megaphone,
  Plus,
  Send,
  Users,
  Mail,
  MessageCircle,
  Bell,
  Smartphone,
  CheckCircle2,
  Eye,
  MousePointerClick,
  CalendarClock,
  Wallet,
  Target,
  Sparkles,
  Gift,
  RefreshCw,
  Rocket,
} from "lucide-react";
import type {
  Campaign,
  CampaignChannel,
  CampaignStatus,
  Segment,
} from "@/lib/types";

// ---- Channel metadata ----
const CHANNEL_META: Record<
  CampaignChannel,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  sms: {
    label: "رسالة نصية",
    color: "#003527",
    bg: "rgba(0, 53, 39, 0.08)",
    icon: <Smartphone className="size-3.5" />,
  },
  email: {
    label: "بريد إلكتروني",
    color: "#0b513d",
    bg: "rgba(11, 81, 61, 0.08)",
    icon: <Mail className="size-3.5" />,
  },
  whatsapp: {
    label: "واتساب",
    color: "#0b513d",
    bg: "rgba(149, 211, 186, 0.25)",
    icon: <MessageCircle className="size-3.5" />,
  },
  push: {
    label: "إشعار",
    color: "#735c00",
    bg: "rgba(204, 167, 47, 0.15)",
    icon: <Bell className="size-3.5" />,
  },
};

// ---- Status metadata ----
const STATUS_META: Record<
  CampaignStatus,
  { label: string; variant: "neutral" | "info" | "warning" | "success" | "danger" | "primary" }
> = {
  draft: { label: "مسودة", variant: "neutral" },
  scheduled: { label: "مجدولة", variant: "info" },
  running: { label: "جارية", variant: "primary" },
  completed: { label: "مكتملة", variant: "success" },
  cancelled: { label: "ملغاة", variant: "danger" },
};

// ---- Visual template presets (Tab 3) ----
const TEMPLATES: {
  title: string;
  icon: React.ReactNode;
  channel: CampaignChannel;
  body: string;
  tag: string;
}[] = [
  {
    title: "رسالة عيد ميلاد",
    icon: <Gift className="size-4" />,
    channel: "sms",
    tag: "تلقائية",
    body: "كل عام وأنتم بخير يا {name}! 🎂 هدية لوميير لكِ في عيد ميلادك: خصم ٢٠٪ على أي خدمة هذا الأسبوع. كود: BD20",
  },
  {
    title: "عرض موسمي",
    icon: <Sparkles className="size-4" />,
    channel: "whatsapp",
    tag: "موسمية",
    body: "عرض رمضان الكريم من لوميير ✨ باقة العناية الكاملة بخصم ٢٥٪. احجزي الآن: lumiere.app/ramadan",
  },
  {
    title: "استعادة عميل",
    icon: <RefreshCw className="size-4" />,
    channel: "email",
    tag: "إعادة تفاعل",
    body: "اشتقنا لك يا {name}! عودي إلى لوميير خلال أبريل واحصلي على جلسة مجانية مع أول حجز. نحن في انتظارك.",
  },
  {
    title: "إطلاق خدمة",
    icon: <Rocket className="size-4" />,
    channel: "push",
    tag: "إعلان",
    body: "جديد في لوميير! مكياج العرائس الفاخر بباقة كاملة مع تجربة مسبقة. احجزي قبل النفاد.",
  },
];

export function MarketingView() {
  const user = useCurrentUser();
  const campaigns = useApp((s) => s.campaigns);
  const segments = useApp((s) => s.segments);
  const createCampaign = useApp((s) => s.createCampaign);

  const [dialogOpen, setDialogOpen] = useState(false);

  // ---- Derived campaign stats ----
  const stats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter(
      (c) => c.status === "running" || c.status === "scheduled",
    ).length;
    const sent = campaigns.reduce((s, c) => s + c.sentCount, 0);
    const responded = campaigns.reduce((s, c) => s + c.respondedCount, 0);
    const responseRate = sent > 0 ? Math.round((responded / sent) * 100) : 0;
    return { total, active, sent, responded, responseRate };
  }, [campaigns]);

  // ---- Segment lookup ----
  const segmentName = (id: string) =>
    segments.find((s) => s.id === id)?.name ?? "—";

  // ---- Sorted campaigns (newest scheduled first, then completed) ----
  const sortedCampaigns = useMemo(() => {
    const order: Record<CampaignStatus, number> = {
      running: 0,
      scheduled: 1,
      draft: 2,
      completed: 3,
      cancelled: 4,
    };
    return [...campaigns].sort(
      (a, b) => order[a.status] - order[b.status] || a.scheduledAt.localeCompare(b.scheduledAt),
    );
  }, [campaigns]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="التسويق"
        subtitle="الحملات والشرائح"
        actions={
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            حملة جديدة
          </Button>
        }
      />

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList>
          <TabsTrigger value="campaigns">
            <Megaphone className="size-4" />
            الحملات
          </TabsTrigger>
          <TabsTrigger value="segments">
            <Users className="size-4" />
            الشرائح
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Sparkles className="size-4" />
            القوالب
          </TabsTrigger>
        </TabsList>

        {/* ============ Tab 1: Campaigns ============ */}
        <TabsContent value="campaigns" className="space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="إجمالي الحملات"
              value={formatNumber(stats.total)}
              icon={<Megaphone className="size-4" />}
            />
            <StatCard
              label="حملات جارية"
              value={formatNumber(stats.active)}
              hint="مجدولة أو قيد التنفيذ"
              icon={<Send className="size-4" />}
            />
            <StatCard
              label="رسائل مرسلة"
              value={formatNumber(stats.sent)}
              icon={<CheckCircle2 className="size-4" />}
            />
            <StatCard
              label="معدل الاستجابة"
              value={`${formatNumber(stats.responseRate)}٪`}
              hint={`${formatNumber(stats.responded)} رد`}
              icon={<MousePointerClick className="size-4" />}
            />
          </div>

          <SectionTitle>قائمة الحملات</SectionTitle>

          {sortedCampaigns.length === 0 ? (
            <EmptyState
              icon={<Megaphone className="size-10" />}
              title="لا توجد حملات بعد"
              description="ابدأ بإنشاء أول حملة تسويقية لاستهداف شرائح عملائك."
              action={
                <Button size="sm" onClick={() => setDialogOpen(true)}>
                  <Plus className="size-4" />
                  حملة جديدة
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {sortedCampaigns.map((c) => (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                  segmentName={segmentName(c.segmentId)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ============ Tab 2: Segments ============ */}
        <TabsContent value="segments" className="space-y-5">
          <SectionTitle>شرائح العملاء</SectionTitle>
          {segments.length === 0 ? (
            <EmptyState
              icon={<Users className="size-10" />}
              title="لا توجد شرائح"
              description="ستظهر هنا شرائح العملاء القائمة على القواعد."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {segments.map((s) => (
                <SegmentCard key={s.id} segment={s} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ============ Tab 3: Templates ============ */}
        <TabsContent value="templates" className="space-y-5">
          <SectionTitle>قوالب الرسائل</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            {TEMPLATES.map((t) => {
              const ch = CHANNEL_META[t.channel];
              return (
                <div
                  key={t.title}
                  className="card-hover flex flex-col rounded-lg border border-border bg-card p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex size-9 items-center justify-center rounded-md"
                        style={{ background: ch.bg, color: ch.color }}
                      >
                        {t.icon}
                      </span>
                      <div>
                        <p className="font-display text-base font-semibold text-foreground">
                          {t.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.tag}</p>
                      </div>
                    </div>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ background: ch.bg, color: ch.color }}
                    >
                      {ch.icon}
                      {ch.label}
                    </span>
                  </div>
                  <div
                    dir="rtl"
                    className="flex-1 rounded-md border border-border bg-muted/40 p-3 text-sm leading-relaxed text-foreground"
                  >
                    {t.body}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      قالب جاهز — يُستخدم مع المتغيرات
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDialogOpen(true);
                        toast.message("تم اختيار القالب — أكمل بيانات الحملة");
                      }}
                    >
                      <Sparkles className="size-4" />
                      استخدام القالب
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <NewCampaignDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        segments={segments}
        onCreate={(input) => {
          if (!user) return;
          createCampaign({
            name: input.name,
            segmentId: input.segmentId,
            channel: input.channel,
            message: input.message,
            scheduledAt: input.scheduledAt,
            budget: input.budget,
            status: "scheduled",
            createdBy: user.id,
          });
          toast.success(`تم إنشاء الحملة «${input.name}» وجدولتها بنجاح`);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}

// ============================================================
// Campaign Card
// ============================================================
function CampaignCard({
  campaign,
  segmentName,
}: {
  campaign: Campaign;
  segmentName: string;
}) {
  const ch = CHANNEL_META[campaign.channel];
  const st = STATUS_META[campaign.status];
  const responseRate =
    campaign.sentCount > 0
      ? Math.round((campaign.respondedCount / campaign.sentCount) * 100)
      : 0;
  const progress = campaign.sentCount > 0 ? responseRate : 0;

  return (
    <div className="card-hover rounded-lg border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {campaign.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Target className="size-3.5" />
              {segmentName}
            </span>
            <span aria-hidden>•</span>
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-3.5" />
              {formatDate(campaign.scheduledAt)}
            </span>
          </div>
        </div>
        <Badge variant={st.variant}>{st.label}</Badge>
      </div>

      {/* Channel badge */}
      <div className="mt-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ background: ch.bg, color: ch.color }}
        >
          {ch.icon}
          {ch.label}
        </span>
      </div>

      {/* Message preview */}
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {campaign.message}
      </p>

      {/* Stats row */}
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground">
            <Send className="size-3.5" />
            <span className="text-[11px] uppercase tracking-wider">مرسلة</span>
          </div>
          <p className="mt-1 font-display text-xl font-bold tnum text-foreground">
            {formatNumber(campaign.sentCount)}
          </p>
        </div>
        <div className="text-center border-x border-border">
          <div className="flex items-center justify-center gap-1 text-muted-foreground">
            <Eye className="size-3.5" />
            <span className="text-[11px] uppercase tracking-wider">فتحت</span>
          </div>
          <p className="mt-1 font-display text-xl font-bold tnum text-foreground">
            {formatNumber(campaign.openedCount)}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground">
            <MousePointerClick className="size-3.5" />
            <span className="text-[11px] uppercase tracking-wider">ردّت</span>
          </div>
          <p className="mt-1 font-display text-xl font-bold tnum text-foreground">
            {formatNumber(campaign.respondedCount)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">معدل الاستجابة</span>
          <span className="font-semibold text-primary tnum">
            {formatNumber(responseRate)}٪
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(100, progress)}%`,
              background: "#003527",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wallet className="size-3.5" />
          الميزانية:
          <span className="font-semibold text-foreground tnum">
            {formatEGP(campaign.budget)}
          </span>
        </span>
        <span className="text-[11px] text-muted-foreground">
          {campaign.sentCount > 0
            ? `${formatNumber(campaign.sentCount)} مستلم`
            : "لم تُرسل بعد"}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// Segment Card
// ============================================================
function SegmentCard({ segment }: { segment: Segment }) {
  return (
    <div
      className="card-hover relative overflow-hidden rounded-lg border border-border bg-card p-5"
      style={{ borderRightWidth: 4, borderRightColor: segment.color }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold text-foreground">
            {segment.name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">{segment.description}</p>
        </div>
        <span
          className="size-3 shrink-0 rounded-full"
          style={{ background: segment.color }}
          aria-hidden
        />
      </div>

      {/* Rule (mono, muted bg) */}
      <div
        dir="ltr"
        className="mt-3 rounded-md bg-muted/60 px-2.5 py-1.5 text-left font-mono text-[11px] text-muted-foreground"
      >
        {segment.rule}
      </div>

      {/* Big count */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            عدد العملاء
          </p>
          <p
            className="mt-1 font-display text-4xl font-bold tnum"
            style={{ color: segment.color }}
          >
            {formatNumber(segment.count)}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Target className="size-4" />
          استهداف
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// New Campaign Dialog
// ============================================================
function NewCampaignDialog({
  open,
  onOpenChange,
  segments,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  segments: Segment[];
  onCreate: (input: {
    name: string;
    segmentId: string;
    channel: CampaignChannel;
    message: string;
    scheduledAt: string;
    budget: number;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [segmentId, setSegmentId] = useState("");
  const [channel, setChannel] = useState<CampaignChannel>("sms");
  const [message, setMessage] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [budget, setBudget] = useState("");

  const reset = () => {
    setName("");
    setSegmentId("");
    setChannel("sms");
    setMessage("");
    setScheduledAt("");
    setBudget("");
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("الرجاء إدخال اسم الحملة");
      return;
    }
    if (!segmentId) {
      toast.error("الرجاء اختيار شريحة العملاء");
      return;
    }
    if (!message.trim()) {
      toast.error("الرجاء إدخال نص الرسالة");
      return;
    }
    if (!scheduledAt) {
      toast.error("الرجاء تحديد تاريخ الجدولة");
      return;
    }
    const budgetNum = Number(budget) || 0;
    if (budgetNum <= 0) {
      toast.error("الرجاء إدخال ميزانية صحيحة");
      return;
    }
    onCreate({
      name: name.trim(),
      segmentId,
      channel,
      message: message.trim(),
      scheduledAt: new Date(scheduledAt).toISOString(),
      budget: budgetNum,
    });
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>حملة تسويقية جديدة</DialogTitle>
          <DialogDescription>
            أنشئ حملة جديدة لاستهداف شريحة من عملائك عبر القناة المناسبة.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Name */}
          <div className="grid gap-1.5">
            <Label htmlFor="cmp-name">اسم الحملة</Label>
            <Input
              id="cmp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عرض الربيع — خصم ١٥٪"
            />
          </div>

          {/* Segment + Channel */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>الشريحة المستهدفة</Label>
              <Select value={segmentId} onValueChange={setSegmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر شريحة" />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({formatNumber(s.count)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>القناة</Label>
              <Select
                value={channel}
                onValueChange={(v) => setChannel(v as CampaignChannel)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">رسالة نصية</SelectItem>
                  <SelectItem value="email">بريد إلكتروني</SelectItem>
                  <SelectItem value="whatsapp">واتساب</SelectItem>
                  <SelectItem value="push">إشعار</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="grid gap-1.5">
            <Label htmlFor="cmp-msg">نص الرسالة</Label>
            <Textarea
              id="cmp-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا… يمكنك استخدام {name} كمتغير لاسم العميل."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              {message.length} حرف
            </p>
          </div>

          {/* Schedule + Budget */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="cmp-date">تاريخ الجدولة</Label>
              <Input
                id="cmp-date"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="cmp-budget">الميزانية (ج.م)</Label>
              <Input
                id="cmp-budget"
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="مثال: ١٥٠٠"
                dir="ltr"
                className="text-right"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>
            <Send className="size-4" />
            جدولة الحملة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
