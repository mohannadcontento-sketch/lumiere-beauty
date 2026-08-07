# Task 8e — subagent-portals

## Task
Build Customer + Staff portals for the Lumière Beauty Arabic RTL Beauty Center Management demo.

## Files created
1. `src/components/views/customer-portal.tsx` — exports `CustomerPortal`
2. `src/components/views/staff-portal.tsx` — exports `StaffPortal`

## Architecture used
- Zustand store at `@/lib/store`: `useApp` for state + actions, `useCurrentUser` for logged-in user.
- Single-route SPA. The `view` from store determines which sub-view to render. Each portal is a thin switch on `view`.
- Shared UI primitives from `@/components/shared/ui`: `PageHeader`, `SectionTitle`, `StatCard`, `Badge`, `EmptyState`, `StatusBadge`, `Avatar`.
- shadcn/ui: `Button`, `Input`, `Label`, `Tabs` (+ list/trigger/content), `Select` (+ trigger/value/content/item), `Dialog` (+ header/title/description/footer/content).
- Format helpers from `@/lib/format`: `formatEGP`, `formatNumber`, `formatDate`, `formatDateShort`, `formatDateTime`, `formatTime`, `isSameDay`, `WEEKDAYS_AR`, `WEEKDAYS_SHORT_AR`, `MONTHS_AR`, `dayName`.
- Icons: `lucide-react`. Charts: `recharts` (BarChart in StaffPerformanceView). `sonner` for toast feedback.

## CustomerPortal
Switches on `view` and renders one of 4 sub-views. Guard: returns EmptyState if user is not a customer.

### view === "my_profile" (`MyProfileView`)
- PageHeader "ملفي" / "مرحباً بكِ في لوميير بيوتي — مساحتكِ الخاصة للعناية".
- Hero card: `Avatar` (lg, tier color), name (font-display 2xl), tier Badge with icon (Star/Medal/Crown), contact info (Phone, Mail, Cake — all dir="ltr" for Latin identifiers).
- Stats row (4 StatCards): نقاط الولاء (Coins), إجمالي الزيارات (CalendarCheck), إجمالي الإنفاق (Wallet, formatEGP), العضوية (Crown, tier label).
- Membership card: plan name + colored tier icon, expiry date (formatDateShort), perks list with emerald Check, "ترقية العضوية" outline button → `setView("my_offers")`.
- Quick actions card: 3 QuickAction buttons (حجز موعد → book_appointment, عرض العروض → my_offers, مواعيدي → my_appointments) with icon + title + desc + ArrowLeft arrow.
- Recent activity timeline (last 5 events from `customer.timeline`): ol with colored icon circle per event type (appointment/payment/loyalty/note/membership/purchase), title, description, formatDateShort.

### view === "book_appointment" (`BookAppointmentView`)
- PageHeader "حجز موعد جديد".
- SectionTitle "تصفّحي حسب الفئة" + grid (2/3/4/7 cols) of 7 category cards (صبغات/علاج الشعر/تصفيف/بشرة/مانيكير/باديكير/مكياج), each with colored icon tile (CATEGORY_COLORS hex), label, count, active state (border-primary bg-primary/5).
- SectionTitle "خدمات فئة {category}" + grid (1/2/3 cols) of ServiceCard components: name (font-display), category pill (colored), description (line-clamp-2), Clock + duration, Users + staff count, price (font-display text-primary), "احجزي" Button.
- SectionTitle "خدماتنا الأكثر طلباً" + horizontal-lines list of top 5 services by popularity (rank circle, name + category, TrendingUp + popularity, price, "احجزي" outline button).
- BookingDialog (`Dialog sm:max-w-lg`) — opens on "احجزي":
  - Title: "حجز: {service.name}", description with duration + price.
  - Staff Select (filtered to `service.staffIds`, default first).
  - Date Input (type=date, dir="ltr", default tomorrow) + Time Input (type=time, dir="ltr", default "11:00").
  - Summary card: staff name + formatted start datetime.
  - Warnings (amber card with AlertCircle): "خارج ساعات العمل" if `!isStaffWorking`, "تعارض — الأخصائية محجوزة" if `!checkAvailability`. Both checks done via store actions.
  - Footer: إلغاء (outline) + تأكيد الحجز (default, disabled if warnings or submitting).
  - On confirm: calls `createAppointment({ customerId, branchId: branches[0].id, services:[{serviceId, staffId, price:service.price}], start, end, createdBy: user.id })`. ISO start/end computed from date+time + durationMin. On ok: toast.success + close dialog + `setView("my_appointments")`. On error: toast.error.

