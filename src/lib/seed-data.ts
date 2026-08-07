import type {
  AppNotification,
  Appointment,
  AutomationRule,
  Branch,
  Campaign,
  Customer,
  LoyaltyLedgerEntry,
  LoyaltyRule,
  MembershipPlan,
  Product,
  SaleItem,
  Segment,
  Service,
  Staff,
  Transaction,
  User,
} from "./types";

// ============================================================
// Helpers
// ============================================================
const today = new Date();
const iso = (d: Date) => d.toISOString();
const dayOffset = (days: number, hour = 10, minute = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return iso(d);
};
const dateOffset = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

// ============================================================
// Branches
// ============================================================
export const BRANCHES: Branch[] = [
  {
    id: "br1",
    name: "لوميير — زمالك",
    address: "١٦ شارع ٢٦ يوليو، زمالك، القاهرة",
    phone: "+20 2 2735 0001",
    manager: "مريم حسن",
    isMain: true,
  },
  {
    id: "br2",
    name: "لوميير — نيوباي",
    address: "برج نيوباي، الشيخ زايد، الجيزة",
    phone: "+20 2 3850 0042",
    manager: "نور علي",
    isMain: false,
  },
];

// ============================================================
// Users (demo accounts)
// ============================================================
export const USERS: User[] = [
  {
    id: "u_owner",
    name: "ليلى عبد الرحمن",
    email: "owner@beauty-demo.com",
    password: "Demo123!",
    role: "owner",
    avatarColor: "#003527",
    phone: "+20 100 100 0001",
  },
  {
    id: "u_reception",
    name: "هبة مصطفى",
    email: "reception@beauty-demo.com",
    password: "Demo123!",
    role: "reception",
    avatarColor: "#735c00",
    phone: "+20 100 100 0002",
    staffId: "st_reception",
  },
  {
    id: "u_staff",
    name: "مريم حسن",
    email: "staff@beauty-demo.com",
    password: "Demo123!",
    role: "staff",
    avatarColor: "#0b513d",
    phone: "+20 100 100 0003",
    staffId: "st1",
  },
  {
    id: "u_customer",
    name: "سلمى يوسف",
    email: "customer@beauty-demo.com",
    password: "Demo123!",
    role: "customer",
    avatarColor: "#5f5e5b",
    phone: "+20 100 100 0004",
    customerId: "c1",
  },
];

// ============================================================
// Staff
// ============================================================
const stdHours = (off: number[] = [5]) =>
  [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    day,
    start: "10:00",
    end: "20:00",
    off: off.includes(day),
  }));

export const STAFF: Staff[] = [
  {
    id: "st1",
    name: "مريم حسن",
    role: "أخصائية شعر",
    phone: "+20 100 123 4501",
    email: "mariam@lumiere.com",
    status: "active",
    branchId: "br1",
    serviceIds: ["sv1", "sv2", "sv3", "sv15"],
    workingHours: stdHours([5]),
    rating: 4.9,
    color: "#003527",
    hireDate: "2022-03-01",
    commissionPct: 15,
    completedAppointments: 412,
    totalRevenue: 318450,
  },
  {
    id: "st2",
    name: "نور علي",
    role: "أخصائية بشرة",
    phone: "+20 100 123 4502",
    email: "nour@lumiere.com",
    status: "active",
    branchId: "br1",
    serviceIds: ["sv4", "sv5", "sv6"],
    workingHours: stdHours([5]),
    rating: 4.8,
    color: "#0b513d",
    hireDate: "2022-06-15",
    commissionPct: 14,
    completedAppointments: 356,
    totalRevenue: 264200,
  },
  {
    id: "st3",
    name: "سارة محمد",
    role: "أخصائية أظافر",
    phone: "+20 100 123 4503",
    email: "sara@lumiere.com",
    status: "active",
    branchId: "br1",
    serviceIds: ["sv5", "sv6", "sv7"],
    workingHours: stdHours([5]),
    rating: 4.7,
    color: "#735c00",
    hireDate: "2023-01-10",
    commissionPct: 13,
    completedAppointments: 289,
    totalRevenue: 178900,
  },
  {
    id: "st4",
    name: "عمر خالد",
    role: "خبير مكياج",
    phone: "+20 100 123 4504",
    email: "omar@lumiere.com",
    status: "active",
    branchId: "br1",
    serviceIds: ["sv7", "sv8", "sv9"],
    workingHours: stdHours([5]),
    rating: 4.9,
    color: "#5f5e5b",
    hireDate: "2023-04-20",
    commissionPct: 16,
    completedAppointments: 198,
    totalRevenue: 221300,
  },
  {
    id: "st5",
    name: "فاطمة الزهراء",
    role: "أخصائية صبغات",
    phone: "+20 100 123 4505",
    email: "fatma@lumiere.com",
    status: "active",
    branchId: "br2",
    serviceIds: ["sv1", "sv2", "sv10"],
    workingHours: stdHours([5]),
    rating: 4.6,
    color: "#064e3b",
    hireDate: "2023-08-01",
    commissionPct: 15,
    completedAppointments: 167,
    totalRevenue: 132400,
  },
  {
    id: "st6",
    name: "آية محمود",
    role: "أخصائية عناية",
    phone: "+20 100 123 4506",
    email: "aya@lumiere.com",
    status: "on_leave",
    branchId: "br2",
    serviceIds: ["sv3", "sv4", "sv11"],
    workingHours: stdHours([0, 5]),
    rating: 4.5,
    color: "#bfc9c3",
    hireDate: "2023-11-15",
    commissionPct: 12,
    completedAppointments: 92,
    totalRevenue: 76800,
  },
  {
    id: "st_reception",
    name: "هبة مصطفى",
    role: "موظفة استقبال",
    phone: "+20 100 123 4500",
    email: "heba@lumiere.com",
    status: "active",
    branchId: "br1",
    serviceIds: [],
    workingHours: stdHours([5]),
    rating: 5,
    color: "#404944",
    hireDate: "2022-02-01",
    commissionPct: 0,
    completedAppointments: 0,
    totalRevenue: 0,
  },
];

