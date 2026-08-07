# Lumière Beauty — Work Log

Shared worklog for the Beauty Center Management demo build.
All agents MUST read this before working and append their section after.

---
Task ID: 0
Agent: main
Task: Foundation — design system, types, seed data, store

Work Log:
- Removed old spec files (spec-data.ts, sidebar-nav.tsx, spec/ui.tsx)
- Set up design system in globals.css: Deep Emerald (#003527) + Cream (#fbf8fc) palette, Playfair Display + Cairo fonts, RTL support, floating labels, card hover, nav active bar
- Set up layout.tsx with lang="ar" dir="rtl", Cairo + Playfair Display + Geist Mono fonts
- Created src/lib/types.ts with full domain model (User, Staff, Service, Customer, Appointment, Product, Transaction, Loyalty, Membership, Segment, Campaign, Notification, Automation)
- Created src/lib/seed-data.ts: 2 branches, 4 demo users, 7 staff, 15 services, 32 customers, 56+ appointments (32 today), 20 products, 110 transactions, loyalty ledger, 3 membership plans, 6 segments, 4 campaigns, 8 notifications, 6 automation rules
- Created src/lib/format.ts: Arabic EGP/date/time formatting, Egyptian week (Sat=0), relative time
- Created src/lib/store.ts: Zustand store with localStorage persistence, login/logout, view navigation, appointment creation (with conflict + working-hours checks), transaction creation (updates customer spend/visits/loyalty/timeline + appointment status), notes, stock adjustments, points redemption, notifications, segments auto-recount

Stage Summary:
- Foundation complete. Brand: "Lumière Beauty" / "لوميير بيوتي"
- Demo accounts: owner@/reception@/staff@/customer@beauty-demo.com (password: Demo123!)
- Store exposes: useApp (state + actions), useCurrentUser()
- View IDs cover all 4 role experiences (owner 11 modules, reception 5, staff 5, customer 6)
- Ready for: login screen, app shell, and view components

---
Task ID: 8a
Agent: subagent-services-staff
Task: Build Services + Staff views

Work Log:
- Read worklog.md and architecture context (store, types, format helpers, shared UI primitives, existing customer-view pattern)
- Inspected seed-data.ts for Staff and Service shapes (7 staff incl. reception, 15 services across 7 categories with popularity + cost)
- Wrote src/components/views/services-view.tsx:
  - PageHeader with subtitle (total services count) + تصدير / خدمة جديدة actions
  - 4 StatCards (إجمالي الخدمات، الخدمات النشطة، متوسط السعر، إجمالي الحجوزات) — computed on full set via useMemo
  - Filter bar: Search by name (right-aligned icon) + native <select> for category (الكل + 7 categories mapped to Arabic labels)
  - Responsive grid (1/2/3 cols) of ServiceCard components:
    - Name (font-display, font-semibold), description (line-clamp-2)
    - Category pill colored with brand-specific hex per category codes
    - Price (font-display, font-bold, text-primary, formatEGP, "/ جلسة")
    - Meta grid: Clock + duration min, UserCog + staff count, TrendingUp + popularity, status badge (نشط success / غير نشط neutral)
    - Footer: cost of materials (tnum) + تعديل ghost button
  - EmptyState when no matches
- Wrote src/components/views/staff-view.tsx:
  - PageHeader with subtitle (total staff count) + جدول المناوبات / موظف جديد actions
  - 4 StatCards (إجمالي الموظفين، الأخصائيون النشطون، متوسط التقييم، إجمالي الإيرادات)
  - Filter bar: Search by name/role/email + native <select> for status (الكل، نشط، في إجازة، غير نشط)
  - Responsive grid (1/2/3 cols) of StaffCard components (whole card clickable + keyboard accessible):
    - Avatar (uses staff.color, size lg) + name (font-display) + role + status badge + branch name (MapPin)
    - 5 rating stars (gold fill = round(rating)) + numeric rating + commission %
    - Phone + email (dir="ltr" for Latin identifiers)
    - Services count (Scissors) + working days range summary (CalendarClock) + time range (Clock, dir="ltr")
    - Stats: completedAppointments + totalRevenue (formatEGP)
    - عرض الجدول outline button (stopPropagation to avoid double-trigger)
  - StaffScheduleDialog (radix Dialog, sm:max-w-2xl):
    - Header: Avatar + name + role — branch + status badge
    - Quick stats grid (rating, completed appts, revenue)
    - Working hours banner (range + time range)
    - Weekly schedule table (7 rows Sat..Fri): day name | عمل/إجازة badge | hours or "—"
    - Services list (scrollable, max-h-56) with checkmark + name + duration + price
    - Contact footer (phone + email)
  - summarizeWorkingHours() helper: detects longest consecutive working-day run using WEEKDAYS_AR; picks most-common start/end pair for time range
- Verified both files lint cleanly (`npx eslint` exit 0). Dev server recompiles successfully.
- Note: a pre-existing lint error exists in src/components/app/app-shell.tsx (setState-in-effect) — out of scope for this task, left untouched.

Stage Summary:
- ServicesView: complete premium catalog with 4 stat cards, search + category filter, responsive service-card grid showing category pill, duration, price, staff count, popularity, status, edit action
- StaffView: complete team directory with 4 stat cards, search + status filter, responsive staff-card grid with avatar, rating stars, contact, branch, services count, working-hours summary, performance stats, and a detailed schedule Dialog (weekly table + services list + contact)
- Both views follow the brand spec: Arabic RTL, Deep Emerald #003527 primary, Cream bg, Playfair display headings, tabular numbers, card-hover lift, border-only table dividers, uppercase tracking-wider section titles, no indigo/blue, no gradients
- All text in Arabic; Latin identifiers (phone, email, time ranges) wrapped with dir="ltr"
- Empty states provided for both views when filters return no matches

---
Task ID: 8b
Agent: subagent-inventory-loyalty
Task: Build Inventory + Loyalty views

Work Log:
- Read worklog.md (Task 0 + 8a foundation) and architecture context (store, types, format helpers, shared UI primitives, services-view/staff-view patterns, sonner Toaster already mounted in layout.tsx)
- Inspected seed-data.ts for Product shape (20 products across 7 categories with stock, lowStockThreshold, unitCost, unitPrice, supplier), LoyaltyRule (pointsPerEgp=1, minRedeemPoints=50, pointsToEgpRate=1), LoyaltyLedgerEntry (60 earn entries from transactions), MEMBERSHIP_PLANS (basic/gold/vip with color + perks), SEGMENTS (6 deterministic rule-based segments with count), and CUSTOMERS[0] override mapping to logged-in customer (u_customer → c1, gold tier)
- Wrote src/components/views/inventory-view.tsx:
  - PageHeader "المخزون" / "إدارة المنتجات والمستلزمات" + تصدير + منتج جديد actions
  - 4 StatCards (إجمالي المنتجات, قيمة المخزون via sum(stock*unitCost), منتجات منخفضة, تنبيهات) computed on full set via useMemo
  - Filter bar: Search by name/SKU (right-aligned icon) + native <select> for category (الكل + 7 categories mapped to Arabic labels)
  - Responsive inventory table (min-w-[920px] + overflow-x-auto): المنتج (colored icon + name + cat label), SKU (mono ltr badge), المخزون (− button + bold tnum number + + button, calls adjustStock; floor 0), الحالة (متوفر success / مخزون منخفض warning), التكلفة (unitCost), السعر (unitPrice), الربح (unitPrice−unitCost in emerald), المورد
  - Low-stock rows highlighted with bg-amber-50/60 and amber hover; disabled − button when stock=0
  - Toast notifications via sonner on +/− adjustment (success on change, error on floor-0 attempt, warning when result is at/below threshold)
  - Sticky amber summary footer card showing total low-stock count + إنشاء أمر شراء button (visual)
  - EmptyState when no products match the search/category filters
  - Reusable Th helper for table headers (uppercase tracking-wider text-xs)
- Wrote src/components/views/loyalty-view.tsx:
  - PageHeader "الولاء والعضويات" / "برنامج النقاط وعضويات العملاء" (or customer-context subtitle) + استبدال نقاط action button (owner/reception only)
  - Customer-context narrowing: when useCurrentUser().role === "customer", filters customers → [me] and ledger → own entries only; hides segments panel and redeem button; shows personal balance card instead of top-customers list
  - Tabs component with 3 tabs: نظرة عامة / العضويات / سجل النقاط
  - Tab 1 (نظرة عامة):
    * 4 StatCards: إجمالي النقاط الموزعة (sum of positive ledger), نقاط مستبدلة (abs of negative), عملاء نشطون (loyaltyPoints>0), متوسط النقاط/عميل
    * Loyalty rule card: نقطة لكل ١٠٠ ج.م / الحد الأدنى للاستبدال: ٥٠ نقطة / قيمة النقطة: ١ ج.م (read from store.loyaltyRule)
    * For staff/owner: Top 5 customers by loyaltyPoints list (rank badge + Avatar colored by tier + name + tier label + points + tier badge)
    * For customer-context: Personal balance card (border-primary/30 bg-primary/5) with 5xl points number, tier badge, total spend, visit count, points value
    * Segments panel (staff/owner only): responsive grid of SegmentCard with colored right border (segment.color), name, description, big count number, rule code (mono ltr)
  - Tab 2 (العضويات): 3 MembershipCard side-by-side (basic/gold/vip), each with colored top strip, name (font-display), price + "/سنة", duration months, 2-col grid (discount % + free services/month), priority booking row (Check/X), perks list with check icons, تعديل الخطة button. VIP card uses border-primary + bg-primary/5 + "الأكثر شعبية" badge. Marks current tier if customer-context.
  - Tab 3 (سجل النقاط):
    * Filter bar: Select (shadcn) for customer + 3-button toggle for type (all/earn/redeem) + result count
    * Table (max-h-[600px] overflow-y-auto thin-scroll, sticky thead): التاريخ (formatDateTime), العميل (name lookup), النوع (مكتسب success / مستبدل warning / تعديل neutral badges), النقاط (+/- colored emerald/amber tnum), السبب
    * EmptyState when no ledger entries match
    * Customer-context read-only note at bottom
  - RedeemDialogButton component: Dialog with Select customer (only eligible = loyaltyPoints ≥ 50), points input (number, min=50, max=customer's balance, dir=ltr text-end), reason input; shows live points-value preview; validates and calls redeemPoints(customerId, points, reason); shows success/error toast; resets state on close
  - TIER_LABELS, TIER_BADGE_VARIANT, TIER_ICON maps for consistent tier presentation
- Verified both files lint cleanly (`bun run lint` shows only the pre-existing app-shell.tsx setState-in-effect error noted in Task 8a — out of scope, left untouched)

Stage Summary:
- InventoryView: complete premium inventory table with 4 stat cards, search + category filter, responsive horizontally-scrollable table, +/- stock controls wired to adjustStock with toast feedback, low-stock amber row highlighting + summary card, profit column in emerald, supplier column, empty state
- LoyaltyView: complete loyalty dashboard with customer-context narrowing (customer sees own info only), 3-tab interface (overview/memberships/ledger), 4 stat cards, loyalty rule card, segments panel with colored borders, top-5 customers list, 3 membership plan cards with VIP highlight, full ledger table with customer + type filters and thin-scroll max-height, redeem dialog wired to redeemPoints with validation and toast
- Both views follow the brand spec: Arabic RTL, Deep Emerald #003527 primary, Cream bg, Playfair display headings, tabular numbers, card-hover lift, border-only table dividers, uppercase tracking-wider section titles, no indigo/blue, no gradients, shadcn/ui components used (Tabs, Select, Dialog, Input, Label, Button)
- All text in Arabic; Latin identifiers (SKU, dates with Latin digits, code rules) wrapped with dir="ltr"
- Empty states provided for both views when filters return no matches

---
Task ID: 8c
Agent: subagent-marketing-reports
Task: Build Marketing + Reports views

Work Log:
- Read worklog.md (Tasks 0, 8a, 8b) and architecture context (store.ts, types.ts, format.ts, seed-data.ts, shared/ui.tsx, dashboard-view.tsx chart patterns, inventory/loyalty view Dialog patterns)
- Inspected seed-data.ts: 4 CAMPAIGNS (sms/email/whatsapp/push across scheduled/completed/running), 6 SEGMENTS with deterministic rules + counts + colors, 7 STAFF (6 specialists with revenue/rating/commission), 15 SERVICES across 7 categories, 110 TRANSACTIONS, 56+ APPOINTMENTS, 20 PRODUCTS, 32 CUSTOMERS
- Wrote src/components/views/marketing-view.tsx:
  - PageHeader "التسويق" / "الحملات والشرائح" + حملة جديدة action button
  - Tabs (3): الحملات / الشرائح / القوالب
  - Tab 1 (الحملات): 4 StatCards (إجمالي الحملات, حملات جارية [running+scheduled], رسائل مرسلة [sum sentCount], معدل الاستجابة [sum responded / sum sent * 100 %]); sorted campaign grid (running → scheduled → draft → completed → cancelled) with CampaignCard each
  - CampaignCard: name (font-display), segment name lookup, scheduled date, channel badge (colored per channel: sms/email/whatsapp/push with icon + Arabic label), status badge (draft/scheduled/running/completed/cancelled mapped to Arabic + variant), message preview (line-clamp-2), 3-col stats grid (sent/opened/responded with icons), progress bar showing responded/sent ratio in primary emerald, footer with budget (formatEGP) + recipient count
  - Tab 2 (الشرائح): responsive 1/2/3 col grid of SegmentCard — name (font-display), description, rule code (mono dir="ltr" in muted bg), huge font-display count number colored with segment.color, colored 4px right border using segment.color, استهداف outline button (visual)
  - Tab 3 (القوالب): 4 visual template cards (رسالة عيد ميلاد / عرض موسمي / استعادة عميل / إطلاق خدمة) — each with icon, tag, channel badge, full message preview (RTL), استخدام القالب button (opens new campaign dialog + toast)
  - NewCampaignDialog (sm:max-w-2xl): name Input, segment Select (with counts), channel Select (sms/email/whatsapp/push Arabic labels), message Textarea (with char count), datetime-local schedule Input, budget Input (dir="ltr"); validates all fields with toast.error; on submit calls createCampaign({status:"scheduled", createdBy:user.id}) + toast.success + reset; aborts on validation failure
  - CHANNEL_META + STATUS_META maps for consistent channel colors and Arabic status labels
- Wrote src/components/views/reports-view.tsx:
  - PageHeader "التقارير" / "تحليلات الأداء والأعمال" + تصدير التقرير + طباعة action buttons (toast feedback)
  - Filter bar: 4-button date range toggle (آخر ٧ أيام / آخر ٣٠ يوم / هذا الشهر / هذا العام — default 30d) + branch Select (كل الفروع + 2 branches)
  - 8 sections in responsive layout:
    1. KPI summary (4 StatCards): إجمالي الإيرادات (sum paid txn.total), متوسط الفاتورة, إجمالي المواعيد, معدل الإلغاء %
    2. Revenue over time (full-width AreaChart, last 30d grouped by day, emerald area gradient, XAxis=reversed date formatDateShort, YAxis=k formatter, Tooltip shows formatEGP, RTL contentStyle)
    3. Revenue by category (horizontal BarChart, emerald #003527 bars, vertical layout, XAxis=k formatter, YAxis=Arabic category labels right-oriented)
    4. Appointments by status (PieChart donut, status colors exactly as spec: scheduled=#404944, confirmed=#003527, checked_in=#cca72f, in_progress=#735c00, completed=#0b513d, cancelled=#ba1a1a, no_show=#5f5e5b; legend grid below with Arabic labels + counts)
    5. Staff performance table (sortable visually by revenue desc): Avatar+name+role | completed appts (count from appointments where status=completed and service.staffId matches) | revenue (sum of paid transactions.staffId) | rating (Star icon + tnum) | commissionPct (Badge)
    6. Top services (vertical BarChart, top 5 services by transaction count, emerald #0b513d bars, XAxis=service names rotated -15°)
    7. Customer retention (LineChart, last 6 months, two lines: new (joinedAt in month) vs returning (lastVisit in month & visitCount>1) using MONTHS_AR labels, emerald #003527 + #95d3ba lines, RTL Legend)
    8. Inventory value (top 5 products by stock*unitCost, table with rank #/name/SKU, stock, unitCost, value, share bar with %)
  - CHART_TOOLTIP_STYLE constant: direction:"rtl", Cairo font, rounded border
  - Reusable Th helper for table headers (uppercase tracking-wider text-xs)
  - All charts use RTL conventions: XAxis reversed where appropriate, YAxis orientation="right"
- Verified: `bun run lint` shows only the pre-existing app-shell.tsx setState-in-effect error (noted in Task 8a — out of scope, left untouched). Direct eslint on the two new files passes with zero errors/warnings. Dev server recompiles successfully.

Stage Summary:
- MarketingView: complete premium marketing dashboard with 3-tab interface (campaigns/segments/templates), 4 stat cards, new-campaign Dialog wired to createCampaign with full validation + toast feedback, campaign cards showing channel badge + status + sent/opened/responded stats + progress bar + budget, segment cards with colored right border + mono rule + huge count, 4 visual template cards with previews
- ReportsView: complete analytics dashboard with date-range + branch filter bar, 8 sections covering KPI summary, revenue-over-time area chart, category-revenue horizontal bar chart, appointment-status pie chart with full status color spec, staff performance table, top-services vertical bar chart, 6-month customer retention line chart, top-5 inventory value table
- Both views follow brand spec: Arabic RTL throughout, Deep Emerald #003527 primary, Cream bg, Playfair display headings, tabular numbers, card-hover lift, border-only divide-y tables with uppercase tracking-wider headers, emerald chart palette (#003527, #95d3ba, #cca72f, #5f5e5b, #735c00, #0b513d), no indigo/blue, no gradients (chart area fills only), all chart Tooltips direction:"rtl" with Cairo font
- All text in Arabic; Latin identifiers (SKU codes, schedule datetimes, rule code expressions) wrapped with dir="ltr"
- Empty states provided where appropriate (no campaigns, no appointments in range)

---
Task ID: 8d
Agent: subagent-settings-notifications
Task: Build Settings + Notifications views

Work Log:
- Read worklog.md (Tasks 0, 8a, 8b, 8c) and architecture context (store.ts: branches, automationRules, notifications, toggleAutomation, markNotificationRead, markAllNotificationsRead, setView; types.ts: AutomationRule, AppNotification, NotificationType, Branch; format.ts: relativeTime, WEEKDAYS_AR; shared/ui.tsx: PageHeader, SectionTitle, Badge, EmptyState; shadcn Switch/Tabs/Input/Label/Button/Checkbox; sonner toast already mounted)
- Inspected seed-data.ts: BRANCHES (2: زمالك main + نيوباي), AUTOMATION_RULES (6 rules: تذكير قبل الموعد، تأكيد الحجز، تنبيه مخزون، عيد ميلاد، عميل غير نشط [disabled], مضاعفة نقاط المميزين), NOTIFICATIONS (8 entries across all 7 types with severity info/success/warning)
- Wrote src/components/views/settings-view.tsx:
  - PageHeader "الإعدادات" / "إدارة النظام والقواعد" + حفظ الكل outline action
  - Tabs (5): النشاط التجاري / الفروع / الأدوار والصلاحيات / قواعد الأتمتة / قواعد الإشعارات — each trigger has lucide icon
  - Tab 1 (business): 3 stacked cards in rounded-lg border-border bg-card p-5 style
    * "معلومات المركز": 8-field form (name, legal name, tax number [dir ltr tnum], currency, timezone [Globe icon dir ltr], phone [Phone icon dir ltr], email [Mail icon dir ltr], address) — 2-col responsive grid, all prefilled with لوميير بيوتي / شركة لوميير للجمال ش.م.م / ٣٠٠-٤٢١-٨٨٩ / ج.م / Africa/Cairo / +20 2 2735 0001 / info@lumiere-beauty.com; "حفظ التغييرات" button → toast.success
    * "ساعات العمل": horizontal-lines table (Sat..Fri Egyptian week via WEEKDAYS_AR) with time inputs (dir ltr tnum) + Switch per row for مغلق state; disabled when off; "حفظ" button → toast
    * "ضريبة القيمة المضافة": Switch for enabled + percentage Input with ٪ suffix (default 14), disabled when off; "حفظ" button → toast
  - Tab 2 (branches): grid (1/2 cols) of branch cards from store.branches; each card has icon, name (font-display) + "الفرع الرئيسي" badge if isMain, address, manager + phone (dir ltr tnum) in 2-col grid, تعديل + إدارة buttons (visual); "إضافة فرع" button at top
  - Tab 3 (roles): single card with role × module matrix table
    * 12 columns (لوحة القيادة، التقويم، العملاء، المواعيد، الخدمات، الموظفون، نقطة البيع، المخزون، الولاء، التسويق، التقارير، الإعدادات) + role col + notes col
    * 5 role rows (owner=المالك with Crown, manager=المدير with Briefcase, reception=الاستقبال with ConciergeBell, staff=الأخصائي with UserRound, customer=العميل with UserRound) — each with icon + label + desc
    * Cells: emerald Check icon if role.access includes module, muted Minus icon if not
    * Owner: all 12 ✓. Manager: 11 ✓ (no settings). Reception: 5 ✓ (dashboard, calendar, customers, appointments, pos). Staff: all dashes + portal note "بوابة الأخصائي: مواعيد اليوم، العملاء، الجدول، الأداء". Customer: all dashes + portal note "بوابة العميل: حجز موعد، مواعيدي، حسابي، عروضي"
    * Header row colored: bg-primary/5 + text-primary uppercase tracking-wider text-xs
    * Legend below table explaining ✓/— and portal note for staff/customer
    * Horizontally scrollable (min-w-[920px] overflow-x-auto) for mobile
  - Tab 4 (automation): card with divide-y list of automationRules from store; each row shows name + enabled/disabled badge, trigger + action with • separator, Switch bound to toggleAutomation(id) with toast feedback ("{name} — تم التفعيل/تم الإيقاف"); "قاعدة جديدة" button at top
  - Tab 5 (notifications): card with divide-y list of 6 notification rule types (تذكير قبل الموعد، تأكيد الحجز، تنبيه المخزون المنخفض، عيد ميلاد العميل، العميل غير النشط [initially disabled], إنجاز الولاء); each row has name + desc + enable Switch (local state) + 4 channel Checkboxes (SMS، بريد، واتساب، داخل التطبيق) with local state; channels disabled when rule is off; "حفظ القواعد" button at top
- Wrote src/components/views/notifications-view.tsx:
  - PageHeader "مركز التنبيهات" / subtitle showing unread count (or "كل الإشعارات مقروءة" if 0) + "تحديد الكل كمقروء" button calling markAllNotificationsRead + toast (disabled when 0 unread; toast.info if 0)
  - Filter pills (rounded-full border buttons): الكل / غير مقروء / تذكير موعد / مخزون / ولاء / عملاء — each shows count badge; active = bg-primary text-primary-foreground
  - Filter logic: all = everything; unread = !read; appointment = appointment_reminder; stock = low_stock; loyalty = loyalty_milestone; customers = customer_birthday + inactive_customer + booking_confirmation + campaign_sent
  - List: single card with divide-y ul; each notification is a button with:
    * 4px right border (RTL leading edge) colored by severity (info=#404944, success=#0b513d, warning=#cca72f, error=#ba1a1a) via inline style
    * Icon circle (size-10 rounded-full) with severity-tinted background (color + 1a alpha) and color text; icon per type: appointment_reminder=Clock, booking_confirmation=CheckCircle, low_stock=Package, customer_birthday=Cake, inactive_customer=UserX, loyalty_milestone=Gift, campaign_sent=Megaphone
    * Title (font-semibold truncate) + body (text-sm text-muted-foreground line-clamp-2) + relativeTime (text-xs) on opposite side
    * Unread: bg-primary/[0.03] + size-2 dot indicator next to title
    * Click marks as read via markNotificationRead(id)
  - EmptyState when filtered.length === 0 (Inbox icon + contextual description)
  - Footer summary showing "عرض X من أصل Y إشعار" + unread count indicator
- Verified: `bun run lint` shows only the pre-existing app-shell.tsx setState-in-effect error (noted in Task 8a — out of scope, left untouched). Direct eslint on both new files passes with zero errors/warnings. Dev server recompiles successfully.

Stage Summary:
- SettingsView: complete 5-tab settings dashboard (business/branches/roles/automation/notification rules) with prefilled business form, working-hours table with per-day Switch, VAT card with toggle + percentage, branch cards grid with main-branch badge, role×module permission matrix with colored headers + emerald checkmarks + staff/customer portal notes, automation rules wired to toggleAutomation with toast feedback, notification rule cards with per-type enable Switch + 4 channel Checkboxes
- NotificationsView: complete notifications center with unread-count subtitle, "mark all read" button wired to markAllNotificationsRead, 6 filter pills with live counts, severity-colored (info/success/warning/error) notification cards with type-specific icons in tinted circles, 4px severity right-border (RTL leading edge), unread dot + bg-primary/3 emphasis, click-to-mark-read, EmptyState when filter empty, footer summary
- Both views follow brand spec: Arabic RTL throughout, Deep Emerald #003527 primary, Cream bg, Playfair display headings, tabular numbers, card-hover lift, border-only divide-y tables with uppercase tracking-wider headers, no indigo/blue, no gradients, shadcn/ui components used (Tabs, Switch, Input, Label, Button, Checkbox)
- All text in Arabic; Latin identifiers (phone, email, tax number, timezone, time inputs) wrapped with dir="ltr"
- Empty states provided for NotificationsView when filter returns no matches

---
Task ID: 8e
Agent: subagent-portals
Task: Build Customer + Staff portals

Work Log:
- Read worklog.md (Tasks 0, 8a, 8b, 8c, 8d) and architecture context (store.ts: view/setView, customers/appointments/services/staff/transactions/memberships/campaigns, createAppointment with conflict+working-hours checks, updateAppointmentStatus, checkAvailability, isStaffWorking, openCustomer; types.ts: Customer.timeline, Staff.workingHours/commissionPct/rating, Appointment.services; format.ts: WEEKDAYS_SHORT_AR, MONTHS_AR, dayName, isSameDay, formatDate/Short/Time/DateTime; shared/ui.tsx: PageHeader, SectionTitle, StatCard (hint:string), Badge, EmptyState, StatusBadge, Avatar; shadcn Tabs/Select/Dialog/Input/Label/Button; recharts for charts; sonner toast already mounted)
- Inspected seed-data.ts: CUSTOMERS[0] override → c1 (سلمى يوسف, gold tier, favoriteStaffId=st1, assignedStaffId=st1); STAFF st1 (مريم حسن, أخصائية شعر, 4.9 rating, 15% commission, serviceIds sv1/sv2/sv3/sv15); SERVICES 15 across 7 categories with popularity; CAMPAIGNS 4 with scheduled/running/completed; MEMBERSHIP_PLANS basic/gold/vip
- Wrote src/components/views/customer-portal.tsx — `CustomerPortal` switches on `view`:
  - Guard: EmptyState if user.role !== "customer"
  - **my_profile** (`MyProfileView`): hero card (Avatar lg tier-color, name font-display 2xl, tier Badge with icon, Phone/Mail/Cake contact dir="ltr"), 4 StatCards (نقاط الولاء/إجمالي الزيارات/إجمالي الإنفاق formatEGP/العضوية), membership card (plan name, perks Check list, expiry formatDateShort, "ترقية العضوية" button → my_offers), quick actions card (3 QuickAction rows: حجز موعد→book_appointment, عرض العروض→my_offers, مواعيدي→my_appointments, with ArrowLeft), recent activity timeline (last 5 from customer.timeline with EVENT_ICON map per type)
  - **book_appointment** (`BookAppointmentView`): PageHeader + category grid (7 cards with colored tiles per CATEGORY_COLORS hex + count), service list for active category (ServiceCard with name, category pill, description, duration+staff count, price font-display text-primary, "احجزي" Button), top-5-services-by-popularity horizontal-lines list with rank circle + TrendingUp, BookingDialog (Dialog sm:max-w-lg): staff Select (filtered to service.staffIds), date Input type=date dir="ltr" default tomorrow, time Input type=time dir="ltr" default "11:00", summary card, amber warnings for !isStaffWorking/!checkAvailability with AlertCircle, confirm button disabled on warnings; on confirm calls createAppointment with computed ISO start/end + branchId:branches[0].id + createdBy:user.id, toast.success on ok + setView("my_appointments"), toast.error on failure
  - **my_appointments** (`MyAppointmentsView`): Tabs (القادمة/السابقة/الملغاة) with count badges; upcoming filters scheduled/confirmed/checked_in/in_progress with start>=now; past filters completed OR (end<now AND not cancelled/no_show); cancelled filters cancelled/no_show; AppointmentCard with time block (font-display 2xl formatTime + formatDateShort + range dir="ltr"), service name + StatusBadge, staff name + role, code dir="ltr", cancellation reason, price font-display text-primary, action button (إلغاء الموعد outline for upcoming scheduled/confirmed → updateAppointmentStatus(id,"cancelled",{cancellationReason:"بناءً على طلب العميل"}) + toast; إعادة الحجز for completed/cancelled → setView("book_appointment")); EmptyState per tab with action for upcoming
  - **my_offers** (`MyOffersView`): personalized OfferCard grid (خصم عيد الميلاد BDAY20 ٢٠٪ if birthday within 30 days computed via Date math, عرض العضوية الذهبية VIP30 ٣٠٪ if tier!=vip, كوبون أول حجز WELCOME15 ١٥٪ if visitCount<=2, خدمة مجانية عند الإحالة REFER مجاناً) — each card with colored top strip + icon tile + tag Badge + title font-display + discount font-display text-primary + code mono ltr + optional استخدم العرض button; active campaigns (status=running OR scheduled) cards with name + StatusBadge + message line-clamp-3 + scheduled date + sent count; membership upgrade CTA card (border-primary/30 bg-primary/5) showing next-tier membership with icon tile + name + description + ترقية الآن button → setView("loyalty")
- Wrote src/components/views/staff-portal.tsx — `StaffPortal` switches on `view`:
  - Guard: EmptyState if user.role !== "staff"
  - **staff_today** (`StaffTodayView`): PageHeader with today's date (dayName + formatDate), 4 StatCards (مواعيد اليوم/مكتملة with % delta/قادمة/إيراد اليوم formatEGP from today's paid txns where staffId matches), today's appointment list filtered to staff's appointments AND isSameDay(start, today) sorted asc; TodayAppointmentRow with time block (font-display 2xl formatTime + end arrow dir="ltr"), customer button (Avatar tier-color → openCustomer), service name, StatusBadge + action button (بدء PlayCircle for scheduled/confirmed/checked_in → updateAppointmentStatus(id,"in_progress") + toast; إتمام CheckCircle2 for in_progress → updateAppointmentStatus(id,"completed") + toast; Badge منجزة for completed); EmptyState if no appointments today
  - **staff_customers** (`StaffCustomersView`): PageHeader "عملائي" with count subtitle, Search Input (right-aligned Search icon) filtering by name/phone/email, myCustomers via useMemo union of (assignedStaffId===staffId OR favoriteStaffId===staffId OR have appointments with this staff), grid (1/2/3 cols) of MyCustomerCard with Avatar lg tier-color + name + tier Badge + appointment count badge, contact (Phone + Mail dir="ltr"), 3-col stats grid (زيارات/الإنفاق formatEGP/آخر زيارة formatDateShort), عرض الملف outline button → openCustomer; EmptyState if no matches
  - **staff_schedule** (`StaffScheduleView`): PageHeader "جدولي الأسبوعي" with week range subtitle; all hooks (useApp + useMemo for weekStart/weekDays) BEFORE the !staff early return (rules-of-hooks compliance); weekStart = Saturday of Egyptian week (computed via (getDay()+1)%7); 3 StatCards (مواعيد الأسبوع/إجمالي الساعات from end-start diff/الإيراد المتوقع from non-cancelled service prices); 7-day columns grid (min-w-[900px] thin-scroll overflow-x-auto on mobile) — each column: weekday short name (WEEKDAYS_SHORT_AR) + day number font-display, today highlighted border-primary, working hours banner (Clock + start—end dir="ltr" tnum) at top if not off, "إجازة" pill if off, list of day's appointments (filtered to staff + same day, sorted asc) with start time font-bold tnum + customer name + service name + StatusBadge
  - **staff_performance** (`StaffPerformanceView`): PageHeader "أدائي"; all hooks (useApp + useMemo for monthlySeries) BEFORE the !staff early return; 4 StatCards (إجمالي المواعيد المكتملة staff.completedAppointments/إجمالي الإيرادات formatEGP staff.totalRevenue/التقييم rating/٥ with hint string/نسبة العمولة staff.commissionPct%); commission card (border-primary/30 bg-primary/5) with عمولة هذا الشهر big number formatEGP = monthRevenue*commissionPct/100 + 3 CommissionRow items (نسبة العمولة/مواعيد هذا الشهر/متوسط العمولة/موعد); monthly performance BarChart (lg:col-span-2) last 6 months with XAxis reversed for RTL + YAxis right-oriented + k formatter + 6 colored cells (CHART_BARS emerald-family palette) + RTL Tooltip with formatEGP, visual floor blended with real data so bars always visible; "الخدمات الأكثر تقديماً" list of top 5 services from staff.serviceIds sorted by popularity with rank circle + name + progress bar + count; "رضا العملاء" panel with rating big number + star icon + 5-row breakdown (5★..1★) with progress bars colored emerald for 4-5★/gold for 3★/red for 1-2★ + count column
- Fixed rules-of-hooks violation in StaffPerformanceView (initial lint error at line 680: useMemo called after early return for !staff) by moving all hooks before the early return and computing monthlyCommission with `staff ? Math.round(...) : 0` guard
- Fixed TS error at line 754 (Type 'Element' is not assignable to type 'string' for StatCard hint prop) by replacing JSX hint with string `${formatNumber(staff.completedAppointments)} تقييم`
- Removed now-unused StarRow helper function from staff-portal.tsx
- Verified: `npx eslint src/components/views/customer-portal.tsx src/components/views/staff-portal.tsx` → 0 errors/0 warnings. `npx tsc --noEmit --skipLibCheck` → no errors in either new file. `bun run lint` shows only the pre-existing app-shell.tsx setState-in-effect error (noted in Task 8a — out of scope). Dev server recompiles successfully.

Stage Summary:
- CustomerPortal: complete 4-view customer experience (my_profile hero+stats+membership+quick actions+timeline, book_appointment categories+services+booking dialog wired to createAppointment with conflict+working-hours validation, my_appointments tabs with cancel/rebook actions wired to updateAppointmentStatus, my_offers personalized offers+campaigns+membership CTA) — elegant, friendly, less dense, mobile-first
- StaffPortal: complete 4-view specialist experience (staff_today stats+appointment list with start/complete actions wired to updateAppointmentStatus, staff_customers search+customer cards wired to openCustomer, staff_schedule weekly Sat-Fri grid with working hours and appointments, staff_performance stats+commission card+monthly BarChart+top services+satisfaction breakdown) — functional, efficient, tablet-friendly
- Both portals follow brand spec: Arabic RTL throughout, Deep Emerald #003527 primary, Cream bg, Playfair display headings, tabular numbers, card-hover lift, border-only divide-y, uppercase tracking-wider SectionTitle, no indigo/blue, no gradients, shadcn/ui components used (Tabs, Select, Dialog, Input, Label, Button), recharts BarChart in StaffPerformanceView with RTL conventions
- All text in Arabic; Latin identifiers (phone, email, time ranges, datetime, codes, time inputs) wrapped with dir="ltr"
- Empty states provided for all sub-views when no data (no appointments today, no customers match search, no upcoming/past/cancelled appointments, missing staff/customer)
- Single-route SPA pattern: each portal switches on `view` from Zustand store; navigation between sub-views via `setView` and cross-portal navigation via `openCustomer`

---
Task ID: 12
Agent: main
Task: Wire full demo flow + verify all accounts + responsive

Work Log:
- Fixed app-shell setState-in-effect lint error (removed redundant effect)
- Fixed type errors: Playfair Display subsets (removed "arabic"), SaleItem[] explicit typing in seed-data
- Ran lint: clean (0 errors). Ran tsc --noEmit: clean for src/
- Agent Browser verification (all 4 demo accounts):
  * Owner: dashboard with KPI cards + 4 charts + today's appointments + top services + customer activity — VLM rated 9/10
  * Owner → Calendar: month grid with appointments, day agenda, appointment detail dialog with status actions (تأكيد/وصول/بدء/إتمام/إلغاء/لم يحضر) — VLM rated 9/10
  * Owner → Customer profile: header with tier badge, contact, stats, favorites, membership perks, 4 tabs (timeline/appointments/payments/notes), interactive timeline
  * Owner → POS: customer select, service catalog grid, cart with qty controls, discount + loyalty redemption, payment dialog (cash/card/online), receipt with loyalty points earned
  * Receptionist: restricted to 5 modules (dashboard, calendar, customers, appointments, pos) — role-based access verified
  * Staff: portal with today's appointments (بدء/إتمام actions), my customers, weekly schedule, performance (commission, charts)
  * Customer: portal with profile, book appointment (category → service → dialog with staff/date/time → confirmed AP-1101), my appointments, offers, loyalty
- Full demo flow verified end-to-end:
  Login (owner) → Dashboard → Calendar → Appointment detail → Customer profile → Create appointment → POS payment (INV-2200, +27 points) → Customer loyalty updated (36 points) → Dashboard metrics updated
- Responsive verified: mobile (390px) hamburger menu + drawer, tablet, desktop (1440px)
- Charts (recharts) render with data in dashboard and reports

Stage Summary:
- All 16 views functional across 4 roles
- Demo flow (login → dashboard → calendar → appointment → customer → create appt → POS → payment → loyalty update → dashboard metrics) fully working
- Lint clean, typecheck clean, no runtime errors
- VLM visual ratings: 9/10 (dashboard, calendar)
- App is production-ready for the demo
