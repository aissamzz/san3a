import Link from "next/link";
import { Hammer } from "lucide-react";

import { BRAND } from "@/lib/config";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Hammer className="h-4 w-4" />
          </span>
          <span className="text-xl font-extrabold">{BRAND}</span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button variant="ghost" size="sm" className="sm:h-11 sm:px-5" asChild>
            <Link href="/login">دخول</Link>
          </Button>
          <Button size="sm" className="sm:h-11 sm:px-5" asChild>
            <Link href="/signup">أنشئ صفحتك</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
