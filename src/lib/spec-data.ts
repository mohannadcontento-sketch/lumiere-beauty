// ============================================================
// منصة إدارة مركز التجميل — بيانات المواصفات
// كل المحتوى المنظَّم لوثيقة المواصفات.
// ملاحظة: بدون ذكاء اصطناعي. قواعد حتمية فقط.
// المعرّفات التقنية (أسماء الجداول، الأعمدة، الأنواع، مسارات API)
// تُترك بالإنجليزية لأنها كود.
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
    name: "المالك",
    summary:
      "تحكّم كامل في المؤسسة بأكملها. صلاحيات مالية واستراتيجية وتكوينية. يدير جميع الفروع والموظفين والإعدادات.",
    screens: [
      "لوحة المالك",
      "لوحات جميع الفروع",
      "إعدادات المؤسسة",
      "الفوترة والاشتراك",
      "كل الوحدات (قراءة/كتابة)",
      "سجلات التدقيق",
      "التقارير والتحليلات (كاملة)",
    ],
    canSee: [
      "الإيرادات والأرباح عبر جميع الفروع",
      "رواتب وأداء جميع الموظفين",
      "كل بيانات العملاء",
      "بيانات المصروفات",
      "تكوين المؤسسة على المستوى الأعلى",
    ],
    cannotSee: ["بيانات اعتماد الموظفين الخاصة (كلمات المرور مجزّأة)"],
  },
  {
    id: "admin",
    name: "المدير",
    summary:
      "إدارة العمليات اليومية للفرع أو الفروع المعيّنة. يدير الموظفين والخدمات والعملاء والمخزون والعمليات — لكن دون الفوترة/الاشتراك.",
    screens: [
      "لوحة المدير",
      "إدارة الموظفين",
      "إدارة الخدمات",
      "إدارة علاقات العملاء",
      "المواعيد (كاملة)",
      "نقطة البيع والمدفوعات",
      "المخزون",
      "تكوين الولاء والعضويات",
      "حملات التسويق",
      "التقارير (نطاق الفرع)",
    ],
    canSee: [
      "إيرادات الفرع",
      "جداول وأداء الموظفين",
      "بيانات العملاء (الفرع)",
      "المخزون والمستودع",
    ],
    cannotSee: [
      "فوترة/اشتراك المؤسسة",
      "بيانات الفروع الأخرى",
      "المجاميع المالية الخاصة بالمالك فقط",
    ],
  },
  {
    id: "receptionist",
    name: "موظف الاستقبال",
    summary:
      "عمليات مكتب الاستقبال. يحجز ويدير المواعيد، يسجّل دخول العملاء، يعالج مدفوعات الزبائن بدون موعد، ويدير التقويم اليومي.",
    screens: [
      "لوحة الاستقبال",
      "التقويم / لوحة المواعيد",
      "إدارة علاقات العملاء (قراءة + إنشاء/تعديل أساسي)",
      "تسجيل الدخول / الخروج",
      "نقطة البيع (المدفوعات)",
      "بحث العملاء",
    ],
    canSee: [
      "مواعيد اليوم",
      "معلومات التواصل وسجل العميل",
      "أسعار الخدمات والتوفّر",
      "جداول الموظفين (للحجز)",
    ],
    cannotSee: [
      "رواتب الموظفين",
      "التقارير المالية / الأرباح",
      "بيانات تكلفة المخزون/المشتريات",
      "نتائج الحملات التسويقية",
      "سجلات التدقيق",
    ],
  },
  {
    id: "staff",
    name: "موظف / أخصائي تجميل",
    summary:
      "مقدّم الخدمة. يرى جدوله الشخصي ومعلومات العملاء للمواعيد المُسندة إليه وأداءه. لا يرى تفاصيل الموظفين الآخرين أو الماليات.",
    screens: [
      "لوحة الموظف",
      "التقويم الشخصي",
      "ملفات العملاء المُسندة (محدودة)",
      "ملاحظات الخدمة والسجل (الخاصة به)",
      "الأداء الشخصي",
    ],
    canSee: [
      "مواعيده وجدوله",
      "معلومات العميل لمواعيده",
      "سجل خدماته وإحصاءاته",
    ],
    cannotSee: [
      "جداول أو إحصاءات الموظفين الآخرين",
      "أرقام الإيرادات/الأرباح",
      "تفاصيل مدفوعات العملاء",
      "تكاليف المخزون",
      "بيانات التسويق",
    ],
  },
  {
    id: "customer",
    name: "العميل",
    summary:
      "المستخدم النهائي لبوابة العملاء (الإصدار الثاني). يحجز المواعيد، يطّلع على سجله، نقاط الولاء، والعضويات. لا يمكنه الوصول لأي بيانات تشغيلية.",
    screens: [
      "بوابة العملاء (الإصدار الثاني)",
      "الحجز الإلكتروني",
      "سجل المواعيد الخاص",
      "الفواتير/الإيصالات الخاصة",
      "الولاء والعضوية الخاصة",
      "الملف الشخصي",
    ],
    canSee: ["بياناته فقط"],
    cannotSee: [
      "أي بيانات تشغيلية للموظفين",
      "بيانات العملاء الآخرين",
      "منطق التسعير وراء الأسعار المعروضة",
    ],
  },
];

