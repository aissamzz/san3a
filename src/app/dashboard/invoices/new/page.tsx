"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReceiptText } from "lucide-react";
import { toast } from "sonner";

import { addInvoice } from "@/lib/store";
import { useMyPage } from "@/lib/use-my-page";
import { Button } from "@/components/ui/button";
import { emptyInvoiceForm, InvoiceForm } from "@/components/invoice-form";

export default function NewInvoicePage() {
  const router = useRouter();
  const { page, loaded } = useMyPage();
  const [form, setForm] = useState(emptyInvoiceForm());

  if (!loaded || !page) return null;

  const create = async () => {
    if (!form.clientName.trim()) {
      toast.error("أدخل اسم الزبون");
      return;
    }
    const validItems = form.items.filter((item) => item.description.trim());
    if (validItems.length === 0) {
      toast.error("أضف على الأقل خدمة أو منتج واحد");
      return;
    }
    const invoice = await addInvoice({
      pageId: page.id,
      clientName: form.clientName.trim(),
      clientPhone: form.clientPhone.trim(),
      clientAddress: form.clientAddress.trim(),
      date: form.date,
      notes: form.notes.trim(),
      items: validItems,
    });
    if (!invoice) {
      toast.error("تعذّر إنشاء الفاتورة");
      return;
    }
    toast.success("تم إنشاء الفاتورة");
    router.push(`/dashboard/invoices/${invoice.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-extrabold sm:text-2xl">
          <ReceiptText className="h-6 w-6 text-primary" />
          فاتورة جديدة
        </h1>
      </div>

      <InvoiceForm value={form} onChange={setForm} />

      <div className="flex justify-end gap-2 pb-6">
        <Button variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button onClick={create}>إنشاء الفاتورة</Button>
      </div>
    </div>
  );
}
