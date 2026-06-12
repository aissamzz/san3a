"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { uid, updatePage } from "@/lib/store";
import { useMyPage } from "@/lib/use-my-page";
import { WILAYAS } from "@/lib/wilayas";
import type { Page } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const DAY_NAMES = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export default function EditPage() {
  const { page, loaded } = useMyPage();
  const [draft, setDraft] = useState<Page | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (page) setDraft(structuredClone(page));
  }, [page]);

  if (!loaded || !draft) return null;

  const set = <K extends keyof Page>(key: K, value: Page[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const save = () => {
    if (!draft.businessName.trim()) {
      toast.error("اسم النشاط إجباري");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(draft.slug)) {
      toast.error("الرابط يجب أن يحتوي فقط على حروف لاتينية صغيرة، أرقام و -");
      return;
    }
    const result = updatePage(draft);
    if (result.ok) toast.success(result.message);
    else toast.error(result.message);
  };

  const addGalleryFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setDraft((d) =>
          d
            ? { ...d, gallery: [...d.gallery, { id: uid(), url: String(reader.result) }] }
            : d
        );
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold sm:text-2xl">تعديل الصفحة</h1>
          <p className="text-sm text-muted-foreground sm:text-base">هكذا يراك زبائنك — اجعلها مميزة</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`/${draft.slug}?preview=1`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              معاينة
            </a>
          </Button>
          <Button onClick={save}>
            <Save className="h-4 w-4" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* Basic info */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="businessName">اسم النشاط</Label>
            <Input
              id="businessName"
              value={draft.businessName}
              onChange={(e) => set("businessName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="craft">الصنعة / الحرفة</Label>
            <Input
              id="craft"
              placeholder="مثال: نجّار"
              value={draft.craft}
              onChange={(e) => set("craft", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">رابط الصفحة</Label>
            <div className="flex items-center gap-2" dir="ltr">
              <span className="text-xs text-muted-foreground">san3apages.com/</span>
              <Input
                id="slug"
                dir="ltr"
                className="flex-1"
                value={draft.slug}
                onChange={(e) => set("slug", e.target.value.toLowerCase())}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">الولاية</Label>
            <Select id="city" value={draft.city} onChange={(e) => set("city", e.target.value)}>
              {WILAYAS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">وصف قصير</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="قدّم نفسك وخبرتك في جملتين أو ثلاث..."
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الهاتف (اتصل الآن)</Label>
            <Input
              id="phone"
              dir="ltr"
              placeholder="0550123456"
              value={draft.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">رقم واتساب (بالصيغة الدولية)</Label>
            <Input
              id="whatsapp"
              dir="ltr"
              placeholder="213550123456"
              value={draft.whatsapp}
              onChange={(e) => set("whatsapp", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">رابط صورة الملف الشخصي</Label>
            <Input
              id="avatarUrl"
              dir="ltr"
              placeholder="https://..."
              value={draft.avatarUrl}
              onChange={(e) => set("avatarUrl", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverUrl">رابط صورة الغلاف</Label>
            <Input
              id="coverUrl"
              dir="ltr"
              placeholder="https://..."
              value={draft.coverUrl}
              onChange={(e) => set("coverUrl", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>الخدمات والأسعار</CardTitle>
            <CardDescription>السعر يظهر للزبون بصيغة &quot;ابتداءً من&quot;</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              set("services", [...draft.services, { id: uid(), name: "", startingPrice: 0 }])
            }
          >
            <Plus className="h-4 w-4" />
            إضافة خدمة
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {draft.services.length === 0 && (
            <p className="py-2 text-center text-sm text-muted-foreground">
              أضف خدماتك حتى يعرف الزبون ماذا تقدم
            </p>
          )}
          {draft.services.map((service, i) => (
            <div key={service.id} className="flex flex-wrap items-end gap-2">
              <div className="w-full min-w-0 space-y-1 sm:w-auto sm:flex-1">
                <Label className="text-xs text-muted-foreground">اسم الخدمة {i + 1}</Label>
                <Input
                  placeholder="مثال: مطبخ على المقاس"
                  value={service.name}
                  onChange={(e) =>
                    set(
                      "services",
                      draft.services.map((s) =>
                        s.id === service.id ? { ...s, name: e.target.value } : s
                      )
                    )
                  }
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1 sm:flex-none sm:basis-36">
                <Label className="text-xs text-muted-foreground">السعر يبدأ من (دج)</Label>
                <Input
                  type="number"
                  dir="ltr"
                  min={0}
                  value={service.startingPrice || ""}
                  onChange={(e) =>
                    set(
                      "services",
                      draft.services.map((s) =>
                        s.id === service.id
                          ? { ...s, startingPrice: Number(e.target.value) }
                          : s
                      )
                    )
                  }
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive"
                aria-label="حذف الخدمة"
                onClick={() =>
                  set("services", draft.services.filter((s) => s.id !== service.id))
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>معرض الأعمال</CardTitle>
            <CardDescription>صور أعمالك هي أفضل دعاية لك</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus className="h-4 w-4" />
            إضافة صور
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addGalleryFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </CardHeader>
        <CardContent>
          {draft.gallery.length === 0 ? (
            <p className="py-2 text-center text-sm text-muted-foreground">لا توجد صور بعد</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {draft.gallery.map((image) => (
                <div key={image.id} className="group relative overflow-hidden rounded-lg border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt="" className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    aria-label="حذف الصورة"
                    onClick={() =>
                      set("gallery", draft.gallery.filter((g) => g.id !== image.id))
                    }
                    className="absolute end-1.5 top-1.5 cursor-pointer rounded-md bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly hours */}
      <Card>
        <CardHeader>
          <CardTitle>أوقات العمل</CardTitle>
          <CardDescription>الزبائن يحجزون فقط في هذه الأوقات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {DAY_NAMES.map((dayName, dayIdx) => {
            const day = draft.hours[dayIdx] ?? { enabled: false, from: "09:00", to: "17:00" };
            const setDay = (patch: Partial<typeof day>) =>
              set("hours", { ...draft.hours, [dayIdx]: { ...day, ...patch } });
            return (
              <div key={dayIdx} className="flex flex-wrap items-center gap-3">
                <div className="flex w-28 items-center gap-2">
                  <Switch
                    checked={day.enabled}
                    onCheckedChange={(checked) => setDay({ enabled: checked })}
                  />
                  <span className={day.enabled ? "font-semibold" : "text-muted-foreground"}>
                    {dayName}
                  </span>
                </div>
                {day.enabled ? (
                  <div className="flex items-center gap-2" dir="ltr">
                    <Input
                      type="time"
                      step={3600}
                      className="w-28"
                      value={day.from}
                      onChange={(e) => setDay({ from: e.target.value })}
                    />
                    <span className="text-muted-foreground">→</span>
                    <Input
                      type="time"
                      step={3600}
                      className="w-28"
                      value={day.to}
                      onChange={(e) => setDay({ to: e.target.value })}
                    />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">مغلق</span>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex justify-end pb-6">
        <Button size="lg" onClick={save}>
          <Save className="h-4 w-4" />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
}
