"use client";

import { Plus, Trash2 } from "lucide-react";

import { formatDZD, invoiceTotal, uid } from "@/lib/store";
import type { InvoiceItem, InvoiceStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface InvoiceFormValue {
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  date: string; // YYYY-MM-DD
  status: InvoiceStatus;
  notes: string;
  items: InvoiceItem[];
}

export function InvoiceForm({
  value,
  onChange,
}: {
  value: InvoiceFormValue;
  onChange: (value: InvoiceFormValue) => void;
}) {
  const setItem = (id: string, patch: Partial<InvoiceItem>) =>
    onChange({
      ...value,
      items: value.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>معلومات الزبون</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="clientName">اسم الزبون *</Label>
            <Input
              id="clientName"
              placeholder="الاسم الكامل أو اسم الشركة"
              value={value.clientName}
              onChange={(e) => onChange({ ...value, clientName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientPhone">رقم الهاتف (اختياري)</Label>
            <Input
              id="clientPhone"
              dir="ltr"
              placeholder="0550123456"
              value={value.clientPhone}
              onChange={(e) => onChange({ ...value, clientPhone: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="clientAddress">العنوان (اختياري)</Label>
            <Input
              id="clientAddress"
              placeholder="مثال: حي 20 أوت، باب الواد، الجزائر"
              value={value.clientAddress}
              onChange={(e) => onChange({ ...value, clientAddress: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>معلومات الفاتورة</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="invoiceDate">تاريخ الفاتورة</Label>
            <Input
              id="invoiceDate"
              type="date"
              dir="ltr"
              value={value.date}
              onChange={(e) => onChange({ ...value, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceStatus">حالة الدفع</Label>
            <Select
              id="invoiceStatus"
              value={value.status}
              onChange={(e) => onChange({ ...value, status: e.target.value as InvoiceStatus })}
            >
              <option value="unpaid">غير مدفوعة</option>
              <option value="paid">مدفوعة</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>الخدمات والمنتجات</CardTitle>
            <CardDescription className="mt-1">أضف سطراً لكل خدمة أو منتج</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() =>
              onChange({ ...value, items: [...value.items, { id: uid(), description: "", qty: 1, price: 0 }] })
            }
          >
            <Plus className="h-4 w-4" />
            إضافة سطر
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {value.items.map((item, i) => (
            <div key={item.id} className="space-y-2 rounded-xl border bg-muted/30 p-3 sm:border-0 sm:bg-transparent sm:p-0">
              <div className="flex flex-wrap items-end gap-2">
                <div className="w-full min-w-0 space-y-1 sm:w-auto sm:flex-1">
                  <Label className="text-xs text-muted-foreground">الوصف {i + 1}</Label>
                  <Input
                    placeholder="مثال: باب خشب أحمر مع التركيب"
                    value={item.description}
                    onChange={(e) => setItem(item.id, { description: e.target.value })}
                  />
                </div>
                <div className="w-[72px] space-y-1">
                  <Label className="text-xs text-muted-foreground">الكمية</Label>
                  <Input
                    type="number"
                    dir="ltr"
                    min={1}
                    value={item.qty}
                    onChange={(e) => setItem(item.id, { qty: Math.max(1, Number(e.target.value)) })}
                  />
                </div>
                <div className="w-28 min-w-0 flex-1 space-y-1 sm:flex-none sm:basis-32">
                  <Label className="text-xs text-muted-foreground">السعر (دج)</Label>
                  <Input
                    type="number"
                    dir="ltr"
                    min={0}
                    value={item.price || ""}
                    onChange={(e) => setItem(item.id, { price: Number(e.target.value) })}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive"
                  aria-label="حذف السطر"
                  disabled={value.items.length === 1}
                  onClick={() => onChange({ ...value, items: value.items.filter((x) => x.id !== item.id) })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-end text-xs text-muted-foreground">
                المجموع: <span className="font-bold">{formatDZD(item.qty * item.price)}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-xl bg-accent px-4 py-3.5">
            <span className="font-extrabold">المجموع الكلي</span>
            <span className="text-xl font-extrabold text-primary">
              {formatDZD(invoiceTotal(value.items))}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ملاحظات (اختياري)</CardTitle>
          <CardDescription>تظهر أسفل الفاتورة — مثل شروط الضمان أو طريقة الدفع</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            placeholder="مثال: ضمان سنة على التركيب. الدفع نقداً عند التسليم."
            value={value.notes}
            onChange={(e) => onChange({ ...value, notes: e.target.value })}
          />
        </CardContent>
      </Card>
    </>
  );
}

export function emptyInvoiceForm(): InvoiceFormValue {
  return {
    clientName: "",
    clientPhone: "",
    clientAddress: "",
    date: new Date().toISOString().slice(0, 10),
    status: "unpaid",
    notes: "",
    items: [{ id: uid(), description: "", qty: 1, price: 0 }],
  };
}