// ============================================================
// Services
// ============================================================
export const SERVICES: Service[] = [
  { id: "sv1", name: "صبغة شعر كاملة", category: "hair_color", durationMin: 120, price: 1500, cost: 280, description: "صبغة شعر احترافية باستخدام منتجات خالية من الأمونيا", staffIds: ["st1", "st5"], status: "active", popularity: 86 },
  { id: "sv2", name: "هايلايت بالومشاج", category: "hair_color", durationMin: 150, price: 2200, cost: 350, description: "هايلايت باستخدام تقنية البالومشاج الفرنسية", staffIds: ["st1", "st5"], status: "active", popularity: 64 },
  { id: "sv3", name: "علاج البروتين", category: "hair_treatment", durationMin: 90, price: 1800, cost: 220, description: "علاج عميق بالبروتين والكيراتين لترميم الشعر", staffIds: ["st1", "st6"], status: "active", popularity: 72 },
  { id: "sv4", name: "تنظيف بشرة عميق", category: "facial", durationMin: 75, price: 950, cost: 140, description: "تنظيف وترطيب عميق مع قناع مضاد للأكسدة", staffIds: ["st2"], status: "active", popularity: 98 },
  { id: "sv5", name: "مانيكير فرنسي", category: "manicure", durationMin: 60, price: 450, cost: 70, description: "مانيكير كلاسيكي باللمسة الفرنسية", staffIds: ["st3"], status: "active", popularity: 120 },
  { id: "sv6", name: "باديكير سبا", category: "pedicure", durationMin: 75, price: 650, cost: 90, description: "باديكير كامل مع تدليك وحمام مغربي للأقدام", staffIds: ["st3"], status: "active", popularity: 88 },
  { id: "sv7", name: "مكياج سهرة كامل", category: "makeup", durationMin: 90, price: 1300, cost: 180, description: "مكياج احترافي للسهرات والمناسبات", staffIds: ["st4"], status: "active", popularity: 76 },
  { id: "sv8", name: "مكياج عروس", category: "makeup", durationMin: 150, price: 3500, cost: 320, description: "باقة العروس الكاملة مع تجربة مسبقة", staffIds: ["st4"], status: "active", popularity: 34 },
  { id: "sv9", name: "تركيب رموش", category: "makeup", durationMin: 60, price: 700, cost: 110, description: "تركيب رموش صناعية طبيعية المظهر", staffIds: ["st4"], status: "active", popularity: 58 },
  { id: "sv10", name: "بالاجراش معالج", category: "hair_treatment", durationMin: 180, price: 2800, cost: 420, description: "علاج البرازيلي للتنعيم ولفرد الشعر", staffIds: ["st1", "st5"], status: "active", popularity: 41 },
  { id: "sv11", name: "حمام كريم مغذي", category: "hair_treatment", durationMin: 45, price: 400, cost: 60, description: "حمام زيت وكريم لترطيب الشعر الجاف", staffIds: ["st1", "st6"], status: "active", popularity: 132 },
  { id: "sv12", name: "قصة وتصفيف", category: "hair_styling", durationMin: 45, price: 350, cost: 30, description: "قصة عصرية مع تصفيف نهائي", staffIds: ["st1"], status: "active", popularity: 145 },
  { id: "sv13", name: "تصفيف سهرة", category: "hair_styling", durationMin: 60, price: 600, cost: 40, description: "تصفيف شعر احترافي للمناسبات", staffIds: ["st1"], status: "active", popularity: 67 },
  { id: "sv14", name: "تدليك وجه بالذهب", category: "facial", durationMin: 60, price: 1100, cost: 160, description: "جلسة تدليك بذهب ٢٤ قيراط لنضارة البشرة", staffIds: ["st2"], status: "active", popularity: 52 },
  { id: "sv15", name: "كيراتين معالج", category: "hair_treatment", durationMin: 150, price: 2400, cost: 300, description: "علاج الكيراتين المكثف لفرد الشعر", staffIds: ["st1", "st5"], status: "active", popularity: 49 },
];