// مصفوفة الصلاحيات: القدرة ← الأدوار التي يمكنها تنفيذها
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
  // المصادقة
  { capability: "تسجيل الدخول للوحة الموظفين", module: "المصادقة", owner: true, admin: true, receptionist: true, staff: true, customer: false },
  { capability: "تسجيل الدخول لبوابة العملاء", module: "المصادقة", owner: false, admin: false, receptionist: false, staff: false, customer: true },
  { capability: "إعادة تعيين كلمة المرور", module: "المصادقة", owner: true, admin: true, receptionist: true, staff: true, customer: true },
  { capability: "إدارة حسابات المستخدمين (إنشاء/إلغاء تفعيل)", module: "المصادقة", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  // العملاء
  { capability: "عرض قائمة العملاء", module: "العملاء", owner: true, admin: true, receptionist: true, staff: false, customer: false },
  { capability: "إنشاء/تعديل عميل", module: "العملاء", owner: true, admin: true, receptionist: true, staff: false, customer: false },
  { capability: "عرض السجل المالي للعميل", module: "العملاء", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "عرض العميل المُسند (الخاص)", module: "العملاء", owner: true, admin: true, receptionist: true, staff: true, customer: false },
  // المواعيد
  { capability: "إنشاء موعد للآخرين", module: "المواعيد", owner: true, admin: true, receptionist: true, staff: false, customer: false },
  { capability: "حجز موعد ذاتي (إلكتروني)", module: "المواعيد", owner: false, admin: false, receptionist: false, staff: false, customer: true },
  { capability: "إعادة جدولة/إلغاء أي موعد", module: "المواعيد", owner: true, admin: true, receptionist: true, staff: false, customer: false },
  { capability: "تسجيل الدخول / غياب / إكمال", module: "المواعيد", owner: true, admin: true, receptionist: true, staff: true, customer: false },
  // الخدمات
  { capability: "إنشاء/تعديل الخدمات", module: "الخدمات", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "عرض الخدمات (للحجز)", module: "الخدمات", owner: true, admin: true, receptionist: true, staff: true, customer: true },
  // الموظفون
  { capability: "إدارة ملفات الموظفين والجداول", module: "الموظفون", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "عرض الجدول الخاص", module: "الموظفون", owner: true, admin: true, receptionist: true, staff: true, customer: false },
  // نقطة البيع
  { capability: "معالجة المدفوعات", module: "نقطة البيع", owner: true, admin: true, receptionist: true, staff: false, customer: false },
  { capability: "إصدار المردودات", module: "نقطة البيع", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "تطبيق الخصومات", module: "نقطة البيع", owner: true, admin: true, receptionist: true, staff: false, customer: false },
  // المخزون
  { capability: "إدارة المنتجات والموردين", module: "المخزون", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "تسجيل حركات المخزون / الاستهلاك", module: "المخزون", owner: true, admin: true, receptionist: true, staff: true, customer: false },
  { capability: "عرض بيانات تكلفة المخزون", module: "المخزون", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  // الولاء والعضوية
  { capability: "تكوين قواعد الولاء", module: "الولاء", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "عرض الولاء والعضوية الخاصة", module: "الولاء", owner: false, admin: false, receptionist: false, staff: false, customer: true },
  // التسويق
  { capability: "إنشاء/إدارة الحملات والشرائح", module: "التسويق", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "عرض نتائج الحملات", module: "التسويق", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  // التقارير
  { capability: "عرض تقارير المؤسسة الكاملة", module: "التقارير", owner: true, admin: false, receptionist: false, staff: false, customer: false },
  { capability: "عرض تقارير الفرع", module: "التقارير", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "عرض الأداء الشخصي", module: "التقارير", owner: true, admin: true, receptionist: false, staff: true, customer: false },
  // الإعدادات
  { capability: "إعدادات المؤسسة والفروع", module: "الإعدادات", owner: true, admin: false, receptionist: false, staff: false, customer: false },
  { capability: "إعدادات الفرع", module: "الإعدادات", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "تكوين قواعد الأتمتة", module: "الإعدادات", owner: true, admin: true, receptionist: false, staff: false, customer: false },
  { capability: "عرض سجلات التدقيق", module: "الإعدادات", owner: true, admin: false, receptionist: false, staff: false, customer: false },
];

// ---- الوحدات الأساسية ----
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
    name: "المصادقة والتفويض",
    purpose:
      "طبقة هوية آمنة مع تحكم بالوصول قائم على الأدوار، وإدارة الجلسات، وضوابط دورة الحساب.",
    features: [
      "تسجيل الدخول / الخروج (لوحة الموظفين + بوابة العملاء)",
      "إعادة تعيين كلمة المرور عبر رمز البريد/الرسائل (محدّد بزمن، للاستخدام مرة واحدة)",
      "إدارة الجلسات برموز التحديث مع إمكانية الإلغاء",
      "صلاحيات قائمة على الدور تُطبَّق على كل نقطة نهاية",
      "حالة الحساب: نشط / موقوف / معطّل",
      "المصادقة الثنائية (TOTP) اختيارية حسب الدور (إلزامية للمالك/المدير)",
      "كبح محاولات الدخول والقفل بعد عدد من المحاولات الفاشلة",
      "إعدادات الأمان: سياسة كلمة المرور، مهلة الجلسة",
    ],
  },
  {
    id: "crm",
    letter: "B",
    name: "إدارة علاقات العملاء",
    purpose:
      "ملف شامل للعميل يربط الحجوزات والزيارات والمدفوعات والولاء والمتابعات.",
    features: [
      "الاسم الكامل، الهاتف، البريد، تاريخ الميلاد، صورة الملف، التفضيلات، الملاحظات",
      "سجل الخدمات، سجل المواعيد، سجل المدفوعات",
      "ربط نقاط الولاء والعضوية",
      "الموظفون المفضّلون والخدمات المفضّلة",
      "حالة العميل (نشط / خامل / VIP / مدرج على القائمة السوداء)",
      "آخر زيارة والزيارة المتوقعة التالية (محسوبة)",
      "بحث (الاسم/الهاتف/البريد)، فلاتر، وسوم، شرائح",
      "الخط الزمني للعميل (تسلسل زمني للنشاط)",
    ],
  },
  {
    id: "appointments",
    letter: "C",
    name: "نظام المواعيد والحجز",
    purpose:
      "جدولة بدون تعارض تحترم توفّر الموظفين ومدة الخدمة وسعة الفرع.",
    features: [
      "مسار حجز العميل: الخدمة ← الموظف ← التاريخ ← الوقت ← التأكيد",
      "إعادة الجدولة والإلغاء (مع نوافذ السياسة)",
      "موظف الاستقبال: إنشاء/تعديل/إعادة جدولة/إلغاء، تسجيل الدخول، الغياب، الإكمال",
      "منع الحجز المزدوج تلقائياً",
      "يراعي: ساعات عمل الموظف، أيام الإجازة، مدة الخدمة، الفترات، المواعيد القائمة، توفّر الفرع",
      "محرّك توليد المواعيد (حتمي)",
      "قائمة الانتظار / المواعيد الاحتياطية (اختياري)",
      "عروض التقويم: يوم / أسبوع / شهر / حسب الموظف / حسب الفرع",
    ],
  },
  {
    id: "services",
    letter: "D",
    name: "إدارة الخدمات",
    purpose:
      "كتالوج الخدمات القابلة للحجز مع التسعير والمدة والتوظيف وربط الموارد.",
    features: [
      "الاسم، الفئة، الوصف، السعر، المدة",
      "الموظفون المعيّنون (الأخصائيون القادرون على أدائها)",
      "الإضافات (خدمات تكميلية اختيارية)",
      "الحالة (نشط / غير نشط)",
      "منتجات/موارد اختيارية مطلوبة (ترتبط بالمخزون)",
      "فئات الخدمات (شعر، بشرة، أظافر، سبا، تصفيف...)",
    ],
    notes: "أمثلة خدمات: صبغة الشعر، علاج الشعر، تنظيف البشرة، مناكير، باديكير، تصفيف.",
  },
  {
    id: "staff",
    letter: "E",
    name: "إدارة الموظفين",
    purpose:
      "إدارة الأخصائيين وقدراتهم وجداولهم ومؤشرات أدائهم.",
    features: [
      "الملف، الدور، الخدمات المُسندة",
      "ساعات العمل وأيام الإجازة (متكررة + لمرة واحدة)",
      "عرض الجدول والمواعيد",
      "عدد الخدمات المكتملة",
      "الإيرادات المُولّدة (حسب الموظف)",
      "مؤشرات الأداء: الاستخدام، معدل الإلغاء، متوسط التقييم",
    ],
  },
  {
    id: "pos",
    letter: "F",
    name: "نقطة البيع والمدفوعات",
    purpose:
      "مسار الدفع من الخدمات إلى الفاتورة مع مزوّدي الدفع القابلين للتبديل.",
    features: [
      "المسار: العميل ← الخدمات ← الإضافات ← الخصومات ← الضريبة ← الإجمالي ← الدفع ← الفاتورة",
      "طرق الدفع: نقدي، بطاقة، إلكتروني، دفع جزئي",
      "المردودات والمردود الجزئي",
      "الخصم (مبلغ ثابت / نسبة، مع قواعد اعتماد)",
      "تكوين الضريبة (لكل فرع / لكل خدمة)",
      "الفاتورة والإيصال القابل للطباعة",
      "تكامل مزوّد الدفع بشكل نمطي (Stripe / بوابات محلية عبر نمط المحوّل)",
    ],
  },
  {
    id: "inventory",
    letter: "G",
    name: "المخزون",
    purpose:
      "تتبّع المنتجات ومستويات المخزون والموردين والاستهلاك المرتبط بالخدمات.",
    features: [
      "المنتجات، الفئات، الموردون",
      "مستويات المخزون لكل فرع",
      "حركات المخزون (داخل / خارج / تسوية)",
      "المشتريات (طلبات الموردين)",
      "الاستهلاك (يدوي أو تلقائي عند إكمال الخدمة)",
      "تنبيهات انخفاض المخزون (حدّ قابل للتكوين)",
      "اختياري: ربط المنتج + الكمية بالخدمة (خصم تلقائي عند الإكمال)",
    ],
    notes: "مثال: خدمة «صبغة الشعر» تستهلك وحدة واحدة من منتج «الصبغة».",
  },
  {
    id: "loyalty",
    letter: "H",
    name: "الولاء والعضوية",
    purpose:
      "الاحتفاظ بالعملاء عبر النقاط والمستويات ومزايا العضوية القابلة للتكوين.",
    features: [
      "الولاء: النقاط، قواعد الكسب، قواعد الاسترداد، المعاملات، قواعد الانتهاء",
      "مستويات العضوية: أساسي / ذهبي / VIP (قابلة للتكوين)",
      "لكل مستوى: خصومات، مزايا، حجز أولوية، مكافآت",
      "دفتر نقاط لكل عميل مع سجل تدقيق",
    ],
  },
  {
    id: "notifications",
    letter: "I",
    name: "الإشعارات والأتمتة",
    purpose:
      "رسائل ومحفّزات قائمة على القواعد الحتمية. بدون ذكاء اصطناعي — قواعد مُكوَّنة فقط.",
    features: [
      "تذكير الموعد: قبل ساعات (افتراضي 24 ساعة)",
      "رسالة ما بعد الزيارة: بعد ساعات من إكمال الموعد",
      "تذكير إعادة الحجز: بعد أيام من الخدمة",
      "رسالة عيد الميلاد: في عيد ميلاد العميل",
      "العميل الخامل: إذا لم تكن هناك زيارة منذ أيام",
      "انخفاض المخزون: إذا نزل المخزون عن الحد",
      "قواعد يكوّنها المدير (المحفّز + الشرط + القناة + القالب)",
      "القنوات: الرسائل، البريد، داخل التطبيق (مزوّدون نمطيون)",
    ],
    notes: "كل القواعد حتمية (إذا-فقط). بدون تعلّم آلي.",
  },
  {
    id: "segmentation",
    letter: "J",
    name: "تقسيم العملاء",
    purpose:
      "تجميع العملاء قائم على القواعد ومبني على قاعدة البيانات للاستهداف والتحليلات.",
    features: [
      "عميل جديد، عميل عائد، VIP، خامل، إنفاق عالٍ، زائر متكرر، لم يعد، عيد ميلاد هذا الشهر",
      "الشريحة = مجموعة شروط حتمية على قاعدة البيانات (و/أو)",
      "عضوية ديناميكية (تُعاد كل جدول زمني أو عند الطلب)",
      "منشئ شرائح مخصّص (المدير)",
    ],
  },
  {
    id: "marketing",
    letter: "K",
    name: "الحملات التسويقية",
    purpose:
      "استهداف الشرائح بحملات مجدولة متعددة القنوات وقياس نتائج حتمية.",
    features: [
      "المسار: الشريحة ← الحملة ← الرسالة ← القناة ← الجدولة ← التسليم ← النتائج",
      "القنوات: الرسائل، البريد (مزوّدون نمطيون)",
      "قوالب الرسائل (يكتبها المدير، بدون توليد بالذكاء الاصطناعي)",
      "الجدولة: فورية / مجدولة / متكررة",
      "النتائج: أُرسلت، وصلت، فُتحت (البريد)، نُقرت، تحوّلت (إعادة حجز مُسندة)",
    ],
    notes: "بدون محتوى مُولّد بالذكاء الاصطناعي. كل النصوص يكتبها الموظفون.",
  },
  {
    id: "dashboard",
    letter: "L",
    name: "لوحة المعلومات",
    purpose:
      "نظرات عامة تشغيلية خاصة بكل دور مع مقاييس لحظية ومُجمَّعة.",
    features: [
      "المالك: الإيرادات (اليوم/الشهر)، المواعيد، المكتملة، الإلغاءات، الغياب، العملاء الجدد/العائدون، أفضل الخدمات، أداء الموظفين، الاحتفاظ، تنبيهات المخزون",
      "الاستقبال: مواعيد اليوم، تسجيلات الدخول، القادمة، المواعيد المتاحة، بحث العملاء",
      "الموظف: جدول اليوم، العملاء القادمون، الخدمات المكتملة، الأداء الشخصي",
    ],
  },
];

