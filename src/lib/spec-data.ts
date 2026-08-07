// ============================================================
// Beauty Center Management Platform — Specification Data
// All structured content for the specification document.
// NOTE: No AI features. Deterministic rules only.
// ============================================================

export type Role = {
  id: string;
  name: string;
  summary: string;
  screens: string[];
  canSee: string[];
  cannotSee: string[];
};

export const ROLES: Role[] = [
  {
    id: "owner",
    name: "Owner",
    summary:
      "Full control across the entire organization. Financial, strategic, and configuration access. Can manage all branches, staff, and settings.",
    screens: [
      "Owner Dashboard",
      "All branch dashboards",
      "Organization settings",
      "Billing & subscription",
      "All modules (read/write)",
      "Audit logs",
      "Reports & analytics (full)",
    ],
    canSee: [
      "Revenue & profit across all branches",
      "All staff salaries and performance",
      "All customer data",
      "Expense data",
      "Organization-level configuration",
    ],
    cannotSee: ["Individual staff private credentials (passwords are hashed)"],
  },
  {
    id: "admin",
    name: "Admin",
    summary:
      "Day-to-day operational management of assigned branch(es). Manages staff, services, customers, inventory, and operations — but not billing/subscription.",
    screens: [
      "Admin Dashboard",
      "Staff management",
      "Service management",
      "Customer CRM",
      "Appointments (full)",
      "POS & payments",
      "Inventory",
      "Loyalty & Membership config",
      "Marketing campaigns",
      "Reports (branch scope)",
    ],
    canSee: [
      "Branch revenue",
      "Staff schedules & performance",
      "Customer data (branch)",
      "Inventory & stock",
    ],
    cannotSee: [
      "Organization billing/subscription",
      "Other branches' data",
      "Owner-only financial aggregates",
    ],
  },
  {
    id: "receptionist",
    name: "Receptionist",
    summary:
      "Front-desk operations. Books and manages appointments, checks customers in, processes walk-in payments, and manages the daily calendar.",
    screens: [
      "Receptionist Dashboard",
      "Calendar / Appointment board",
      "Customer CRM (read + create/edit basic)",
      "Check-in / Check-out",
      "POS (payments)",
      "Customer search",
    ],
    canSee: [
      "Today's appointments",
      "Customer contact info & history",
      "Service prices & availability",
      "Staff schedules (for booking)",
    ],
    cannotSee: [
      "Staff salaries",
      "Financial reports / profit",
      "Inventory cost/purchase data",
      "Marketing campaign results",
      "Audit logs",
    ],
  },
  {
    id: "staff",
    name: "Staff / Beauty Specialist",
    summary:
      "Service provider. Sees personal schedule, customer info for assigned appointments, and own performance. Cannot see other staff details or financials.",
    screens: [
      "Staff Dashboard",
      "Personal calendar",
      "Assigned customer profiles (limited)",
      "Service notes & history (own)",
      "Personal performance",
    ],
    canSee: [
      "Own appointments & schedule",
      "Customer info for own appointments",
      "Own service history & stats",
    ],
    cannotSee: [
      "Other staff schedules or stats",
      "Revenue/profit figures",
      "Customer payment details",
      "Inventory costs",
      "Marketing data",
    ],
  },
  {
    id: "customer",
    name: "Customer",
    summary:
      "End-user of the customer portal (V2). Books appointments, views own history, loyalty points, and memberships. Cannot access any staff/operational data.",
    screens: [
      "Customer Portal (V2)",
      "Online booking",
      "Own appointment history",
      "Own invoices/receipts",
      "Own loyalty & membership",
      "Own profile",
    ],
    canSee: ["Own data only"],
    cannotSee: [
      "Any staff/operational data",
      "Other customers' data",
      "Pricing logic beyond displayed prices",
    ],
  },
];

// Permissions matrix: capability -> which roles can perform it
export type PermissionRow = {
  capability: string;
  module: string;
  owner: boolean;
  admin: boolean;
  receptionist: boolean;
  staff: boolean;
  customer: boolean;
};

