"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ReceiptText, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { addInvoice, formatDZD, invoiceTotal, uid } from "@/lib/store";
import { useMyPage } from "@/lib/use-my-page";
import type { InvoiceItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewInvoicePage() {
  const router = useRouter();
  const { page, loaded } = useMyPage();
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: uid(), description: "", qty: 1, price: 0 },
  ]);

  if (!loaded || !page) return null;

  const setItem = (id: string, patch: Partial<InvoiceItem>) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const create = () => {
    if (!clientName.trim()) {
      toast.error("أدخل اسم الزبون");
      return;
    }
    const validItems = items.filter((item) => item.description.trim());
    if (validItems.length === 0) {
      toast.error("أضف على الأقل خدمة أو منتج واحد");
      return;
    }
    const invoice = addInvoice({
      pageId: page.id,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      items: validItems,
    });
    toast.success("تم إنشاء الفاتورة");
    router.push(`/dashboard/invoices/${invoice.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold">
          <ReceiptText className="h-6 w-6 text-primary" />
          فاتورة جديدة
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات الزبون</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="clientName">اسم الزبون</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientPhone">رقم الهاتف (اختياري)</Label>
            <Input
              id="clientPhone"
              dir="ltr"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
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
            onClick={() => setItems([...items, { id: uid(), description: "", qty: 1, price: 0 }])}
          >
            <Plus className="h-4 w-4" />
            إضافة سطر
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item, i) => (
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
                disabled={items.length === 1}
                onClick={() => setItems(items.filter((x) => x.id !== item.id))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-4">
            <span className="font-bold">المجموع الكلي</span>
            <span className="text-xl font-extrabold text-primary">
              {formatDZD(invoiceTotal(items))}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 pb-6">
        <Button variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button onClick={create}>إنشاء الفاتورة</Button>
      </div>
    </div>
  );
}