// ============================================================
// Products (Inventory)
// ============================================================
export const PRODUCTS: Product[] = [
  { id: "p1", name: "صبغة شعر بني داكن", category: "hair_color", sku: "HC-001", stock: 42, lowStockThreshold: 15, unitCost: 120, unitPrice: 280, supplier: "بروفشنال بيوتي", branchId: "br1" },
  { id: "p2", name: "صبغة شعر أشقر رملي", category: "hair_color", sku: "HC-002", stock: 8, lowStockThreshold: 12, unitCost: 130, unitPrice: 290, supplier: "بروفشنال بيوتي", branchId: "br1" },
  { id: "p3", name: "شامبو خالي من السلفات", category: "shampoo", sku: "SH-001", stock: 64, lowStockThreshold: 20, unitCost: 85, unitPrice: 220, supplier: "إيكو هير", branchId: "br1" },
  { id: "p4", name: "بلسم مرطب مكثف", category: "conditioner", sku: "CN-001", stock: 51, lowStockThreshold: 18, unitCost: 75, unitPrice: 200, supplier: "إيكو هير", branchId: "br1" },
  { id: "p5", name: "ماسك وجه بالألوفيرا", category: "facial_mask", sku: "FM-001", stock: 34, lowStockThreshold: 10, unitCost: 55, unitPrice: 150, supplier: "غلو لاب", branchId: "br1" },
  { id: "p6", name: "سيروم فيتامين سي", category: "serum", sku: "SR-001", stock: 12, lowStockThreshold: 14, unitCost: 180, unitPrice: 420, supplier: "غلو لاب", branchId: "br1" },
  { id: "p7", name: "طلاء أظافر أحمر", category: "nail_polish", sku: "NP-001", stock: 76, lowStockThreshold: 25, unitCost: 35, unitPrice: 90, supplier: "نيل آرت", branchId: "br1" },
  { id: "p8", name: "طلاء أظافر وردي", category: "nail_polish", sku: "NP-002", stock: 88, lowStockThreshold: 25, unitCost: 35, unitPrice: 90, supplier: "نيل آرت", branchId: "br1" },
  { id: "p9", name: "مزيل طلاء لطيف", category: "nail_polish", sku: "NP-003", stock: 6, lowStockThreshold: 10, unitCost: 25, unitPrice: 70, supplier: "نيل آرت", branchId: "br1" },
  { id: "p10", name: "كريم أساس مرطب", category: "facial_mask", sku: "MK-001", stock: 28, lowStockThreshold: 12, unitCost: 140, unitPrice: 350, supplier: "لوكسا", branchId: "br1" },
  { id: "p11", name: "أحمر شفاه مطفي", category: "facial_mask", sku: "MK-002", stock: 45, lowStockThreshold: 15, unitCost: 70, unitPrice: 180, supplier: "لوكسا", branchId: "br1" },
  { id: "p12", name: "مقص شعر احترافي", category: "tools", sku: "TL-001", stock: 14, lowStockThreshold: 5, unitCost: 220, unitPrice: 480, supplier: "جابينو", branchId: "br1" },
  { id: "p13", name: "فرشة تصفيف كبيرة", category: "tools", sku: "TL-002", stock: 22, lowStockThreshold: 8, unitCost: 60, unitPrice: 140, supplier: "جابينو", branchId: "br1" },
  { id: "p14", name: "سيروم زراعة الرموش", category: "serum", sku: "SR-002", stock: 18, lowStockThreshold: 8, unitCost: 95, unitPrice: 240, supplier: "غلو لاب", branchId: "br1" },
  { id: "p15", name: "شامبو ضد القشرة", category: "shampoo", sku: "SH-002", stock: 39, lowStockThreshold: 15, unitCost: 90, unitPrice: 230, supplier: "إيكو هير", branchId: "br1" },
  { id: "p16", name: "ماسك شعر بالكيراتين", category: "facial_mask", sku: "FM-002", stock: 27, lowStockThreshold: 10, unitCost: 110, unitPrice: 280, supplier: "إيكو هير", branchId: "br1" },
  { id: "p17", name: "زيت أرغان مغربي", category: "serum", sku: "SR-003", stock: 31, lowStockThreshold: 12, unitCost: 130, unitPrice: 310, supplier: "بروفشنال بيوتي", branchId: "br1" },
  { id: "p18", name: "فوط شعر معقمة", category: "tools", sku: "TL-003", stock: 120, lowStockThreshold: 40, unitCost: 5, unitPrice: 15, supplier: "سيفتي فيرست", branchId: "br1" },
  { id: "p19", name: "كريم حماية حرارية", category: "conditioner", sku: "CN-002", stock: 9, lowStockThreshold: 12, unitCost: 85, unitPrice: 210, supplier: "إيكو هير", branchId: "br1" },
  { id: "p20", name: "ثابت شعر سبراي", category: "tools", sku: "TL-004", stock: 33, lowStockThreshold: 15, unitCost: 50, unitPrice: 130, supplier: "جابينو", branchId: "br1" },
];

