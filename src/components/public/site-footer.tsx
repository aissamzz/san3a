import Link from "next/link";
import { Hammer } from "lucide-react";

import { BRAND, SITE_DOMAIN, SUPPORT_EMAIL } from "@/lib/config";

const footerLinks = [
  { href: "/privacy", label: "سياسة الخصوصية" },
  { href: "/refund", label: "سياسة الاسترجاع" },
  { href: "/terms", label: "شروط الاستخدام" },
  { href: "/login", label: "تسجيل الدخول" },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center text-sm text-muted-foreground">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Hammer className="h-4 w-4" />
          </span>
          {BRAND}
        </Link>
        <p>
          منصة الحرفيين في الجزائر — <span dir="ltr">{SITE_DOMAIN}</span>
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <p>
          للتواصل: <a href={`mailto:${SUPPORT_EMAIL}`} dir="ltr" className="hover:text-primary">{SUPPORT_EMAIL}</a>
        </p>
        <p>© {new Date().getFullYear()} {BRAND} — جميع الحقوق محفوظة</p>
      </div>
    </footer>
  );
}