export const PERMISSION_MATRIX: PermissionRow[] = [
  // Auth
  { capability: "Login to staff panel", module: "Auth", owner: true, admin: true, receptionist: true, staff: true, customer: false },
  { capability: "Login to customer portal", module: "Auth", owner: false, admin: false, receptionist: false, staff: false, customer: true },
  { capability: "Reset own password", module: "Auth", owner: true, admin: true, receptionist: true, staff: true, customer: true },
  { capability: "Manage user accounts (create/deactivate)", module: "Auth", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  // Customers
  { capability: "View customer list", module: "CRM", owner: true, admin: true, receptionist: true, staff: false, customer: false },
  { capability: "Create/edit customer", module: "CRM", owner: true, admin: true, receptionist: true, staff: false, customer: false },
  { capability: "View customer financial history", module: "CRM", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "View assigned customer (own)", module: "CRM", owner: true, admin: true, receptionist: true, staff: true, customer: false },
  // Appointments
  { capability: "Create appointment for others", module: "Appointments", owner: true, admin: true, receptionist: true, staff: false, customer: false },
  { capability: "Book own appointment (online)", module: "Appointments", owner: false, admin: false, receptionist: false, staff: false, customer: true },
  { capability: "Reschedule/cancel any appointment", module: "Appointments", owner: true, admin: true, receptionist: true, staff: false, customer: false },
  { capability: "Check-in / mark no-show / complete", module: "Appointments", owner: true, admin: true, receptionist: true, staff: true, customer: false },
  // Services
  { capability: "Create/edit services", module: "Services", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "View services (for booking)", module: "Services", owner: true, admin: true, receptionist: true, staff: true, customer: true },
  // Staff
  { capability: "Manage staff profiles & schedules", module: "Staff", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "View own schedule", module: "Staff", owner: true, admin: true, receptionist: true, staff: true, customer: false },
  // POS
  { capability: "Process payments", module: "POS", owner: true, admin: true, receptionist: true, staff: false, customer: false },
  { capability: "Issue refunds", module: "POS", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "Apply discounts", module: "POS", owner: true, admin: true, receptionist: true, staff: false, customer: false },
  // Inventory
  { capability: "Manage products & suppliers", module: "Inventory", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "Record stock movements / consumption", module: "Inventory", owner: true, admin: true, receptionist: true, staff: true, customer: false },
  { capability: "View inventory cost data", module: "Inventory", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  // Loyalty & Membership
  { capability: "Configure loyalty rules", module: "Loyalty", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "View own loyalty & membership", module: "Loyalty", owner: false, admin: false, receptionist: false, staff: false, customer: true },
  // Marketing
  { capability: "Create/manage campaigns & segments", module: "Marketing", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "View campaign results", module: "Marketing", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  // Reports
  { capability: "View organization-wide reports", module: "Reports", owner: true, admin: false, receptionist: false, staff: false, customer: false },
  { capability: "View branch reports", module: "Reports", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "View own performance", module: "Reports", owner: true, admin: true, receptionist: false, staff: true, customer: false },
  // Settings
  { capability: "Organization settings & branches", module: "Settings", owner: true, admin: false, receptionist: false, staff: false, customer: false },
  { capability: "Branch settings", module: "Settings", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "Configure automation rules", module: "Settings", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "View audit logs", module: "Settings", owner: true, admin: false, receptionist: false, staff: false, customer: false },
];

// ---- Core Modules ----
export type ModuleSpec = {
  id: string;
  letter: string;
  name: string;
  purpose: string;
  features: string[];
  notes?: string;
};

export const CORE_MODULES: ModuleSpec[] = [
  {
    id: "auth",
    letter: "A",
    name: "Authentication & Authorization",
    purpose:
      "Secure identity layer with RBAC, session management, and account lifecycle controls.",
    features: [
      "Login / Logout (staff panel + customer portal)",
      "Password reset via email/SMS token (time-limited, single-use)",
      "Session management with refresh tokens & revocation",
      "Role-based permissions enforced on every API endpoint",
      "Account status: Active / Suspended / Deactivated",
      "2FA (TOTP) optional per role (Owner/Admin mandatory)",
      "Login attempt throttling & lockout after N failures",
      "Security settings: password policy, session timeout config",
    ],
  },
  {
    id: "crm",
    letter: "B",
    name: "Customer CRM",
    purpose:
      "360° customer profile connecting bookings, visits, payments, loyalty, and follow-ups.",
    features: [
      "Full name, phone, email, DOB, profile image, preferences, notes",
      "Service history, appointment history, payment history",
      "Loyalty points & membership linkage",
      "Favorite staff & favorite services",
      "Customer status (Active / Inactive / VIP / Blacklisted)",
      "Last visit & next expected visit (computed)",
      "Search (name/phone/email), filters, tags, segments",
      "Customer timeline (chronological activity feed)",
    ],
  },
  {
    id: "appointments",
    letter: "C",
    name: "Appointment & Booking System",
    purpose:
      "Conflict-free scheduling that respects staff availability, service duration, and branch capacity.",
    features: [
      "Customer booking flow: service → staff → date → time → confirm",
      "Reschedule & cancel (with policy windows)",
      "Receptionist: create/edit/reschedule/cancel, check-in, no-show, complete",
      "Automatic double-booking prevention",
      "Considers: staff working hours, days off, service duration, breaks, existing appointments, branch availability",
      "Slot generation engine (deterministic)",
      "Waitlist / standby slots (optional)",
      "Calendar views: day / week / month / staff / branch",
    ],
  },
  {
    id: "services",
    letter: "D",
    name: "Services Management",
    purpose:
      "Catalog of bookable services with pricing, duration, staffing, and resource linkage.",
    features: [
      "Name, category, description, price, duration",
      "Assigned staff (which specialists can perform it)",
      "Add-ons (optional supplementary services)",
      "Status (Active / Inactive)",
      "Optional products/resources required (links to inventory)",
      "Service categories (Hair, Facial, Nails, Spa, Styling...)",
    ],
    notes: "Example services: Hair Color, Hair Treatment, Facial, Manicure, Pedicure, Styling.",
  },
  {
    id: "staff",
    letter: "E",
    name: "Staff Management",
    purpose:
      "Manage specialists, their capabilities, schedules, and performance metrics.",
    features: [
      "Profile, role, assigned services",
      "Working hours & days off (recurring + one-off)",
      "Schedule & appointments view",
      "Completed services count",
      "Revenue generated (by staff)",
      "Performance metrics: utilization, cancellation rate, avg rating",
    ],
  },
  {
    id: "pos",
    letter: "F",
    name: "POS & Payments",
    purpose:
      "Checkout workflow from services to invoice with modular payment providers.",
    features: [
      "Workflow: Customer → Services → Add-ons → Discounts → Tax → Total → Payment → Invoice",
      "Payment methods: Cash, Card, Online, Partial payment",
      "Refund & partial refund",
      "Discount (fixed / percentage, with approval rules)",
      "Tax configuration (per branch / per service)",
      "Invoice & printable receipt",
      "Modular payment provider integration (Stripe / local gateways via adapter pattern)",
    ],
  },
  {
    id: "inventory",
    letter: "G",
    name: "Inventory",
    purpose:
      "Track products, stock levels, suppliers, and consumption linked to services.",
    features: [
      "Products, categories, suppliers",
      "Stock levels per branch",
      "Stock movements (in / out / adjustment)",
      "Purchases (supplier orders)",
      "Consumption (manual or auto on service completion)",
      "Low-stock alerts (configurable threshold)",
      "Optional: link product + quantity to a service (auto-deduct on completion)",
    ],
    notes: "Example: 'Hair Color' service consumes 1 unit of 'Color Product'.",
  },
  {
    id: "loyalty",
    letter: "H",
    name: "Loyalty & Membership",
    purpose:
      "Retain customers through points, tiers, and configurable membership benefits.",
    features: [
      "Loyalty: points, earn rules, redeem rules, transactions, expiration rules",
      "Membership tiers: Basic / Gold / VIP (configurable)",
      "Per-tier: discounts, benefits, priority booking, rewards",
      "Points ledger per customer with audit trail",
    ],
  },
  {
    id: "notifications",
    letter: "I",
    name: "Notifications & Automation",
    purpose:
      "Deterministic, rule-based messaging and triggers. No AI — only configured rules.",
    features: [
      "Appointment reminder: X hours before (default 24h)",
      "Post-visit message: X hours after completed appointment",
      "Rebooking reminder: X days after service",
      "Birthday message: on customer birthday",
      "Inactive customer: if no visit for X days",
      "Low stock: if stock < threshold",
      "Admin-configurable rules (trigger + condition + channel + template)",
      "Channels: SMS, Email, In-app (modular providers)",
    ],
    notes: "All rules are deterministic (if-then). No machine learning.",
  },
  {
    id: "segmentation",
    letter: "J",
    name: "Customer Segmentation",
    purpose:
      "Rule-based, database-driven customer grouping for targeting and analytics.",
    features: [
      "New Customer, Returning Customer, VIP, Inactive, High Spending, Frequent Visitor, Never Returned, Birthday This Month",
      "Segment = set of deterministic DB conditions (AND/OR)",
      "Dynamic membership (recomputed on schedule or on-demand)",
      "Custom segments builder (admin)",
    ],
  },
  {
    id: "marketing",
    letter: "K",
    name: "Marketing Campaigns",
    purpose:
      "Target segments with scheduled, multi-channel campaigns and measure deterministic results.",
    features: [
      "Workflow: Segment → Campaign → Message → Channel → Schedule → Delivery → Results",
      "Channels: SMS, Email (modular providers)",
      "Message templates (admin-authored, no AI generation)",
      "Schedule: immediate / scheduled / recurring",
      "Results: sent, delivered, opened (email), clicked, converted (rebooking attributed)",
    ],
    notes: "No AI-generated content. All copy written by staff.",
  },
  {
    id: "dashboard",
    letter: "L",
    name: "Dashboard",
    purpose:
      "Role-specific operational overviews with real-time and aggregated metrics.",
    features: [
      "Owner: revenue (today/month), appointments, completions, cancellations, no-shows, new/returning customers, top services, staff performance, retention, inventory alerts",
      "Receptionist: today's appointments, check-ins, upcoming, available slots, customer search",
      "Staff: today's schedule, upcoming customers, completed services, personal performance",
    ],
  },
];

// ---- Database tables ----
export type DbColumn = {
  name: string;
  type: string;
  pk?: boolean;
  fk?: string;
  nullable?: boolean;
  note?: string;
};

export type DbTable = {
  name: string;
  group: string;
  description: string;
  columns: DbColumn[];
  indexes?: string[];
  constraints?: string[];
};

export const DB_TABLES: DbTable[] = [
  {
    name: "organizations",
    group: "Tenancy",
    description: "Top-level tenant. Each Beauty Center is one organization.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "name", type: "varchar(160)" },
      { name: "slug", type: "varchar(80)", note: "unique" },
      { name: "country", type: "varchar(2)" },
      { name: "currency", type: "char(3)" },
      { name: "timezone", type: "varchar(64)" },
      { name: "status", type: "enum(active,suspended)" },
      { name: "created_at", type: "timestamptz" },
    ],
    indexes: ["unique(slug)"],
  },
  {
    name: "branches",
    group: "Tenancy",
    description: "Physical locations of an organization. Supports multi-branch.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "name", type: "varchar(160)" },
      { name: "address", type: "text", nullable: true },
      { name: "phone", type: "varchar(32)", nullable: true },
      { name: "is_active", type: "boolean" },
      { name: "created_at", type: "timestamptz" },
    ],
    indexes: ["index(organization_id)", "unique(organization_id, name)"],
  },
  {
    name: "users",
    group: "Identity",
    description: "Staff/operational user accounts (not customers).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "branch_id", type: "uuid", fk: "branches.id", nullable: true },
      { name: "email", type: "varchar(255)" },
      { name: "password_hash", type: "varchar(255)", note: "argon2/bcrypt" },
      { name: "full_name", type: "varchar(160)" },
      { name: "phone", type: "varchar(32)", nullable: true },
      { name: "status", type: "enum(active,suspended,deactivated)" },
      { name: "two_factor_enabled", type: "boolean" },
      { name: "last_login_at", type: "timestamptz", nullable: true },
      { name: "created_at", type: "timestamptz" },
    ],
    indexes: ["unique(organization_id, email)", "index(branch_id)"],
  },
  {
    name: "roles",
    group: "Identity",
    description: "Role definitions (Owner, Admin, Receptionist, Staff).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id", nullable: true, note: "null = system role" },
      { name: "name", type: "varchar(64)" },
      { name: "description", type: "text", nullable: true },
    ],
    indexes: ["unique(organization_id, name)"],
  },
  {
    name: "permissions",
    group: "Identity",
    description: "Granular permission keys (e.g., 'appointment.create').",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "key", type: "varchar(128)", note: "e.g. customer.read" },
      { name: "description", type: "text", nullable: true },
    ],
    indexes: ["unique(key)"],
  },
  {
    name: "role_permissions",
    group: "Identity",
    description: "Many-to-many join between roles and permissions.",
    columns: [
      { name: "role_id", type: "uuid", fk: "roles.id", pk: true },
      { name: "permission_id", type: "uuid", fk: "permissions.id", pk: true },
    ],
    constraints: ["composite PK (role_id, permission_id)"],
  },
  {
    name: "user_roles",
    group: "Identity",
    description: "Assigns roles to users (optionally scoped to a branch).",
    columns: [
      { name: "user_id", type: "uuid", fk: "users.id", pk: true },
      { name: "role_id", type: "uuid", fk: "roles.id", pk: true },
      { name: "branch_id", type: "uuid", fk: "branches.id", nullable: true },
    ],
  },
  {
    name: "staff",
    group: "Operations",
    description: "Beauty specialist profiles linked to a user account.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "user_id", type: "uuid", fk: "users.id" },
      { name: "branch_id", type: "uuid", fk: "branches.id" },
      { name: "bio", type: "text", nullable: true },
      { name: "profile_image_url", type: "text", nullable: true },
      { name: "commission_rate", type: "numeric(5,2)", nullable: true },
      { name: "is_active", type: "boolean" },
    ],
    indexes: ["index(branch_id)", "unique(user_id)"],
  },
  {
    name: "staff_services",
    group: "Operations",
    description: "Which services a staff member can perform.",
    columns: [
      { name: "staff_id", type: "uuid", fk: "staff.id", pk: true },
      { name: "service_id", type: "uuid", fk: "services.id", pk: true },
    ],
  },
  {
    name: "staff_schedules",
    group: "Operations",
    description: "Recurring working hours and one-off days off per staff.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "staff_id", type: "uuid", fk: "staff.id" },
      { name: "weekday", type: "smallint", note: "0=Sun..6=Sat" },
      { name: "start_time", type: "time" },
      { name: "end_time", type: "time" },
      { name: "break_start", type: "time", nullable: true },
      { name: "break_end", type: "time", nullable: true },
      { name: "is_day_off", type: "boolean" },
      { name: "effective_from", type: "date" },
      { name: "effective_to", type: "date", nullable: true },
    ],
    indexes: ["index(staff_id, weekday)"],
  },
  {
    name: "service_categories",
    group: "Catalog",
    description: "Grouping for services (Hair, Nails, Facial...).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "name", type: "varchar(120)" },
      { name: "sort_order", type: "int" },
    ],
    indexes: ["unique(organization_id, name)"],
  },
  {
    name: "services",
    group: "Catalog",
    description: "Bookable services with price and duration.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "category_id", type: "uuid", fk: "service_categories.id", nullable: true },
      { name: "name", type: "varchar(160)" },
      { name: "description", type: "text", nullable: true },
      { name: "price", type: "numeric(10,2)" },
      { name: "duration_minutes", type: "int" },
      { name: "status", type: "enum(active,inactive)" },
      { name: "tax_rate", type: "numeric(5,2)", nullable: true },
    ],
    indexes: ["index(organization_id, status)"],
  },
  {
    name: "service_addons",
    group: "Catalog",
    description: "Optional add-ons attachable to a service at booking/checkout.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "service_id", type: "uuid", fk: "services.id" },
      { name: "name", type: "varchar(120)" },
      { name: "price", type: "numeric(10,2)" },
      { name: "duration_minutes", type: "int" },
    ],
    indexes: ["index(service_id)"],
  },
  {
    name: "service_products",
    group: "Catalog",
    description: "Links a service to products it consumes (inventory integration).",
    columns: [
      { name: "service_id", type: "uuid", fk: "services.id", pk: true },
      { name: "product_id", type: "uuid", fk: "products.id", pk: true },
      { name: "quantity", type: "numeric(10,3)" },
    ],
  },
  {
    name: "customers",
    group: "CRM",
    description: "Customer master record (tenant-scoped).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "branch_id", type: "uuid", fk: "branches.id", nullable: true, note: "home branch" },
      { name: "full_name", type: "varchar(160)" },
      { name: "phone", type: "varchar(32)" },
      { name: "email", type: "varchar(255)", nullable: true },
      { name: "date_of_birth", type: "date", nullable: true },
      { name: "profile_image_url", type: "text", nullable: true },
      { name: "preferences", type: "jsonb", nullable: true },
      { name: "status", type: "enum(active,inactive,vip,blacklisted)" },
      { name: "last_visit_at", type: "timestamptz", nullable: true },
      { name: "created_at", type: "timestamptz" },
    ],
    indexes: ["unique(organization_id, phone)", "index(organization_id, email)", "index(status)"],
  },
  {
    name: "customer_tags",
    group: "CRM",
    description: "Flexible tagging for customers.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "name", type: "varchar(64)" },
      { name: "color", type: "varchar(16)", nullable: true },
    ],
    indexes: ["unique(organization_id, name)"],
  },
  {
    name: "customer_tag_assignments",
    group: "CRM",
    description: "Join table: customer ↔ tag.",
    columns: [
      { name: "customer_id", type: "uuid", fk: "customers.id", pk: true },
      { name: "tag_id", type: "uuid", fk: "customer_tags.id", pk: true },
    ],
  },
  {
    name: "customer_notes",
    group: "CRM",
    description: "Free-text notes attached by staff to a customer.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "customer_id", type: "uuid", fk: "customers.id" },
      { name: "author_id", type: "uuid", fk: "users.id" },
      { name: "body", type: "text" },
      { name: "created_at", type: "timestamptz" },
    ],
    indexes: ["index(customer_id, created_at)"],
  },
  {
    name: "customer_favorites",
    group: "CRM",
    description: "Favorite staff and services per customer.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "customer_id", type: "uuid", fk: "customers.id" },
      { name: "staff_id", type: "uuid", fk: "staff.id", nullable: true },
      { name: "service_id", type: "uuid", fk: "services.id", nullable: true },
    ],
  },
  {
    name: "appointments",
    group: "Bookings",
    description: "Core appointment record.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "branch_id", type: "uuid", fk: "branches.id" },
      { name: "customer_id", type: "uuid", fk: "customers.id" },
      { name: "staff_id", type: "uuid", fk: "staff.id" },
      { name: "start_at", type: "timestamptz" },
      { name: "end_at", type: "timestamptz" },
      { name: "status", type: "enum(booked,confirmed,checked_in,completed,cancelled,no_show)" },
      { name: "source", type: "enum(receptionist,online,walk_in)" },
      { name: "notes", type: "text", nullable: true },
      { name: "created_by", type: "uuid", fk: "users.id", nullable: true },
      { name: "created_at", type: "timestamptz" },
    ],
    indexes: ["index(branch_id, start_at)", "index(staff_id, start_at)", "index(customer_id)", "unique(staff_id, start_at, end_at) WHERE status NOT IN ('cancelled','no_show')"],
  },
  {
    name: "appointment_services",
    group: "Bookings",
    description: "Services (and add-ons) attached to an appointment.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "appointment_id", type: "uuid", fk: "appointments.id" },
      { name: "service_id", type: "uuid", fk: "services.id" },
      { name: "addon_id", type: "uuid", fk: "service_addons.id", nullable: true },
      { name: "price", type: "numeric(10,2)", note: "snapshot at booking" },
    ],
    indexes: ["index(appointment_id)"],
  },
  {
    name: "payments",
    group: "Finance",
    description: "Payment records linked to an appointment/invoice.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "branch_id", type: "uuid", fk: "branches.id" },
      { name: "customer_id", type: "uuid", fk: "customers.id" },
      { name: "appointment_id", type: "uuid", fk: "appointments.id", nullable: true },
      { name: "invoice_id", type: "uuid", fk: "invoices.id", nullable: true },
      { name: "amount", type: "numeric(10,2)" },
      { name: "method", type: "enum(cash,card,online)" },
      { name: "provider", type: "varchar(64)", nullable: true },
      { name: "provider_ref", type: "varchar(128)", nullable: true },
      { name: "status", type: "enum(pending,completed,failed,refunded,partial_refund)" },
      { name: "paid_at", type: "timestamptz" },
    ],
    indexes: ["index(branch_id, paid_at)", "index(customer_id)"],
  },
  {
    name: "invoices",
    group: "Finance",
    description: "Invoice header for a checkout.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "branch_id", type: "uuid", fk: "branches.id" },
      { name: "customer_id", type: "uuid", fk: "customers.id" },
      { name: "number", type: "varchar(40)", note: "human-readable" },
      { name: "subtotal", type: "numeric(10,2)" },
      { name: "discount", type: "numeric(10,2)", note: "default 0" },
      { name: "tax", type: "numeric(10,2)" },
      { name: "total", type: "numeric(10,2)" },
      { name: "status", type: "enum(open,paid,partial,refunded,void)" },
      { name: "issued_at", type: "timestamptz" },
    ],
    indexes: ["unique(organization_id, number)", "index(branch_id, issued_at)"],
  },
  {
    name: "invoice_items",
    group: "Finance",
    description: "Line items on an invoice.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "invoice_id", type: "uuid", fk: "invoices.id" },
      { name: "description", type: "varchar(255)" },
      { name: "quantity", type: "numeric(10,3)" },
      { name: "unit_price", type: "numeric(10,2)" },
      { name: "line_total", type: "numeric(10,2)" },
    ],
    indexes: ["index(invoice_id)"],
  },
  {
    name: "products",
    group: "Inventory",
    description: "Stockable products (retail or consumable).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "category_id", type: "uuid", fk: "product_categories.id", nullable: true },
      { name: "name", type: "varchar(160)" },
      { name: "sku", type: "varchar(64)", nullable: true },
      { name: "unit", type: "varchar(16)", note: "pcs, ml, g" },
      { name: "cost_price", type: "numeric(10,2)", nullable: true },
      { name: "sale_price", type: "numeric(10,2)", nullable: true },
      { name: "low_stock_threshold", type: "numeric(10,3)", nullable: true },
    ],
    indexes: ["unique(organization_id, sku)"],
  },
  {
    name: "product_categories",
    group: "Inventory",
    description: "Product grouping.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "name", type: "varchar(120)" },
    ],
  },
  {
    name: "suppliers",
    group: "Inventory",
    description: "Product suppliers.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "name", type: "varchar(160)" },
      { name: "contact", type: "text", nullable: true },
    ],
  },
  {
    name: "inventory",
    group: "Inventory",
    description: "Current stock level per product per branch.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "branch_id", type: "uuid", fk: "branches.id" },
      { name: "product_id", type: "uuid", fk: "products.id" },
      { name: "quantity", type: "numeric(12,3)" },
      { name: "updated_at", type: "timestamptz" },
    ],
    indexes: ["unique(branch_id, product_id)"],
  },
  {
    name: "inventory_movements",
    group: "Inventory",
    description: "Audit-trail of every stock change.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "inventory_id", type: "uuid", fk: "inventory.id" },
      { name: "type", type: "enum(purchase,consumption,adjustment,return)" },
      { name: "delta", type: "numeric(12,3)" },
      { name: "reason", type: "varchar(255)", nullable: true },
      { name: "ref_appointment_id", type: "uuid", fk: "appointments.id", nullable: true },
      { name: "performed_by", type: "uuid", fk: "users.id" },
      { name: "created_at", type: "timestamptz" },
    ],
    indexes: ["index(inventory_id, created_at)"],
  },
  {
    name: "loyalty_accounts",
    group: "Loyalty",
    description: "Points balance per customer.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "customer_id", type: "uuid", fk: "customers.id", note: "unique" },
      { name: "points_balance", type: "int" },
      { name: "membership_id", type: "uuid", fk: "memberships.id", nullable: true },
      { name: "updated_at", type: "timestamptz" },
    ],
    indexes: ["unique(customer_id)"],
  },
  {
    name: "loyalty_transactions",
    group: "Loyalty",
    description: "Points earn/redeem ledger.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "loyalty_account_id", type: "uuid", fk: "loyalty_accounts.id" },
      { name: "type", type: "enum(earn,redeem,expire,adjust)" },
      { name: "points", type: "int", note: "+/- " },
      { name: "ref_payment_id", type: "uuid", fk: "payments.id", nullable: true },
      { name: "expires_at", type: "timestamptz", nullable: true },
      { name: "created_at", type: "timestamptz" },
    ],
    indexes: ["index(loyalty_account_id, created_at)"],
  },
  {
    name: "memberships",
    group: "Loyalty",
    description: "Membership tier definitions (Basic/Gold/VIP).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "name", type: "varchar(64)" },
      { name: "discount_percent", type: "numeric(5,2)" },
      { name: "priority_booking", type: "boolean" },
      { name: "points_multiplier", type: "numeric(3,2)" },
      { name: "is_active", type: "boolean" },
    ],
  },
  {
    name: "membership_benefits",
    group: "Loyalty",
    description: "Configurable benefits per membership tier.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "membership_id", type: "uuid", fk: "memberships.id" },
      { name: "benefit_key", type: "varchar(64)" },
      { name: "benefit_value", type: "varchar(255)" },
    ],
  },
  {
    name: "notifications",
    group: "Messaging",
    description: "Outbound notification records (per recipient).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "customer_id", type: "uuid", fk: "customers.id", nullable: true },
      { name: "channel", type: "enum(sms,email,in_app)" },
      { name: "template_key", type: "varchar(64)" },
      { name: "subject", type: "varchar(255)", nullable: true },
      { name: "body", type: "text" },
      { name: "status", type: "enum(queued,sent,delivered,failed)" },
      { name: "sent_at", type: "timestamptz", nullable: true },
      { name: "automation_rule_id", type: "uuid", fk: "automation_rules.id", nullable: true },
    ],
    indexes: ["index(organization_id, status)", "index(customer_id)"],
  },
  {
    name: "notification_templates",
    group: "Messaging",
    description: "Admin-authored message templates (no AI).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "key", type: "varchar(64)" },
      { name: "channel", type: "enum(sms,email,in_app)" },
      { name: "subject", type: "varchar(255)", nullable: true },
      { name: "body", type: "text", note: "with {{placeholders}}" },
      { name: "is_active", type: "boolean" },
    ],
    indexes: ["unique(organization_id, key, channel)"],
  },
  {
    name: "automation_rules",
    group: "Messaging",
    description: "Deterministic trigger→action rules (no AI).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "trigger", type: "varchar(64)", note: "e.g. appointment_reminder, birthday" },
      { name: "condition_json", type: "jsonb", note: "e.g. {hoursBefore:24}" },
      { name: "action_template_id", type: "uuid", fk: "notification_templates.id" },
      { name: "channel", type: "enum(sms,email,in_app)" },
      { name: "is_active", type: "boolean" },
    ],
  },
  {
    name: "customer_segments",
    group: "Marketing",
    description: "Saved segment definitions (deterministic rules).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "name", type: "varchar(120)" },
      { name: "rule_json", type: "jsonb", note: "DB conditions" },
      { name: "is_dynamic", type: "boolean" },
      { name: "last_computed_at", type: "timestamptz", nullable: true },
      { name: "member_count", type: "int", note: "cached count" },
    ],
  },
  {
    name: "campaigns",
    group: "Marketing",
    description: "Marketing campaigns targeting segments.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "segment_id", type: "uuid", fk: "customer_segments.id" },
      { name: "name", type: "varchar(160)" },
      { name: "channel", type: "enum(sms,email)" },
      { name: "template_id", type: "uuid", fk: "notification_templates.id" },
      { name: "scheduled_at", type: "timestamptz", nullable: true },
      { name: "status", type: "enum(draft,scheduled,running,completed,cancelled)" },
      { name: "created_at", type: "timestamptz" },
    ],
    indexes: ["index(organization_id, status)"],
  },
  {
    name: "campaign_recipients",
    group: "Marketing",
    description: "Per-customer delivery & result tracking for a campaign.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "campaign_id", type: "uuid", fk: "campaigns.id" },
      { name: "customer_id", type: "uuid", fk: "customers.id" },
      { name: "status", type: "enum(queued,sent,delivered,failed)" },
      { name: "opened_at", type: "timestamptz", nullable: true },
      { name: "clicked_at", type: "timestamptz", nullable: true },
      { name: "converted", type: "boolean", note: "rebooked within window" },
    ],
    indexes: ["index(campaign_id)", "index(campaign_id, status)"],
  },
  {
    name: "audit_logs",
    group: "Security",
    description: "Immutable audit trail of sensitive actions.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "actor_user_id", type: "uuid", fk: "users.id", nullable: true },
      { name: "action", type: "varchar(64)" },
      { name: "entity_type", type: "varchar(64)" },
      { name: "entity_id", type: "uuid", nullable: true },
      { name: "metadata", type: "jsonb", nullable: true },
      { name: "ip_address", type: "inet", nullable: true },
      { name: "created_at", type: "timestamptz" },
    ],
    indexes: ["index(organization_id, created_at)", "index(entity_type, entity_id)"],
  },
];