// ---- جداول قاعدة البيانات ----
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
    group: "التأجير",
    description: "المستأجر الأعلى. كل مركز تجميل هو مؤسسة واحدة.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "name", type: "varchar(160)" },
      { name: "slug", type: "varchar(80)", note: "فريد" },
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
    group: "التأجير",
    description: "المواقع الفعلية للمؤسسة. يدعم تعدد الفروع.",
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
    group: "الهوية",
    description: "حسابات مستخدمي الموظفين/التشغيل (ليس العملاء).",
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
    group: "الهوية",
    description: "تعريفات الأدوار (المالك، المدير، الاستقبال، الموظف).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id", nullable: true, note: "null = دور نظامي" },
      { name: "name", type: "varchar(64)" },
      { name: "description", type: "text", nullable: true },
    ],
    indexes: ["unique(organization_id, name)"],
  },
  {
    name: "permissions",
    group: "الهوية",
    description: "مفاتيح صلاحيات دقيقة (مثل 'appointment.create').",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "key", type: "varchar(128)", note: "مثل customer.read" },
      { name: "description", type: "text", nullable: true },
    ],
    indexes: ["unique(key)"],
  },
  {
    name: "role_permissions",
    group: "الهوية",
    description: "ربط متعدد لمتعدد بين الأدوار والصلاحيات.",
    columns: [
      { name: "role_id", type: "uuid", fk: "roles.id", pk: true },
      { name: "permission_id", type: "uuid", fk: "permissions.id", pk: true },
    ],
    constraints: ["مفتاح أساسي مركّب (role_id, permission_id)"],
  },
  {
    name: "user_roles",
    group: "الهوية",
    description: "يسند الأدوار للمستخدمين (اختيارياً ضمن نطاق فرع).",
    columns: [
      { name: "user_id", type: "uuid", fk: "users.id", pk: true },
      { name: "role_id", type: "uuid", fk: "roles.id", pk: true },
      { name: "branch_id", type: "uuid", fk: "branches.id", nullable: true },
    ],
  },
  {
    name: "staff",
    group: "العمليات",
    description: "ملفات أخصائيي التجميل المرتبطة بحساب مستخدم.",
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
    group: "العمليات",
    description: "الخدمات التي يمكن للموظف أداءها.",
    columns: [
      { name: "staff_id", type: "uuid", fk: "staff.id", pk: true },
      { name: "service_id", type: "uuid", fk: "services.id", pk: true },
    ],
  },
  {
    name: "staff_schedules",
    group: "العمليات",
    description: "ساعات العمل المتكررة وأيام الإجازة لمرة واحدة لكل موظف.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "staff_id", type: "uuid", fk: "staff.id" },
      { name: "weekday", type: "smallint", note: "0=أحد..6=سبت" },
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
    group: "الكتالوج",
    description: "تجميع الخدمات (شعر، أظافر، بشرة...).",
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
    group: "الكتالوج",
    description: "الخدمات القابلة للحجز بالسعر والمدة.",
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
    group: "الكتالوج",
    description: "إضافات اختيارية تُرفق بالخدمة عند الحجز/الدفع.",
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
    group: "الكتالوج",
    description: "يربط الخدمة بالمنتجات التي تستهلكها (تكامل المخزون).",
    columns: [
      { name: "service_id", type: "uuid", fk: "services.id", pk: true },
      { name: "product_id", type: "uuid", fk: "products.id", pk: true },
      { name: "quantity", type: "numeric(10,3)" },
    ],
  },
  {
    name: "customers",
    group: "العملاء",
    description: "السجل الرئيسي للعميل (ضمن نطاق المستأجر).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "branch_id", type: "uuid", fk: "branches.id", nullable: true, note: "الفرع الرئيسي" },
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
    group: "العملاء",
    description: "وسم مرن للعملاء.",
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
    group: "العملاء",
    description: "جدول الربط: العميل ↔ الوسم.",
    columns: [
      { name: "customer_id", type: "uuid", fk: "customers.id", pk: true },
      { name: "tag_id", type: "uuid", fk: "customer_tags.id", pk: true },
    ],
  },
  {
    name: "customer_notes",
    group: "العملاء",
    description: "ملاحظات نصية حرّة يضيفها الموظفون للعميل.",
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
    group: "العملاء",
    description: "الموظفون والخدمات المفضّلة لكل عميل.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "customer_id", type: "uuid", fk: "customers.id" },
      { name: "staff_id", type: "uuid", fk: "staff.id", nullable: true },
      { name: "service_id", type: "uuid", fk: "services.id", nullable: true },
    ],
  },
  {
    name: "appointments",
    group: "الحجوزات",
    description: "سجل الموعد الأساسي.",
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
    group: "الحجوزات",
    description: "الخدمات (والإضافات) المرفقة بالموعد.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "appointment_id", type: "uuid", fk: "appointments.id" },
      { name: "service_id", type: "uuid", fk: "services.id" },
      { name: "addon_id", type: "uuid", fk: "service_addons.id", nullable: true },
      { name: "price", type: "numeric(10,2)", note: "لقطة عند الحجز" },
    ],
    indexes: ["index(appointment_id)"],
  },
  {
    name: "payments",
    group: "المالية",
    description: "سجلات الدفع المرتبطة بموعد/فاتورة.",
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
    group: "المالية",
    description: "رأس الفاتورة لعملية الدفع.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "branch_id", type: "uuid", fk: "branches.id" },
      { name: "customer_id", type: "uuid", fk: "customers.id" },
      { name: "number", type: "varchar(40)", note: "مقروء آدمياً" },
      { name: "subtotal", type: "numeric(10,2)" },
      { name: "discount", type: "numeric(10,2)", note: "افتراضي 0" },
      { name: "tax", type: "numeric(10,2)" },
      { name: "total", type: "numeric(10,2)" },
      { name: "status", type: "enum(open,paid,partial,refunded,void)" },
      { name: "issued_at", type: "timestamptz" },
    ],
    indexes: ["unique(organization_id, number)", "index(branch_id, issued_at)"],
  },
  {
    name: "invoice_items",
    group: "المالية",
    description: "بنود الفاتورة.",
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
    group: "المخزون",
    description: "المنتجات القابلة للتخزين (بيع أو استهلاك).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "category_id", type: "uuid", fk: "product_categories.id", nullable: true },
      { name: "name", type: "varchar(160)" },
      { name: "sku", type: "varchar(64)", nullable: true },
      { name: "unit", type: "varchar(16)", note: "قطعة، مل، جم" },
      { name: "cost_price", type: "numeric(10,2)", nullable: true },
      { name: "sale_price", type: "numeric(10,2)", nullable: true },
      { name: "low_stock_threshold", type: "numeric(10,3)", nullable: true },
    ],
    indexes: ["unique(organization_id, sku)"],
  },
  {
    name: "product_categories",
    group: "المخزون",
    description: "تجميع المنتجات.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "name", type: "varchar(120)" },
    ],
  },
  {
    name: "suppliers",
    group: "المخزون",
    description: "موردو المنتجات.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "name", type: "varchar(160)" },
      { name: "contact", type: "text", nullable: true },
    ],
  },
  {
    name: "inventory",
    group: "المخزون",
    description: "مستوى المخزون الحالي لكل منتج في كل فرع.",
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
    group: "المخزون",
    description: "سجل تدقيق لكل تغيّر في المخزون.",
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
    group: "الولاء",
    description: "رصيد النقاط لكل عميل.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "customer_id", type: "uuid", fk: "customers.id", note: "فريد" },
      { name: "points_balance", type: "int" },
      { name: "membership_id", type: "uuid", fk: "memberships.id", nullable: true },
      { name: "updated_at", type: "timestamptz" },
    ],
    indexes: ["unique(customer_id)"],
  },
  {
    name: "loyalty_transactions",
    group: "الولاء",
    description: "دفتر كسب/استرداد النقاط.",
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
    group: "الولاء",
    description: "تعريفات مستويات العضوية (أساسي/ذهبي/VIP).",
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
    group: "الولاء",
    description: "مزايا قابلة للتكوين لكل مستوى عضوية.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "membership_id", type: "uuid", fk: "memberships.id" },
      { name: "benefit_key", type: "varchar(64)" },
      { name: "benefit_value", type: "varchar(255)" },
    ],
  },
  {
    name: "notifications",
    group: "الرسائل",
    description: "سجلات الإشعارات الصادرة (لكل مستلم).",
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
    group: "الرسائل",
    description: "قوالب رسائل يكتبها المدير (بدون ذكاء اصطناعي).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "key", type: "varchar(64)" },
      { name: "channel", type: "enum(sms,email,in_app)" },
      { name: "subject", type: "varchar(255)", nullable: true },
      { name: "body", type: "text", note: "مع {{عناصر نائبة}}" },
      { name: "is_active", type: "boolean" },
    ],
    indexes: ["unique(organization_id, key, channel)"],
  },
  {
    name: "automation_rules",
    group: "الرسائل",
    description: "قواعد حتمية محفّز ← إجراء (بدون ذكاء اصطناعي).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "trigger", type: "varchar(64)", note: "مثل appointment_reminder, birthday" },
      { name: "condition_json", type: "jsonb", note: "مثل {hoursBefore:24}" },
      { name: "action_template_id", type: "uuid", fk: "notification_templates.id" },
      { name: "channel", type: "enum(sms,email,in_app)" },
      { name: "is_active", type: "boolean" },
    ],
  },
  {
    name: "customer_segments",
    group: "التسويق",
    description: "تعريفات شرائح محفوظة (قواعد حتمية).",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "organization_id", type: "uuid", fk: "organizations.id" },
      { name: "name", type: "varchar(120)" },
      { name: "rule_json", type: "jsonb", note: "شروط قاعدة البيانات" },
      { name: "is_dynamic", type: "boolean" },
      { name: "last_computed_at", type: "timestamptz", nullable: true },
      { name: "member_count", type: "int", note: "عدد مخزّن مؤقتاً" },
    ],
  },
  {
    name: "campaigns",
    group: "التسويق",
    description: "حملات تسويقية تستهدف الشرائح.",
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
    group: "التسويق",
    description: "تتبّع التسليم والنتائج لكل عميل ضمن حملة.",
    columns: [
      { name: "id", type: "uuid", pk: true },
      { name: "campaign_id", type: "uuid", fk: "campaigns.id" },
      { name: "customer_id", type: "uuid", fk: "customers.id" },
      { name: "status", type: "enum(queued,sent,delivered,failed)" },
      { name: "opened_at", type: "timestamptz", nullable: true },
      { name: "clicked_at", type: "timestamptz", nullable: true },
      { name: "converted", type: "boolean", note: "أعاد الحجز خلال النافذة" },
    ],
    indexes: ["index(campaign_id)", "index(campaign_id, status)"],
  },
  {
    name: "audit_logs",
    group: "الأمان",
    description: "سجل تدقيق غير قابل للتعديل للإجراءات الحساسة.",
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

// ---- نقاط نهاية API ----
export type ApiEndpoint = {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
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
    module: "المصادقة",
    endpoints: [
      { method: "POST", path: "/auth/login", auth: "عام", roles: "—", description: "يصادق ويعيد رمز الوصول + التحديث." },
      { method: "POST", path: "/auth/refresh", auth: "رمز التحديث", roles: "—", description: "يصدر رمز وصول جديد." },
      { method: "POST", path: "/auth/logout", auth: "Bearer", roles: "الكل", description: "يُلغي الجلسة الحالية." },
      { method: "POST", path: "/auth/password/reset", auth: "عام", roles: "—", description: "يرسل رمز إعادة التعيين عبر البريد/الرسائل." },
      { method: "POST", path: "/auth/password/reset/confirm", auth: "رمز إعادة التعيين", roles: "—", description: "يضبط كلمة مرور جديدة بالرمز." },
      { method: "GET", path: "/auth/me", auth: "Bearer", roles: "الكل", description: "ملف المستخدم الحالي والصلاحيات." },
    ],
  },
  {
    module: "العملاء (CRM)",
    endpoints: [
      { method: "GET", path: "/customers", auth: "Bearer", roles: "المالك، المدير، الاستقبال", description: "قائمة/بحث العملاء (مقسّم لصفحات، قابل للفلترة)." },
      { method: "POST", path: "/customers", auth: "Bearer", roles: "المالك، المدير، الاستقبال", description: "إنشاء عميل." },
      { method: "GET", path: "/customers/:id", auth: "Bearer", roles: "المالك، المدير، الاستقبال، الموظف (المُسند)", description: "تفاصيل العميل مع الخط الزمني." },
      { method: "PATCH", path: "/customers/:id", auth: "Bearer", roles: "المالك، المدير، الاستقبال", description: "تحديث ملف العميل." },
      { method: "DELETE", path: "/customers/:id", auth: "Bearer", roles: "المالك، المدير", description: "حذف ناعم / إلغاء تفعيل العميل." },
      { method: "GET", path: "/customers/:id/timeline", auth: "Bearer", roles: "المالك، المدير، الاستقبال", description: "تغذية النشاط الزمنية." },
      { method: "POST", path: "/customers/:id/notes", auth: "Bearer", roles: "المالك، المدير، الاستقبال، الموظف", description: "إضافة ملاحظة." },
      { method: "POST", path: "/customers/:id/tags", auth: "Bearer", roles: "المالك، المدير، الاستقبال", description: "إسناد وسوم." },
    ],
  },
  {
    module: "المواعيد",
    endpoints: [
      { method: "GET", path: "/appointments", auth: "Bearer", roles: "المالك، المدير، الاستقبال، الموظف (الخاص)", description: "قائمة المواعيد (فلترة بالتاريخ/الموظف/الفرع/الحالة)." },
      { method: "POST", path: "/appointments", auth: "Bearer", roles: "المالك، المدير، الاستقبال، العميل (إلكتروني)", description: "إنشاء موعد (يتحقص من عدم الحجز المزدوج)." },
      { method: "GET", path: "/appointments/:id", auth: "Bearer", roles: "المالك، المدير، الاستقبال، الموظف (المُسند)، العميل (الخاص)", description: "تفاصيل الموعد." },
      { method: "PATCH", path: "/appointments/:id", auth: "Bearer", roles: "المالك، المدير، الاستقبال، العميل (الخاص، إعادة جدولة)", description: "إعادة جدولة / تحديث." },
      { method: "DELETE", path: "/appointments/:id", auth: "Bearer", roles: "المالك، المدير، الاستقبال، العميل (الخاص، إلغاء)", description: "إلغاء الموعد." },
      { method: "POST", path: "/appointments/:id/check-in", auth: "Bearer", roles: "المالك، المدير، الاستقبال، الموظف", description: "وضع علامة تم تسجيل الدخول." },
      { method: "POST", path: "/appointments/:id/complete", auth: "Bearer", roles: "المالك، المدير، الاستقبال، الموظف", description: "وضع علامة مكتمل." },
      { method: "POST", path: "/appointments/:id/no-show", auth: "Bearer", roles: "المالك، المدير، الاستقبال", description: "وضع علامة غياب." },
      { method: "GET", path: "/availability", auth: "Bearer/عام", roles: "الكل / العميل", description: "الحصول على المواعيد المتاحة للموظف+الخدمة+التاريخ." },
    ],
  },
  {
    module: "الخدمات",
    endpoints: [
      { method: "GET", path: "/services", auth: "Bearer/عام", roles: "الكل / العميل", description: "قائمة الخدمات النشطة." },
      { method: "POST", path: "/services", auth: "Bearer", roles: "المالك، المدير", description: "إنشاء خدمة." },
      { method: "PATCH", path: "/services/:id", auth: "Bearer", roles: "المالك، المدير", description: "تحديث الخدمة." },
      { method: "DELETE", path: "/services/:id", auth: "Bearer", roles: "المالك، المدير", description: "إلغاء تفعيل الخدمة." },
      { method: "GET", path: "/services/:id/addons", auth: "Bearer/عام", roles: "الكل / العميل", description: "قائمة الإضافات للخدمة." },
    ],
  },
  {
    module: "الموظفون",
    endpoints: [
      { method: "GET", path: "/staff", auth: "Bearer", roles: "المالك، المدير، الاستقبال", description: "قائمة الموظفين (مع الجداول)." },
      { method: "POST", path: "/staff", auth: "Bearer", roles: "المالك، المدير", description: "إنشاء ملف موظف + مستخدم." },
      { method: "PATCH", path: "/staff/:id", auth: "Bearer", roles: "المالك، المدير، الموظف (الخاص)", description: "تحديث الملف." },
      { method: "GET", path: "/staff/:id/schedule", auth: "Bearer", roles: "المالك، المدير، الاستقبال، الموظف (الخاص)", description: "ساعات العمل وأيام الإجازة." },
      { method: "PUT", path: "/staff/:id/schedule", auth: "Bearer", roles: "المالك، المدير", description: "ضبط الجدول المتكرر." },
      { method: "GET", path: "/staff/:id/performance", auth: "Bearer", roles: "المالك، المدير، الموظف (الخاص)", description: "مؤشرات الأداء." },
    ],
  },
  {
    module: "نقطة البيع والمدفوعات",
    endpoints: [
      { method: "POST", path: "/invoices", auth: "Bearer", roles: "المالك، المدير، الاستقبال", description: "إنشاء فاتورة من الموعد/الخدمات." },
      { method: "GET", path: "/invoices/:id", auth: "Bearer", roles: "المالك، المدير، الاستقبال، العميل (الخاص)", description: "تفاصيل الفاتورة + البنود." },
      { method: "POST", path: "/payments", auth: "Bearer", roles: "المالك، المدير، الاستقبال", description: "تسجيل دفعة (نقدي/بطاقة/إلكتروني)." },
      { method: "POST", path: "/payments/:id/refund", auth: "Bearer", roles: "المالك، المدير", description: "إصدار مردود (كامل/جزئي)." },
      { method: "GET", path: "/invoices/:id/receipt", auth: "Bearer", roles: "المالك، المدير، الاستقبال، العميل (الخاص)", description: "إيصال قابل للطباعة (PDF)." },
    ],
  },
  {
    module: "المخزون",
    endpoints: [
      { method: "GET", path: "/products", auth: "Bearer", roles: "المالك، المدير، الاستقبال (قراءة)", description: "قائمة المنتجات." },
      { method: "POST", path: "/products", auth: "Bearer", roles: "المالك، المدير", description: "إنشاء منتج." },
      { method: "GET", path: "/inventory", auth: "Bearer", roles: "المالك، المدير", description: "مستويات المخزون لكل فرع." },
      { method: "POST", path: "/inventory/movements", auth: "Bearer", roles: "المالك، المدير، الاستقبال، الموظف", description: "تسجيل حركة (داخل/خارج/تسوية)." },
      { method: "GET", path: "/inventory/alerts", auth: "Bearer", roles: "المالك، المدير", description: "تنبيهات انخفاض المخزون." },
    ],
  },
  {
    module: "الولاء والعضوية",
    endpoints: [
      { method: "GET", path: "/loyalty/accounts/:customerId", auth: "Bearer", roles: "المالك، المدير، الاستقبال، العميل (الخاص)", description: "رصيد النقاط والمستوى." },
      { method: "GET", path: "/loyalty/transactions", auth: "Bearer", roles: "المالك، المدير", description: "دفتر النقاط." },
      { method: "POST", path: "/loyalty/redeem", auth: "Bearer", roles: "المالك، المدير، الاستقبال", description: "استرداد النقاط." },
      { method: "GET", path: "/memberships", auth: "Bearer", roles: "المالك، المدير", description: "قائمة المستويات." },
      { method: "POST", path: "/memberships", auth: "Bearer", roles: "المالك، المدير", description: "إنشاء/تكوين المستوى." },
    ],
  },
  {
    module: "التسويق والشرائح",
    endpoints: [
      { method: "GET", path: "/segments", auth: "Bearer", roles: "المالك، المدير", description: "قائمة الشرائح المحفوظة." },
      { method: "POST", path: "/segments", auth: "Bearer", roles: "المالك، المدير", description: "إنشاء شريحة (قاعدة JSON)." },
      { method: "POST", path: "/segments/:id/compute", auth: "Bearer", roles: "المالك، المدير", description: "إعادة احتساب العضوية." },
      { method: "GET", path: "/campaigns", auth: "Bearer", roles: "المالك، المدير", description: "قائمة الحملات." },
      { method: "POST", path: "/campaigns", auth: "Bearer", roles: "المالك، المدير", description: "إنشاء + جدولة حملة." },
      { method: "GET", path: "/campaigns/:id/results", auth: "Bearer", roles: "المالك، المدير", description: "نتائج التسليم والتحويل." },
    ],
  },
  {
    module: "لوحة المعلومات والتقارير",
    endpoints: [
      { method: "GET", path: "/dashboard", auth: "Bearer", roles: "المالك، المدير، الاستقبال، الموظف", description: "تجميع لوحة المعلومات حسب الدور." },
      { method: "GET", path: "/reports/revenue", auth: "Bearer", roles: "المالك، المدير", description: "تقرير الإيرادات (نطاق تاريخ، تجميع باليوم/الموظف/الخدمة/الفرع)." },
      { method: "GET", path: "/reports/customers", auth: "Bearer", roles: "المالك، المدير", description: "تحليلات العملاء (الاحتفاظ، التسرّب، متوسط الإنفاق)." },
      { method: "GET", path: "/reports/staff", auth: "Bearer", roles: "المالك، المدير", description: "تقرير أداء الموظفين." },
      { method: "GET", path: "/reports/services", auth: "Bearer", roles: "المالك، المدير", description: "شعبية وإيرادات الخدمات." },
    ],
  },
  {
    module: "الإعدادات والأتمتة",
    endpoints: [
      { method: "GET", path: "/settings", auth: "Bearer", roles: "المالك، المدير", description: "إعدادات المؤسسة/الفرع." },
      { method: "PUT", path: "/settings", auth: "Bearer", roles: "المالك، المدير", description: "تحديث الإعدادات." },
      { method: "GET", path: "/automation-rules", auth: "Bearer", roles: "المالك، المدير", description: "قائمة قواعد الأتمتة." },
      { method: "POST", path: "/automation-rules", auth: "Bearer", roles: "المالك، المدير", description: "إنشاء قاعدة." },
      { method: "GET", path: "/audit-logs", auth: "Bearer", roles: "المالك", description: "استعلام سجلات التدقيق." },
    ],
  },
];

