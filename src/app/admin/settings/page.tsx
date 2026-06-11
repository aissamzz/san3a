"use client";

import { RefreshCw, Settings2 } from "lucide-react";
import { toast } from "sonner";

import { resetDemoData } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">إعدادات المنصة</h1>
        <p className="text-muted-foreground">الإعدادات العامة لصنعةبيدجز</p>
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
          <CardTitle className="text-base">بيانات تجريبية</CardTitle>
          <CardDescription>
            إعادة ضبط جميع البيانات التجريبية المخزنة في هذا المتصفح (مستخدمون، صفحات، مفاتيح...)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => {
              resetDemoData();
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
