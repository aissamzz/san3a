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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function InvoicesPage() {
  const { page, loaded } = useMyPage();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const refresh = useCallback(() => {
    if (page) setInvoices(getInvoices(page.id));
  }, [page]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!loaded || !page) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">الفواتير</h1>
          <p className="text-muted-foreground">أنشئ فواتير احترافية واطبعها أو حمّلها PDF</p>
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
            <p className="font-semibold">لا توجد فواتير بعد</p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/invoices/new">أنشئ أول فاتورة</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الرقم</TableHead>
                <TableHead>الزبون</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead className="text-end">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell dir="ltr" className="font-mono text-xs">
                    {invoice.number}
                  </TableCell>
                  <TableCell className="font-semibold">{invoice.clientName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {invoice.date.slice(0, 10)}
                  </TableCell>
                  <TableCell className="font-bold text-primary">
                    {formatDZD(invoiceTotal(invoice.items))}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label="عرض" asChild>
                        <Link href={`/dashboard/invoices/${invoice.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="تعديل" asChild>
                        <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        aria-label="حذف"
                        onClick={() => {
                          deleteInvoice(invoice.id);
                          refresh();
                          toast.success("تم حذف الفاتورة");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