### view === "my_appointments" (`MyAppointmentsView`)
- PageHeader "مواعيدي" / "تابعي مواعيدكِ القادمة والسابقة".
- Tabs (3) with count badges: القادمة / السابقة / الملغاة.
- Each tab filters `appointments` where `customerId === user.customerId`, sorted by start desc.
  - upcoming: status scheduled/confirmed/checked_in/in_progress AND start >= now.
  - past: status completed OR (end < now AND not cancelled/no_show).
  - cancelled: status cancelled OR no_show.
- AppointmentCard (flex row): time block (font-display 2xl formatTime + formatDateShort + range dir="ltr"), service name (font-display) + StatusBadge, staff name + role, code (dir="ltr"), cancellation reason if any, price (font-display text-primary), action button: "إلغاء الموعد" (outline) for scheduled/confirmed upcoming → `updateAppointmentStatus(id, "cancelled", {cancellationReason: "بناءً على طلب العميل"})` + toast; "إعادة الحجز" for completed/cancelled → `setView("book_appointment")`.
- EmptyState per tab with appropriate description + (for upcoming) action button "حجز موعد جديد".

### view === "my_offers" (`MyOffersView`)
- PageHeader "العروض والخصومات".
- SectionTitle "عروض مخصصة لكِ" + grid of OfferCard components (conditional based on customer data):
  - "خصم عيد الميلاد" (BDAY20, ٢٠٪) — shown if birthday within 30 days (computed via Date math).
  - "عرض العضوية الذهبية" (VIP30, ٣٠٪) — shown if tier !== vip, onClick → setView("loyalty").
  - "كوبون أول حجز" (WELCOME15, ١٥٪) — shown if visitCount <= 2, onClick → setView("book_appointment").
  - "خدمة مجانية عند الإحالة" (REFER, مجاناً) — always shown.
  - Each card: colored top strip, icon tile, tag Badge, title (font-display), description, discount (font-display text-primary), code in mono ltr, optional "استخدم العرض" button.
- "الحملات الجارية" section: filters `campaigns` where status=running or scheduled; cards with name, StatusBadge, message preview (line-clamp-3), scheduled date + sent count.
- Membership upgrade CTA card (border-primary/30 bg-primary/5): if customer's tier is not vip, show next-tier membership (gold→vip, basic→gold) with icon tile, name, description (discount %, free services), "ترقية الآن" Button → `setView("loyalty")`.

## StaffPortal
Switches on `view` and renders one of 4 sub-views. Guard: returns EmptyState if user is not staff.

