"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Check, Clock, Globe, Pencil, Phone, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import {
  addAppointment,
  deleteAppointment,
  getAppointments,
  updateAppointment,
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

const emptyForm = {
  clientName: "",
  clientPhone: "",
  serviceName: "",
  date: "",
  time: "10:00",
};

export default function AppointmentsPage() {
  const { page, loaded } = useMyPage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const refresh = useCallback(() => {
    if (page) setAppointments(getAppointments(page.id));
  }, [page]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!loaded || !page) return null;

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (a: Appointment) => {
    setEditingId(a.id);
    setForm({
      clientName: a.clientName,
      clientPhone: a.clientPhone,
      serviceName: a.serviceName,
      date: a.date,
      time: a.time,
    });
    setDialogOpen(true);
  };

  const save = () => {
    if (!form.clientName.trim() || !form.date || !form.time) {
      toast.error("املأ اسم الزبون، التاريخ والساعة");
      return;
    }
    if (editingId) {
      updateAppointment(editingId, {
        clientName: form.clientName.trim(),
        clientPhone: form.clientPhone.trim(),
        serviceName: form.serviceName,
        date: form.date,
        time: form.time,
      });
      toast.success("تم تعديل الموعد");
    } else {
      addAppointment({
        pageId: page.id,
        clientName: form.clientName.trim(),
        clientPhone: form.clientPhone.trim(),
        serviceName: form.serviceName,
        date: form.date,
        time: form.time,
        status: "confirmed",
        source: "manual",
      });
      toast.success("تمت إضافة الموعد");
    }
    setDialogOpen(false);
    refresh();
  };

  const grouped = appointments.reduce<Record<string, Appointment[]>>((acc, a) => {
    (acc[a.date] ??= []).push(a);
    return acc;
  }, {});
  const dates = Object.keys(grouped).sort();

  return (
    <div className="mx-auto max-w-4xl space-y-5 sm:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold sm:text-2xl">المواعيد</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            تظهر حجوزات صفحتك هنا تلقائياً، ويمكنك إضافة مواعيدك يدوياً
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" />
              موعد جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "تعديل الموعد" : "إضافة موعد يدوياً"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="m-name">اسم الزبون</Label>
                <Input
                  id="m-name"
                  value={form.clientName}
                  onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="m-phone">رقم الهاتف (اختياري)</Label>
                <Input
                  id="m-phone"
                  dir="ltr"
                  value={form.clientPhone}
                  onChange={(e) => setForm((f) => ({ ...f, clientPhone: e.target.value }))}
                />
              </div>
              {page.services.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="m-service">الخدمة</Label>
                  <Select
                    id="m-service"
                    value={form.serviceName}
                    onChange={(e) => setForm((f) => ({ ...f, serviceName: e.target.value }))}
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
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="m-time">الساعة</Label>
                  <Input
                    id="m-time"
                    type="time"
                    step={3600}
                    dir="ltr"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={save}>{editingId ? "حفظ التعديلات" : "إضافة الموعد"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {dates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <CalendarDays className="h-10 w-10 text-muted-foreground" />
            <p className="font-bold">لا توجد مواعيد بعد</p>
            <p className="text-sm text-muted-foreground">
              عندما يحجز زبون من صفحتك، سيظهر الموعد هنا مباشرة
            </p>
          </CardContent>
        </Card>
      ) : (
        dates.map((d) => (
          <div key={d} className="space-y-2.5">
            <h2 className="px-1 text-sm font-extrabold text-muted-foreground">{dayLabel(d)}</h2>
            <div className="space-y-3">
              {grouped[d].map((a) => (
                <Card key={a.id} className={a.status === "cancelled" ? "opacity-60" : undefined}>
                  <CardContent className="p-4 sm:p-5">
                    {/* Top: time + client + status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1.5 text-sm font-extrabold tabular-nums text-accent-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span dir="ltr">{a.time}</span>
                        </span>
                        <div className="min-w-0">
                          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span className="truncate font-bold">{a.clientName}</span>
                            {a.source === "web" && (
                              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                                <Globe className="h-3 w-3" />
                                عبر الصفحة
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 truncate text-sm text-muted-foreground">
                            {a.serviceName || "بدون خدمة محددة"}
                          </div>
                          {a.clientPhone && (
                            <a
                              href={`tel:${a.clientPhone}`}
                              className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                            >
                              <Phone className="h-3 w-3" />
                              <span dir="ltr">{a.clientPhone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                      <Badge variant={statusConfig[a.status].variant} className="shrink-0">
                        {statusConfig[a.status].label}
                      </Badge>
                    </div>

                    {/* Bottom: actions */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t pt-3">
                      {a.status === "pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-700"
                          onClick={() => {
                            updateAppointmentStatus(a.id, "confirmed");
                            refresh();
                            toast.success("تم تأكيد الموعد");
                          }}
                        >
                          <Check className="h-4 w-4" />
                          تأكيد
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => openEdit(a)}>
                        <Pencil className="h-4 w-4" />
                        تعديل
                      </Button>
                      {a.status !== "cancelled" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => {
                            updateAppointmentStatus(a.id, "cancelled");
                            refresh();
                            toast.success("تم إلغاء الموعد");
                          }}
                        >
                          <X className="h-4 w-4" />
                          إلغاء
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ms-auto text-destructive"
                        onClick={() => {
                          deleteAppointment(a.id);
                          refresh();
                          toast.success("تم حذف الموعد");
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
          </div>
        ))
      )}
    </div>
  );
}
