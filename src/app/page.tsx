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

/* ----------------------------- Hero ----------------------------- */

function Hero() {
  return (
    <header className="pt-12 sm:pt-16 pb-10 border-b border-border/60">
      <div className="flex items-center gap-2 mb-6">
        <Pill tone="violet">
          <Sparkles className="w-3 h-3" /> Production-Ready Specification
        </Pill>
        <Pill tone="slate">
          <Ban className="w-3 h-3" /> No AI — Deterministic Only
        </Pill>
      </div>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
        Beauty Center
        <br />
        <span className="text-muted-foreground">Management Platform</span>
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
        A complete operational platform that transforms a traditional beauty center into a
        digitally organized business — connecting customers, bookings, services, payments,
        inventory, marketing, and analytics into one deterministic, rule-driven system.
      </p>
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { k: "5", v: "User Roles", icon: Users },
          { k: "12", v: "Core Modules", icon: Layers },
          { k: "40", v: "DB Tables", icon: Database },
          { k: "60+", v: "API Endpoints", icon: Server },
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
          <Ban className="w-4 h-4" /> Artificial Intelligence is explicitly excluded
        </p>
        <p className="mt-1 text-amber-700 dark:text-amber-400/90 text-[13px] leading-relaxed">
          The entire platform operates on deterministic business rules, database queries,
          analytics, and configurable workflows. The architecture is designed so AI{" "}
          <em>could</em> be added in a future version, but no AI exists in the current product.
        </p>
      </div>
    </header>
  );
}

/* --------------------------- Overview --------------------------- */

function OverviewSection() {
  const deliverables = [
    "Product Requirements Document",
    "Complete Feature List",
    "User Roles & Permissions Matrix",
    "User Flows",
    "Information Architecture",
    "Database ERD Description",
    "API Specification",
    "System Architecture",
    "Security Architecture",
    "MVP Scope",
    "V2 Scope",
    "Development Roadmap",
    "Technical Recommendations",
    "Risks",
    "Assumptions",
  ];
  return (
    <Section id="overview">
      <SectionHeader
        number="00"
        kicker="Document Map"
        title="Overview"
        subtitle="This specification is organized into 15 deliverables. Each is detailed enough that a professional team can begin UX/UI design and implementation directly."
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
            <Layers className="w-4 h-4 text-muted-foreground" /> What this platform connects
          </h3>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            The customer lifecycle, end to end:
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
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
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Operational domains:</p>
          <div className="flex flex-wrap gap-1.5">
            {["Customers", "Staff", "Services", "Appointments", "Payments", "Inventory", "Marketing", "Reports", "Analytics"].map(
              (d) => (
                <Pill key={d} tone="slate">{d}</Pill>
              )
            )}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-muted-foreground" /> Design principles
          </h3>
          <Bullets
            items={[
              "Principle of least privilege across all roles",
              "Multi-tenant data isolation from day one (organization_id scoping)",
              "Deterministic business rules only — no probabilistic/AI logic",
              "Modular integrations (payments, messaging) via adapter pattern",
              "Schema supports multi-branch even if first client is single-branch",
              "Auditability: every sensitive action is logged",
            ]}
          />
        </Card>
      </div>
    </Section>
  );
}

/* --------------------------- Vision ---------------------------- */