// ---- خارطة الطريق ----
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
    label: "الإصدار الأول — العمليات الأساسية",
    color: "rose",
    scope: [
      "المصادقة والتحكم بالوصول (المالك، المدير، الاستقبال، الموظف)",
      "إدارة المستخدمين والأدوار",
      "العملاء (CRM) — الملف الأساسي، البحث، السجل",
      "إدارة الموظفين والجداول",
      "الخدمات والفئات",
      "التقويم (يوم/أسبوع/شهر، عرض الموظف)",
      "المواعيد — إنشاء، إعادة جدولة، إلغاء، تسجيل دخول، إكمال، غياب",
      "نقطة البيع والمدفوعات (نقدي/بطاقة)، الفواتير والإيصالات",
      "لوحات معلومات أساسية (حسب الدور)",
      "فرع واحد (مخطط متعدد الفروع جاهز)",
    ],
    notIncluded: [
      "بوابة العملاء والحجز الإلكتروني",
      "محرّك الإشعارات/الأتمتة",
      "الولاء والعضوية",
      "التقسيم والتسويق",
      "المخزون",
      "التقارير المتقدمة",
    ],
  },
  {
    phase: "الإصدار الثاني",
    label: "الإصدار الثاني — النمو والاحتفاظ",
    color: "amber",
    scope: [
      "بوابة العملاء (حجز إلكتروني، خدمة ذاتية)",
      "محرّك الإشعارات والأتمتة (قواعد حتمية)",
      "نقاط الولاء والاسترداد",
      "مستويات العضوية والمزايا",
      "تقسيم العملاء (قائم على القواعد)",
      "الحملات التسويقية (الرسائل/البريد)",
      "إدارة المخزون (المنتجات، المخزون، الاستهلاك)",
      "التقارير والتحليلات المتقدمة",
      "تكامل مزوّد الدفع الإلكتروني",
    ],
    notIncluded: ["واجهة إدارة تعدد الفروع", "الاشتراك/الفوترة", "تكامل المحاسبة"],
  },
  {
    phase: "الإصدار 3+",
    label: "المستقبل — التوسّع والتكامل",
    color: "emerald",
    scope: [
      "واجهة إدارة تعدد الفروع وتحليلات عبر الفروع",
      "نموذج اشتراك/فوترة SaaS",
      "تسويق متقدم (A/B حتمي، تسلسلات تنقيطية)",
      "تكاملات خارجية (محاسبة: QuickBooks/Xero؛ مزامنة التقويم)",
      "أتمتة متقدمة (تدفقات متعددة الخطوات، شروط)",
      "تحليلات متقدمة (مجموعات، منشئ تقارير مخصّص)",
      "تطبيقات جوال (موظف وعميل)",
      "تخصيص العلامة التجارية",
    ],
    notIncluded: ["أي ميزات ذكاء اصطناعي — خارج النطاق صراحةً للمنصة"],
  },
];

