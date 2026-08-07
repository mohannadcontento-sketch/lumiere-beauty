import type { ReactNode } from "react";
import {
  Sparkles,
  Users,
  CalendarDays,
  CreditCard,
  Boxes,
  Gift,
  Bell,
  Megaphone,
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Database,
  Server,
  Lock,
  Gauge,
  Rocket,
  Layers,
  GitBranch,
  Cpu,
  Ban,
  Globe2,
} from "lucide-react";
import { SidebarNav } from "@/components/spec/sidebar-nav";
import { Section, SectionHeader, Card, Pill, YesNo, Bullets } from "@/components/spec/ui";
import {
  ROLES,
  PERMISSION_MATRIX,
  CORE_MODULES,
  DB_TABLES,
  API_GROUPS,
  ROADMAP,
  USER_FLOWS,
} from "@/lib/spec-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex flex-1">
        <SidebarNav />
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 mx-auto max-w-5xl w-full px-5 sm:px-8 lg:px-12">
            <Hero />
            <OverviewSection />
            <VisionSection />
            <RolesSection />
            <ModulesSection />
            <AnalyticsSection />
            <MultiBranchSection />
            <MultiTenantSection />
            <DatabaseSection />
            <ApiSection />
            <ArchitectureSection />
            <SecuritySection />
            <NfrSection />
            <MvpSection />
            <V2Section />
            <RoadmapSection />
            <AssumptionsSection />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

/* ----------------------------- البطل ----------------------------- */

function Hero() {
  return (
    <header className="pt-12 sm:pt-16 pb-10 border-b border-border/60">
      <div className="flex items-center gap-2 mb-6">
        <Pill tone="violet">
          <Sparkles className="w-3 h-3" /> مواصفات جاهزة للإنتاج
        </Pill>
        <Pill tone="slate">
          <Ban className="w-3 h-3" /> بدون ذكاء اصطناعي — حتمي فقط
        </Pill>
      </div>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.2]">
        منصة إدارة
        <br />
        <span className="text-muted-foreground">مركز التجميل</span>
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
        منصة تشغيلية متكاملة تحوّل مركز التجميل التقليدي إلى عمل منظّم رقمياً —
        تربط العملاء والحجوزات والخدمات والمدفوعات والمخزون والتسويق والتحليلات
        في نظام حتمي واحد قائم على القواعد.
      </p>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { k: "5", v: "أدوار مستخدمين", icon: Users },
          { k: "12", v: "وحدات أساسية", icon: Layers },
          { k: "40", v: "جدول قاعدة بيانات", icon: Database },
          { k: "+60", v: "نقطة نهاية API", icon: Server },
        ].map((s) => (
          <div key={s.v} className="rounded-xl border border-border bg-card p-4">
            <s.icon className="w-4 h-4 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold tabular-nums">{s.k}</p>
            <p className="text-xs text-muted-foreground">{s.v}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900 p-4 text-sm">
        <p className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <Ban className="w-4 h-4" /> الذكاء الاصطناعي مستثنى صراحةً
        </p>
        <p className="mt-1 text-amber-700 dark:text-amber-400/90 text-[13px] leading-relaxed">
          تعمل المنصة بأكملها على قواعد أعمال حتمية واستعلامات قاعدة بيانات
          وتحليلات وتدفقات عمل قابلة للتكوين. البنية مصمَّمة بحيث{" "}
          <em>يمكن</em> إضافة الذكاء الاصطناعي في إصدار مستقبلي، لكن لا يوجد أي
          ذكاء اصطناعي في المنتج الحالي.
        </p>
      </div>
    </header>
  );
}

/* --------------------------- نظرة عامة --------------------------- */