function VisionSection() {
  return (
    <Section id="vision">
      <SectionHeader
        number="01"
        kicker="Deliverable 1 — Product Requirements"
        title="Product Vision"
        subtitle="Not merely an appointment system, but a complete operational platform for managing and understanding a beauty center."
      />
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <Users className="w-5 h-5 text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-1">For Operators</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Replace paper calendars, scattered WhatsApp bookings, and manual ledgers with one
            source of truth for every appointment, customer, and transaction.
          </p>
        </Card>
        <Card>
          <LayoutDashboard className="w-5 h-5 text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-1">For Owners</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            See real-time revenue, staff utilization, retention, and inventory health — and act
            on it through targeted, rule-based campaigns.
          </p>
        </Card>
        <Card>
          <CreditCard className="w-5 h-5 text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-1">For Customers</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Book online in seconds, track loyalty, receive timely reminders, and build a
            relationship with the center — not just a transaction.
          </p>
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-muted-foreground" /> Success criteria (measurable)
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { m: "Zero", d: "double-booked appointments" },
            { m: "< 5%", d: "no-show rate (with reminders)" },
            { m: "+30%", d: "rebooking rate via automation" },
            { m: "99.9%", d: "platform uptime" },
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

/* --------------------------- Roles ----------------------------- */

function RolesSection() {
  return (
    <Section id="roles">
      <SectionHeader
        number="02"
        kicker="Deliverable 2 & 3 — Users, Roles, Permissions"
        title="Users & Roles"
        subtitle="A complete Role-Based Access Control system built on the principle of least privilege. Five roles, each with scoped screens, actions, and data visibility."
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

            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Screens
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {role.screens.map((s) => (
                <Pill key={s}>{s}</Pill>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 mt-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                  Can see
                </p>
                <Bullets items={role.canSee} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1">
                  Cannot see
                </p>
                <Bullets items={role.cannotSee} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold">Permissions Matrix</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Capability × Role. <span className="text-emerald-600 dark:text-emerald-400">✓</span> = permitted,
            <span className="text-muted-foreground"> — </span> = denied.
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[260px]">Capability</TableHead>
                <TableHead>Module</TableHead>
                <TableHead className="text-center">Owner</TableHead>
                <TableHead className="text-center">Admin</TableHead>
                <TableHead className="text-center">Reception</TableHead>
                <TableHead className="text-center">Staff</TableHead>
                <TableHead className="text-center">Customer</TableHead>
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

/* --------------------------- Modules ---------------------------- */

function ModulesSection() {
  const icons: Record<string, ReactNode> = {
    A: <Lock className="w-4 h-4" />,
    B: <Users className="w-4 h-4" />,
    C: <CalendarDays className="w-4 h-4" />,
    D: <Sparkles className="w-4 h-4" />,
    E: <Users className="w-4 h-4" />,
    F: <CreditCard className="w-4 h-4" />,
    G: <Boxes className="w-4 h-4" />,
    H: <Gift className="w-4 h-4" />,
    I: <Bell className="w-4 h-4" />,
    J: <Users className="w-4 h-4" />,
    K: <Megaphone className="w-4 h-4" />,
    L: <LayoutDashboard className="w-4 h-4" />,
  };
  return (
    <Section id="modules">
      <SectionHeader
        number="03"
        kicker="Deliverable 2 — Feature List & Information Architecture"
        title="Core Modules"
        subtitle="Twelve modules covering the full operational surface of the platform. Each is designed with deterministic logic and configurable rules."
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
              <p className="mt-3 text-xs text-muted-foreground italic border-l-2 border-border pl-3">
                {m.notes}
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* User flows */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-1">User Flows</h3>
        <p className="text-sm text-muted-foreground mb-5">Deliverable 4 — key end-to-end journeys.</p>
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

/* --------------------------- Analytics -------------------------- */

function AnalyticsSection() {
  const groups = [
    {
      title: "Customer Analytics",
      icon: Users,
      tone: "violet" as const,
      items: [
        "New customers (period)",
        "Returning customers",
        "Retention rate (cohort-based)",
        "Churn / inactivity rate",
        "Average spend per customer",
        "Visit frequency",
      ],
    },
    {
      title: "Service Analytics",
      icon: Sparkles,
      tone: "rose" as const,
      items: [
        "Most popular services",
        "Least popular services",
        "Revenue by service",
        "Service utilization (bookings vs. capacity)",
      ],
    },
    {
      title: "Staff Analytics",
      icon: Users,
      tone: "amber" as const,
      items: [
        "Appointments handled",
        "Completed services",
        "Revenue generated",
        "Cancellation rate",
        "Utilization (booked hours / available hours)",
      ],
    },
    {
      title: "Business Analytics",
      icon: Gauge,
      tone: "emerald" as const,
      items: [
        "Revenue (daily / monthly / period)",
        "Expenses (if entered)",
        "Net profit (if expenses available)",
        "Growth (% vs. previous period)",
        "Average transaction value",
      ],
    },
  ];
  return (
    <Section id="analytics">
      <SectionHeader
        number="04"
        kicker="Deliverable — Reporting & Intelligence"
        title="Analytics"
        subtitle="Deterministic analytics computed from database queries and aggregations. No predictive models, no machine learning."
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
          <Ban className="w-4 h-4 text-amber-600" /> What analytics does NOT include
        </h3>
        <Bullets
          items={[
            "No predictive forecasting or ML-based churn prediction",
            "No AI-generated insights or natural-language summaries",
            "No recommendation engines",
            "All figures are direct SQL aggregations over real data",
          ]}
        />
      </Card>
    </Section>
  );
}

/* ------------------------- Multi-branch ------------------------- */

function MultiBranchSection() {
  return (
    <Section id="multibranch">
      <SectionHeader
        number="05"
        kicker="Architecture"
        title="Multi-Branch Architecture"
        subtitle="The data model supports Organization → Branches → Staff / Customers / Services / Appointments / Inventory from day one, even if the first client operates a single branch."
      />
      <Card>
        <div className="flex flex-wrap items-center gap-2 text-sm font-mono">
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
            "Every operational entity carries a branch_id foreign key",
            "Staff belong to a branch; customers optionally have a 'home branch' but can book across branches",
            "Inventory is tracked per branch (separate stock levels)",
            "Reporting can be scoped to a single branch or aggregated across the organization",
            "Services are defined at organization level but can be enabled/disabled per branch",
            "Working hours and days off are per-staff (and therefore per-branch)",
          ]}
        />
      </Card>
    </Section>
  );
}

/* ------------------------ Multi-tenant -------------------------- */

function MultiTenantSection() {
  return (
    <Section id="multitenant">
      <SectionHeader
        number="06"
        kicker="Architecture"
        title="Multi-Tenant SaaS Readiness"
        subtitle="The platform is designed to eventually serve multiple beauty centers. Every business-owned entity is scoped to an organization_id, with complete data isolation."
      />
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <Building2 className="w-5 h-5 text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-2">Isolation model</h3>
          <Bullets
            items={[
              "Shared database, shared schema — tenant discrimination via organization_id",
              "Every query enforces organization_id at the ORM/repository layer",
              "Row-level security (RLS) policies in PostgreSQL as a defense-in-depth measure",
              "Tenant context resolved from authenticated session, never from user input",
            ]}
          />
        </Card>
        <Card>
          <ShieldCheck className="w-5 h-5 text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-2">SaaS readiness checklist</h3>
          <Bullets
            items={[
              "Per-tenant configuration (currency, timezone, tax rules)",
              "Per-tenant branding/theming (V3)",
              "Subscription & billing model (V3)",
              "Per-tenant rate limiting & quotas",
              "Audit logs scoped to organization_id",
              "Backups restorable per tenant (logical export)",
            ]}
          />
        </Card>
      </div>
    </Section>
  );
}

/* --------------------------- Database --------------------------- */

function DatabaseSection() {
  const groups = Array.from(new Set(DB_TABLES.map((t) => t.group)));
  return (
    <Section id="database">
      <SectionHeader
        number="07"
        kicker="Deliverable 6 — Database ERD Description"
        title="Database Design"
        subtitle="A normalized PostgreSQL schema of 34 tables across 9 functional groups. Every table includes primary keys, foreign keys, indexes, and constraints."
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              {group}
            </h3>
            <div className="grid gap-4 lg:grid-cols-2">
              {DB_TABLES.filter((t) => t.group === group).map((table) => (
                <Card key={table.name} className="p-0 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/40">
                    <h4 className="font-mono font-semibold text-sm">{table.name}</h4>
                    <Database className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <p className="px-4 pt-3 text-xs text-muted-foreground">{table.description}</p>
                  <div className="overflow-x-auto">
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
                    <div className="px-4 py-3 border-t border-border bg-secondary/20 space-y-1.5">
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

/* ----------------------------- API ------------------------------ */

function ApiSection() {
  return (
    <Section id="api">
      <SectionHeader
        number="08"
        kicker="Deliverable 7 — API Specification"
        title="API Design"
        subtitle="RESTful API over HTTPS with JSON. Bearer-token authentication, role-based authorization on every endpoint, consistent error envelopes, and pagination."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { l: "Base URL", v: "https://api.beautycenter.app/v1" },
          { l: "Auth", v: "Bearer JWT (access) + refresh" },
          { l: "Pagination", v: "?page=1&limit=20 → { data, meta }" },
          { l: "Errors", v: "{ error: { code, message, details } }" },
        ].map((s) => (
          <Card key={s.l} className="p-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
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
            <div className="overflow-x-auto">
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
        <h3 className="font-semibold mb-3">Validation & error cases (uniform)</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { c: "400", d: "Validation error", tone: "amber" as const },
            { c: "401", d: "Missing/invalid token", tone: "amber" as const },
            { c: "403", d: "Forbidden (role/tenant)", tone: "rose" as const },
            { c: "404", d: "Resource not found", tone: "slate" as const },
            { c: "409", d: "Conflict (double-booking)", tone: "rose" as const },
            { c: "422", d: "Unprocessable entity", tone: "amber" as const },
            { c: "429", d: "Rate limited", tone: "amber" as const },
            { c: "500", d: "Internal server error", tone: "rose" as const },
          ].map((e) => (
            <div key={e.c} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-sm">{e.c}</span>
                <Pill tone={e.tone}>{e.tone === "rose" ? "Error" : "Client"}</Pill>
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

/* ------------------------ Architecture -------------------------- */

function ArchitectureSection() {
  const stack = [
    {
      layer: "Frontend",
      icon: LayoutDashboard,
      choice: "Next.js + React + TypeScript",
      why: "SSR for dashboards, App Router, shared types with backend. Deployed on Vercel for edge performance.",
    },
    {
      layer: "UI",
      icon: Sparkles,
      choice: "Tailwind CSS + shadcn/ui",
      why: "Consistent design system, accessible components, fast iteration. No heavy component framework lock-in.",
    },
    {
      layer: "Backend",
      icon: Server,
      choice: "NestJS + TypeScript",
      why: "Modular architecture, decorators for RBAC, dependency injection, excellent for multi-tenant services.",
    },
    {
      layer: "Database",
      icon: Database,
      choice: "PostgreSQL (managed)",
      why: "Relational integrity, JSONB for flexible config, RLS for tenant isolation, mature ecosystem.",
    },
    {
      layer: "ORM",
      icon: Layers,
      choice: "Prisma",
      why: "Type-safe queries, migrations, schema-as-code. Shared schema types between frontend and backend.",
    },
    {
      layer: "Caching / Jobs",
      icon: Bell,
      choice: "Redis + BullMQ",
      why: "Background jobs for reminders, campaigns, segment recomputation. Deterministic cron triggers.",
    },
    {
      layer: "Storage",
      icon: Boxes,
      choice: "Cloudflare R2 / S3",
      why: "Profile images, receipts, exports. Cheap egress, durable, CDN-backed.",
    },
    {
      layer: "Auth",
      icon: Lock,
      choice: "JWT (access+refresh) + RBAC",
      why: "Stateless API, fine-grained permissions, refresh rotation with revocation.",
    },
  ];
  return (
    <Section id="architecture">
      <SectionHeader
        number="09"
        kicker="Deliverable 8 — System Architecture"
        title="System Architecture"
        subtitle="A practical, production-ready stack balancing developer velocity, type safety, and operational simplicity."
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
          <Server className="w-4 h-4 text-muted-foreground" /> Request & data flow
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
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
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
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
        <h3 className="font-semibold mb-3">Alternatives & tradeoffs</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Decision</TableHead>
                <TableHead>Chosen</TableHead>
                <TableHead>Alternative</TableHead>
                <TableHead>Tradeoff</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["Backend framework", "NestJS", "Express / Fastify", "More structure & decorators vs. lighter weight"],
                ["DB-per-tenant", "Shared schema + org_id", "Schema-per-tenant", "Simpler ops; relies on RLS for isolation"],
                ["Auth", "JWT + refresh", "Session cookies", "Stateless scales better; cookies simpler for SSR"],
                ["Jobs", "Redis + BullMQ", "pg-boss / DB queue", "Redis faster & richer; pg-boss fewer deps"],
                ["Frontend deploy", "Vercel", "Self-host Node", "Zero-config edge; vendor lock-in risk"],
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

/* --------------------------- Security --------------------------- */

function SecuritySection() {
  const controls = [
    { icon: Lock, t: "Authentication", d: "Argon2id password hashing, JWT access (short TTL) + refresh (rotating, revocable), optional TOTP 2FA for Owner/Admin." },
    { icon: ShieldCheck, t: "Authorization (RBAC)", d: "Permission keys checked via decorators on every endpoint. Tenant + branch scoping enforced in repository layer." },
    { icon: Lock, t: "Input validation", d: "Zod/class-validator schemas on every request body & query. Reject unknown fields." },
    { icon: Gauge, t: "Rate limiting", d: "Per-IP and per-user limits on auth & write endpoints. Exponential backoff on failures." },
    { icon: Lock, t: "Password storage", d: "Argon2id with per-user salt. Never logged, never returned in any response." },
    { icon: ShieldCheck, t: "CSRF protection", d: "Double-submit cookie + SameSite=Strict on session-bearing routes (cookie auth). JWT-in-header routes exempt." },
    { icon: ShieldCheck, t: "XSS prevention", d: "React auto-escaping, strict CSP, no dangerouslySetInnerHTML, sanitized rich-text inputs." },
    { icon: Database, t: "SQL injection", d: "Prisma parameterized queries exclusively. No raw string interpolation." },
    { icon: ShieldCheck, t: "Audit logging", d: "Immutable audit_logs table for all sensitive actions (payments, refunds, role changes, data exports)." },
    { icon: Boxes, t: "Backups", d: "Managed PostgreSQL automated daily snapshots + PITR. Quarterly restore drills." },
    { icon: Building2, t: "Data isolation", d: "organization_id on every entity + Postgres RLS policies as defense-in-depth." },
    { icon: Boxes, t: "Secure file uploads", d: "Signed upload URLs to R2/S3, server-side type validation, size limits, AV scan on ingest." },
    { icon: Server, t: "API security", d: "HTTPS-only, HSTS, CORS allowlist per tenant, request signing for webhooks." },
    { icon: Lock, t: "Secrets management", d: "Vault / AWS Secrets Manager. No secrets in env files in production. Rotated quarterly." },
  ];
  return (
    <Section id="security">
      <SectionHeader
        number="10"
        kicker="Deliverable 9 — Security Architecture"
        title="Security"
        subtitle="Defense in depth: identity, authorization, transport, data, and operational controls."
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

/* ----------------------------- NFR ------------------------------ */

function NfrSection() {
  const nfrs = [
    { t: "Performance", d: "p95 API response < 300ms; dashboard load < 2s; calendar slot computation < 500ms for a day.", icon: Gauge },
    { t: "Scalability", d: "Horizontally stateless API behind load balancer; read replicas for reporting; Redis for hot caches.", icon: Server },
    { t: "Security", d: "OWASP Top 10 mitigations; pen-test before launch; dependency scanning in CI.", icon: Lock },
    { t: "Availability", d: "99.9% uptime SLA target; multi-AZ DB; zero-downtime deploys; health checks & auto-restart.", icon: ShieldCheck },
    { t: "Accessibility", d: "WCAG 2.1 AA; semantic HTML; keyboard nav; ARIA labels; color contrast ≥ 4.5:1.", icon: Users },
    { t: "Responsive design", d: "Mobile-first; breakpoints sm/md/lg/xl; touch targets ≥ 44px; works 360px → 4K.", icon: LayoutDashboard },
    { t: "Mobile usability", d: "PWA installable; receptionist & staff flows optimized for tablet; customer portal mobile-first.", icon: Sparkles },
    { t: "Observability", d: "Structured logs, metrics (Prometheus), distributed tracing (OpenTelemetry), error tracking (Sentry).", icon: Bell },
    { t: "Backup", d: "Automated daily DB snapshots + 35-day PITR; weekly config export; encrypted at rest.", icon: Boxes },
    { t: "Recovery", d: "RPO ≤ 15 min, RTO ≤ 4 h; documented runbooks; quarterly restore tests.", icon: ShieldCheck },
    { t: "Maintainability", d: "Typed end-to-end; > 70% test coverage on critical paths; module boundaries; documented ADRs.", icon: Layers },
    { t: "Internationalization", d: "Multi-currency, multi-timezone, i18n-ready strings (V2).", icon: Globe2 },
  ];
  return (
    <Section id="nfr">
      <SectionHeader
        number="11"
        kicker="Deliverable — Non-Functional Requirements"
        title="Non-Functional Requirements"
        subtitle="Measurable quality attributes the system must satisfy in production."
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
    { icon: Lock, t: "Authentication", d: "Login, logout, password reset, RBAC, session mgmt, 2FA for Owner/Admin." },
    { icon: Users, t: "Users & Roles", d: "Manage staff accounts, assign roles, activate/deactivate." },
    { icon: Users, t: "Customers (CRM)", d: "Profiles, search, service & payment history, notes, tags." },
    { icon: Users, t: "Staff", d: "Profiles, services, working hours, days off." },
    { icon: Sparkles, t: "Services", d: "Categories, pricing, duration, add-ons, status." },
    { icon: CalendarDays, t: "Calendar", d: "Day/week/month + staff views." },
    { icon: CalendarDays, t: "Appointments", d: "Create, reschedule, cancel, check-in, complete, no-show. Double-booking prevention." },
    { icon: CreditCard, t: "Payments (POS)", d: "Cash/card, invoices, receipts, discounts, tax." },
    { icon: LayoutDashboard, t: "Dashboards", d: "Role-specific overviews (Owner/Admin/Receptionist/Staff)." },
  ];
  const excluded = [
    "Customer portal & online booking",
    "Notifications & automation engine",
    "Loyalty & membership",
    "Segmentation & marketing",
    "Inventory management",
    "Advanced reports & analytics",
    "Online payment gateway integration",
    "Multi-branch operational UI",
  ];
  return (
    <Section id="mvp">
      <SectionHeader
        number="12"
        kicker="Deliverable 10 — MVP Scope"
        title="MVP Scope (V1)"
        subtitle="The smallest valuable product that runs a beauty center's daily operations end-to-end. Prioritized: Auth → Users → Customers → Staff → Services → Calendar → Appointments → Payments → Dashboard."
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
              <p className="text-xs text-muted-foreground leading-relaxed pl-9">{item.d}</p>
            </Card>
          ))}
        </div>
        <Card className="border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900">
          <div className="flex items-center gap-2 mb-3">
            <Ban className="w-4 h-4 text-rose-600" />
            <h3 className="font-semibold text-sm">NOT in MVP</h3>
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

/* --------------------------- V2 & Future ------------------------ */

function V2Section() {
  const v2 = [
    { icon: Users, t: "Customer Portal", d: "Self-service booking, history, invoices, loyalty." },
    { icon: CalendarDays, t: "Online Booking", d: "Public booking flow with slot engine." },
    { icon: Bell, t: "Notifications & Automation", d: "Deterministic rule engine: reminders, birthdays, rebooking, low-stock." },
    { icon: Gift, t: "Loyalty", d: "Points, earn/redeem rules, expiration." },
    { icon: Gift, t: "Membership", d: "Tiers (Basic/Gold/VIP) with discounts & priority booking." },
    { icon: Users, t: "Segmentation", d: "Rule-based dynamic segments." },
    { icon: Megaphone, t: "Marketing Campaigns", d: "Segment-targeted SMS/Email with results tracking." },
    { icon: Boxes, t: "Inventory", d: "Products, stock, suppliers, consumption, low-stock alerts." },
    { icon: Gauge, t: "Advanced Reports", d: "Customer/service/staff/business analytics." },
  ];
  const future = [
    "Multi-branch management UI & cross-branch analytics",
    "Subscription / SaaS billing model",
    "Advanced marketing (deterministic A/B, drip sequences)",
    "External integrations (QuickBooks/Xero, calendar sync)",
    "Advanced automation (multi-step conditional workflows)",
    "Advanced analytics (cohorts, custom report builder)",
    "Mobile apps (staff & customer)",
    "White-label theming",
  ];
  return (
    <Section id="v2">
      <SectionHeader
        number="13"
        kicker="Deliverable 11 — V2 Scope & Future"
        title="V2 & Future"
        subtitle="V2 grows the platform into a retention & marketing engine. Future versions scale to multi-branch SaaS — without ever introducing AI."
      />
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Pill tone="amber">V2</Pill> Growth & Retention
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
        <Pill tone="emerald">V3+</Pill> Future — Scale & Integrations
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
            <strong>No AI in any future version unless explicitly scoped.</strong> The architecture
            is AI-ready (modular services, clean data), but the product remains deterministic.
          </span>
        </p>
      </Card>
    </Section>
  );
}

/* --------------------------- Roadmap ---------------------------- */

function RoadmapSection() {
  const risks = [
    { t: "Slot computation correctness", d: "Double-booking prevention across overlapping services, breaks, and multi-staff bookings is the highest-complexity logic. Mitigate with exhaustive unit tests + property-based tests.", tone: "rose" as const },
    { t: "Payment provider reliability", d: "Gateway downtime or async webhook delays. Mitigate with idempotent payment records + reconciliation jobs.", tone: "amber" as const },
    { t: "Tenant data leakage", d: "A single missing org_id filter exposes cross-tenant data. Mitigate with RLS policies + repository-layer enforcement + integration tests.", tone: "rose" as const },
    { t: "Reminder delivery (SMS/Email)", d: "Provider failures. Mitigate with retry queues, fallback providers, and delivery-status tracking.", tone: "amber" as const },
    { t: "Timezone handling", d: "Multi-branch across timezones. Mitigate by storing all timestamps in UTC + per-branch/org timezone for display.", tone: "slate" as const },
    { t: "Scope creep", d: "V2 features pulled into MVP. Mitigate with strict phase gates and a frozen MVP definition.", tone: "slate" as const },
  ];
  const recommendations = [
    "Ship MVP in 10–12 weeks with a 3-engineer team (1 full-stack, 1 backend, 1 frontend).",
    "Treat the slot engine as a pure, well-tested module — it's the system's hardest logic.",
    "Use Prisma's typed client to share DTOs with the Next.js frontend (end-to-end type safety).",
    "Adopt trunk-based development with feature flags to keep V2 work isolated.",
    "Instrument from day one: logs, metrics, traces. You cannot optimize what you cannot see.",
    "Run a quarterly pen-test and a quarterly restore drill — non-negotiable.",
    "Keep integrations (payments, SMS, email) behind adapter interfaces for swappability.",
  ];
  return (
    <Section id="roadmap">
      <SectionHeader
        number="14"
        kicker="Deliverable 12 & 13 — Roadmap, Recommendations, Risks"
        title="Roadmap, Recommendations & Risks"
        subtitle="A phased delivery plan from MVP to multi-tenant SaaS, with the technical recommendations and risks that shape it."
      />
      {/* Roadmap timeline */}
      <div className="grid gap-4 lg:grid-cols-3 mb-8">
        {ROADMAP.map((phase) => (
          <Card key={phase.phase} className="p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-secondary/40 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{phase.phase}</p>
                <p className="font-bold">{phase.label}</p>
              </div>
              <Pill tone={phase.color as "rose" | "amber" | "emerald"}>{phase.phase}</Pill>
            </div>
            <div className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                In scope
              </p>
              <Bullets items={phase.scope} />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 mt-4 mb-2">
                Not included
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

      {/* Recommendations */}
      <Card className="mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-muted-foreground" /> Technical recommendations
        </h3>
        <Bullets items={recommendations} />
      </Card>

      {/* Risks */}
      <div>
        <h3 className="text-lg font-bold mb-4">Risks</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {risks.map((r) => (
            <Card key={r.t} className="p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Pill tone={r.tone}>{r.tone === "rose" ? "High" : r.tone === "amber" ? "Medium" : "Low"}</Pill>
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

/* -------------------------- Assumptions -------------------------- */

function AssumptionsSection() {
  const assumptions = [
    "The first client operates a single branch; the schema supports more without migration.",
    "Staff use the platform via web (tablet/desktop). Native mobile apps are V3+.",
    "Online payment integration uses a third-party gateway (Stripe or a regional equivalent) — not built in-house.",
    "SMS/Email delivery uses third-party providers (e.g., Twilio, SendGrid) via adapters.",
    "Tax rules are configurable per branch but not a full accounting engine — accounting integration is V3.",
    "Currency is single per organization in V1/V2; multi-currency is V3.",
    "The 'next expected visit' is computed from service frequency heuristics configured per service, not predicted by AI.",
    "Customer portal & online booking are V2 — MVP is staff-operated only.",
    "All analytics are computed on-demand or via scheduled materialized views — no streaming pipeline needed at this scale.",
    "The platform targets small-to-mid beauty centers (1–10 branches). Enterprise scale (>100 branches) may require architectural revision.",
  ];
  return (
    <Section id="assumptions">
      <SectionHeader
        number="15"
        kicker="Deliverable 15 — Assumptions"
        title="Assumptions"
        subtitle="Requirements not explicitly specified in the brief. These are stated openly so the team can validate or override them."
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

      <div className="mt-8 rounded-xl border border-border bg-gradient-to-br from-violet-50 to-background dark:from-violet-950/30 dark:to-background p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h3 className="font-bold text-lg">Ready for implementation</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          This specification covers product vision, roles, modules, analytics, multi-branch and
          multi-tenant architecture, a 34-table database design, 60+ API endpoints, system &
          security architecture, NFRs, MVP/V2/future scope, roadmap, risks, and assumptions. A
          professional team can begin UX/UI design and engineering directly from this document.
        </p>
      </div>
    </Section>
  );
}

/* ---------------------------- Footer ---------------------------- */

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
              <p className="text-sm font-semibold">Beauty Center Management Platform</p>
              <p className="text-xs text-muted-foreground">Production-Ready Specification · v1.0</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill tone="violet">Deterministic</Pill>
            <Pill tone="slate">No AI</Pill>
            <Pill tone="emerald">Multi-Tenant Ready</Pill>
          </div>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          This document is a specification, not legal or financial advice. Validate assumptions
          with stakeholders before implementation.
        </p>
      </div>
    </footer>
  );
}