// ---- مسارات المستخدم ----
export type FlowStep = { actor: string; action: string };

export const USER_FLOWS: { name: string; steps: FlowStep[] }[] = [
  {
    name: "الحجز الإلكتروني (العميل)",
    steps: [
      { actor: "العميل", action: "يفتح بوابة الحجز، يختار الخدمة" },
      { actor: "النظام", action: "يعرض الأخصائيين القادرين على أدائها" },
      { actor: "العميل", action: "يختار الموظف المفضّل (أو «أي أحد»)" },
      { actor: "النظام", action: "يحسب المواعيد المتاحة (ساعات العمل − الفترات − المواعيد القائمة)" },
      { actor: "العميل", action: "يختار التاريخ والوقت، يؤكّد" },
      { actor: "النظام", action: "ينشئ الموعد (الحالة: محجوز)، يرسل التأكيد" },
      { actor: "النظام", action: "يرسل تذكيراً قبل 24 ساعة (قاعدة أتمتة)" },
      { actor: "العميل", action: "يصل، موظف الاستقبال يسجّل دخوله" },
      { actor: "الموظف", action: "يؤدي الخدمة، يضع الموعد كمكتمل" },
      { actor: "الاستقبال", action: "يعالج الدفع عبر نقطة البيع، يصدر الفاتورة/الإيصال" },
      { actor: "النظام", action: "يمنح نقاط الولاء (الإصدار الثاني)، يحدّث سجل العميل" },
    ],
  },
  {
    name: "دفع زبون بدون موعد (الاستقبال)",
    steps: [
      { actor: "الاستقبال", action: "يبحث/ينشئ العميل" },
      { actor: "الاستقبال", action: "يضيف الخدمات والإضافات للسلة" },
      { actor: "النظام", action: "يحسب المجموع الفرعي، يطبّق خصم العضوية، يضيف الضريبة" },
      { actor: "الاستقبال", action: "يطبّق خصم اختياري (مع اعتماد إذا تجاوز الحد)" },
      { actor: "الاستقبال", action: "يأخذ الدفع (نقدي/بطاقة/إلكتروني)" },
      { actor: "النظام", action: "ينشئ الفاتورة + الدفعة، يطبع الإيصال" },
      { actor: "النظام", action: "يحدّث المخزون (يستهلك المنتجات المرتبطة)" },
      { actor: "النظام", action: "يحدّث الولاء + آخر زيارة للعميل" },
    ],
  },
  {
    name: "تذكير إعادة الحجز (الأتمتة)",
    steps: [
      { actor: "النظام (مجدول)", action: "مهمة يومية تفحص المواعيد المكتملة قبل أيام دون إعادة حجز" },
      { actor: "النظام", action: "يطابق قاعدة الأتمتة «تذكير إعادة الحجز»" },
      { actor: "النظام", action: "يعرض القالب مع عناصر العميل + الخدمة النائبة" },
      { actor: "النظام", action: "يضع رسالة/بريد للعميل في الطابور" },
      { actor: "النظام", action: "يسجّل الإشعار + يتتبّع التسليم" },
    ],
  },
];
