import Link from "next/link";
import { Hammer } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-primary">
        <Hammer className="h-8 w-8" />
      </span>
      <p className="text-sm font-bold text-primary">404</p>
      <h1 className="text-2xl font-extrabold">الصفحة غير موجودة</h1>
      <p className="max-w-md text-muted-foreground">
        الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.
      </p>
      <Button asChild>
        <Link href="/">العودة إلى الصفحة الرئيسية</Link>
      </Button>
    </div>
  );
}
