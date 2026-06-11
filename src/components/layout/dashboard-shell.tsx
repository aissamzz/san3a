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
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/dashboard/edit", label: "تعديل الصفحة", icon: PencilRuler },
  { href: "/dashboard/appointments", label: "المواعيد", icon: CalendarDays },
  { href: "/dashboard/invoices", label: "الفواتير", icon: ReceiptText },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/users", label: "المستخدمون", icon: Users },
  { href: "/admin/keys", label: "مفاتيح التفعيل", icon: KeyRound },
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
        <Link href="/" className="flex items-center gap-2 border-b px-6 py-5">
          <Hammer className="h-6 w-6 text-primary" />
          <span className="text-lg font-extrabold">
            صنعة<span className="text-primary">بيدجز</span>
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
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
            <div className="font-bold">{profile.name}</div>
            <div className="text-xs text-muted-foreground">{profile.email}</div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar */}
        <header className="no-print sticky top-0 z-40 border-b bg-card md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <Hammer className="h-5 w-5 text-primary" />
              <span className="font-extrabold">
                صنعة<span className="text-primary">بيدجز</span>
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="تسجيل الخروج">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
