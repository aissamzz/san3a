"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Check, Globe, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import {
  addAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointmentStatus,
} from "@/lib/store";
import { useMyPage } from "@/lib/use-my-page";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const DAY_NAMES = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const statusConfig: Record<AppointmentStatus, { label: string; variant: "success" | "warning" | "muted" }> = {
  confirmed: { label: "مؤكد", variant: "success" },
  pending: { label: "في الانتظار", variant: "warning" },
  cancelled: { label: "ملغى", variant: "muted" },
};

function dayLabel(date: string) {
  const d = new Date(date + "T00:00:00");
  return `${DAY_NAMES[d.getDay()]} ${date}`;
}

export default function AppointmentsPage() {
  const { page, loaded } = useMyPage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");

  const refresh = useCallback(() => {
    if (page) setAppointments(getAppointments(page.id));
  }, [page]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!loaded || !page) return null;

  const addManual = () => {
    if (!clientName.trim() || !date || !time) {
      toast.error("املأ اسم الزبون، التاريخ والساعة");
      return;
    }
    addAppointment({
      pageId: page.id,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      serviceName,
      date,
      time,
      status: "confirmed",
      source: "manual",
    });
    toast.success("تمت إضافة الموعد");
    setDialogOpen(false);
    setClientName("");
    setClientPhone("");
    setDate("");
    refresh();
  };

  const grouped = appointments.reduce<Record<string, Appointment[]>>((acc, a) => {
    (acc[a.date] ??= []).push(a);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">المواعيد</h1>
          <p className="text-muted-foreground">
            حجوزات الصفحة تظهر هنا تلقائياً، وتقدر تضيف مواعيدك يدوياً
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              موعد جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة موعد يدوياً</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="m-name">اسم الزبون</Label>
                <Input id="m-name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-phone">رقم الهاتف (اختياري)</Label>
                <Input
                  id="m-phone"
                  dir="ltr"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
              {page.services.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="m-service">الخدمة</Label>
                  <Select
                    id="m-service"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                  >
                    <option value="">— بدون تحديد —</option>
                    {page.services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="m-date">التاريخ</Label>
                  <Input
                    id="m-date"
                    type="date"
                    dir="ltr"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="m-time">الساعة</Label>
                  <Input
                    id="m-time"
                    type="time"
                    step={3600}
                    dir="ltr"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addManual}>إضافة الموعد</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {dates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <CalendarDays className="h-10 w-10 text-muted-foreground" />
            <p className="font-semibold">لا توجد مواعيد بعد</p>
            <p className="text-sm text-muted-foreground">
              عندما يحجز زبون من صفحتك، سيظهر الموعد هنا مباشرة
            </p>
          </CardContent>
        </Card>
      ) : (
        dates.map((d) => (
          <div key={d} className="space-y-2">
            <h2 className="font-bold text-muted-foreground">{dayLabel(d)}</h2>
            <Card>
              <CardContent className="divide-y p-0">
                {grouped[d].map((a) => (
                  <div key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <div className="w-14 shrink-0 text-center">
                      <div className="text-lg font-extrabold tabular-nums" dir="ltr">
                        {a.time}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{a.clientName}</span>
                        {a.source === "web" && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Globe className="h-3 w-3" />
                            عبر الصفحة
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {a.serviceName || "بدون خدمة محددة"}
                        {a.clientPhone && (
                          <span dir="ltr"> • {a.clientPhone}</span>
                        )}
                      </div>
                    </div>
                    <Badge variant={statusConfig[a.status].variant}>
                      {statusConfig[a.status].label}
                    </Badge>
                    <div className="flex gap-1">
                      {a.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-green-600"
                          aria-label="تأكيد"
                          onClick={() => {
                            updateAppointmentStatus(a.id, "confirmed");
                            refresh();
                            toast.success("تم تأكيد الموعد");
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {a.status !== "cancelled" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground"
                          aria-label="إلغاء"
                          onClick={() => {
                            updateAppointmentStatus(a.id, "cancelled");
                            refresh();
                            toast.success("تم إلغاء الموعد");
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        aria-label="حذف"
                        onClick={() => {
                          deleteAppointment(a.id);
                          refresh();
                          toast.success("تم حذف الموعد");
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))
      )}
    </div>
  );
}
