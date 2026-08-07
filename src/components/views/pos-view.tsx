"use client";

import { useMemo, useState } from "react";
import { useApp, useCurrentUser } from "@/lib/store";
import { PageHeader, Badge, Avatar, SectionTitle, EmptyState } from "@/components/shared/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { formatEGP } from "@/lib/format";
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Wifi,
  Gift,
  CheckCircle2,
  Receipt,
  User,
} from "lucide-react";
import { toast } from "sonner";
import type { SaleItem, PaymentMethod } from "@/lib/types";

export function PosView() {
  const customers = useApp((s) => s.customers);
  const services = useApp((s) => s.services);
  const products = useApp((s) => s.products);
  const staff = useApp((s) => s.staff);
  const branches = useApp((s) => s.branches);
  const transactions = useApp((s) => s.transactions);
  const createTransaction = useApp((s) => s.createTransaction);
  const openCustomer = useApp((s) => s.openCustomer);
  const setView = useApp((s) => s.setView);
  const user = useCurrentUser()!;

  const [customerId, setCustomerId] = useState("");
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [discountPct, setDiscountPct] = useState(0);
  const [pointsRedeemed, setPointsRedeemed] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [showPayment, setShowPayment] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<string | null>(null);

  const customer = customers.find((c) => c.id === customerId);

  const addToCart = (item: SaleItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.refId === item.refId && i.kind === item.kind);
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, item];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const taxable = subtotal - discountAmount;
  const taxAmount = Math.round((taxable * 14) / 100);
  const pointsValue = pointsRedeemed; // 1 pt = 1 EGP
  const total = Math.max(0, taxable + taxAmount - pointsValue);
  const pointsEarned = Math.floor(total / 100);

  const filteredServices = services.filter((s) => {
    if (category !== "all" && s.category !== category) return false;
    if (query && !s.name.includes(query)) return false;
    return s.status === "active";
  });
  const filteredProducts = products.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (query && !p.name.includes(query)) return false;
    return true;
  });

  const autoDiscount = customer
    ? customer.membershipTier === "vip"
      ? 15
      : customer.membershipTier === "gold"
        ? 10
        : 0
    : 0;

  const reset = () => {
    setCustomerId("");
    setCart([]);
    setDiscountPct(0);
    setPointsRedeemed(0);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="نقطة البيع"
        subtitle="إنشاء فاتورة جديدة — خدمات ومنتجات وإضافات"
        actions={
          <>
            {cart.length > 0 && (
              <Button variant="outline" size="sm" onClick={reset}>
                <Trash2 className="size-4" />
                مسح السلة
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Left: catalog */}
        <div className="space-y-4 lg:col-span-3">
          {/* Customer selector */}
          <div className="rounded-lg border border-border bg-card p-4">
            <SectionTitle className="mb-2">العميل</SectionTitle>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="h-11"><SelectValue placeholder="اختر العميل..." /></SelectTrigger>
              <SelectContent className="max-h-72">
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} — {c.phone} {c.membershipTier !== "basic" ? `(${c.membershipTier === "vip" ? "VIP" : "ذهبي"})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {customer && (
              <div className="mt-3 flex items-center justify-between rounded-md bg-muted/30 p-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <Avatar name={customer.name} color={customer.membershipTier === "vip" ? "#003527" : customer.membershipTier === "gold" ? "#cca72f" : "#5f5e5b"} size="sm" />
                  <div>
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">نقاط الولاء: {customer.loyaltyPoints} • خصم العضوية: {autoDiscount}٪</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => openCustomer(customer.id)}>
                  <User className="size-4" />
                  الملف
                </Button>
              </div>
            )}
          </div>

          {/* Search + category */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="ابحث عن خدمة أو منتج..." value={query} onChange={(e) => setQuery(e.target.value)} className="pr-9" />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">الكل</option>
              <option value="hair_color">صبغات</option>
              <option value="hair_treatment">علاج الشعر</option>
              <option value="hair_styling">تصفيف</option>
              <option value="facial">بشرة</option>
              <option value="manicure">مانيكير</option>
              <option value="pedicure">باديكير</option>
              <option value="makeup">مكياج</option>
              <option value="shampoo">شامبو</option>
              <option value="serum">سيروم</option>
              <option value="nail_polish">طلاء أظافر</option>
            </select>
          </div>

          {/* Services grid */}
          <div>
            <SectionTitle className="mb-2">الخدمات</SectionTitle>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {filteredServices.map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    addToCart({
                      id: `pos_${s.id}_${Date.now()}`,
                      kind: "service",
                      refId: s.id,
                      name: s.name,
                      qty: 1,
                      unitPrice: s.price,
                      staffId: s.staffIds[0],
                    })
                  }
                  className="card-hover rounded-md border border-border bg-card p-3 text-right"
                >
                  <p className="text-sm font-semibold leading-tight">{s.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.durationMin} دقيقة</p>
                  <p className="mt-1.5 font-display text-base font-bold text-primary">{formatEGP(s.price)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Products grid */}
          {(category === "all" || ["shampoo", "serum", "nail_polish", "facial_mask", "conditioner", "hair_color", "tools"].includes(category)) && (
            <div>
              <SectionTitle className="mb-2">المنتجات والإضافات</SectionTitle>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {filteredProducts.slice(0, 12).map((p) => (
                  <button
                    key={p.id}
                    onClick={() =>
                      addToCart({
                        id: `pos_${p.id}_${Date.now()}`,
                        kind: "product",
                        refId: p.id,
                        name: p.name,
                        qty: 1,
                        unitPrice: p.unitPrice,
                      })
                    }
                    disabled={p.stock <= 0}
                    className="card-hover rounded-md border border-border bg-card p-3 text-right disabled:opacity-40"
                  >
                    <p className="text-sm font-semibold leading-tight">{p.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">المخزون: {p.stock}</p>
                    <p className="mt-1.5 font-display text-base font-bold text-primary">{formatEGP(p.unitPrice)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: cart */}
        <div className="lg:col-span-2">
          <div className="sticky top-20 space-y-3 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <SectionTitle>السلة</SectionTitle>
              <Badge variant="neutral">{cart.length} عنصر</Badge>
            </div>

            {cart.length === 0 ? (
              <EmptyState icon={<ShoppingCart className="size-10" />} title="السلة فارغة" description="اختر خدمات أو منتجات لإضافتها" />
            ) : (
              <>
                <div className="thin-scroll max-h-[300px] space-y-2 overflow-y-auto pl-1">
                  {cart.map((i) => (
                    <div key={i.id} className="flex items-center gap-2 rounded-md border border-border p-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{i.name}</p>
                        <p className="text-xs text-muted-foreground">{formatEGP(i.unitPrice)} × {i.qty}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(i.id, -1)} className="rounded p-1 hover:bg-accent"><Minus className="size-3.5" /></button>
                        <span className="w-6 text-center text-xs tnum">{i.qty}</span>
                        <button onClick={() => updateQty(i.id, 1)} className="rounded p-1 hover:bg-accent"><Plus className="size-3.5" /></button>
                        <button onClick={() => removeItem(i.id)} className="rounded p-1 text-destructive hover:bg-destructive/10"><Trash2 className="size-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount + loyalty */}
                <div className="space-y-2 border-t border-border pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span className="tnum font-medium">{formatEGP(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-muted-foreground">خصم ٪</span>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={discountPct}
                        onChange={(e) => setDiscountPct(Math.min(100, Math.max(0, Number(e.target.value))))}
                        className="h-8 w-16 text-center"
                      />
                      {customer && autoDiscount > 0 && (
                        <Button size="sm" variant="ghost" onClick={() => setDiscountPct(autoDiscount)}>
                          عضوية {autoDiscount}٪
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الخصم</span>
                    <span className="tnum font-medium text-destructive">- {formatEGP(discountAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ضريبة (١٤٪)</span>
                    <span className="tnum font-medium">{formatEGP(taxAmount)}</span>
                  </div>
                  {customer && customer.loyaltyPoints >= 50 && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Gift className="size-3.5" /> استبدال نقاط
                      </span>
                      <Input
                        type="number"
                        min={0}
                        max={Math.min(customer.loyaltyPoints, total)}
                        value={pointsRedeemed}
                        onChange={(e) => setPointsRedeemed(Math.min(customer.loyaltyPoints, Math.max(0, Number(e.target.value))))}
                        className="h-8 w-20 text-center"
                      />
                    </div>
                  )}
                  {pointsRedeemed > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">قيمة النقاط</span>
                      <span className="tnum font-medium text-destructive">- {formatEGP(pointsValue)}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between rounded-md bg-primary/5 p-3">
                  <span className="text-sm font-semibold text-primary">الإجمالي</span>
                  <span className="font-display text-xl font-bold text-primary tnum">{formatEGP(total)}</span>
                </div>

                {customer && pointsEarned > 0 && (
                  <p className="text-center text-xs text-amber-700">
                    <Gift className="ml-1 inline size-3.5" />
                    سيكسب العميل {pointsEarned} نقطة ولاء
                  </p>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!customerId || cart.length === 0}
                  onClick={() => setShowPayment(true)}
                >
                  <CreditCard className="size-4" />
                  إتمام الدفع
                </Button>
                {!customerId && <p className="text-center text-xs text-muted-foreground">يجب اختيار عميل أولاً</p>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment dialog */}
      {showPayment && customer && (
        <PaymentDialog
          total={total}
          onClose={() => setShowPayment(false)}
          onConfirm={(method) => {
            const txn = createTransaction({
              customerId: customer.id,
              branchId: branches[0].id,
              items: cart,
              discountPct,
              taxPct: 14,
              paymentMethod: method,
              pointsRedeemed,
              createdBy: user.id,
              staffId: cart.find((i) => i.kind === "service")?.staffId,
            });
            setShowPayment(false);
            setCompletedTxn(txn.id);
            toast.success(`تمت الفاتورة ${txn.code} بنجاح • +${txn.pointsEarned} نقطة ولاء`);
          }}
        />
      )}

      {/* Receipt dialog */}
      {completedTxn && (
        <ReceiptDialog
          txnId={completedTxn}
          onClose={() => {
            setCompletedTxn(null);
            reset();
            setView("dashboard");
          }}
        />
      )}
    </div>
  );
}

function PaymentDialog({
  total,
  onClose,
  onConfirm,
}: {
  total: number;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const methods: { id: PaymentMethod; label: string; icon: typeof Banknote }[] = [
    { id: "cash", label: "نقدي", icon: Banknote },
    { id: "card", label: "بطاقة", icon: CreditCard },
    { id: "online", label: "أونلاين", icon: Wifi },
  ];
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">تأكيد الدفع</DialogTitle>
          <DialogDescription>اختر طريقة الدفع وأكمل العملية</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md bg-primary/5 p-4 text-center">
            <p className="text-xs text-muted-foreground">المبلغ المطلوب</p>
            <p className="mt-1 font-display text-3xl font-bold text-primary tnum">{formatEGP(total)}</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {methods.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-md border p-4 transition-colors ${
                    method === m.id ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-accent"
                  }`}
                >
                  <Icon className="size-5" />
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>تراجع</Button>
          <Button onClick={() => onConfirm(method)} className="gap-2">
            <CheckCircle2 className="size-4" />
            تأكيد الدفع
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ReceiptDialog({ txnId, onClose }: { txnId: string; onClose: () => void }) {
  const txn = useApp((s) => s.transactions.find((t) => t.id === txnId));
  const customers = useApp((s) => s.customers);
  const branches = useApp((s) => s.branches);
  if (!txn) return null;
  const cust = customers.find((c) => c.id === txn.customerId);
  const branch = branches.find((b) => b.id === txn.branchId);
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <CheckCircle2 className="size-5 text-emerald-600" />
            تمت العملية بنجاح
          </DialogTitle>
        </DialogHeader>
        <div className="rounded-lg border border-border bg-card p-4">
          {/* Receipt header */}
          <div className="text-center">
            <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-primary">
              <Receipt className="size-5 text-primary-foreground" />
            </div>
            <p className="font-display text-lg font-bold text-primary">لوميير بيوتي</p>
            <p className="text-xs text-muted-foreground">{branch?.name}</p>
            <p className="text-xs text-muted-foreground">{branch?.phone}</p>
          </div>
          <div className="my-3 border-t border-dashed border-border" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">رقم الفاتورة</span><span className="font-mono" dir="ltr">{txn.code}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">العميل</span><span className="font-medium">{cust?.name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">طريقة الدفع</span><span>{txn.payments[0]?.method === "cash" ? "نقدي" : txn.payments[0]?.method === "card" ? "بطاقة" : "أونلاين"}</span></div>
          </div>
          <div className="my-3 border-t border-dashed border-border" />
          {/* Items */}
          <div className="space-y-1.5">
            {txn.items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{i.name} × {i.qty}</span>
                <span className="tnum">{formatEGP(i.unitPrice * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="my-3 border-t border-dashed border-border" />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">المجموع الفرعي</span><span className="tnum">{formatEGP(txn.subtotal)}</span></div>
            {txn.discountAmount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">الخصم ({txn.discountPct}٪)</span><span className="tnum text-destructive">- {formatEGP(txn.discountAmount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">ضريبة</span><span className="tnum">{formatEGP(txn.taxAmount)}</span></div>
            {txn.pointsRedeemed > 0 && <div className="flex justify-between"><span className="text-muted-foreground">نقاط مُستبدلة</span><span className="tnum text-destructive">- {formatEGP(txn.pointsRedeemed)}</span></div>}
            <div className="flex justify-between border-t border-border pt-1.5 text-base font-bold"><span>الإجمالي</span><span className="tnum text-primary">{formatEGP(txn.total)}</span></div>
          </div>
          {txn.pointsEarned > 0 && (
            <div className="mt-3 rounded-md bg-amber-50 p-2 text-center text-xs text-amber-700">
              <Gift className="ml-1 inline size-3.5" />
              تم إضافة {txn.pointsEarned} نقطة ولاء لحساب {cust?.name}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>إغلاق</Button>
          <Button onClick={onClose}>عرض لوحة القيادة</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