// ---- API Endpoints ----
export type ApiEndpoint = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  auth: string;
  roles: string;
  description: string;
};

export type ApiGroup = {
  module: string;
  endpoints: ApiEndpoint[];
};

export const API_GROUPS: ApiGroup[] = [
  {
    module: "Authentication",
    endpoints: [
      { method: "POST", path: "/auth/login", auth: "Public", roles: "—", description: "Authenticate, returns access + refresh tokens." },
      { method: "POST", path: "/auth/refresh", auth: "Refresh token", roles: "—", description: "Issue a new access token." },
      { method: "POST", path: "/auth/logout", auth: "Bearer", roles: "Any", description: "Revoke current session." },
      { method: "POST", path: "/auth/password/reset", auth: "Public", roles: "—", description: "Send reset token via email/SMS." },
      { method: "POST", path: "/auth/password/reset/confirm", auth: "Reset token", roles: "—", description: "Set new password with token." },
      { method: "GET", path: "/auth/me", auth: "Bearer", roles: "Any", description: "Current user profile & permissions." },
    ],
  },
  {
    module: "Customers (CRM)",
    endpoints: [
      { method: "GET", path: "/customers", auth: "Bearer", roles: "Owner, Admin, Receptionist", description: "List/search customers (paginated, filterable)." },
      { method: "POST", path: "/customers", auth: "Bearer", roles: "Owner, Admin, Receptionist", description: "Create a customer." },
      { method: "GET", path: "/customers/:id", auth: "Bearer", roles: "Owner, Admin, Receptionist, Staff (assigned)", description: "Get customer detail with timeline." },
      { method: "PATCH", path: "/customers/:id", auth: "Bearer", roles: "Owner, Admin, Receptionist", description: "Update customer profile." },
      { method: "DELETE", path: "/customers/:id", auth: "Bearer", roles: "Owner, Admin", description: "Soft-delete / deactivate customer." },
      { method: "GET", path: "/customers/:id/timeline", auth: "Bearer", roles: "Owner, Admin, Receptionist", description: "Chronological activity feed." },
      { method: "POST", path: "/customers/:id/notes", auth: "Bearer", roles: "Owner, Admin, Receptionist, Staff", description: "Add a note." },
      { method: "POST", path: "/customers/:id/tags", auth: "Bearer", roles: "Owner, Admin, Receptionist", description: "Assign tags." },
    ],
  },
  {
    module: "Appointments",
    endpoints: [
      { method: "GET", path: "/appointments", auth: "Bearer", roles: "Owner, Admin, Receptionist, Staff (own)", description: "List appointments (filter by date/staff/branch/status)." },
      { method: "POST", path: "/appointments", auth: "Bearer", roles: "Owner, Admin, Receptionist, Customer (online)", description: "Create appointment (validates no double-booking)." },
      { method: "GET", path: "/appointments/:id", auth: "Bearer", roles: "Owner, Admin, Receptionist, Staff (assigned), Customer (own)", description: "Appointment detail." },
      { method: "PATCH", path: "/appointments/:id", auth: "Bearer", roles: "Owner, Admin, Receptionist, Customer (own, reschedule)", description: "Reschedule / update." },
      { method: "DELETE", path: "/appointments/:id", auth: "Bearer", roles: "Owner, Admin, Receptionist, Customer (own, cancel)", description: "Cancel appointment." },
      { method: "POST", path: "/appointments/:id/check-in", auth: "Bearer", roles: "Owner, Admin, Receptionist, Staff", description: "Mark checked-in." },
      { method: "POST", path: "/appointments/:id/complete", auth: "Bearer", roles: "Owner, Admin, Receptionist, Staff", description: "Mark completed." },
      { method: "POST", path: "/appointments/:id/no-show", auth: "Bearer", roles: "Owner, Admin, Receptionist", description: "Mark no-show." },
      { method: "GET", path: "/availability", auth: "Bearer/Public", roles: "Any / Customer", description: "Get available slots for staff+service+date." },
    ],
  },
  {
    module: "Services",
    endpoints: [
      { method: "GET", path: "/services", auth: "Bearer/Public", roles: "Any / Customer", description: "List active services." },
      { method: "POST", path: "/services", auth: "Bearer", roles: "Owner, Admin", description: "Create service." },
      { method: "PATCH", path: "/services/:id", auth: "Bearer", roles: "Owner, Admin", description: "Update service." },
      { method: "DELETE", path: "/services/:id", auth: "Bearer", roles: "Owner, Admin", description: "Deactivate service." },
      { method: "GET", path: "/services/:id/addons", auth: "Bearer/Public", roles: "Any / Customer", description: "List add-ons for a service." },
    ],
  },
  {
    module: "Staff",
    endpoints: [
      { method: "GET", path: "/staff", auth: "Bearer", roles: "Owner, Admin, Receptionist", description: "List staff (with schedules)." },
      { method: "POST", path: "/staff", auth: "Bearer", roles: "Owner, Admin", description: "Create staff profile + user." },
      { method: "PATCH", path: "/staff/:id", auth: "Bearer", roles: "Owner, Admin, Staff (own)", description: "Update profile." },
      { method: "GET", path: "/staff/:id/schedule", auth: "Bearer", roles: "Owner, Admin, Receptionist, Staff (own)", description: "Working hours & days off." },
      { method: "PUT", path: "/staff/:id/schedule", auth: "Bearer", roles: "Owner, Admin", description: "Set recurring schedule." },
      { method: "GET", path: "/staff/:id/performance", auth: "Bearer", roles: "Owner, Admin, Staff (own)", description: "Performance metrics." },
    ],
  },
  {
    module: "POS & Payments",
    endpoints: [
      { method: "POST", path: "/invoices", auth: "Bearer", roles: "Owner, Admin, Receptionist", description: "Create invoice from appointment/services." },
      { method: "GET", path: "/invoices/:id", auth: "Bearer", roles: "Owner, Admin, Receptionist, Customer (own)", description: "Invoice detail + items." },
      { method: "POST", path: "/payments", auth: "Bearer", roles: "Owner, Admin, Receptionist", description: "Record a payment (cash/card/online)." },
      { method: "POST", path: "/payments/:id/refund", auth: "Bearer", roles: "Owner, Admin", description: "Issue refund (full/partial)." },
      { method: "GET", path: "/invoices/:id/receipt", auth: "Bearer", roles: "Owner, Admin, Receptionist, Customer (own)", description: "Printable receipt (PDF)." },
    ],
  },
  {
    module: "Inventory",
    endpoints: [
      { method: "GET", path: "/products", auth: "Bearer", roles: "Owner, Admin, Receptionist (read)", description: "List products." },
      { method: "POST", path: "/products", auth: "Bearer", roles: "Owner, Admin", description: "Create product." },
      { method: "GET", path: "/inventory", auth: "Bearer", roles: "Owner, Admin", description: "Stock levels per branch." },
      { method: "POST", path: "/inventory/movements", auth: "Bearer", roles: "Owner, Admin, Receptionist, Staff", description: "Record movement (in/out/adjust)." },
      { method: "GET", path: "/inventory/alerts", auth: "Bearer", roles: "Owner, Admin", description: "Low-stock alerts." },
    ],
  },
  {
    module: "Loyalty & Membership",
    endpoints: [
      { method: "GET", path: "/loyalty/accounts/:customerId", auth: "Bearer", roles: "Owner, Admin, Receptionist, Customer (own)", description: "Points balance & tier." },
      { method: "GET", path: "/loyalty/transactions", auth: "Bearer", roles: "Owner, Admin", description: "Points ledger." },
      { method: "POST", path: "/loyalty/redeem", auth: "Bearer", roles: "Owner, Admin, Receptionist", description: "Redeem points." },
      { method: "GET", path: "/memberships", auth: "Bearer", roles: "Owner, Admin", description: "List tiers." },
      { method: "POST", path: "/memberships", auth: "Bearer", roles: "Owner, Admin", description: "Create/configure tier." },
    ],
  },
  {
    module: "Marketing & Segments",
    endpoints: [
      { method: "GET", path: "/segments", auth: "Bearer", roles: "Owner, Admin", description: "List saved segments." },
      { method: "POST", path: "/segments", auth: "Bearer", roles: "Owner, Admin", description: "Create segment (rule JSON)." },
      { method: "POST", path: "/segments/:id/compute", auth: "Bearer", roles: "Owner, Admin", description: "Recompute membership." },
      { method: "GET", path: "/campaigns", auth: "Bearer", roles: "Owner, Admin", description: "List campaigns." },
      { method: "POST", path: "/campaigns", auth: "Bearer", roles: "Owner, Admin", description: "Create + schedule campaign." },
      { method: "GET", path: "/campaigns/:id/results", auth: "Bearer", roles: "Owner, Admin", description: "Delivery & conversion results." },
    ],
  },
  {
    module: "Dashboard & Reports",
    endpoints: [
      { method: "GET", path: "/dashboard", auth: "Bearer", roles: "Owner, Admin, Receptionist, Staff", description: "Role-specific dashboard aggregate." },
      { method: "GET", path: "/reports/revenue", auth: "Bearer", roles: "Owner, Admin", description: "Revenue report (date range, group by day/staff/service/branch)." },
      { method: "GET", path: "/reports/customers", auth: "Bearer", roles: "Owner, Admin", description: "Customer analytics (retention, churn, avg spend)." },
      { method: "GET", path: "/reports/staff", auth: "Bearer", roles: "Owner, Admin", description: "Staff performance report." },
      { method: "GET", path: "/reports/services", auth: "Bearer", roles: "Owner, Admin", description: "Service popularity & revenue." },
    ],
  },
  {
    module: "Settings & Automation",
    endpoints: [
      { method: "GET", path: "/settings", auth: "Bearer", roles: "Owner, Admin", description: "Organization/branch settings." },
      { method: "PUT", path: "/settings", auth: "Bearer", roles: "Owner, Admin", description: "Update settings." },
      { method: "GET", path: "/automation-rules", auth: "Bearer", roles: "Owner, Admin", description: "List automation rules." },
      { method: "POST", path: "/automation-rules", auth: "Bearer", roles: "Owner, Admin", description: "Create rule." },
      { method: "GET", path: "/audit-logs", auth: "Bearer", roles: "Owner", description: "Query audit logs." },
    ],
  },
];

