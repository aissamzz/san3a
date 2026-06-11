"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Printer } from "lucide-react";

import { formatDZD, getInvoice, invoiceTotal } from "@/lib/store";
import { useMyPage } from "@/lib/use-my-page";
import type { Invoice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { page, loaded } = useMyPage();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    setInvoice(getInvoice(id));
  }, [id]);

  if (!loaded || !page) return null;

  if (!invoice) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-muted-foreground">الفاتورة غير موجودة</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/invoices">العودة للفواتير</Link>
        </Button>
      </div>
    );
  }

  const total = invoiceTotal(invoice.items);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/invoices">
            <ArrowRight className="h-4 w-4" />
            العودة للفواتير
          </Link>
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          طباعة / تحميل PDF
        </Button>
      </div>

      <Card className="print-area">
        <CardContent className="p-8">
          {/* Invoice header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
            <div>
              <h1 className="text-2xl font-extrabold">{page.businessName}</h1>
              {page.craft && <p className="text-muted-foreground">{page.craft}</p>}
              <p className="text-sm text-muted-foreground">{page.city}</p>
              {page.phone && (
                <p className="text-sm text-muted-foreground" dir="ltr">
                  {page.phone}
                </p>
              )}
            </div>
            <div className="text-end">
              <div className="text-xl font-extrabold text-primary">فاتورة</div>
              <div className="mt-1 font-mono text-sm" dir="ltr">
                {invoice.number}
              </div>
              <div className="text-sm text-muted-foreground">
                التاريخ: {invoice.date.slice(0, 10)}
              </div>
            </div>
          </div>

          {/* Client */}
          <div className="border-b py-5">
            <div className="text-xs font-bold uppercase text-muted-foreground">فاتورة إلى</div>
            <div className="mt-1 font-bold">{invoice.clientName}</div>
            {invoice.clientPhone && (
              <div className="text-sm text-muted-foreground" dir="ltr">
                {invoice.clientPhone}
              </div>
            )}
          </div>

          {/* Items */}
          <table className="mt-5 w-full text-sm">
            <thead>
              <tr className="border-b text-start text-muted-foreground">
                <th className="pb-2 text-start font-semibold">الوصف</th>
                <th className="pb-2 text-center font-semibold">الكمية</th>
                <th className="pb-2 text-center font-semibold">السعر</th>
                <th className="pb-2 text-end font-semibold">المجموع</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-3 font-semibold">{item.description}</td>
                  <td className="py-3 text-center tabular-nums">{item.qty}</td>
                  <td className="py-3 text-center tabular-nums">{formatDZD(item.price)}</td>
                  <td className="py-3 text-end font-bold tabular-nums">
                    {formatDZD(item.qty * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div className="mt-6 flex justify-end">
            <div className="w-56 rounded-xl bg-accent px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="font-bold">المجموع الكلي</span>
                <span className="text-lg font-extrabold text-primary">{formatDZD(total)}</span>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            شكراً لثقتكم — {page.businessName} • san3apages.com/{page.slug}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