function OverviewSection() {
  const deliverables = [
    "وثيقة متطلبات المنتج",
    "قائمة الميزات الكاملة",
    "مصفوفة الأدوار والصلاحيات",
    "مسارات المستخدم",
    "هندسة المعلومات",
    "وصف مخطط قاعدة البيانات",
    "مواصفات الواجهات البرمجية",
    "بنية النظام",
    "بنية الأمان",
    "نطاق MVP",
    "نطاق الإصدار الثاني",
    "خارطة طريق التطوير",
    "توصيات تقنية",
    "المخاطر",
    "الافتراضات",
  ];
  return (
    <Section id="overview">
      <SectionHeader
        number="00"
        kicker="خريطة الوثيقة"
        title="نظرة عامة"
        subtitle="هذه المواصفات منظَّمة في 15 مُخرَجاً. كل منها مفصّل بما يكفي ليبدأ فريق محترف تصميم UX/UI والتنفيذ مباشرةً."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {deliverables.map((d, i) => (
          <div
            key={d}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
          >
            <span className="grid place-items-center w-7 h-7 rounded-md bg-secondary text-secondary-foreground font-mono text-xs tabular-nums shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-sm font-medium">{d}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" /> ماذا تربط هذه المنصة
          </h3>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            دورة حياة العميل، من البداية للنهاية:
          </p>
          {/* مخطط تدفّق — يُعرض من اليسار لليمين كالمعتاد في المخططات */}
          <div dir="ltr" className="flex flex-wrap items-center gap-1.5 text-xs justify-start">
            {["Customer", "Booking", "Visit", "Service", "Payment", "History", "Follow-up", "Rebooking", "Loyalty"].map(
              (step, i, arr) => (
                <span key={step} className="flex items-center gap-1.5">
                  <Pill tone="violet">{step}</Pill>
                  {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
                </span>
              )
            )}
          </div>
          <div className="my-4 h-px bg-border" />
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">النطاقات التشغيلية:</p>
          <div className="flex flex-wrap gap-1.5">
            {["العملاء", "الموظفون", "الخدمات", "المواعيد", "المدفوعات", "المخزون", "التسويق", "التقارير", "التحليلات"].map(
              (d) => (
                <Pill key={d} tone="slate">{d}</Pill>
              )
            )}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-muted-foreground" /> مبادئ التصميم
          </h3>
          <Bullets
            items={[
              "مبدأ الامتياز الأقل عبر كل الأدوار",
              "عزل بيانات تعدد المستأجرين منذ اليوم الأول (تحديد نطاق بـ organization_id)",
              "قواعد أعمال حتمية فقط — بدون منطق احتمالي/ذكاء اصطناعي",
              "تكاملات نمطية (المدفوعات، الرسائل) عبر نمط المحوّل",
              "المخطط يدعم تعدد الفروع حتى لو كان أول عميل بفرع واحد",
              "قابلية التدقيق: كل إجراء حساس مُسجَّل",
            ]}
          />
        </Card>
      </div>
    </Section>
  );
}

/* --------------------------- الرؤية ---------------------------- */

function VisionSection() {
  return (
    <Section id="vision">
      <SectionHeader
        number="01"
        kicker="المُخرَج 1 — متطلبات المنتج"
        title="رؤية المنتج"
        subtitle="ليست مجرد نظام مواعيد، بل منصة تشغيلية متكاملة لإدارة مركز التجميل وفهمه."
      />
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <Users className="w-5 h-5 text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-1">للمشغّلين</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            استبدال التقاويم الورقية وحجوزات الواتساب المبعثرة والسجلات اليدوية
            بمصدر حقيقة واحد لكل موعد وعميل ومعاملة.
          </p>
        </Card>
        <Card>
          <LayoutDashboard className="w-5 h-5 text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-1">للملاك</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            رؤية الإيرادات اللحظية واستخدام الموظفين والاحتفاظ وصحة المخزون —
            والتصرف عبر حملات مستهدفة قائمة على القواعد.
          </p>
        </Card>
        <Card>
          <CreditCard className="w-5 h-5 text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-1">للعملاء</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            حجز إلكتروني في ثوانٍ، تتبّع الولاء، استلام تذكيرات في الوقت المناسب،
            وبناء علاقة مع المركز — لا مجرد معاملة.
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-muted-foreground" /> معايير النجاح (قابلة للقياس)
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { m: "صفر", d: "مواعيد مزدوجة" },
            { m: "< 5٪", d: "معدل الغياب (مع التذكيرات)" },
            { m: "+30٪", d: "معدل إعادة الحجز عبر الأتمتة" },
            { m: "99.9٪", d: "جهوزية المنصة" },
          ].map((s) => (
            <div key={s.d} className="text-center rounded-lg bg-secondary/50 p-4">
              <p className="text-2xl font-bold">{s.m}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.d}</p>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

/* --------------------------- الأدوار ----------------------------- */

function RolesSection() {
  return (
    <Section id="roles">
      <SectionHeader
        number="02"
        kicker="المُخرَج 2 و3 — المستخدمون، الأدوار، الصلاحيات"
        title="المستخدمون والأدوار"
        subtitle="نظام تحكم كامل بالوصول قائم على الأدوار مبني على مبدأ الامتياز الأقل. خمسة أدوار، لكل منها شاشات وإجراءات ورؤية بيانات محددة."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mb-8">
        {ROLES.map((role) => (
          <Card key={role.id}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{role.name}</h3>
              <Pill tone={role.id === "owner" ? "violet" : role.id === "customer" ? "amber" : "slate"}>
                {role.id}
              </Pill>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{role.summary}</p>

            <p className="text-[11px] font-semibold tracking-wider text-muted-foreground mb-1.5">
              الشاشات
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {role.screens.map((s) => (
                <Pill key={s}>{s}</Pill>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 mt-2">
              <div>
                <p className="text-[11px] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  يمكنه الرؤية
                </p>
                <Bullets items={role.canSee} />
              </div>
              <div>
                <p className="text-[11px] font-semibold tracking-wider text-rose-600 dark:text-rose-400 mb-1">
                  لا يمكنه الرؤية
                </p>
                <Bullets items={role.cannotSee} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold">مصفوفة الصلاحيات</h3>
          <p className="text-sm text-muted-foreground mt-1">
            القدرة × الدور. <span className="text-emerald-600 dark:text-emerald-400">✓</span> = مسموح،
            <span className="text-muted-foreground"> — </span> = مرفوض.
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[260px]">القدرة</TableHead>
                <TableHead>الوحدة</TableHead>
                <TableHead className="text-center">المالك</TableHead>
                <TableHead className="text-center">المدير</TableHead>
                <TableHead className="text-center">الاستقبال</TableHead>
                <TableHead className="text-center">الموظف</TableHead>
                <TableHead className="text-center">العميل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSION_MATRIX.map((row) => (
                <TableRow key={row.capability + row.module}>
                  <TableCell className="font-medium text-[13px]">{row.capability}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{row.module}</TableCell>
                  <TableCell className="text-center"><YesNo value={row.owner} /></TableCell>
                  <TableCell className="text-center"><YesNo value={row.admin} /></TableCell>
                  <TableCell className="text-center"><YesNo value={row.receptionist} /></TableCell>
                  <TableCell className="text-center"><YesNo value={row.staff} /></TableCell>
                  <TableCell className="text-center"><YesNo value={row.customer} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </Section>
  );
}

/* --------------------------- الوحدات ---------------------------- */

function ModulesSection() {
  return (
    <Section id="modules">
      <SectionHeader
        number="03"
        kicker="المُخرَج 2 — قائمة الميزات وهندسة المعلومات"
        title="الوحدات الأساسية"
        subtitle="اثنتا عشرة وحدة تغطّي السطح التشغيلي الكامل للمنصة. كل منها مصمَّمة بمنطق حتمي وقواعد قابلة للتكوين."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {CORE_MODULES.map((m) => (
          <Card key={m.id}>
            <div className="flex items-start gap-3 mb-3">
              <span className="grid place-items-center w-9 h-9 rounded-lg bg-primary text-primary-foreground font-mono text-sm shrink-0">
                {m.letter}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold leading-tight">{m.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{m.purpose}</p>
              </div>
            </div>
            <Bullets items={m.features} />
            {m.notes && (
              <p className="mt-3 text-xs text-muted-foreground italic border-r-2 border-border pr-3">
                {m.notes}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* مسارات المستخدم */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-1">مسارات المستخدم</h3>
        <p className="text-sm text-muted-foreground mb-5">المُخرَج 4 — رحلات رئيسية من البداية للنهاية.</p>
        <div className="grid gap-4 lg:grid-cols-3">
          {USER_FLOWS.map((flow) => (
            <Card key={flow.name}>
              <h4 className="font-semibold mb-3 text-sm">{flow.name}</h4>
              <ol className="space-y-2">
                {flow.steps.map((step, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="grid place-items-center w-5 h-5 rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="text-xs">
                      <span className="font-semibold text-foreground">{step.actor}: </span>
                      <span className="text-muted-foreground">{step.action}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* --------------------------- التحليلات -------------------------- */

function AnalyticsSection() {
  const groups = [
    {
      title: "تحليلات العملاء",
      icon: Users,
      tone: "violet" as const,
      items: [
        "عملاء جدد (للفترة)",
        "عملاء عائدون",
        "معدل الاحتفاظ (قائم على المجموعات)",
        "معدل التسرّب / الخمول",
        "متوسط الإنفاق لكل عميل",
        "تكرار الزيارة",
      ],
    },
    {
      title: "تحليلات الخدمات",
      icon: Sparkles,
      tone: "rose" as const,
      items: [
        "الخدمات الأكثر شعبية",
        "الخدمات الأقل شعبية",
        "الإيرادات حسب الخدمة",
        "استخدام الخدمة (الحجوزات مقابل السعة)",
      ],
    },
    {
      title: "تحليلات الموظفين",
      icon: Users,
      tone: "amber" as const,
      items: [
        "المواعيد المُنجزة",
        "الخدمات المكتملة",
        "الإيرادات المُولّدة",
        "معدل الإلغاء",
        "الاستخدام (ساعات محجوزة / ساعات متاحة)",
      ],
    },
    {
      title: "تحليلات الأعمال",
      icon: Gauge,
      tone: "emerald" as const,
      items: [
        "الإيرادات (يومية / شهرية / للفترة)",
        "المصروفات (إذا أُدخلت)",
        "صافي الربح (إذا توفّرت المصروفات)",
        "النمو (٪ مقابل الفترة السابقة)",
        "متوسط قيمة المعاملة",
      ],
    },
  ];
  return (
    <Section id="analytics">
      <SectionHeader
        number="04"
        kicker="المُخرَج — التقارير والذكاء"
        title="التحليلات"
        subtitle="تحليلات حتمية محسوبة من استعلامات وتجميعات قاعدة البيانات. بدون نماذج تنبؤية، بدون تعلّم آلي."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((g) => (
          <Card key={g.title}>
            <div className="flex items-center gap-2 mb-3">
              <Pill tone={g.tone}>
                <g.icon className="w-3 h-3" /> {g.title}
              </Pill>
            </div>
            <Bullets items={g.items} />
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Ban className="w-4 h-4 text-amber-600" /> ما لا تشمله التحليلات
        </h3>
        <Bullets
          items={[
            "لا تنبؤ أو توقّع ولا تسرّب مبني على تعلّم آلي",
            "لا رؤى مُولَّدة بالذكاء الاصطناعي أو ملخصات بلغة طبيعية",
            "لا محرّكات توصية",
            "كل الأرقام تجميعات SQL مباشرة على بيانات حقيقية",
          ]}
        />
      </Card>
    </Section>
  );
}

/* ------------------------- تعدد الفروع ------------------------- */

function MultiBranchSection() {
  return (
    <Section id="multibranch">
      <SectionHeader
        number="05"
        kicker="البنية"
        title="بنية تعدد الفروع"
        subtitle="نموذج البيانات يدعم المؤسسة ← الفروع ← الموظفين/العملاء/الخدمات/المواعيد/المخزون منذ اليوم الأول، حتى لو كان أول عميل يدير فرعاً واحداً."
      />
      <Card>
        <div dir="ltr" className="flex flex-wrap items-center gap-2 text-sm font-mono justify-start">
          {["Organization", "Branch", "Staff", "Customers", "Services", "Appointments", "Inventory"].map(
            (n, i, arr) => (
              <span key={n} className="flex items-center gap-2">
                <span className="rounded-lg border border-border bg-secondary/50 px-3 py-1.5">{n}</span>
                {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
              </span>
            )
          )}
        </div>
        <div className="my-5 h-px bg-border" />
        <Bullets
          items={[
            "كل كيان تشغيلي يحمل مفتاحاً أجنبياً branch_id",
            "الموظفون ينتمون لفرع؛ العملاء لديهم «فرع رئيسي» اختياري لكن يمكنهم الحجز عبر الفروع",
            "المخزون يُتتبَّع لكل فرع (مستويات مخزون منفصلة)",
            "يمكن تحديد نطاق التقارير بفرع واحد أو تجميعها عبر المؤسسة",
            "الخدمات تُعرَّف على مستوى المؤسسة لكن يمكن تفعيل/تعطيل كل منها لكل فرع",
            "ساعات العمل وأيام الإجازة لكل موظف (وبالتالي لكل فرع)",
          ]}
        />
      </Card>
    </Section>
  );
}

/* ------------------------ تعدد المستأجرين -------------------------- */

function MultiTenantSection() {
  return (
    <Section id="multitenant">
      <SectionHeader
        number="06"
        kicker="البنية"
        title="جاهزية تعدد المستأجرين SaaS"
        subtitle="المنصة مصمَّمة لخدمة مراكز تجميل متعددة مستقبلاً. كل كيان مملوك للمؤسسة محدد النطاق بـ organization_id، مع عزل بيانات كامل."
      />
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <Building2 className="w-5 h-5 text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-2">نموذج العزل</h3>
          <Bullets
            items={[
              "قاعدة بيانات مشتركة، مخطط مشترك — تمييز المستأجر عبر organization_id",
              "كل استعلام يفرض organization_id في طبقة الـORM/المستودع",
              "سياسات أمن على مستوى الصف (RLS) في PostgreSQL كإجراء دفاعي إضافي",
              "سياق المستأجر يُحلّ من الجلسة المُصادَقة، أبداً من مدخلات المستخدم",
            ]}
          />
        </Card>
        <Card>
          <ShieldCheck className="w-5 h-5 text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-2">قائمة جاهزية SaaS</h3>
          <Bullets
            items={[
              "تكوين لكل مستأجر (العملة، المنطقة الزمنية، قواعد الضريبة)",
              "علامة تجارية/تخصيص لكل مستأجر (الإصدار 3)",
              "نموذج اشتراك وفوترة (الإصدار 3)",
              "تحديد معدّل وحصص لكل مستأجر",
              "سجلات تدقيق محددة النطاق بـ organization_id",
              "نسخ احتياطية قابلة للاستعادة لكل مستأجر (تصدير منطقي)",
            ]}
          />
        </Card>
      </div>
    </Section>
  );
}

/* --------------------------- قاعدة البيانات --------------------------- */

function DatabaseSection() {
  const groups = Array.from(new Set(DB_TABLES.map((t) => t.group)));
  return (
    <Section id="database">
      <SectionHeader
        number="07"
        kicker="المُخرَج 6 — وصف مخطط قاعدة البيانات"
        title="تصميم قاعدة البيانات"
        subtitle="مخطط PostgreSQL طبيعي من 40 جدولاً عبر 9 مجموعات وظيفية. كل جدول يتضمّن مفاتيح أساسية ومفاتيح أجنبية وفهارس وقيود."
      />
      <div className="flex flex-wrap gap-1.5 mb-6">
        {groups.map((g) => {
          const count = DB_TABLES.filter((t) => t.group === g).length;
          return (
            <Pill key={g} tone="slate">
              {g} · {count}
            </Pill>
          );
        })}
      </div>

      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group}>
            <h3 className="text-sm font-bold tracking-wider text-muted-foreground mb-3">
              {group}
            </h3>
            <div className="grid gap-4 lg:grid-cols-2">
              {DB_TABLES.filter((t) => t.group === group).map((table) => (
                <Card key={table.name} className="p-0 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/40">
                    {/* اسم الجدول كود — يُعرض من اليسار لليمين */}
                    <h4 dir="ltr" className="font-mono font-semibold text-sm text-right w-full">{table.name}</h4>
                    <Database className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  </div>
                  <p className="px-4 pt-3 text-xs text-muted-foreground">{table.description}</p>
                  {/* جدول الأعمدة — كود، يُعرض LTR */}
                  <div dir="ltr" className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Column</TableHead>
                          <TableHead className="text-xs">Type</TableHead>
                          <TableHead className="text-xs text-center">Key</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {table.columns.map((c) => (
                          <TableRow key={c.name}>
                            <TableCell className="font-mono text-[11px] py-1.5">{c.name}</TableCell>
                            <TableCell className="font-mono text-[11px] text-muted-foreground py-1.5">
                              {c.type}
                            </TableCell>
                            <TableCell className="py-1.5 text-center">
                              {c.pk && <Pill tone="violet">PK</Pill>}
                              {c.fk && <Pill tone="amber">FK</Pill>}
                              {c.nullable && <span className="text-[10px] text-muted-foreground">null</span>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {(table.indexes?.length || table.constraints?.length) && (
                    <div dir="ltr" className="px-4 py-3 border-t border-border bg-secondary/20 space-y-1.5 text-left">
                      {table.indexes?.map((idx) => (
                        <p key={idx} className="text-[11px] font-mono text-muted-foreground">
                          <span className="text-emerald-600 dark:text-emerald-400">idx:</span> {idx}
                        </p>
                      ))}
                      {table.constraints?.map((con) => (
                        <p key={con} className="text-[11px] font-mono text-muted-foreground">
                          <span className="text-amber-600 dark:text-amber-400">con:</span> {con}
                        </p>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------- الواجهات ------------------------------ */

function ApiSection() {
  return (
    <Section id="api">
      <SectionHeader
        number="08"
        kicker="المُخرَج 7 — مواصفات الواجهات البرمجية"
        title="تصميم الواجهات"
        subtitle="واجهات RESTful عبر HTTPS بصيغة JSON. مصادقة برمز Bearer، تفويض قائم على الدور عند كل نقطة نهاية، غلاف أخطاء موحّد، وتقسيم لصفحات."
      />
      <div dir="ltr" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8 text-left">
        {[
          { l: "Base URL", v: "https://api.beautycenter.app/v1" },
          { l: "Auth", v: "Bearer JWT (access) + refresh" },
          { l: "Pagination", v: "?page=1&limit=20 → { data, meta }" },
          { l: "Errors", v: "{ error: { code, message, details } }" },
        ].map((s) => (
          <Card key={s.l} className="p-4">
            <p className="text-[11px] tracking-wider text-muted-foreground">{s.l}</p>
            <p className="text-sm font-mono mt-1 break-all">{s.v}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        {API_GROUPS.map((group) => (
          <Card key={group.module} className="p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-secondary/40">
              <h3 className="font-semibold">{group.module}</h3>
            </div>
            {/* جدول الواجهات — كود، يُعرض LTR */}
            <div dir="ltr" className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Method</TableHead>
                    <TableHead className="min-w-[240px]">Endpoint</TableHead>
                    <TableHead>Auth</TableHead>
                    <TableHead className="min-w-[200px]">Roles</TableHead>
                    <TableHead className="min-w-[260px]">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.endpoints.map((ep) => (
                    <TableRow key={ep.method + ep.path}>
                      <TableCell>
                        <MethodBadge method={ep.method} />
                      </TableCell>
                      <TableCell className="font-mono text-[12px]">{ep.path}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{ep.auth}</TableCell>
                      <TableCell className="text-xs">{ep.roles}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{ep.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h3 className="font-semibold mb-3">التحقق وحالات الخطأ (موحّدة)</h3>
        <div dir="ltr" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          {[
            { c: "400", d: "خطأ تحقق", tone: "amber" as const },
            { c: "401", d: "رمز مفقود/غير صالح", tone: "amber" as const },
            { c: "403", d: "ممنوع (دور/مستأجر)", tone: "rose" as const },
            { c: "404", d: "المورد غير موجود", tone: "slate" as const },
            { c: "409", d: "تعارض (حجز مزدوج)", tone: "rose" as const },
            { c: "422", d: "كيان غير قابل للمعالجة", tone: "amber" as const },
            { c: "429", d: "محدود المعدّل", tone: "amber" as const },
            { c: "500", d: "خطأ خادم داخلي", tone: "rose" as const },
          ].map((e) => (
            <div key={e.c} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-sm">{e.c}</span>
                <Pill tone={e.tone}>{e.tone === "rose" ? "خطأ" : "عميل"}</Pill>
              </div>
              <p className="text-xs text-muted-foreground">{e.d}</p>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

function MethodBadge({ method }: { method: string }) {
  const map: Record<string, string> = {
    GET: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    POST: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400",
    PATCH: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    PUT: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    DELETE: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
  };
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${map[method] ?? ""}`}>
      {method}
    </span>
  );
}

/* ------------------------ البنية -------------------------- */

function ArchitectureSection() {
  const stack = [
    {
      layer: "الواجهة الأمامية",
      icon: LayoutDashboard,
      choice: "Next.js + React + TypeScript",
      why: "SSR للوحات المعلومات، App Router، أنواع مشتركة مع الخلفية. النشر على Vercel لأداء الحافة.",
    },
    {
      layer: "واجهة المستخدم",
      icon: Sparkles,
      choice: "Tailwind CSS + shadcn/ui",
      why: "نظام تصميم متّسق، مكوّنات يسهل الوصول إليها، تكرار سريع. بدون قفل بإطار مكوّنات ثقيل.",
    },
    {
      layer: "الخلفية",
      icon: Server,
      choice: "NestJS + TypeScript",
      why: "بنية نمطية، مزخرفات للتحكم بالوصول، حقن الاعتماديات، ممتازة لخدمات تعدد المستأجرين.",
    },
    {
      layer: "قاعدة البيانات",
      icon: Database,
      choice: "PostgreSQL (مُدارة)",
      why: "تكامل علائقي، JSONB للتكوين المرن، RLS لعزل المستأجر، منظومة ناضجة.",
    },
    {
      layer: "ORM",
      icon: Layers,
      choice: "Prisma",
      why: "استعلامات آمنة نوعياً، هجرات، المخطط ككود. أنواع مخطط مشتركة بين الواجهة والخلفية.",
    },
    {
      layer: "التخزين المؤقت / المهام",
      icon: Bell,
      choice: "Redis + BullMQ",
      why: "مهام خلفية للتذكيرات والحملات وإعادة احتساب الشرائح. محفّزات cron حتمية.",
    },
    {
      layer: "التخزين",
      icon: Boxes,
      choice: "Cloudflare R2 / S3",
      why: "صور الملفات، الإيصالات، التصديرات. خروج رخيص، متين، مدعوم بـCDN.",
    },
    {
      layer: "المصادقة",
      icon: Lock,
      choice: "JWT (وصول+تحديث) + RBAC",
      why: "واجهة عديمة الحالة، صلاحيات دقيقة، تدوير التحديث مع إمكانية الإلغاء.",
    },
  ];
  return (
    <Section id="architecture">
      <SectionHeader
        number="09"
        kicker="المُخرَج 8 — بنية النظام"
        title="بنية النظام"
        subtitle="حزمة عملية جاهزة للإنتاج توازن بين سرعة التطوير وأمان النوع وبساطة التشغيل."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {stack.map((s) => (
          <Card key={s.layer}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4 text-muted-foreground" />
              <Pill tone="violet">{s.layer}</Pill>
            </div>
            <p className="font-semibold mb-1">{s.choice}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.why}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Server className="w-4 h-4 text-muted-foreground" /> تدفّق الطلب والبيانات
        </h3>
        {/* مخطط تدفّق — LTR */}
        <div dir="ltr" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm justify-start">
          {[
            "Client (Web)",
            "CDN / Edge",
            "API Gateway",
            "NestJS API",
            "RBAC Guard",
            "Prisma",
            "PostgreSQL",
          ].map((n, i, arr) => (
            <span key={n} className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 font-mono">
                {n}
              </span>
              {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
            </span>
          ))}
        </div>
        <div className="my-4 h-px bg-border" />
        <div dir="ltr" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm justify-start">
          <span className="text-muted-foreground">Background:</span>
          {["Cron", "BullMQ Worker", "Redis", "Notification Provider"].map((n, i, arr) => (
            <span key={n} className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 font-mono">
                {n}
              </span>
              {i < arr.length - 1 && <span className="text-muted-foreground">→</span>}
            </span>
          ))}
        </div>
      </Card>

      <Card className="mt-4">
        <h3 className="font-semibold mb-3">البدائل والمقايضات</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>القرار</TableHead>
                <TableHead>المختار</TableHead>
                <TableHead>البديل</TableHead>
                <TableHead>المقايضة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["إطار الخلفية", "NestJS", "Express / Fastify", "بنية ومزخرفات أكثر مقابل وزن أخف"],
                ["قاعدة بيانات لكل مستأجر", "مخطط مشترك + org_id", "مخطط لكل مستأجر", "تشغيل أبسط؛ يعتمد على RLS للعزل"],
                ["المصادقة", "JWT + تحديث", "كوكيز الجلسة", "عديم الحالة يتوسّع أفضل؛ الكوكيز أبسط لـ SSR"],
                ["المهام", "Redis + BullMQ", "pg-boss / طابور قاعدة بيانات", "Redis أسرع وأغنى؛ pg-boss اعتماديات أقل"],
                ["نشر الواجهة", "Vercel", "استضافة ذاتية Node", "حافة بدون إعداد؛ خطر قفل المزوّد"],
              ].map((r) => (
                <TableRow key={r[0]}>
                  <TableCell className="font-medium text-sm">{r[0]}</TableCell>
                  <TableCell className="text-sm text-emerald-600 dark:text-emerald-400">{r[1]}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r[2]}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r[3]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </Section>
  );
}

/* --------------------------- الأمان --------------------------- */

function SecuritySection() {
  const controls = [
    { icon: Lock, t: "المصادقة", d: "تجزئة كلمة المرور Argon2id، JWT وصول (TTL قصير) + تحديث (متدفّق، قابل للإلغاء)، TOTP اختياري للمالك/المدير." },
    { icon: ShieldCheck, t: "التفويض (RBAC)", d: "مفاتيح صلاحيات تُفحص عبر مزخرفات عند كل نقطة نهاية. تحديد نطاق المستأجر + الفرع في طبقة المستودع." },
    { icon: Lock, t: "التحقق من المدخلات", d: "مخططات Zod/class-validator لكل جسم واستعلام طلب. رفض الحقول غير المعروفة." },
    { icon: Gauge, t: "تحديد المعدّل", d: "حدود لكل IP ولكل مستخدم على نقاط المصادقة والكتابة. تراجع أُسّي عند الفشل." },
    { icon: Lock, t: "تخزين كلمة المرور", d: "Argon2id مع ملح لكل مستخدم. لا تُسجَّل ولا تُعاد في أي استجابة." },
    { icon: ShieldCheck, t: "حماية CSRF", d: "كوكيز مزدوجة الإرسال + SameSite=Strict على مسارات الجلسة (مصادقة الكوكيز). مسارات JWT-في-الترويسة معفاة." },
    { icon: ShieldCheck, t: "منع XSS", d: "إفلات تلقائي في React، CSP صارم، لا dangerouslySetInnerHTML، تطهير مدخلات النص الغني." },
    { icon: Database, t: "حقن SQL", d: "استعلامات Prisma ذات وسائط حصراً. بدون دمج سلاسل خام." },
    { icon: ShieldCheck, t: "سجلات التدقيق", d: "جدول audit_logs غير قابل للتعديل لكل الإجراءات الحساسة (مدفوعات، مردودات، تغيير أدوار، تصدير بيانات)." },
    { icon: Boxes, t: "النسخ الاحتياطية", d: "لقطات PostgreSQL المُدارة يومياً تلقائياً + PITR. تدريبات استعادة فصلية." },
    { icon: Building2, t: "عزل البيانات", d: "organization_id على كل كيان + سياسات RLS في Postgres كدفاع إضافي." },
    { icon: Boxes, t: "رفع الملفات الآمن", d: "روابط رفع موقّعة إلى R2/S3، تحقق نوع من جهة الخادم، حدود حجم، فحص AV عند الاستقبال." },
    { icon: Server, t: "أمان API", d: "HTTPS فقط، HSTS، قائمة CORS لكل مستأجر، توقيع الطلبات للويبهوك." },
    { icon: Lock, t: "إدارة الأسرار", d: "Vault / AWS Secrets Manager. لا أسرار في ملفات env في الإنتاج. تدوير ربع سنوي." },
  ];
  return (
    <Section id="security">
      <SectionHeader
        number="10"
        kicker="المُخرَج 9 — بنية الأمان"
        title="الأمان"
        subtitle="دفاع في العمق: هوية، تفويض، نقل، بيانات، وضوابط تشغيلية."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {controls.map((c) => (
          <Card key={c.t} className="p-5">
            <c.icon className="w-4 h-4 text-muted-foreground mb-2" />
            <h3 className="font-semibold text-sm mb-1">{c.t}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.d}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------- المتطلبات غير الوظيفية ------------------------------ */

function NfrSection() {
  const nfrs = [
    { t: "الأداء", d: "استجابة API عند p95 < 300ms؛ تحميل اللوحة < ثانيتين؛ حساب مواعيد التقويم < 500ms ليوم.", icon: Gauge },
    { t: "قابلية التوسّع", d: "واجهة عديمة الحالة أفقياً خلف موازن حمل؛ نسخ قراءة للتقارير؛ Redis للكاش الساخن.", icon: Server },
    { t: "الأمان", d: "تخفيفات OWASP Top 10؛ اختبار اختراق قبل الإطلاق؛ فحص الاعتماديات في CI.", icon: Lock },
    { t: "التوفّر", d: "هدف SLA جهوزية 99.9٪؛ قاعدة بيانات متعددة المناطق؛ نشر بدون توقّف؛ فحوصات صحة وإعادة تشغيل تلقائية.", icon: ShieldCheck },
    { t: "إمكانية الوصول", d: "WCAG 2.1 AA؛ HTML دلالي؛ تنقّل بلوحة المفاتيح؛ وسوم ARIA؛ تباين ألوان ≥ 4.5:1.", icon: Users },
    { t: "التصميم المتجاوب", d: "المحمول أولاً؛ نقاط sm/md/lg/xl؛ أهداف لمس ≥ 44px؛ يعمل من 360px إلى 4K.", icon: LayoutDashboard },
    { t: "قابلية الاستخدام على الجوال", d: "PWA قابلة للتثبيت؛ تدفقات الاستقبال والموظف محسّنة للوحات؛ بوابة العملاء محمول أولاً.", icon: Sparkles },
    { t: "الرصد", d: "سجلات منظّمة، مقاييس (Prometheus)، تتبّع موزّع (OpenTelemetry)، تتبّع أخطاء (Sentry).", icon: Bell },
    { t: "النسخ الاحتياطي", d: "لقطات قاعدة بيانات يومية تلقائية + PITR لـ35 يوماً؛ تصدير تكوين أسبوعي؛ مشفّر عند السكون.", icon: Boxes },
    { t: "التعافي", d: "RPO ≤ 15 دقيقة، RTO ≤ 4 ساعات؛ runbooks موثّقة؛ اختبارات استعادة فصلية.", icon: ShieldCheck },
    { t: "قابلية الصيانة", d: "أنواع من الطرف للطرف؛ تغطية اختبارات > 70٪ على المسارات الحرجة؛ حدود وحدات؛ ADRs موثّقة.", icon: Layers },
    { t: "التدويل", d: "عملات متعددة، مناطق زمنية متعددة، سلاسل جاهزة i18n (الإصدار الثاني).", icon: Globe2 },
  ];
  return (
    <Section id="nfr">
      <SectionHeader
        number="11"
        kicker="المُخرَج — المتطلبات غير الوظيفية"
        title="المتطلبات غير الوظيفية"
        subtitle="سمات جودة قابلة للقياس يجب أن يحققها النظام في الإنتاج."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {nfrs.map((n) => (
          <Card key={n.t} className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <n.icon className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">{n.t}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{n.d}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------- MVP ------------------------------ */

function MvpSection() {
  const included = [
    { icon: Lock, t: "المصادقة", d: "تسجيل الدخول، الخروج، إعادة تعيين كلمة المرور، RBAC، إدارة الجلسات، 2FA للمالك/المدير." },
    { icon: Users, t: "المستخدمون والأدوار", d: "إدارة حسابات الموظفين، إسناد الأدوار، تفعيل/إلغاء تفعيل." },
    { icon: Users, t: "العملاء (CRM)", d: "ملفات، بحث، سجل الخدمات والمدفوعات، ملاحظات، وسوم." },
    { icon: Users, t: "الموظفون", d: "ملفات، خدمات، ساعات عمل، أيام إجازة." },
    { icon: Sparkles, t: "الخدمات", d: "فئات، تسعير، مدة، إضافات، حالة." },
    { icon: CalendarDays, t: "التقويم", d: "عروض يوم/أسبوع/شهر + حسب الموظف." },
    { icon: CalendarDays, t: "المواعيد", d: "إنشاء، إعادة جدولة، إلغاء، تسجيل دخول، إكمال، غياب. منع الحجز المزدوج." },
    { icon: CreditCard, t: "المدفوعات (POS)", d: "نقدي/بطاقة، فواتير، إيصالات، خصومات، ضريبة." },
    { icon: LayoutDashboard, t: "لوحات المعلومات", d: "نظرات عامة حسب الدور (المالك/المدير/الاستقبال/الموظف)." },
  ];
  const excluded = [
    "بوابة العملاء والحجز الإلكتروني",
    "محرّك الإشعارات والأتمتة",
    "الولاء والعضوية",
    "التقسيم والتسويق",
    "إدارة المخزون",
    "التقارير والتحليلات المتقدمة",
    "تكامل بوابة الدفع الإلكتروني",
    "واجهة إدارة تعدد الفروع",
  ];
  return (
    <Section id="mvp">
      <SectionHeader
        number="12"
        kicker="المُخرَج 10 — نطاق MVP"
        title="نطاق MVP (الإصدار الأول)"
        subtitle="أصغر منتج قيّم يدير عمليات مركز التجميل اليومية من البداية للنهاية. مرتَّب بالأولوية: المصادقة ← المستخدمون ← العملاء ← الموظفون ← الخدمات ← التقويم ← المواعيد ← المدفوعات ← اللوحة."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-3 sm:grid-cols-2">
          {included.map((item, i) => (
            <Card key={item.t} className="p-4">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="grid place-items-center w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 font-mono text-xs font-bold">
                  {i + 1}
                </span>
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm">{item.t}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pr-9">{item.d}</p>
            </Card>
          ))}
        </div>
        <Card className="border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900">
          <div className="flex items-center gap-2 mb-3">
            <Ban className="w-4 h-4 text-rose-600" />
            <h3 className="font-semibold text-sm">ليس في MVP</h3>
          </div>
          <ul className="space-y-2">
            {excluded.map((e) => (
              <li key={e} className="flex gap-2 text-xs text-rose-700 dark:text-rose-400/90">
                <span className="text-rose-400">✕</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Section>
  );
}

/* --------------------------- الإصدار الثاني والمستقبل ------------------------ */

function V2Section() {
  const v2 = [
    { icon: Users, t: "بوابة العملاء", d: "حجز ذاتي الخدمة، السجل، الفواتير، الولاء." },
    { icon: CalendarDays, t: "الحجز الإلكتروني", d: "تدفّق حجز عام بمحرّك المواعيد." },
    { icon: Bell, t: "الإشعارات والأتمتة", d: "محرّك قواعد حتمي: تذكيرات، أعياد ميلاد، إعادة حجز، انخفاض مخزون." },
    { icon: Gift, t: "الولاء", d: "نقاط، قواعد كسب/استرداد، انتهاء." },
    { icon: Gift, t: "العضوية", d: "مستويات (أساسي/ذهبي/VIP) مع خصومات وحجز أولوية." },
    { icon: Users, t: "التقسيم", d: "شرائح ديناميكية قائمة على القواعد." },
    { icon: Megaphone, t: "الحملات التسويقية", d: "استهداف شرائح بالرسائل/البريد مع تتبّع النتائج." },
    { icon: Boxes, t: "المخزون", d: "منتجات، مخزون، موردين، استهلاك، تنبيهات انخفاض." },
    { icon: Gauge, t: "تقارير متقدمة", d: "تحليلات العملاء/الخدمات/الموظفين/الأعمال." },
  ];
  const future = [
    "واجهة إدارة تعدد الفروع وتحليلات عبر الفروع",
    "نموذج اشتراك/فوترة SaaS",
    "تسويق متقدم (A/B حتمي، تسلسلات تنقيطية)",
    "تكاملات خارجية (QuickBooks/Xero، مزامنة التقويم)",
    "أتمتة متقدمة (تدفقات شرطية متعددة الخطوات)",
    "تحليلات متقدمة (مجموعات، منشئ تقارير مخصّص)",
    "تطبيقات جوال (موظف وعميل)",
    "تخصيص العلامة التجارية",
  ];
  return (
    <Section id="v2">
      <SectionHeader
        number="13"
        kicker="المُخرَج 11 — نطاق الإصدار الثاني والمستقبل"
        title="الإصدار الثاني والمستقبل"
        subtitle="الإصدار الثاني ينمّي المنصة إلى محرّك احتفاظ وتسويق. الإصدارات المستقبلية تتوسّع إلى SaaS متعدد الفروع — دون إدخال ذكاء اصطناعي أبداً."
      />
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Pill tone="amber">الإصدار الثاني</Pill> النمو والاحتفاظ
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {v2.map((item) => (
          <Card key={item.t} className="p-5">
            <item.icon className="w-4 h-4 text-muted-foreground mb-2" />
            <h4 className="font-semibold text-sm mb-1">{item.t}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
          </Card>
        ))}
      </div>

      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Pill tone="emerald">الإصدار 3+</Pill> المستقبل — التوسّع والتكامل
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {future.map((f) => (
          <div key={f} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
            <Rocket className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-sm">{f}</span>
          </div>
        ))}
      </div>
      <Card className="mt-6 border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
        <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <Ban className="w-4 h-4" />
          <span>
            <strong>لا ذكاء اصطناعي في أي إصدار مستقبلي ما لم يُحدَّد صراحةً.</strong> البنية
            جاهزة للذكاء الاصطناعي (خدمات نمطية، بيانات نظيفة)، لكن المنتج يبقى حتمياً.
          </span>
        </p>
      </Card>
    </Section>
  );
}

/* --------------------------- خارطة الطريق ---------------------------- */

function RoadmapSection() {
  const risks = [
    { t: "صحة حساب المواعيد", d: "منع الحجز المزدوج عبر خدمات متداخلة وفترات وحجوزات متعددة الموظفين هي أعقد منطق. التخفيف باختبارات وحدة شاملة + اختبارات قائمة على الخصائص.", tone: "rose" as const },
    { t: "موثوقية مزوّد الدفع", d: "توقّف البوابة أو تأخّر الويبهوك غير المتزامن. التخفيف بسجلات دفع idempotent + مهام تسوية.", tone: "amber" as const },
    { t: "تسرّب بيانات المستأجر", d: "فلتر org_id مفقود واحد يكشف بيانات عبر المستأجرين. التخفيف بسياسات RLS + إفراذ طبقة المستودع + اختبارات تكامل.", tone: "rose" as const },
    { t: "تسليم التذكيرات (الرسائل/البريد)", d: "فشل المزوّد. التخفيف بطوابير إعادة المحاولة، مزوّدون احتياطيون، وتتبّع حالة التسليم.", tone: "amber" as const },
    { t: "معالجة المنطقة الزمنية", d: "تعدد الفروع عبر المناطق الزمنية. التخفيف بتخزين كل الطوابع الزمنية بـ UTC + منطقة زمنية لكل فرع/مؤسسة للعرض.", tone: "slate" as const },
    { t: "زحف النطاق", d: "سحب ميزات الإصدار الثاني إلى MVP. التخفيف ببوابات مرحلة صارمة وتعريف MVP مجمد.", tone: "slate" as const },
  ];
  const recommendations = [
    "شحن MVP في 10–12 أسبوعاً بفريق من 3 مهندسين (1 full-stack، 1 خلفية، 1 واجهة).",
    "تعامل مع محرّك المواعيد كوحدة نقية مُختبَرة جيداً — إنه أصعب منطق في النظام.",
    "استخدم عميل Prisma المُكتب لتبادل DTOs مع واجهة Next.js (أمان نوع من الطرف للطرف).",
    "اعتمد التطوير القائم على الجذع مع أعلام الميزات لعزل عمل الإصدار الثاني.",
    "أدوات قياس من اليوم الأول: سجلات، مقاييس، تتبّعات. لا يمكنك تحسين ما لا تراه.",
    "شغّل اختبار اختراق ربع سنوي وتدريب استعادة ربع سنوي — غير قابل للتفاوض.",
    "أبقِ التكاملات (المدفوعات، الرسائل، البريد) خلف واجهات محوّلة لقابلية الاستبدال.",
  ];
  return (
    <Section id="roadmap">
      <SectionHeader
        number="14"
        kicker="المُخرَج 12 و13 — خارطة الطريق، التوصيات، المخاطر"
        title="خارطة الطريق، التوصيات والمخاطر"
        subtitle="خطة تسليم مرحلية من MVP إلى SaaS متعدد المستأجرين، مع التوصيات التقنية والمخاطر التي تشكّلها."
      />
      {/* خط زمني لخارطة الطريق */}
      <div className="grid gap-4 lg:grid-cols-3 mb-8">
        {ROADMAP.map((phase) => (
          <Card key={phase.phase} className="p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-secondary/40 flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-wider text-muted-foreground">{phase.phase}</p>
                <p className="font-bold">{phase.label}</p>
              </div>
              <Pill tone={phase.color as "rose" | "amber" | "emerald"}>{phase.phase}</Pill>
            </div>
            <div className="p-5">
              <p className="text-[11px] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                ضمن النطاق
              </p>
              <Bullets items={phase.scope} />
              <p className="text-[11px] font-semibold tracking-wider text-rose-600 dark:text-rose-400 mt-4 mb-2">
                غير مشمول
              </p>
              <ul className="space-y-1">
                {phase.notIncluded.map((n) => (
                  <li key={n} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="text-rose-400">✕</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      {/* التوصيات */}
      <Card className="mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-muted-foreground" /> توصيات تقنية
        </h3>
        <Bullets items={recommendations} />
      </Card>

      {/* المخاطر */}
      <div>
        <h3 className="text-lg font-bold mb-4">المخاطر</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {risks.map((r) => (
            <Card key={r.t} className="p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Pill tone={r.tone}>{r.tone === "rose" ? "عالٍ" : r.tone === "amber" ? "متوسط" : "منخفض"}</Pill>
                <h4 className="font-semibold text-sm">{r.t}</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.d}</p>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* -------------------------- الافتراضات -------------------------- */

function AssumptionsSection() {
  const assumptions = [
    "أول عميل يدير فرعاً واحداً؛ المخطط يدعم المزيد بدون هجرة.",
    "الموظفون يستخدمون المنصة عبر الويب (لوح/حاسوب). التطبيقات الجوال الأصلية في الإصدار 3+.",
    "تكامل الدفع الإلكتروني يستخدم بوابة طرف ثالث (Stripe أو مكافئ إقليمي) — غير مبني داخلياً.",
    "تسليم الرسائل/البريد يستخدم مزوّدي طرف ثالث (مثل Twilio، SendGrid) عبر محوّلات.",
    "قواعد الضريبة قابلة للتكوين لكل فرع لكنها ليست محرّك محاسبة كامل — تكامل المحاسبة في الإصدار 3.",
    "العملة واحدة لكل مؤسسة في الإصدار 1/2؛ العملات المتعددة في الإصدار 3.",
    "«الزيارة المتوقعة التالية» تُحسب من إرشادات تكرار الخدمة المُكوَّنة لكل خدمة، لا متوقَّعة بالذكاء الاصطناعي.",
    "بوابة العملاء والحجز الإلكتروني في الإصدار الثاني — MVP يُشغَّل بالموظفين فقط.",
    "كل التحليلات تُحسب عند الطلب أو عبر عروض مجسّمة مجدولة — لا حاجة لخط تدفّق بث عند هذا الحجم.",
    "المنصة تستهدف مراكز تجميل صغيرة إلى متوسطة (1–10 فروع). حجم المؤسسات (>100 فرع) قد يتطلب مراجعة بنية.",
  ];
  return (
    <Section id="assumptions">
      <SectionHeader
        number="15"
        kicker="المُخرَج 15 — الافتراضات"
        title="الافتراضات"
        subtitle="متطلبات لم تُحدَّد صراحةً في الملخّص. هذه مذكورة علناً ليتمكّن الفريق من التحقق منها أو تجاوزها."
      />
      <Card>
        <ol className="space-y-3">
          {assumptions.map((a, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid place-items-center w-6 h-6 rounded-md bg-secondary text-secondary-foreground font-mono text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm leading-relaxed text-foreground/90">{a}</span>
            </li>
          ))}
        </ol>
      </Card>

      <div className="mt-8 rounded-xl border border-border bg-gradient-to-bl from-violet-50 to-background dark:from-violet-950/30 dark:to-background p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h3 className="font-bold text-lg">جاهز للتنفيذ</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          تغطّي هذه المواصفات رؤية المنتج، الأدوار، الوحدات، التحليلات، بنية تعدد
          الفروع والمستأجرين، تصميم قاعدة بيانات من 40 جدولاً، أكثر من 60 نقطة نهاية
          API، بنية النظام والأمان، المتطلبات غير الوظيفية، نطاق MVP/الإصدار الثاني/
          المستقبل، خارطة الطريق، المخاطر، والافتراضات. يمكن لفريق محترف البدء في
          تصميم UX/UI والهندسة مباشرةً من هذه الوثيقة.
        </p>
      </div>
    </Section>
  );
}

/* ---------------------------- التذييل ---------------------------- */

function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="grid place-items-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">منصة إدارة مركز التجميل</p>
              <p className="text-xs text-muted-foreground">مواصفات جاهزة للإنتاج · الإصدار 1.0</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone="violet">حتمي</Pill>
            <Pill tone="slate">بدون ذكاء اصطناعي</Pill>
            <Pill tone="emerald">جاهز لتعدد المستأجرين</Pill>
          </div>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          هذه الوثيقة مواصفات، وليست نصيحة قانونية أو مالية. تحقّق من الافتراضات مع
          أصحاب المصلحة قبل التنفيذ.
        </p>
      </div>
    </footer>
  );
}
