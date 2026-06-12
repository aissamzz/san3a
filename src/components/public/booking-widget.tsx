"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, Phone } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { addAppointment, getAvailableSlots } from "@/lib/store";
import type { Page } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { WhatsAppIcon } from "@/components/public/whatsapp-icon";

const DAY_NAMES = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const MONTH_NAMES = [
  "جانفي",
  "فيفري",
  "مارس",
  "أفريل",
  "ماي",
  "جوان",
  "جويلية",
  "أوت",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

interface DayOption {
  date: string; // YYYY-MM-DD
  dayName: string;
  dayNum: number;
  monthName: string;
}

function toLocalISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function BookingWidget({ page }: { page: Page }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState(page.services[0]?.name ?? "");
  const [clientName, setClientName] = useState("");
  // bump to re-read available slots after a booking is recorded
  const [version, setVersion] = useState(0);

  const days: DayOption[] = useMemo(() => {
    const result: DayOption[] = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayIdx = d.getDay();
      if (!page.hours[dayIdx]?.enabled) continue;
      result.push({
        date: toLocalISO(d),
        dayName: DAY_NAMES[dayIdx],
        dayNum: d.getDate(),
        monthName: MONTH_NAMES[d.getMonth()],
      });
    }
    return result;
  }, [page.hours]);

  const [slots, setSlots] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }
    getAvailableSlots(page, selectedDate).then(setSlots);
  }, [page, selectedDate, version]);

  const book = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("اختر التاريخ والساعة أولاً");
      return;
    }
    if (!clientName.trim()) {
      toast.error("أدخل اسمك حتى يتعرف عليك الحرفي");
      return;
    }

    await addAppointment({
      pageId: page.id,
      clientName: clientName.trim(),
      clientPhone: "",
      serviceName,
      date: selectedDate,
      time: selectedTime,
      status: "pending",
      source: "web",
    });

    const day = days.find((d) => d.date === selectedDate);
    const dateLabel = day ? `${day.dayName} ${day.dayNum} ${day.monthName}` : selectedDate;
    const message =
      `السلام عليكم، أنا ${clientName.trim()}.\n` +
      `أريد حجز موعد عبر صفحتكم في san3apages:\n` +
      (serviceName ? `• الخدمة: ${serviceName}\n` : "") +
      `• اليوم: ${dateLabel}\n` +
      `• الساعة: ${selectedTime}\n` +
      `هل الموعد مناسب؟`;

    window.open(
      `https://wa.me/${page.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    toast.success("تم إرسال طلب الحجز عبر واتساب وتسجيله عند الحرفي");
    setSelectedTime(null);
    setVersion((value) => value + 1);
  };

  return (
    <Card id="booking" className="scroll-mt-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          احجز موعدك
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Day picker */}
        <div className="space-y-2">
          <Label>اختر اليوم</Label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((day) => (
              <button
                key={day.date}
                type="button"
                onClick={() => {
                  setSelectedDate(day.date);
                  setSelectedTime(null);
                }}
                className={cn(
                  "flex w-16 shrink-0 cursor-pointer flex-col items-center rounded-xl border px-2 py-2.5 text-center transition-colors",
                  selectedDate === day.date
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card hover:border-primary/50"
                )}
              >
                <span className="text-xs font-semibold">{day.dayName}</span>
                <span className="text-lg font-extrabold">{day.dayNum}</span>
                <span className="text-[10px]">{day.monthName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time picker */}
        {selectedDate && (
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              اختر الساعة
            </Label>
            {slots.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                لا توجد مواعيد متاحة في هذا اليوم، جرّب يوماً آخر.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={cn(
                      "cursor-pointer rounded-lg border px-3.5 py-1.5 text-sm font-semibold tabular-nums transition-colors",
                      selectedTime === slot
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-card hover:border-primary/50"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Details */}
        {selectedTime && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="booking-name">اسمك</Label>
              <Input
                id="booking-name"
                placeholder="مثال: أحمد"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            {page.services.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="booking-service">الخدمة المطلوبة</Label>
                <Select
                  id="booking-service"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                >
                  {page.services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2 pt-1">
          <Button variant="whatsapp" size="lg" className="w-full" onClick={book}>
            <WhatsAppIcon className="h-5 w-5" />
            احجز عبر واتساب
          </Button>
          <Button variant="outline" size="lg" className="w-full" asChild>
            <a href={`tel:${page.phone}`}>
              <Phone className="h-5 w-5" />
              اتصل الآن
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
