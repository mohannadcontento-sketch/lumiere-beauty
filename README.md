<div dir="rtl">

# ✨ لوميير بيوتي — منصة إدارة صالونات التجميل

منصة متكاملة لإدارة مراكز التجميل، مبنية بـ **Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui**.
تجربة تفاعلية كاملة بأربعة أدوار مختلفة (المالكة، الاستقبال، الأخصائية، العميل) مع بيانات واقعية وسير عمل فعلي (موعد ← دفع ← نقاط ولاء ← تحديث لوحة التحكم).

> **ملاحظة:** هذا العرض التوضيحي يعمل بالكامل في المتصفح باستخدام `localStorage` — لا حاجة لقاعدة بيانات حقيقية. كل المنطق قائم على قواعد محددة (No AI).

---

## 🎯 حسابات الدخول التجريبية

كل الحسابات تستخدم نفس كلمة المرور: `Demo123!`

| الدور | البريد الإلكتروني | الوصول |
|------|-------------------|--------|
| 👑 **المالكة (Owner)** | `owner@beauty-demo.com` | كل الوحدات + التقارير + الإعدادات |
| 🧑‍💼 **الاستقبال (Reception)** | `reception@beauty-demo.com` | لوحة التحكم، المواعيد، العملاء، نقاط البيع، الإشعارات |
| 💅 **الأخصائية (Staff)** | `staff@beauty-demo.com` | جدولها اليومي، عملاؤها، الخدمات، نقاط البيع |
| 💎 **العميلة (Customer)** | `customer@beauty-demo.com` | ملفها، حجوزاتها، سجلها، نقاط الولاء، العروض |

---

## 🧩 الوحدات

### لوحة المالكة
- 📊 لوحة تحكم تنفيذية برسوم بيانية (إيرادات، مواعيد، عملاء جدد)
- 📅 تقويم المواعيد (يومي / أسبوعي / شهري)
- 👥 إدارة العملاء (CRM) مع الخط الزمني لكل عميلة
- 💇 إدارة الخدمات والأسعار
- 👩‍🔧 إدارة الأخصائيات ومواعيد العمل
- 🛒 نقاط البيع (POS) متعددة الخطوات
- 📦 إدارة المخزون
- 🎫 برنامج الولاء + العضويات
- 🧮 تقسيم العملاء (Segments) تلقائي
- 🔔 الإشعارات والأتمتة
- 📣 الحملات التسويقية
- 📈 التقارير المتقدمة
- ⚙️ الإعدادات

### بوابة الأخصائية (تابلت)
- جدول اليوم، إكمال الموعد، نقاط البيع، ملف العميل

### بوابة العميل (موبايل)
- حجز موعد، سجل الزيارات، نقاط الولاء، العروض

---

## 🔄 سير العمل التوضيحي

```
تسجيل الدخول ← لوحة التحكم ← التقويم ← اختيار موعد ← صفحة العميل
← إنشاء موعد جديد ← إكمال الموعد ← نقاط البيع ← الدفع
← تحديث نقاط الولاء ← تحديث مؤشرات لوحة التحكم
```

---

## 🛠️ التقنيات المستخدمة

| الفئة | الأداة |
|------|-------|
| Framework | Next.js 16 (App Router) + Turbopack |
| اللغة | TypeScript 5 |
| التنسيق | Tailwind CSS 4 |
| المكونات | shadcn/ui (New York) + Lucide Icons |
| الرسوم البيانية | Recharts |
| إدارة الحالة | Zustand (+ localStorage persistence) |
| الحركة | Framer Motion |
| RTL | دعم كامل للعربية من اليمين لليسار |
| الخطوط | Playfair Display + Cairo |

---

</div>

---

## 🚀 Local Development

```bash
# 1. Install dependencies
bun install

# 2. (optional) Copy env
cp .env.example .env

# 3. Run dev server
bun run dev
# → http://localhost:3000

# 4. Lint
bun run lint
```

> Requires Node.js 18.18+ and [Bun](https://bun.sh) (or npm/yarn/pnpm).

---

## ☁️ Deploy to Vercel (recommended)

This app is 100% static-client friendly and deploys to Vercel in one click.

### Option A — One-click via GitHub
1. Push this repo to GitHub (see below).
2. Go to **https://vercel.com/new**
3. Import your GitHub repo.
4. Framework preset: **Next.js** (auto-detected).
5. Leave Build Command & Output as default.
6. Click **Deploy** → live in ~60 seconds.

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```

### Option C — Other platforms
Works on **Netlify**, **Cloudflare Pages**, **Railway**, or any Node host that runs `next build`.

---

## 📦 Push to GitHub

```bash
# from project root
git init                # if not already
git add .
git commit -m "feat: Lumière Beauty management platform"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

Then create a **Personal Access Token** at  
https://github.com/settings/tokens (classic, scope: `repo`)  
and use it as the password when pushing — **never share tokens publicly!**

---

## 📂 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # RTL root layout, fonts
│   ├── page.tsx              # Entry (renders AppShell)
│   └── globals.css           # Design system + theme
├── components/
│   ├── ui/                   # shadcn/ui primitives
│   ├── auth/login-screen.tsx # Login with 4 demo roles
│   ├── app/                  # AppShell, Sidebar, Topbar
│   ├── shared/ui.tsx         # Shared UI helpers
│   └── views/                # 14 module views
│       ├── dashboard-view.tsx
│       ├── calendar-view.tsx
│       ├── customers-view.tsx
│       ├── customer-detail-view.tsx
│       ├── services-view.tsx
│       ├── staff-view.tsx
│       ├── pos-view.tsx
│       ├── inventory-view.tsx
│       ├── loyalty-view.tsx
│       ├── marketing-view.tsx
│       ├── reports-view.tsx
│       ├── notifications-view.tsx
│       ├── settings-view.tsx
│       ├── staff-portal.tsx
│       └── customer-portal.tsx
└── lib/
    ├── types.ts              # Domain model
    ├── seed-data.ts          # Realistic mock data
    ├── store.ts              # Zustand store + actions
    └── format.ts             # Arabic formatting helpers
```

---

## 📊 Mock Data Volume

- 2 فروع · 4 مستخدمين · 7 أخصائيات · 15 خدمة
- 32 عميلة · 56+ موعد (32 اليوم) · 20 منتج · 110 معاملة
- سجل ولاء · 3 خطط عضوية · 6 شرائح · 4 حملات · 8 إشعارات

---

## 📝 License

MIT — free to use, modify, and deploy.

---

<div dir="rtl">

صُنع بعناية ✨ — **لوميير بيوتي**

</div>
