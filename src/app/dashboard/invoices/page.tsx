"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Plus, ReceiptText, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteInvoice, formatDZD, getInvoices, invoiceTotal } from "@/lib/store";
import { useMyPage } from "@/lib/use-my-page";
import type { Invoice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function InvoicesPage() {
  const { page, loaded } = useMyPage();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const refresh = useCallback(async () => {
    if (page) setInvoices(await getInvoices(page.id));
  }, [page]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!loaded || !page) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold sm:text-2xl">الفواتير</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            أنشئ فواتير احترافية واطبعها أو حمّلها PDF
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/invoices/new">
            <Plus className="h-4 w-4" />
            فاتورة جديدة
          </Link>
        </Button>
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <ReceiptText className="h-10 w-10 text-muted-foreground" />
            <p className="font-bold">لا توجد فواتير بعد</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/invoices/new">أنشئ أول فاتورة</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="truncate font-bold">{invoice.clientName}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      <span dir="ltr">{invoice.number}</span> • {invoice.date.slice(0, 10)}
                    </div>
                  </div>
                  <div className="shrink-0 text-end">
                    <div className="text-lg font-extrabold text-primary">
                      {formatDZD(invoiceTotal(invoice.items))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t pt-3">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                      <Eye className="h-4 w-4" />
                      عرض
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                      تعديل
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ms-auto text-destructive"
                    onClick={async () => {
                      await deleteInvoice(invoice.id);
                      await refresh();
                      toast.success("تم حذف الفاتورة");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
