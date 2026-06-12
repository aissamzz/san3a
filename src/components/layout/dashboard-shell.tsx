"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  Hammer,
  KeyRound,
  LayoutDashboard,
  LogOut,
  PencilRuler,
  ReceiptText,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getSession, logout } from "@/lib/store";
import type { Profile, Role } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const userNav: NavItem[] = [
  { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/dashboard/edit", label: "صفحتي", icon: PencilRuler },
  { href: "/dashboard/appointments", label: "المواعيد", icon: CalendarDays },
  { href: "/dashboard/invoices", label: "الفواتير", icon: ReceiptText },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/users", label: "المستخدمون", icon: Users },
  { href: "/admin/keys", label: "المفاتيح", icon: KeyRound },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function DashboardShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== role) {
      router.replace(session.role === "admin" ? "/admin" : "/dashboard");
      return;
    }
    setProfile(session);
    setChecked(true);
  }, [router, role]);

  if (!checked || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        جاري التحميل...
      </div>
    );
  }

  const nav = role === "admin" ? adminNav : userNav;
  const isActive = (href: string) =>
    href === "/dashboard" || href === "/admin" ? pathname === href : pathname.startsWith(href);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar (desktop) */}
      <aside className="no-print hidden w-64 shrink-0 flex-col border-e bg-card md:flex">
        <Link href="/" className="flex items-center gap-2.5 border-b px-6 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Hammer className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold">صنعة</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-3">
          <div className="mb-2 px-3 text-sm">
            <div className="truncate font-bold">{profile.name}</div>
            <div className="truncate text-xs text-muted-foreground" dir="ltr">
              {profile.email}
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar */}
        <header className="no-print sticky top-0 z-40 border-b bg-card/95 backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Hammer className="h-4 w-4" />
              </span>
              <span className="font-extrabold">صنعة</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="تسجيل الخروج">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 pb-28 md:p-8 md:pb-8">{children}</main>

        {/* Mobile bottom navigation */}
        <nav className="no-print fixed inset-x-0 bottom-0 z-50 border-t bg-card/95 pb-safe backdrop-blur md:hidden">
          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}
          >
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 py-2 text-[11px] font-bold transition-colors",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                      active && "bg-accent"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
