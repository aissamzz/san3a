"use client";

import { Plus, Trash2 } from "lucide-react";

import { formatDZD, invoiceTotal, uid } from "@/lib/store";
import type { InvoiceItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface InvoiceFormValue {
  clientName: string;
  clientPhone: string;
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
            <Label htmlFor="clientName">اسم الزبون</Label>
            <Input
              id="clientName"
              value={value.clientName}
              onChange={(e) => onChange({ ...value, clientName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientPhone">رقم الهاتف (اختياري)</Label>
            <Input
              id="clientPhone"
              dir="ltr"
              value={value.clientPhone}
              onChange={(e) => onChange({ ...value, clientPhone: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>التفاصيل</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({ ...value, items: [...value.items, { id: uid(), description: "", qty: 1, price: 0 }] })
            }
          >
            <Plus className="h-4 w-4" />
            إضافة سطر
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {value.items.map((item, i) => (
            <div key={item.id} className="flex items-end gap-2">
              <div className="flex-1 space-y-1">
                {i === 0 && <Label>الوصف</Label>}
                <Input
                  placeholder="مثال: باب خشب أحمر"
                  value={item.description}
                  onChange={(e) => setItem(item.id, { description: e.target.value })}
                />
              </div>
              <div className="w-20 space-y-1">
                {i === 0 && <Label>الكمية</Label>}
                <Input
                  type="number"
                  dir="ltr"
                  min={1}
                  value={item.qty}
                  onChange={(e) => setItem(item.id, { qty: Math.max(1, Number(e.target.value)) })}
                />
              </div>
              <div className="w-32 space-y-1">
                {i === 0 && <Label>السعر (دج)</Label>}
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
                className="text-destructive"
                aria-label="حذف السطر"
                disabled={value.items.length === 1}
                onClick={() => onChange({ ...value, items: value.items.filter((x) => x.id !== item.id) })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-4">
            <span className="font-bold">المجموع الكلي</span>
            <span className="text-xl font-extrabold text-primary">
              {formatDZD(invoiceTotal(value.items))}
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export function emptyInvoiceForm(): InvoiceFormValue {
  return { clientName: "", clientPhone: "", items: [{ id: uid(), description: "", qty: 1, price: 0 }] };
}
