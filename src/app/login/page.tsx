"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { login } from "@/lib/store";
import { BrandMark } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const doLogin = async (loginEmail: string, loginPassword: string) => {
    const profile = await login(loginEmail, loginPassword);
    if (!profile) {
      toast.error("البريد الإلكتروني أو كلمة السر غير صحيحة");
      return;
    }
    toast.success(`مرحباً ${profile.name}`);
    router.push(profile.role === "admin" ? "/admin" : "/dashboard");
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
          <CardTitle className="text-xl">تسجيل الدخول</CardTitle>
          <CardDescription>ادخل إلى لوحة تحكمك</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              doLogin(email, password);
            }}
          >
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
              دخول
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link href="/signup" className="font-bold text-primary hover:underline">
              سجّل مجاناً
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