### view === "staff_today" (`StaffTodayView`)
- PageHeader "مواعيد اليوم" with subtitle `${dayName(today)} — ${formatDate(today)}`.
- 4 StatCards: مواعيد اليوم (CalendarCheck), مكتملة (CheckCircle2, delta %), قادمة (Clock), إيراد اليوم (Wallet, formatEGP, computed from today's paid txns where staffId matches).
- "جدول اليوم" list: filters appointments where any `service.staffId === user.staffId` AND `isSameDay(start, today)`, sorted by start asc. Each row (TodayAppointmentRow):
  - Time block (font-display 2xl formatTime + end arrow, dir="ltr").
  - Customer button (Avatar colored by tier + name) → `openCustomer(a.customerId)`, service name.
  - StatusBadge + action buttons:
    - scheduled/confirmed/checked_in → "بدء" (PlayCircle) → `updateAppointmentStatus(id, "in_progress")` + toast.
    - in_progress → "إتمام" (CheckCircle2) → `updateAppointmentStatus(id, "completed")` + toast.
    - completed → Badge "منجزة".
- EmptyState if no appointments today.

### view === "staff_customers" (`StaffCustomersView`)
- PageHeader "عملائي" / "{count} عميل في رعايتكِ".
- Search Input (right-aligned Search icon) filtering by name/phone/email.
- myCustomers computed via useMemo: union of customers where `assignedStaffId === staffId` OR `favoriteStaffId === staffId` OR have any appointment with this staff.
- Grid (1/2/3 cols) of MyCustomerCard:
  - Avatar (lg, tier color) + name + tier Badge + appointment count badge.
  - Contact info (Phone + Mail, dir="ltr").
  - 3-col stats grid: زيارات, الإنفاق (formatEGP), آخر زيارة (formatDateShort).
  - "عرض الملف" outline button → `openCustomer(c.id)`.
- EmptyState if no matches.

### view === "staff_schedule" (`StaffScheduleView`)
- PageHeader "جدولي الأسبوعي" with subtitle showing week range.
- All hooks (useApp for staff + appointments + services + customers, useMemo for weekStart + weekDays) are called BEFORE the early return for `!staff` (rules-of-hooks compliance).
- weekStart = Saturday of this week (Egyptian week: Sat=0..Fri=6, computed from JS day via `(getDay()+1)%7`).
- 3 StatCards: مواعيد الأسبوع, إجمالي الساعات (computed from end-start diff), الإيراد المتوقع (sum of non-cancelled/no_show appointment service prices).
- 7-day columns grid (min-w-[900px] horizontal scroll on mobile):
  - Each column: weekday short name (WEEKDAYS_SHORT_AR), day number (font-display), today highlighted (border-primary).
  - If day off (no working hours OR off=true): show "إجازة" pill.
  - Else: working hours banner (Clock + start—end, dir="ltr" tnum) at top, then list of day's appointments (filtered to staff + same day, sorted asc) with start time (font-bold tnum), customer name, service name, StatusBadge.
- Empty cell shows "لا مواعيد" if no appointments that day.

### view === "staff_performance" (`StaffPerformanceView`)
- PageHeader "أدائي" / "ملخص إنجازاتكِ ومعدلاتكِ".
- All hooks (useApp, useMemo for monthlySeries) are called BEFORE the early return for `!staff` (rules-of-hooks compliance).
- 4 StatCards: إجمالي المواعيد المكتملة (staff.completedAppointments, CheckCircle2), إجمالي الإيرادات (staff.totalRevenue, formatEGP, Wallet), التقييم (rating/٥ with hint showing completedAppointments count), نسبة العمولة (staff.commissionPct%).
- Commission card (border-primary/30 bg-primary/5): "عمولة هذا الشهر" with big number (formatEGP), computed as `monthRevenue * commissionPct / 100` where monthRevenue = sum of paid txns this month for this staff. Plus 3 CommissionRow items: نسبة العمولة, مواعيد هذا الشهر, متوسط العمولة/موعد.
- Monthly performance BarChart (lg:col-span-2): last 6 months, XAxis=month (reversed for RTL), YAxis=k formatter (orientation="right"), Bar with 6 colored cells (CHART_BARS palette of emerald-family hexes), Tooltip with formatEGP. Visual floor blended with real data so chart always has visible bars.
- "الخدمات الأكثر تقديماً" list: top 5 services from staff.serviceIds sorted by popularity, each with rank circle, name, progress bar (popularity/145), count.
- "رضا العملاء" panel: rating big number with star icon, then 5-row breakdown (5★..1★) with progress bars colored emerald for 4-5★, gold for 3★, red for 1-2★, and count column.

## Design & compliance
- All Arabic right-aligned. Latin codes (phone, email, time ranges, datetime, codes, time inputs) wrapped with `dir="ltr"`.
- Brand spec: Deep Emerald #003527 primary, Cream bg, Playfair display headings (font-display class), Cairo body, tabular numbers (.tnum).
- Cards: `rounded-lg border border-border bg-card p-5` with `card-hover` lift.
- Tables/lists use divide-y borders. Section titles use SectionTitle component (uppercase tracking-wider text-xs).
- No indigo/blue. No gradients. Subtle hover lifts only.
- Responsive: customer portal optimized for mobile (grid stacks at sm/md/lg), staff portal for tablet+ (week schedule horizontally scrolls on small screens, min-w-[900px]).
- shadcn components used: Button, Input, Label, Tabs (full set), Select (full set), Dialog (full set).
- Sonner toasts for booking success/error, appointment status changes.
- Charts: recharts BarChart with RTL conventions (reversed XAxis, right-oriented YAxis, RTL Tooltip style).

## Verification
- `npx eslint src/components/views/customer-portal.tsx src/components/views/staff-portal.tsx` → 0 errors, 0 warnings.
- `npx tsc --noEmit --skipLibCheck` → no errors in either new file (other pre-existing errors in examples/, skills/, layout.tsx, seed-data.ts are out of scope).
- `bun run lint` → only the pre-existing app-shell.tsx setState-in-effect error noted by previous agents (out of scope, left untouched). Both new files lint cleanly.
- Dev server recompiles successfully after each edit.

## Notes
- CustomerPortal's BookingDialog fully wires to `createAppointment` with proper validation (staff working hours + availability) via store actions `isStaffWorking` and `checkAvailability`. The confirm button disables if there are warnings.
- StaffPortal's StaffPerformanceView carefully orders all hooks before the early return for `!staff` to comply with rules-of-hooks (initially triggered a lint error which was fixed by restructuring).
- StaffPortal's StaffScheduleView computes the Egyptian-week Saturday as weekStart so the 7-day grid always aligns Sat→Fri.
- CustomerPortal's MyOffersView computes "birthday within 30 days" using real Date math against `customer.birthday`.
- Both portals gracefully handle missing user (e.g., direct navigation without login) with an EmptyState.
