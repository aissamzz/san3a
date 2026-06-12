"use client";

import { Database, Settings2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">إعدادات المنصة</h1>
        <p className="text-muted-foreground">الإعدادات العامة لمنصة صنعة</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            التسعير
          </CardTitle>
          <CardDescription>
            سعر الاشتراك السنوي المعروض في الموقع — سيصبح قابلاً للتعديل مع ربط قاعدة البيانات
          </CardDescription>
        </CardHeader>
        <CardContent className="flex max-w-xs items-end gap-3">
          <div className="flex-1 space-y-2">
            <Label>السعر السنوي (دج)</Label>
            <Input dir="ltr" value="4500" readOnly />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="h-5 w-5 text-primary" />
            قاعدة البيانات
          </CardTitle>
          <CardDescription>
            البيانات مرتبطة الآن بجداول Supabase. استعمل لوحة Supabase لإدارة النسخ الاحتياطي، RLS، ومفاتيح الخدمة.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          لا توجد بيانات محلية لإعادة ضبطها.
        </CardContent>
      </Card>
    </div>
  );
}
