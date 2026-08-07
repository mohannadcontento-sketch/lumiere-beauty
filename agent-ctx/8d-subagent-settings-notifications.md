# Task 8d — subagent-settings-notifications

## Task
Build Settings + Notifications views for the Lumière Beauty Arabic RTL demo.

## Files created
1. `src/components/views/settings-view.tsx` — exports `SettingsView`
2. `src/components/views/notifications-view.tsx` — exports `NotificationsView`

## Architecture used
- Zustand store at `@/lib/store`: `useApp` for state + actions, `useCurrentUser` for logged-in user.
- Store fields used: `branches`, `automationRules`, `notifications`.
- Store actions used: `toggleAutomation(id)`, `markNotificationRead(id)`, `markAllNotificationsRead()`.
- Shared UI primitives: `PageHeader`, `SectionTitle`, `Badge`, `EmptyState`.
- shadcn/ui: `Button`, `Input`, `Label`, `Switch`, `Tabs` (+`TabsList`/`TabsTrigger`/`TabsContent`), `Checkbox`.
- Format helpers: `relativeTime`, `WEEKDAYS_AR`.
- Toast: `sonner` (already mounted in layout).
- Icons: `lucide-react`.

## SettingsView
- PageHeader "الإعدادات" / "إدارة النظام والقواعد" + "حفظ الكل" outline action.
- 5 Tabs:
  1. **النشاط التجاري** — three stacked cards:
     - "معلومات المركز" form (8 fields, prefilled: لوميير بيوتي / شركة لوميير للجمال ش.م.م / ٣٠٠-٤٢١-٨٨٩ / ج.م / Africa/Cairo / +20 2 2735 0001 / info@lumiere-beauty.com / address). Latin identifiers `dir="ltr"`. "حفظ التغييرات" → toast.
     - "ساعات العمل" table (Sat..Fri Egyptian week via `WEEKDAYS_AR`) with `type="time"` from/to inputs (dir ltr tnum) + per-row Switch for مغلق.
     - "ضريبة القيمة المضافة" card: enabled Switch + percentage Input (default 14%).
  2. **الفروع** — grid (1/2 cols) of branch cards from `store.branches`. Each: MapPin icon, name (font-display) + "الفرع الرئيسي" badge if isMain, address, manager + phone (dir ltr) in 2-col grid, تعديل/إدارة buttons. "إضافة فرع" button.
  3. **الأدوار والصلاحيات** — role × module matrix table. 12 module columns + role col + notes col. 5 role rows (المالك / المدير / الاستقبال / الأخصائي / العميل) each with icon + label + desc. Cells show emerald `Check` if access, muted `Minus` if not. Owner = all 12 ✓; Manager = 11 ✓ (no settings); Reception = 5 ✓ (dashboard, calendar, customers, appointments, pos); Staff & Customer = all dashes + portal note text. Colored headers (bg-primary/5 + text-primary uppercase). Horizontally scrollable on mobile.
  4. **قواعد الأتمتة** — divide-y list of `store.automationRules`. Each row: name + enabled/disabled badge, trigger + action, `Switch` bound to `toggleAutomation(id)` with toast feedback. "قاعدة جديدة" button.
  5. **قواعد الإشعارات** — divide-y list of 6 notification rule types (تذكير قبل الموعد، تأكيد الحجز، تنبيه المخزون المنخفض، عيد ميلاد العميل، العميل غير النشط، إنجاز الولاء). Each row: enable `Switch` (local state) + 4 channel `Checkbox`es (SMS، بريد، واتساب، داخل التطبيق). Channels disabled when rule off. "حفظ القواعد" button.

## NotificationsView
- PageHeader "مركز التنبيهات" / subtitle showing unread count + "تحديد الكل كمقروء" button (calls `markAllNotificationsRead()` + toast).
- Filter pills: الكل / غير مقروء / تذكير موعد / مخزون / ولاء / عملاء (each with live count badge; active = bg-primary text-primary-foreground).
- Filter logic: all = everything; unread = !read; appointment = appointment_reminder; stock = low_stock; loyalty = loyalty_milestone; customers = customer_birthday + inactive_customer + booking_confirmation + campaign_sent.
- List: single card with divide-y ul; each notification is a `<button>`:
  - 4px right border (RTL leading edge) colored by severity via inline style (info=#404944, success=#0b513d, warning=#cca72f, error=#ba1a1a).
  - Icon circle (size-10 rounded-full) with severity-tinted background (color + `1a` alpha) + icon per type (Clock/CheckCircle/Package/Cake/UserX/Gift/Megaphone).
  - Title (font-semibold truncate) + body (text-sm line-clamp-2) + relativeTime (text-xs).
  - Unread: `bg-primary/[0.03]` + size-2 dot next to title.
  - Click calls `markNotificationRead(id)`.
- EmptyState when filter returns no matches (Inbox icon + contextual description).
- Footer summary: "عرض X من أصل Y إشعار" + unread count.

## Design conformance
- Premium, minimal, luxury. NO indigo/blue. NO gradients. NO excessive rounded corners.
- Cards: `rounded-lg border border-border bg-card p-5`.
- Headings: `font-display`. Section subtitles: `SectionTitle`.
- Tables: horizontal lines only (divide-y), header uppercase tracking-wider text-xs.
- Numbers: `tnum`. Switches use `data-[state=checked]:bg-primary` (accent-primary).
- Responsive: mobile-first (grid-cols-1 → sm:grid-cols-2 → lg:grid-cols-2). Tables use overflow-x-auto with min-w.
- All Arabic right-aligned. Latin codes/emails/phone/tax-number/timezone/time inputs wrapped `dir="ltr"`.

## Verification
- `bun run lint` → only the pre-existing `app-shell.tsx` setState-in-effect error (noted in Task 8a, out of scope).
- Direct `npx eslint` on both new files → 0 errors, 0 warnings.
- Dev server recompiles successfully.