// ============================================================
// Customers (30+)
// ============================================================
const arabicFirstNames = [
  "سلمى", "نورا", "هالة", "دina", "ريم", "مريم", "آية", "فاطمة", "ياسمين", "ميرنا",
  "دينا", "مروة", "إيمان", "رانيا", "هبة", "سارة", "لبنى", "منى", "أمل", "كريمة",
  "وفاء", "سندس", "بسمة", "تالا", "جنى", "لارا", "مي", "ندى", "روان", "شيرين",
  "ولاء", "إسراء",
];
const arabicLastNames = [
  "يوسف", "أحمد", "مصطفى", "السيد", "حسن", "عبد الله", "فؤاد", "كمال", "زكي", "سمير",
  "رشاد", "عبد الرحمن", "شوقي", "نبيل", "صبحي", "عز الدين", "منصور", "الشناوي", "بدران", "الجندي",
];
const makePhone = (i: number) => `+20 10${(i % 9)} ${String(1000000 + i * 1317).slice(0, 3)} ${String(1000 + i * 17).slice(0, 4)}`;

const membershipTiers: ("basic" | "gold" | "vip")[] = ["basic", "basic", "gold", "basic", "gold", "vip", "basic", "gold"];

const customers: Customer[] = [];
for (let i = 0; i < 32; i++) {
  const first = arabicFirstNames[i % arabicFirstNames.length];
  const last = arabicLastNames[(i * 3) % arabicLastNames.length];
  const name = `${first} ${last}`;
  const joinedDaysAgo = 20 + i * 11;
  const lastVisitDaysAgo = i % 4 === 0 ? 90 + i : (i % 7) + 1;
  const visitCount = i % 3 === 0 ? 2 + i : 8 + i * 2;
  const totalSpend = visitCount * (450 + (i % 5) * 200);
  const tier = membershipTiers[i % membershipTiers.length];
  const isVip = tier === "vip";
  const isActive = lastVisitDaysAgo < 30;
  const isInactive = lastVisitDaysAgo > 60;
  const tags: string[] = [];
  if (visitCount <= 2) tags.push("عميل جديد");
  if (isVip) tags.push("VIP");
  if (isInactive) tags.push("غير نشط");
  if (visitCount >= 15) tags.push("زائر متكرر");
  if (totalSpend >= 15000) tags.push("إنفاق عالٍ");
  if (visitCount > 5 && lastVisitDaysAgo < 30) tags.push("عميل عائد");

  customers.push({
    id: `c${i + 1}`,
    name,
    phone: makePhone(i + 1),
    email: `${first}.${last}@example.com`.replace(/\s/g, ".").toLowerCase(),
    gender: i % 10 === 0 ? "male" : "female",
    birthday: `${1990 + (i % 12)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
    joinedAt: dayOffset(-joinedDaysAgo).slice(0, 10),
    lastVisit: dayOffset(-lastVisitDaysAgo).slice(0, 10),
    totalSpend,
    visitCount,
    loyaltyPoints: Math.floor(totalSpend / 100) - Math.floor(i * 5),
    membershipTier: tier,
    membershipExpiry: dateOffset(120 + (i % 6) * 30),
    favoriteServiceId: SERVICES[i % SERVICES.length].id,
    favoriteStaffId: STAFF[i % 4].id,
    assignedStaffId: i === 0 ? "st1" : STAFF[i % 4].id,
    notes:
      i % 5 === 0
        ? [
            {
              id: `n_${i}_1`,
              date: dayOffset(-lastVisitDaysAgo).slice(0, 10),
              author: "مريم حسن",
              text: "تفضّل الصبغات الباردة. حساسية تجاه الأمونيا.",
            },
          ]
        : [],
    timeline: [],
    tags,
    balance: i % 6 === 0 ? 200 + i * 50 : 0,
  });
}
// Override first customer to be the logged-in customer account
customers[0].name = "سلمى يوسف";
customers[0].email = "customer@beauty-demo.com";
customers[0].membershipTier = "gold";
export const CUSTOMERS: Customer[] = customers;

// ============================================================
// Appointments (50+)
// ============================================================
const apptStatuses: Appointment["status"][] = [
  "completed", "completed", "completed", "completed", "completed",
  "completed", "completed", "completed", "cancelled", "no_show",
  "scheduled", "confirmed", "checked_in", "in_progress", "scheduled",
];
const appts: Appointment[] = [];
let apptCounter = 1024;
for (let i = 0; i < 56; i++) {
  const cust = CUSTOMERS[i % CUSTOMERS.length];
  const service = SERVICES[(i * 3) % SERVICES.length];
  const staff = STAFF.find((s) => service.staffIds.includes(s.id)) || STAFF[0];
  const dayShift = i < 20 ? -(i + 1) : i < 40 ? 0 : (i - 39);
  const hour = 10 + (i % 9);
  const start = dayOffset(dayShift, hour, (i % 2) * 30);
  const end = dayOffset(dayShift, hour + Math.floor(service.durationMin / 60), (i % 2) * 30 + (service.durationMin % 60));
  const status = apptStatuses[i % apptStatuses.length];
  appts.push({
    id: `a${i + 1}`,
    code: `AP-${apptCounter++}`,
    customerId: cust.id,
    branchId: staff.branchId,
    services: [{ serviceId: service.id, staffId: staff.id, price: service.price }],
    start,
    end,
    status,
    notes: status === "scheduled" ? "مطلوب تأكيد الحجز قبل الموعد بـ ٢٤ ساعة" : undefined,
    createdBy: "u_reception",
    createdAt: dayOffset(dayShift - 1, 9, 0),
    checkedInAt: status === "checked_in" || status === "in_progress" || status === "completed" ? dayOffset(dayShift, hour, 0) : undefined,
    completedAt: status === "completed" ? end : undefined,
    cancellationReason: status === "cancelled" ? "اعتذار العميل" : status === "no_show" ? "لم يحضر العميل" : undefined,
  });
}
// Force 32 appointments today (per brief)
const todaysAppts = appts.filter((a) => {
  const d = new Date(a.start);
  const t = new Date();
  return d.toDateString() === t.toDateString();
}).length;
// ensure today has ~32
let extraToday = Math.max(0, 32 - todaysAppts);
for (let i = 0; i < extraToday; i++) {
  const cust = CUSTOMERS[i % CUSTOMERS.length];
  const service = SERVICES[(i * 5) % SERVICES.length];
  const staff = STAFF.find((s) => service.staffIds.includes(s.id)) || STAFF[0];
  const hour = 10 + (i % 10);
  appts.push({
    id: `a_today_${i}`,
    code: `AP-${apptCounter++}`,
    customerId: cust.id,
    branchId: staff.branchId,
    services: [{ serviceId: service.id, staffId: staff.id, price: service.price }],
    start: dayOffset(0, hour, (i % 2) * 30),
    end: dayOffset(0, hour + Math.floor(service.durationMin / 60), 0),
    status: i % 4 === 0 ? "completed" : i % 3 === 0 ? "checked_in" : "scheduled",
    createdBy: "u_reception",
    createdAt: dayOffset(-1, 9, 0),
  });
}
export const APPOINTMENTS: Appointment[] = appts;

// ============================================================
// Transactions (100+) — generated from completed appointments + POS sales
// ============================================================
const txns: Transaction[] = [];
let txnCounter = 2048;
const paymentMethods: ("cash" | "card" | "online")[] = ["cash", "card", "online", "card", "cash"];
for (let i = 0; i < 110; i++) {
  const appt = appts[i % appts.length];
  if (appt.status !== "completed" && appt.status !== "scheduled" && i < 80) {
    // still create a POS transaction
  }
  const cust = CUSTOMERS[i % CUSTOMERS.length];
  const service = SERVICES[(i * 4) % SERVICES.length];
  const product = PRODUCTS[i % PRODUCTS.length];
  const addon = PRODUCTS[(i + 3) % PRODUCTS.length];
  const subtotal = service.price + (i % 3 === 0 ? product.unitPrice : 0) + (i % 4 === 0 ? addon.unitPrice : 0);
  const discountPct = cust.membershipTier === "vip" ? 15 : cust.membershipTier === "gold" ? 10 : 0;
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const taxPct = 14;
  const taxable = subtotal - discountAmount;
  const taxAmount = Math.round((taxable * taxPct) / 100);
  const total = taxable + taxAmount;
  const pointsEarned = Math.floor(total / 100);
  const method = paymentMethods[i % paymentMethods.length];
  const isPaid = appt.status === "completed" || i >= 80;
  const items: SaleItem[] = [
    {
      id: `it_${i}_1`,
      kind: "service",
      refId: service.id,
      name: service.name,
      qty: 1,
      unitPrice: service.price,
      staffId: service.staffIds[0],
    },
  ];
  if (i % 3 === 0)
    items.push({
      id: `it_${i}_2`,
      kind: "product",
      refId: product.id,
      name: product.name,
      qty: 1,
      unitPrice: product.unitPrice,
    });
  if (i % 4 === 0)
    items.push({
      id: `it_${i}_3`,
      kind: "addon",
      refId: addon.id,
      name: addon.name,
      qty: 1,
      unitPrice: addon.unitPrice,
    });
  txns.push({
    id: `t${i + 1}`,
    code: `INV-${txnCounter++}`,
    type: "sale",
    customerId: cust.id,
    branchId: cust.id ? "br1" : "br1",
    appointmentId: i < 80 ? appt.id : undefined,
    items,
    subtotal,
    discountPct,
    discountAmount,
    taxPct,
    taxAmount,
    total,
    paid: isPaid ? total : 0,
    paymentStatus: isPaid ? "paid" : i % 11 === 0 ? "partial" : "unpaid",
    payments: isPaid
      ? [{ id: `pm_${i}`, method, amount: total, ref: `PAY-${1000 + i}` }]
      : i % 11 === 0
        ? [{ id: `pm_${i}`, method, amount: Math.round(total / 2), ref: `PAY-${1000 + i}` }]
        : [],
    pointsEarned: isPaid ? pointsEarned : 0,
    pointsRedeemed: 0,
    createdAt: dayOffset(-(i % 30) - 1, 11 + (i % 8), 0),
    createdBy: "u_reception",
    staffId: service.staffIds[0],
  });
}
export const TRANSACTIONS: Transaction[] = txns;

// ============================================================
// Loyalty
// ============================================================
export const LOYALTY_RULE: LoyaltyRule = {
  pointsPerEgp: 1, // 1 point per 100 EGP (configured as unit-per-100 below)
  minRedeemPoints: 50,
  pointsToEgpRate: 1, // 1 point = 1 EGP
};

export const LOYALTY_LEDGER: LoyaltyLedgerEntry[] = txns
  .filter((t) => t.paymentStatus === "paid" && t.pointsEarned > 0)
  .slice(0, 60)
  .map((t, i) => ({
    id: `ll_${i}`,
    customerId: t.customerId,
    type: "earn" as const,
    points: t.pointsEarned,
    reason: `أرباح من فاتورة ${t.code}`,
    refId: t.id,
    date: t.createdAt,
  }));

// ============================================================
// Memberships
// ============================================================
export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    tier: "basic",
    name: "العضوية الأساسية",
    price: 0,
    durationMonths: 12,
    discountPct: 0,
    freeServicesPerMonth: 0,
    priorityBooking: false,
    perks: ["نقاط ولاء مضاعفة عند الإحالة", "هدية عيد الميلاد"],
    color: "#5f5e5b",
  },
  {
    tier: "gold",
    name: "العضوية الذهبية",
    price: 1500,
    durationMonths: 12,
    discountPct: 10,
    freeServicesPerMonth: 1,
    priorityBooking: true,
    perks: ["خصم ١٠٪ على كل الخدمات", "خدمة مجانية شهرياً", "حجز أولوية", "هدية عيد الميلاد"],
    color: "#cca72f",
  },
  {
    tier: "vip",
    name: "العضوية المميزة VIP",
    price: 4500,
    durationMonths: 12,
    discountPct: 15,
    freeServicesPerMonth: 3,
    priorityBooking: true,
    perks: ["خصم ١٥٪ على كل الخدمات", "٣ خدمات مجانية شهرياً", "حجز أولوية قصوى", "أخصائي مخصص", "صالة انتظار خاصة", "هدية عيد الميلاد الفاخرة"],
    color: "#003527",
  },
];

// ============================================================
// Segments (deterministic rule-based)
// ============================================================
export const SEGMENTS: Segment[] = [
  { id: "seg1", name: "عملاء جدد", description: "انضموا خلال آخر ٣٠ يوماً", rule: "joinedAt >= today - 30d", count: 0, color: "#95d3ba" },
  { id: "seg2", name: "VIP", description: "العضوية المميزة الحالية", rule: "membershipTier = vip", count: 0, color: "#003527" },
  { id: "seg3", name: "غير نشطين", description: "آخر زيارة قبل ٦٠ يوماً", rule: "lastVisit <= today - 60d", count: 0, color: "#ba1a1a" },
  { id: "seg4", name: "زوار متكررون", description: "١٥ زيارة أو أكثر", rule: "visitCount >= 15", count: 0, color: "#cca72f" },
  { id: "seg5", name: "إنفاق عالٍ", description: "إجمالي إنفاق ≥ ١٥٬٠٠٠ ج.م", rule: "totalSpend >= 15000", count: 0, color: "#735c00" },
  { id: "seg6", name: "عملاء عائدون", description: "زاروا خلال آخر ٣٠ يوماً وأكثر من ٥ زيارات", rule: "lastVisit >= today - 30d AND visitCount > 5", count: 0, color: "#0b513d" },
];

// ============================================================
// Campaigns
// ============================================================
export const CAMPAIGNS: Campaign[] = [
  {
    id: "cmp1",
    name: "عرض العيد — خصم ٢٠٪",
    segmentId: "seg2",
    channel: "sms",
    message: "عميلنا العزيز، احتفل معنا بـ Eid بخصم ٢٠٪ على كل خدمات الشعر هذا الأسبوع. كود: EID20",
    scheduledAt: dayOffset(2, 10, 0),
    status: "scheduled",
    sentCount: 0,
    openedCount: 0,
    respondedCount: 0,
    budget: 1500,
    createdBy: "u_owner",
  },
  {
    id: "cmp2",
    name: "استعادة العملاء غير النشطين",
    segmentId: "seg3",
    channel: "email",
    message: "اشتقنا لك! عودي هذا الشهر واحصلي على خدمة مجانية مع أول حجز.",
    scheduledAt: dayOffset(-3, 11, 0),
    status: "completed",
    sentCount: 24,
    openedCount: 17,
    respondedCount: 6,
    budget: 800,
    createdBy: "u_owner",
  },
  {
    id: "cmp3",
    name: "إطلاق مكياج العرائس الجديد",
    segmentId: "seg5",
    channel: "whatsapp",
    message: "باقة العرائس الجديدة متاحة الآن بحجز مسبق. خصم ١٠٪ للحجوزات الأولى.",
    scheduledAt: dayOffset(1, 12, 0),
    status: "running",
    sentCount: 18,
    openedCount: 12,
    respondedCount: 3,
    budget: 1200,
    createdBy: "u_owner",
  },
  {
    id: "cmp4",
    name: "تذكير المواليد الشهرية",
    segmentId: "seg6",
    channel: "push",
    message: "كل عام وأنتم بخير! هدية عيد ميلادك من لوميير: تدليك وجه بالذهب مجاناً.",
    scheduledAt: dayOffset(-7, 9, 0),
    status: "completed",
    sentCount: 42,
    openedCount: 38,
    respondedCount: 11,
    budget: 600,
    createdBy: "u_owner",
  },
];

// ============================================================
// Notifications
// ============================================================
export const NOTIFICATIONS: AppNotification[] = [
  { id: "nt1", type: "appointment_reminder", title: "تذكير موعد", body: "موعد السيدة سلمى يوسف بعد ٣٠ دقيقة — صبغة شعر كاملة مع مريم حسن", date: dayOffset(0, 9, 30), read: false, severity: "info" },
  { id: "nt2", type: "low_stock", title: "تنبيه مخزون منخفض", body: "صبغة شعر أشقر رملي وصلت إلى ٨ وحدات فقط", date: dayOffset(0, 8, 15), read: false, severity: "warning", refId: "p2" },
  { id: "nt3", type: "customer_birthday", title: "عيد ميلاد عميل", body: "عيد ميلاد السيدة هالة أحمد غداً — أرسل هدية الولاء", date: dayOffset(0, 10, 0), read: false, severity: "info", refId: "c3" },
  { id: "nt4", type: "booking_confirmation", title: "تأكيد حجز جديد", body: "تم حجز موعد جديد: AP-1080 للسيدة ريم السيد", date: dayOffset(0, 11, 20), read: true, severity: "success" },
  { id: "nt5", type: "loyalty_milestone", title: "إنجاز ولاء", body: "السيدة نورا مصطفى وصلت إلى ٢٠٠ نقطة ولاء", date: dayOffset(-1, 14, 0), read: true, severity: "success", refId: "c2" },
  { id: "nt6", type: "inactive_customer", title: "عميل غير نشط", body: "السيدة دينا فؤاد لم تزر منذ ٩٠ يوماً — يُنصح بالتواصل", date: dayOffset(-1, 16, 0), read: false, severity: "warning", refId: "c4" },
  { id: "nt7", type: "campaign_sent", title: "حملة مكتملة", body: "اكتملت حملة 'استعادة العملاء غير النشطين' — ٢٤ رسالة مرسلة", date: dayOffset(-3, 11, 0), read: true, severity: "info", refId: "cmp2" },
  { id: "nt8", type: "low_stock", title: "تنبيه مخزون منخفض", body: "مزيل طلاء لطيف وصل إلى ٦ وحدات", date: dayOffset(-2, 9, 0), read: true, severity: "warning", refId: "p9" },
];

// ============================================================
// Automation Rules
// ============================================================
export const AUTOMATION_RULES: AutomationRule[] = [
  { id: "ar1", name: "تذكير قبل الموعد بساعة", trigger: "قبل الموعد بـ ٦٠ دقيقة", action: "إرسال إشعار تذكير للعميل", enabled: true },
  { id: "ar2", name: "تأكيد تلقائي للحجوزات", trigger: "عند إنشاء موعد جديد", action: "إرسال رسالة تأكيد فورية", enabled: true },
  { id: "ar3", name: "تنبيه المخزون المنخفض", trigger: "عند انخفاض المخزون تحت الحد الأدنى", action: "إنشاء إشعار تنبيه للمدير", enabled: true },
  { id: "ar4", name: "هدية عيد الميلاد", trigger: "قبل عيد ميلاد العميل بـ ٧ أيام", action: "إضافة خصم ٢٠٪ لحساب العميل", enabled: true },
  { id: "ar5", name: "تنبيه العميل غير النشط", trigger: "بعد ٦٠ يوماً من آخر زيارة", action: "إضافة العميل لقائمة المتابعة", enabled: false },
  { id: "ar6", name: "مضاعفة نقاط الولاء للمميزين", trigger: "عند إتمام دفع عميل VIP", action: "مضاعفة النقاط المكتسبة", enabled: true },
];
