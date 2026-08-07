"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  APPOINTMENTS,
  AUTOMATION_RULES,
  BRANCHES,
  CAMPAIGNS,
  CUSTOMERS,
  LOYALTY_LEDGER,
  LOYALTY_RULE,
  MEMBERSHIP_PLANS,
  NOTIFICATIONS,
  PRODUCTS,
  SEGMENTS,
  SERVICES,
  STAFF,
  TRANSACTIONS,
  USERS,
} from "./seed-data";
import type {
  AppNotification,
  Appointment,
  AppointmentStatus,
  AutomationRule,
  Branch,
  Campaign,
  Customer,
  CustomerNote,
  LoyaltyLedgerEntry,
  LoyaltyRule,
  MembershipPlan,
  PaymentMethod,
  Product,
  SaleItem,
  Segment,
  Service,
  Staff,
  Transaction,
  User,
} from "./types";

// ---- Loyalty config (1 point per 100 EGP) ----
const POINTS_PER_EGP = 1 / 100;

// ---- Navigation view ids ----
export type ViewId =
  | "dashboard"
  | "calendar"
  | "customers"
  | "customer_detail"
  | "services"
  | "staff"
  | "pos"
  | "inventory"
  | "loyalty"
  | "marketing"
  | "reports"
  | "settings"
  | "notifications"
  | "book_appointment"   // customer
  | "my_appointments"    // customer
  | "my_profile"         // customer
  | "my_offers"          // customer
  | "staff_today"        // staff
  | "staff_customers"    // staff
  | "staff_schedule"     // staff
  | "staff_performance"; // staff

interface AppState {
  // Auth
  currentUserId: string | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;

  // Navigation
  view: ViewId;
  selectedCustomerId: string | null;
  selectedAppointmentId: string | null;
  setView: (v: ViewId) => void;
  openCustomer: (id: string) => void;
  openAppointment: (id: string) => void;

  // Data
  users: User[];
  branches: Branch[];
  staff: Staff[];
  services: Service[];
  customers: Customer[];
  appointments: Appointment[];
  products: Product[];
  transactions: Transaction[];
  loyaltyRule: LoyaltyRule;
  loyaltyLedger: LoyaltyLedgerEntry[];
  memberships: MembershipPlan[];
  segments: Segment[];
  campaigns: Campaign[];
  notifications: AppNotification[];
  automationRules: AutomationRule[];

  // Mutations
  createAppointment: (input: {
    customerId: string;
    branchId: string;
    services: { serviceId: string; staffId: string; price: number }[];
    start: string;
    end: string;
    notes?: string;
    createdBy: string;
  }) => { ok: boolean; error?: string; appointment?: Appointment };
  updateAppointmentStatus: (id: string, status: AppointmentStatus, extra?: { cancellationReason?: string }) => void;
  rescheduleAppointment: (id: string, start: string, end: string) => void;
  checkAvailability: (staffId: string, start: string, end: string, excludeApptId?: string) => boolean;
  isStaffWorking: (staffId: string, date: Date) => boolean;

  createTransaction: (input: {
    customerId: string;
    branchId: string;
    appointmentId?: string;
    items: SaleItem[];
    discountPct: number;
    taxPct: number;
    paymentMethod: PaymentMethod;
    pointsRedeemed?: number;
    createdBy: string;
    staffId?: string;
  }) => Transaction;

  addCustomerNote: (customerId: string, text: string, author: string) => void;
  adjustStock: (productId: string, delta: number) => void;
  redeemPoints: (customerId: string, points: number, reason: string) => { ok: boolean; error?: string };
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleAutomation: (id: string) => void;
  createCampaign: (input: Omit<Campaign, "id" | "sentCount" | "openedCount" | "respondedCount">) => void;
  resetData: () => void;
}

