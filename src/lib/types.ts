// ============================================================
// Lumière Beauty — Domain Types
// All deterministic, rule-based. No AI.
// ============================================================

export type Role = "owner" | "reception" | "staff" | "customer";

export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type PaymentMethod = "cash" | "card" | "online";
export type PaymentStatus = "paid" | "partial" | "unpaid" | "refunded";
export type TxnType = "sale" | "refund" | "loyalty_redemption";

export type ServiceCategory =
  | "hair_color"
  | "hair_treatment"
  | "hair_styling"
  | "facial"
  | "manicure"
  | "pedicure"
  | "makeup";

export type MembershipTier = "basic" | "gold" | "vip";

export type StaffStatus = "active" | "on_leave" | "inactive";

export type ProductCategory =
  | "hair_color"
  | "shampoo"
  | "conditioner"
  | "facial_mask"
  | "serum"
  | "nail_polish"
  | "tools";

export type CampaignChannel = "sms" | "email" | "whatsapp" | "push";
export type CampaignStatus = "draft" | "scheduled" | "running" | "completed" | "cancelled";

export type NotificationType =
  | "appointment_reminder"
  | "booking_confirmation"
  | "low_stock"
  | "customer_birthday"
  | "inactive_customer"
  | "loyalty_milestone"
  | "campaign_sent";

// ---- User ----
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // demo only
  role: Role;
  avatarColor: string;
  phone?: string;
  // For staff users
  staffId?: string;
  // For customer users
  customerId?: string;
}

// ---- Branch ----
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  isMain: boolean;
}

// ---- Staff ----
export interface StaffServiceLink {
  serviceId: string;
}

export interface WorkingHours {
  // 0=Sat .. 6=Fri (Egypt week)
  day: number;
  start: string; // "09:00"
  end: string;   // "18:00"
  off: boolean;
}

export interface Staff {
  id: string;
  name: string;
  role: string; // "أخصائي شعر", "أخصائي بشرة"
  phone: string;
  email: string;
  status: StaffStatus;
  branchId: string;
  serviceIds: string[];
  workingHours: WorkingHours[];
  rating: number; // 0..5
  color: string;  // calendar color
  hireDate: string;
  commissionPct: number; // % of service revenue
  completedAppointments: number;
  totalRevenue: number;
}

// ---- Service ----
export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  durationMin: number;
  price: number;       // EGP
  cost: number;        // product cost estimate
  description: string;
  staffIds: string[];  // who can perform
  status: "active" | "inactive";
  popularity: number;  // count of bookings
}

// ---- Customer ----
export interface CustomerNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: "appointment" | "payment" | "loyalty" | "note" | "membership" | "purchase";
  title: string;
  description?: string;
  amount?: number;
  points?: number;
  refId?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: "female" | "male";
  birthday: string;        // ISO date
  joinedAt: string;        // ISO datetime
  lastVisit?: string;      // ISO datetime
  totalSpend: number;
  visitCount: number;
  loyaltyPoints: number;
  membershipTier: MembershipTier;
  membershipExpiry?: string;
  favoriteServiceId?: string;
  favoriteStaffId?: string;
  notes: CustomerNote[];
  timeline: TimelineEvent[];
  assignedStaffId?: string; // for staff login mapping
  tags: string[]; // deterministic segmentation tags
  balance: number; // outstanding balance (positive = customer owes)
}

// ---- Appointment ----
export interface AppointmentService {
  serviceId: string;
  staffId: string;
  price: number;
}

export interface Appointment {
  id: string;
  code: string; // "AP-1024"
  customerId: string;
  branchId: string;
  services: AppointmentService[];
  start: string;  // ISO datetime
  end: string;    // ISO datetime
  status: AppointmentStatus;
  notes?: string;
  createdBy: string; // user id
  createdAt: string;
  checkedInAt?: string;
  completedAt?: string;
  cancellationReason?: string;
  paymentId?: string;
}

// ---- Product (Inventory) ----
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  unitCost: number;
  unitPrice: number;
  supplier: string;
  branchId: string;
}

// ---- Transaction / Sale (POS) ----
export interface SaleItem {
  id: string;
  kind: "service" | "product" | "addon";
  refId: string;     // serviceId / productId
  name: string;
  qty: number;
  unitPrice: number;
  staffId?: string;
}

export interface Payment {
  id: string;
  method: PaymentMethod;
  amount: number;
  ref: string; // receipt/txn ref
}

export interface Transaction {
  id: string;
  code: string; // "INV-2048"
  type: TxnType;
  customerId: string;
  branchId: string;
  appointmentId?: string;
  items: SaleItem[];
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  taxPct: number;
  taxAmount: number;
  total: number;
  paid: number;
  paymentStatus: PaymentStatus;
  payments: Payment[];
  pointsEarned: number;
  pointsRedeemed: number;
  createdAt: string;
  createdBy: string;
  staffId?: string;
}

// ---- Loyalty ----
export interface LoyaltyRule {
  pointsPerEgp: number;       // e.g. 1 point per 100 EGP
  minRedeemPoints: number;
  pointsToEgpRate: number;    // 1 point = X EGP
}

export interface LoyaltyLedgerEntry {
  id: string;
  customerId: string;
  type: "earn" | "redeem" | "adjust";
  points: number; // positive earn, negative redeem
  reason: string;
  refId?: string;
  date: string;
}

// ---- Membership ----
export interface MembershipPlan {
  tier: MembershipTier;
  name: string;
  price: number;
  durationMonths: number;
  discountPct: number;       // on services
  freeServicesPerMonth: number;
  priorityBooking: boolean;
  perks: string[];
  color: string;
}

// ---- Marketing ----
export interface Segment {
  id: string;
  name: string;
  description: string;
  rule: string; // human-readable rule
  count: number;
  color: string;
}

export interface Campaign {
  id: string;
  name: string;
  segmentId: string;
  channel: CampaignChannel;
  message: string;
  scheduledAt: string;
  status: CampaignStatus;
  sentCount: number;
  openedCount: number;
  respondedCount: number;
  budget: number;
  createdBy: string;
}

// ---- Notifications ----
export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  date: string;
  read: boolean;
  refId?: string;
  severity: "info" | "success" | "warning" | "error";
}

// ---- Settings / Automation ----
export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

// ---- Dashboard KPI ----
export interface KpiPoint {
  label: string;
  value: number;
}