// ---- Roadmap ----
export type RoadmapPhase = {
  phase: string;
  label: string;
  scope: string[];
  notIncluded: string[];
  color: string;
};

export const ROADMAP: RoadmapPhase[] = [
  {
    phase: "MVP",
    label: "V1 — Core Operations",
    color: "rose",
    scope: [
      "Authentication & RBAC (Owner, Admin, Receptionist, Staff)",
      "Users & Roles management",
      "Customers (CRM) — core profile, search, history",
      "Staff management & schedules",
      "Services & categories",
      "Calendar (day/week/month, staff view)",
      "Appointments — create, reschedule, cancel, check-in, complete, no-show",
      "POS & Payments (cash/card), invoices & receipts",
      "Basic dashboards (role-specific)",
      "Single-branch (multi-branch schema ready)",
    ],
    notIncluded: [
      "Customer portal & online booking",
      "Notifications/automation engine",
      "Loyalty & membership",
      "Segmentation & marketing",
      "Inventory",
      "Advanced reports",
    ],
  },
  {
    phase: "V2",
    label: "V2 — Growth & Retention",
    color: "amber",
    scope: [
      "Customer Portal (online booking, self-service)",
      "Notifications & automation engine (deterministic rules)",
      "Loyalty points & redemption",
      "Membership tiers & benefits",
      "Customer segmentation (rule-based)",
      "Marketing campaigns (SMS/Email)",
      "Inventory management (products, stock, consumption)",
      "Advanced reports & analytics",
      "Online payment provider integration",
    ],
    notIncluded: ["Multi-branch operational UI", "Subscription/billing", "Accounting integrations"],
  },
  {
    phase: "V3+",
    label: "Future — Scale & Integrations",
    color: "emerald",
    scope: [
      "Multi-branch management UI & cross-branch analytics",
      "Subscription / SaaS billing model",
      "Advanced marketing (A/B deterministic, drip sequences)",
      "External integrations (accounting: QuickBooks/Xero; calendar sync)",
      "Advanced automation (multi-step workflows, conditions)",
      "Advanced analytics (cohorts, custom report builder)",
      "Mobile apps (staff & customer)",
      "White-label theming",
    ],
    notIncluded: ["Any AI features — explicitly out of scope for the platform"],
  },
];

