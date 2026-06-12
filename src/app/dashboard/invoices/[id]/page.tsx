"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Pencil, Printer } from "lucide-react";

import { formatDZD, getInvoice, invoiceTotal } from "@/lib/store";
import { useMyPage } from "@/lib/use-my-page";
import type { Invoice } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { page, loaded } = useMyPage();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    getInvoice(id).then(setInvoice);
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
    <div className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/invoices">
            <ArrowRight className="h-4 w-4" />
            العودة للفواتير
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
              <Pencil className="h-4 w-4" />
              تعديل
            </Link>
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            طباعة / تحميل PDF
          </Button>
        </div>
      </div>

      {/* Printable invoice document */}
      <div className="print-area overflow-hidden rounded-2xl border bg-white shadow-soft">
        {/* Brand band */}
        <div className="h-2 w-full bg-primary" />

        <div className="p-6 sm:p-10">
          {/* Header: business + invoice meta */}
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold leading-tight">{page.businessName}</h1>
              <div className="mt-3 space-y-0.5 text-sm text-muted-foreground">
                {page.city && <p>{page.city}</p>}
                {page.phone && <p dir="ltr" className="text-end">{page.phone}</p>}
                <p dir="ltr" className="text-end">
                  san3apages.com/{page.slug}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-end">
              <div className="text-3xl font-extrabold tracking-tight text-primary">فاتورة</div>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-muted-foreground">رقم الفاتورة</span>
                  <span className="font-bold tabular-nums" dir="ltr">
                    {invoice.number}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-muted-foreground">التاريخ</span>
                  <span className="font-bold tabular-nums" dir="ltr">
                    {invoice.date.slice(0, 10)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Client */}
          <div className="mt-8 rounded-xl bg-muted/60 p-4 sm:p-5">
            <div className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
              فاتورة إلى
            </div>
            <div className="mt-1.5 text-lg font-bold">{invoice.clientName}</div>
            <div className="mt-0.5 space-y-0.5 text-sm text-muted-foreground">
              {invoice.clientPhone && (
                <p dir="ltr" className="text-end">
                  {invoice.clientPhone}
                </p>
              )}
              {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
            </div>
          </div>

          {/* Items table */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b-2 border-foreground/80 text-muted-foreground">
                  <th className="w-8 pb-2.5 text-start font-bold">#</th>
                  <th className="pb-2.5 text-start font-bold">الوصف</th>
                  <th className="w-16 pb-2.5 text-center font-bold">الكمية</th>
                  <th className="w-32 pb-2.5 text-center font-bold">سعر الوحدة</th>
                  <th className="w-32 pb-2.5 text-end font-bold">المجموع</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 text-muted-foreground tabular-nums">{i + 1}</td>
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
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="flex w-full max-w-xs items-center justify-between border-t-2 border-foreground/80 pt-3">
              <span className="font-extrabold">المجموع الكلي</span>
              <span className="text-lg font-extrabold tabular-nums">{formatDZD(total)}</span>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8 rounded-xl border border-dashed p-4">
              <div className="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                ملاحظات
              </div>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed">{invoice.notes}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="mt-12 grid grid-cols-2 gap-8 text-center text-sm text-muted-foreground">
            <div>
              <div className="mx-auto h-16 max-w-[180px] border-b" />
              <p className="mt-2 font-semibold">توقيع البائع</p>
            </div>
            <div>
              <div className="mx-auto h-16 max-w-[180px] border-b" />
              <p className="mt-2 font-semibold">توقيع الزبون</p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-10 border-t pt-5 text-center text-xs text-muted-foreground">
            شكراً لثقتكم — {page.businessName}
            {page.phone && (
              <>
                {" • "}
                <span dir="ltr">{page.phone}</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