// Re-seed fresh state (used on first load + reset)
function freshData() {
  return {
    users: USERS,
    branches: BRANCHES,
    staff: STAFF,
    services: SERVICES,
    customers: CUSTOMERS.map((c) => ({
      ...c,
      timeline: buildInitialTimeline(c.id),
    })),
    appointments: APPOINTMENTS,
    products: PRODUCTS,
    transactions: TRANSACTIONS,
    loyaltyRule: LOYALTY_RULE,
    loyaltyLedger: LOYALTY_LEDGER,
    memberships: MEMBERSHIP_PLANS,
    segments: computeSegmentCounts(SEGMENTS, CUSTOMERS),
    campaigns: CAMPAIGNS,
    notifications: NOTIFICATIONS,
    automationRules: AUTOMATION_RULES,
  };
}

function buildInitialTimeline(customerId: string): Customer["timeline"] {
  const appts = APPOINTMENTS.filter((a) => a.customerId === customerId);
  const txns = TRANSACTIONS.filter((t) => t.customerId === customerId && t.paymentStatus === "paid");
  const events: Customer["timeline"] = [];
  appts.forEach((a) => {
    const svc = SERVICES.find((s) => s.id === a.services[0]?.serviceId);
    events.push({
      id: `tl_a_${a.id}`,
      date: a.start,
      type: "appointment",
      title: `موعد: ${svc?.name ?? "خدمة"}`,
      description: `الحالة: ${a.status} — الكود: ${a.code}`,
      refId: a.id,
    });
  });
  txns.forEach((t) => {
    events.push({
      id: `tl_t_${t.id}`,
      date: t.createdAt,
      type: "payment",
      title: `دفعة ${t.code}`,
      description: `${t.paymentStatus === "paid" ? "مدفوعة" : "جزئية"} — طريقة: ${t.payments[0]?.method ?? "—"}`,
      amount: t.total,
      refId: t.id,
    });
    if (t.pointsEarned > 0) {
      events.push({
        id: `tl_l_${t.id}`,
        date: t.createdAt,
        type: "loyalty",
        title: `+${t.pointsEarned} نقطة ولاء`,
        description: `أرباح من ${t.code}`,
        points: t.pointsEarned,
        refId: t.id,
      });
    }
  });
  return events.sort((a, b) => (a.date < b.date ? 1 : -1));
}

function computeSegmentCounts(segments: Segment[], customers: Customer[]): Segment[] {
  const now = Date.now();
  return segments.map((s) => {
    let count = 0;
    switch (s.id) {
      case "seg1":
        count = customers.filter((c) => now - new Date(c.joinedAt).getTime() < 30 * 86400000).length;
        break;
      case "seg2":
        count = customers.filter((c) => c.membershipTier === "vip").length;
        break;
      case "seg3":
        count = customers.filter((c) => c.lastVisit && now - new Date(c.lastVisit).getTime() > 60 * 86400000).length;
        break;
      case "seg4":
        count = customers.filter((c) => c.visitCount >= 15).length;
        break;
      case "seg5":
        count = customers.filter((c) => c.totalSpend >= 15000).length;
        break;
      case "seg6":
        count = customers.filter(
          (c) => c.lastVisit && now - new Date(c.lastVisit).getTime() < 30 * 86400000 && c.visitCount > 5,
        ).length;
        break;
    }
    return { ...s, count };
  });
}

