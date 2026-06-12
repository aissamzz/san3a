"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReceiptText } from "lucide-react";
import { toast } from "sonner";

import { getInvoice, updateInvoice } from "@/lib/store";
import { useMyPage } from "@/lib/use-my-page";
import { Button } from "@/components/ui/button";
import { InvoiceForm, type InvoiceFormValue } from "@/components/invoice-form";

export default function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { page, loaded } = useMyPage();
  const [form, setForm] = useState<InvoiceFormValue | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    void getInvoice(id).then((invoice) => {
    if (!invoice) {
      setNotFound(true);
      return;
    }
    setForm({
      clientName: invoice.clientName,
      clientPhone: invoice.clientPhone,
      clientAddress: invoice.clientAddress ?? "",
      date: invoice.date.slice(0, 10),
      notes: invoice.notes ?? "",
      items: invoice.items,
    });
    });
  }, [id]);

  if (!loaded || !page) return null;

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-muted-foreground">الفاتورة غير موجودة</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/invoices">العودة للفواتير</Link>
        </Button>
      </div>
    );
  }

  if (!form) return null;

  const save = async () => {
    if (!form.clientName.trim()) {
      toast.error("أدخل اسم الزبون");
      return;
    }
    const validItems = form.items.filter((item) => item.description.trim());
    if (validItems.length === 0) {
      toast.error("أضف على الأقل خدمة أو منتج واحد");
      return;
    }
    const invoice = await updateInvoice(id, {
      clientName: form.clientName.trim(),
      clientPhone: form.clientPhone.trim(),
      clientAddress: form.clientAddress.trim(),
      date: form.date,
      notes: form.notes.trim(),
      items: validItems,
    });
    if (!invoice) {
      toast.error("تعذّر حفظ التعديلات");
      return;
    }
    toast.success("تم حفظ التعديلات");
    router.push(`/dashboard/invoices/${id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-extrabold sm:text-2xl">
          <ReceiptText className="h-6 w-6 text-primary" />
          تعديل الفاتورة
        </h1>
      </div>

      <InvoiceForm value={form} onChange={setForm} />

      <div className="flex justify-end gap-2 pb-6">
        <Button variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button onClick={save}>حفظ التعديلات</Button>
      </div>
    </div>
  );
}