// ---- User flows ----
export type FlowStep = { actor: string; action: string };

export const USER_FLOWS: { name: string; steps: FlowStep[] }[] = [
  {
    name: "Online Booking (Customer)",
    steps: [
      { actor: "Customer", action: "Opens booking portal, selects service" },
      { actor: "System", action: "Shows specialists who can perform it" },
      { actor: "Customer", action: "Selects preferred staff (or 'any')" },
      { actor: "System", action: "Computes available slots (working hours − breaks − existing bookings)" },
      { actor: "Customer", action: "Picks a date & time, confirms" },
      { actor: "System", action: "Creates appointment (status: booked), sends confirmation" },
      { actor: "System", action: "Sends reminder 24h before (automation rule)" },
      { actor: "Customer", action: "Arrives, receptionist checks them in" },
      { actor: "Staff", action: "Performs service, marks appointment completed" },
      { actor: "Receptionist", action: "Processes payment via POS, issues invoice/receipt" },
      { actor: "System", action: "Awards loyalty points (V2), updates customer history" },
    ],
  },
  {
    name: "Walk-in Checkout (Receptionist)",
    steps: [
      { actor: "Receptionist", action: "Searches/creates customer" },
      { actor: "Receptionist", action: "Adds services & add-ons to cart" },
      { actor: "System", action: "Computes subtotal, applies membership discount, adds tax" },
      { actor: "Receptionist", action: "Applies optional discount (with approval if over threshold)" },
      { actor: "Receptionist", action: "Takes payment (cash/card/online)" },
      { actor: "System", action: "Creates invoice + payment, prints receipt" },
      { actor: "System", action: "Updates inventory (consumes linked products)" },
      { actor: "System", action: "Updates loyalty + customer last-visit" },
    ],
  },
  {
    name: "Rebooking Reminder (Automation)",
    steps: [
      { actor: "System (cron)", action: "Daily job scans completed appointments X days ago without a rebooking" },
      { actor: "System", action: "Matches automation rule 'rebooking_reminder'" },
      { actor: "System", action: "Renders template with customer + service placeholders" },
      { actor: "System", action: "Queues SMS/Email to customer" },
      { actor: "System", action: "Records notification + tracks delivery" },
    ],
  },
];
