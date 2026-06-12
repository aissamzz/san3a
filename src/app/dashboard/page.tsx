"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  Copy,
  ExternalLink,
  KeyRound,
  ReceiptText,
} from "lucide-react";
import { toast } from "sonner";

import { formatDZD, getAppointments, getInvoices, invoiceTotal, isPageLive } from "@/lib/store";
import { useMyPage } from "@/lib/use-my-page";
import type { Appointment, Invoice } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageQrCode } from "@/components/qr-code";

const statusLabels: Record<Appointment["status"], { label: string; variant: "success" | "warning" | "muted" }> = {
  confirmed: { label: "مؤكد", variant: "success" },
  pending: { label: "في الانتظار", variant: "warning" },
  cancelled: { label: "ملغى", variant: "muted" },
};

export default function DashboardPage() {
  const { page, profile, loaded } = useMyPage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (page) {
      const today = new Date().toISOString().slice(0, 10);
      setAppointments(
        getAppointments(page.id).filter((a) => a.date >= today && a.status !== "cancelled").slice(0, 5)
      );
      setInvoices(getInvoices(page.id).slice(0, 5));
    }
  }, [page]);

  if (!loaded || !page || !profile) return null;

  const live = isPageLive(page);
  const pageUrl = `${window.location.origin}/${page.slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast.success("تم نسخ الرابط");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-extrabold sm:text-2xl">مرحباً {profile.name} 👋</h1>
        <p className="text-sm text-muted-foreground sm:text-base">هذه نظرة سريعة على نشاطك</p>
      </div>

      {/* Activation banner */}
      {live ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-500" />
            <div className="min-w-0">
              <div className="font-bold text-green-900">صفحتك منشورة ومفعّلة</div>
              <div className="text-sm text-green-700">الاشتراك ساري حتى {page.activatedUntil}</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 self-start sm:self-auto" asChild>
            <a href={pageUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              زيارة الصفحة
            </a>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <KeyRound className="h-5 w-5 shrink-0 text-amber-700" />
            <div className="min-w-0">
              <div className="font-bold text-amber-900">صفحتك غير مفعّلة بعد</div>
              <div className="text-sm text-amber-700">
                أدخل مفتاح التفعيل (4500 دج/سنة) لنشر صفحتك للعموم
              </div>
            </div>
          </div>
          <Button size="sm" className="shrink-0 self-start sm:self-auto" asChild>
            <Link href="/dashboard/settings">تفعيل الآن</Link>
          </Button>
        </div>
      )}

      <div className="grid min-w-0 gap-5 sm:gap-6 lg:grid-cols-3">
        {/* Page link + QR */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>رابط صفحتك</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex min-w-0 items-center gap-2">
              <code
                dir="ltr"
                className="block min-w-0 flex-1 truncate rounded-lg bg-muted px-3 py-2.5 text-xs"
              >
                {pageUrl}
              </code>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={copyLink}
                aria-label="نسخ الرابط"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <PageQrCode url={pageUrl} slug={page.slug} />
            <Button variant="secondary" className="w-full" asChild>
              <a href={`${pageUrl}?preview=1`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                معاينة الصفحة
              </a>
            </Button>
          </CardContent>
        </Card>

        <div className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-2">
          {/* Upcoming appointments */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                المواعيد القادمة
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/appointments">الكل</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">لا توجد مواعيد قادمة</p>
              ) : (
                <ul className="divide-y">
                  {appointments.map((a) => (
                    <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <div className="truncate font-bold">{a.clientName}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {a.serviceName || "—"} • {a.date} • {a.time}
                        </div>
                      </div>
                      <Badge variant={statusLabels[a.status].variant} className="shrink-0">
                        {statusLabels[a.status].label}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Recent invoices */}
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <ReceiptText className="h-5 w-5 text-primary" />
                آخر الفواتير
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/invoices">الكل</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">لا توجد فواتير بعد</p>
              ) : (
                <ul className="divide-y">
                  {invoices.map((invoice) => (
                    <li key={invoice.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <div className="truncate font-bold">{invoice.clientName}</div>
                        <div className="text-xs text-muted-foreground" dir="ltr">
                          {invoice.number}
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-extrabold text-primary">
                        {formatDZD(invoiceTotal(invoice.items))}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
