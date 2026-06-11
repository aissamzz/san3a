"use client";

import { useState } from "react";
import { KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { activateWithKey, isPageLive, resetDemoData } from "@/lib/store";
import { useMyPage } from "@/lib/use-my-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { page, profile, loaded, refresh } = useMyPage();
  const [key, setKey] = useState("");

  if (!loaded || !page || !profile) return null;

  const live = isPageLive(page);

  const activate = () => {
    if (!key.trim()) {
      toast.error("أدخل مفتاح التفعيل");
      return;
    }
    const result = activateWithKey(page.id, key);
    if (result.ok) {
      toast.success(result.message);
      setKey("");
      refresh();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">الإعدادات</h1>
        <p className="text-muted-foreground">حسابك واشتراكك</p>
      </div>

      {/* Activation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            تفعيل الاشتراك
          </CardTitle>
          <CardDescription>
            اشترِ مفتاح تفعيل بـ 4500 دج من نقاط البيع المعتمدة وأدخله هنا لنشر صفحتك لمدة سنة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border bg-muted/50 px-4 py-3">
            <span className="text-sm font-semibold">حالة الاشتراك</span>
            {live ? (
              <Badge variant="success">مفعّل حتى {page.activatedUntil}</Badge>
            ) : (
              <Badge variant="warning">غير مفعّل</Badge>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="activation-key">مفتاح التفعيل</Label>
            <div className="flex gap-2">
              <Input
                id="activation-key"
                dir="ltr"
                placeholder="SP-XXXX-XXXX-XXXX"
                className="font-mono"
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
              />
              <Button onClick={activate}>تفعيل</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              تلميح تجريبي: جرّب المفتاح <code dir="ltr">SP-2026-DEMO-0001</code>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            معلومات الحساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>الاسم</Label>
              <Input value={profile.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>
              <Input value={profile.email} dir="ltr" readOnly />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            تغيير كلمة السر وبيانات الحساب سيتوفر مع ربط المنصة بنظام المصادقة (Supabase).
          </p>
        </CardContent>
      </Card>

      {/* Demo reset */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">بيانات تجريبية</CardTitle>
          <CardDescription>
            هذه النسخة التجريبية تخزن البيانات في متصفحك فقط. يمكنك إعادة ضبطها في أي وقت.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => {
              resetDemoData();
              refresh();
              toast.success("تمت إعادة ضبط البيانات التجريبية");
            }}
          >
            <RefreshCw className="h-4 w-4" />
            إعادة ضبط البيانات
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
