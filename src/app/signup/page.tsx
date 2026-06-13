"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { signup } from "@/lib/store";
import { BrandMark } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("كلمة السر يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    const result = await signup(name, email, password);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    if (result.needsConfirmation) {
      toast.success(result.message);
      router.push("/login");
      return;
    }
    toast.success("مرحباً بك في صنعة! جهّز صفحتك الآن");
    router.push("/dashboard/edit");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-accent/50 to-background px-4 py-10">
      <Link href="/" className="mb-6 flex items-center gap-2">
        <BrandMark className="h-9 w-9" />
        <span className="text-2xl font-extrabold">
          صنعة
        </span>
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">أنشئ حسابك مجاناً</CardTitle>
          <CardDescription>سجّل وجهّز صفحتك في دقائق</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">الاسم الكامل أو اسم النشاط</Label>
              <Input
                id="name"
                placeholder="مثال: ورشة النجار محمد"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة السر</Label>
              <Input
                id="password"
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              إنشاء الحساب
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              سجّل الدخول
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
