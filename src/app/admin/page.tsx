"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { KeyRound, KeySquare, UserCheck, Users, UserX } from "lucide-react";

import { getAdminStats } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Stats = ReturnType<typeof getAdminStats>;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    setStats(getAdminStats());
  }, []);

  if (!stats) return null;

  const cards = [
    { label: "إجمالي المستخدمين", value: stats.users, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "صفحات مفعّلة", value: stats.active, icon: UserCheck, color: "text-green-600 bg-green-50" },
    { label: "صفحات غير مفعّلة", value: stats.inactive, icon: UserX, color: "text-amber-600 bg-amber-50" },
    { label: "مفاتيح مستعملة", value: stats.keysUsed, icon: KeyRound, color: "text-purple-600 bg-purple-50" },
    { label: "مفاتيح متاحة", value: stats.keysUnused, icon: KeySquare, color: "text-primary bg-accent" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">لوحة تحكم المسؤول</h1>
        <p className="text-muted-foreground">نظرة عامة على المنصة</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`rounded-xl p-3 ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold tabular-nums">{card.value}</div>
                <div className="text-sm text-muted-foreground">{card.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/admin/keys">توليد مفاتيح جديدة</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/users">إدارة المستخدمين</Link>
        </Button>
      </div>
    </div>
  );
}