let apptCounter = 1100;
let txnCounter = 2200;

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      view: "dashboard",
      selectedCustomerId: null,
      selectedAppointmentId: null,

      login: (email, password) => {
        const user = get().users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
        );
        if (!user) return { ok: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
        const firstView: ViewId =
          user.role === "customer"
            ? "my_profile"
            : user.role === "staff"
              ? "staff_today"
              : "dashboard";
        set({ currentUserId: user.id, view: firstView });
        return { ok: true };
      },
      logout: () => set({ currentUserId: null, view: "dashboard", selectedCustomerId: null, selectedAppointmentId: null }),

      setView: (v) => set({ view: v }),
      openCustomer: (id) => set({ selectedCustomerId: id, view: "customer_detail" }),
      openAppointment: (id) => set({ selectedAppointmentId: id, view: "calendar" }),

      ...freshData(),

      checkAvailability: (staffId, start, end, excludeApptId) => {
        const s = new Date(start).getTime();
        const e = new Date(end).getTime();
        return !get().appointments.some((a) => {
          if (a.id === excludeApptId) return false;
          if (a.status === "cancelled" || a.status === "no_show") return false;
          if (!a.services.some((sv) => sv.staffId === staffId)) return false;
          const as = new Date(a.start).getTime();
          const ae = new Date(a.end).getTime();
          return s < ae && e > as;
        });
      },

      isStaffWorking: (staffId, date) => {
        const staff = get().staff.find((s) => s.id === staffId);
        if (!staff) return false;
        const jsDay = date.getDay();
        const egDay = (jsDay + 1) % 7;
        const wh = staff.workingHours.find((w) => w.day === egDay);
        if (!wh || wh.off) return false;
        const [sh, sm] = wh.start.split(":").map(Number);
        const [eh, em] = wh.end.split(":").map(Number);
        const start = new Date(date);
        start.setHours(sh, sm, 0, 0);
        const end = new Date(date);
        end.setHours(eh, em, 0, 0);
        return date >= start && date <= end;
      },

      createAppointment: (input) => {
        const state = get();
        // Conflict + working hours checks
        for (const svc of input.services) {
          const staff = state.staff.find((s) => s.id === svc.staffId);
          if (!staff) return { ok: false, error: "الأخصائي غير موجود" };
          const service = state.services.find((s) => s.id === svc.serviceId);
          if (!service) return { ok: false, error: "الخدمة غير موجودة" };
          if (!staff.serviceIds.includes(svc.serviceId))
            return { ok: false, error: `${staff.name} لا يقدّم هذه الخدمة` };
          if (!state.isStaffWorking(svc.staffId, new Date(input.start)))
            return { ok: false, error: `${staff.name} خارج ساعات العمل في هذا الوقت` };
          if (!state.checkAvailability(svc.staffId, input.start, input.end))
            return { ok: false, error: "تعارض في الموعد — الأخصائي محجوز في هذا الوقت" };
        }
        const appt: Appointment = {
          id: `a_new_${apptCounter++}`,
          code: `AP-${apptCounter++}`,
          customerId: input.customerId,
          branchId: input.branchId,
          services: input.services,
          start: input.start,
          end: input.end,
          status: "scheduled",
          notes: input.notes,
          createdBy: input.createdBy,
          createdAt: new Date().toISOString(),
        };
        set({ appointments: [appt, ...get().appointments] });
        // Push notification
        const cust = get().customers.find((c) => c.id === input.customerId);
        const newNotif: AppNotification = {
          id: `nt_new_${Date.now()}`,
          type: "booking_confirmation",
          title: "تأكيد حجز جديد",
          body: `تم حجز موعد جديد ${appt.code} للسيدة ${cust?.name ?? ""}`,
          date: new Date().toISOString(),
          read: false,
          severity: "success",
          refId: appt.id,
        };
        set({ notifications: [newNotif, ...get().notifications] });
        return { ok: true, appointment: appt };
      },

      updateAppointmentStatus: (id, status, extra) => {
        set({
          appointments: get().appointments.map((a) => {
            if (a.id !== id) return a;
            return {
              ...a,
              status,
              checkedInAt: status === "checked_in" ? new Date().toISOString() : a.checkedInAt,
              completedAt: status === "completed" ? new Date().toISOString() : a.completedAt,
              cancellationReason: extra?.cancellationReason ?? a.cancellationReason,
            };
          }),
        });
      },

      rescheduleAppointment: (id, start, end) => {
        set({
          appointments: get().appointments.map((a) =>
            a.id === id ? { ...a, start, end, status: a.status === "no_show" ? "scheduled" : a.status } : a,
          ),
        });
      },

      createTransaction: (input) => {
        const state = get();
        const subtotal = input.items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
        const discountAmount = Math.round((subtotal * input.discountPct) / 100);
        const taxable = subtotal - discountAmount;
        const taxAmount = Math.round((taxable * input.taxPct) / 100);
        const pointsRedeemed = input.pointsRedeemed ?? 0;
        const pointsValue = pointsRedeemed; // 1 pt = 1 EGP
        const total = Math.max(0, taxable + taxAmount - pointsValue);
        const pointsEarned = Math.floor(total * POINTS_PER_EGP);
        const txn: Transaction = {
          id: `t_new_${txnCounter}`,
          code: `INV-${txnCounter++}`,
          type: "sale",
          customerId: input.customerId,
          branchId: input.branchId,
          appointmentId: input.appointmentId,
          items: input.items,
          subtotal,
          discountPct: input.discountPct,
          discountAmount,
          taxPct: input.taxPct,
          taxAmount,
          total,
          paid: total,
          paymentStatus: "paid",
          payments: [{ id: `pm_${txnCounter}`, method: input.paymentMethod, amount: total, ref: `PAY-${3000 + txnCounter}` }],
          pointsEarned,
          pointsRedeemed,
          createdAt: new Date().toISOString(),
          createdBy: input.createdBy,
          staffId: input.staffId,
        };

        // Update customer: spend, visits, lastVisit, loyalty points, favorite service/staff, timeline
        const cust = state.customers.find((c) => c.id === input.customerId);
        const updatedCustomers = state.customers.map((c) => {
          if (c.id !== input.customerId) return c;
          const newPoints = c.loyaltyPoints + pointsEarned - pointsRedeemed;
          const serviceItem = input.items.find((i) => i.kind === "service");
          return {
            ...c,
            totalSpend: c.totalSpend + total,
            visitCount: c.visitCount + 1,
            lastVisit: new Date().toISOString().slice(0, 10),
            loyaltyPoints: Math.max(0, newPoints),
            favoriteServiceId: serviceItem?.refId ?? c.favoriteServiceId,
            favoriteStaffId: serviceItem?.staffId ?? c.favoriteStaffId,
            balance: Math.max(0, c.balance - total),
            timeline: [
              {
                id: `tl_new_${txn.id}_p`,
                date: txn.createdAt,
                type: "payment" as const,
                title: `دفعة ${txn.code}`,
                description: `طريقة: ${input.paymentMethod === "cash" ? "نقدي" : input.paymentMethod === "card" ? "بطاقة" : "أونلاين"}`,
                amount: total,
                refId: txn.id,
              },
              ...(pointsEarned > 0
                ? [{
                    id: `tl_new_${txn.id}_l`,
                    date: txn.createdAt,
                    type: "loyalty" as const,
                    title: `+${pointsEarned} نقطة ولاء`,
                    description: `أرباح من ${txn.code}`,
                    points: pointsEarned,
                    refId: txn.id,
                  }]
                : []),
              ...c.timeline,
            ],
          };
        });

        // Loyalty ledger
        const ledgerEntries: LoyaltyLedgerEntry[] = [];
        if (pointsEarned > 0) {
          ledgerEntries.push({
            id: `ll_new_${txn.id}_e`,
            customerId: input.customerId,
            type: "earn",
            points: pointsEarned,
            reason: `أرباح من فاتورة ${txn.code}`,
            refId: txn.id,
            date: txn.createdAt,
          });
        }
        if (pointsRedeemed > 0) {
          ledgerEntries.push({
            id: `ll_new_${txn.id}_r`,
            customerId: input.customerId,
            type: "redeem",
            points: -pointsRedeemed,
            reason: `استبدال نقاط في فاتورة ${txn.code}`,
            refId: txn.id,
            date: txn.createdAt,
          });
        }

        // Mark appointment completed if linked
        const updatedAppts = input.appointmentId
          ? state.appointments.map((a) =>
              a.id === input.appointmentId
                ? { ...a, status: "completed" as AppointmentStatus, completedAt: new Date().toISOString(), paymentId: txn.id }
                : a,
            )
          : state.appointments;

        set({
          transactions: [txn, ...state.transactions],
          customers: updatedCustomers,
          appointments: updatedAppts,
          loyaltyLedger: [...ledgerEntries, ...state.loyaltyLedger],
          segments: computeSegmentCounts(state.segments, updatedCustomers),
        });

        // Loyalty milestone notification
        if (cust && pointsEarned > 0) {
          const oldPoints = cust.loyaltyPoints;
          const newTotal = oldPoints + pointsEarned;
          if (Math.floor(oldPoints / 100) < Math.floor(newTotal / 100)) {
            const notif: AppNotification = {
              id: `nt_milestone_${Date.now()}`,
              type: "loyalty_milestone",
              title: "إنجاز ولاء",
              body: `${cust.name} وصلت إلى ${Math.floor(newTotal / 100) * 100} نقطة ولاء`,
              date: new Date().toISOString(),
              read: false,
              severity: "success",
              refId: cust.id,
            };
            set({ notifications: [notif, ...get().notifications] });
          }
        }

        return txn;
      },

      addCustomerNote: (customerId, text, author) => {
        const note: CustomerNote = {
          id: `n_${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          author,
          text,
        };
        set({
          customers: get().customers.map((c) =>
            c.id === customerId
              ? {
                  ...c,
                  notes: [note, ...c.notes],
                  timeline: [
                    {
                      id: `tl_note_${note.id}`,
                      date: note.date,
                      type: "note",
                      title: "ملاحظة جديدة",
                      description: text,
                      refId: note.id,
                    },
                    ...c.timeline,
                  ],
                }
              : c,
          ),
        });
      },

      adjustStock: (productId, delta) => {
        set({
          products: get().products.map((p) =>
            p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p,
          ),
        });
      },

      redeemPoints: (customerId, points, reason) => {
        const cust = get().customers.find((c) => c.id === customerId);
        if (!cust) return { ok: false, error: "العميل غير موجود" };
        if (cust.loyaltyPoints < points) return { ok: false, error: "نقاط غير كافية" };
        if (points < get().loyaltyRule.minRedeemPoints)
          return { ok: false, error: `الحد الأدنى للاستبدال ${get().loyaltyRule.minRedeemPoints} نقطة` };
        set({
          customers: get().customers.map((c) =>
            c.id === customerId ? { ...c, loyaltyPoints: c.loyaltyPoints - points } : c,
          ),
          loyaltyLedger: [
            {
              id: `ll_redeem_${Date.now()}`,
              customerId,
              type: "redeem",
              points: -points,
              reason,
              date: new Date().toISOString(),
            },
            ...get().loyaltyLedger,
          ],
        });
        return { ok: true };
      },

      markNotificationRead: (id) =>
        set({ notifications: get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }),
      markAllNotificationsRead: () =>
        set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) }),
      toggleAutomation: (id) =>
        set({
          automationRules: get().automationRules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
        }),
      createCampaign: (input) =>
        set({
          campaigns: [
            { ...input, id: `cmp_${Date.now()}`, sentCount: 0, openedCount: 0, respondedCount: 0 },
            ...get().campaigns,
          ],
        }),
      resetData: () => set({ ...freshData() }),
    }),
    {
      name: "lumiere-beauty-demo",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        currentUserId: s.currentUserId,
        view: s.view,
        customers: s.customers,
        appointments: s.appointments,
        transactions: s.transactions,
        products: s.products,
        loyaltyLedger: s.loyaltyLedger,
        notifications: s.notifications,
        campaigns: s.campaigns,
        automationRules: s.automationRules,
        segments: s.segments,
      }),
    },
  ),
);

// ---- Selectors / derived helpers ----
export function useCurrentUser(): User | null {
  return useApp((s) => s.users.find((u) => u.id === s.currentUserId) ?? null);
}
