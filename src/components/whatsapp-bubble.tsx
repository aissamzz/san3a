"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { SUPPORT_WHATSAPP } from "@/lib/config";
import { isPageLive } from "@/lib/store";
import { useMyPage } from "@/lib/use-my-page";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/public/whatsapp-icon";

export function WhatsAppBubble() {
  const { page, loaded } = useMyPage();
  const [open, setOpen] = useState(false);

  if (!loaded || !page) return null;

  const live = isPageLive(page);
  const message = live
    ? "تواصل معنا إذا احتجت إلى أي مساعدة."
    : "تواصل معنا لتفعيل حسابك.";
  const prefilled = live
    ? `السلام عليكم، أنا صاحب الصفحة ${page.slug} وأحتاج إلى مساعدة.`
    : `السلام عليكم، أريد تفعيل حسابي (الصفحة: ${page.slug}).`;
  const waLink = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(prefilled)}`;

  return (
    <div className="no-print fixed bottom-24 start-4 z-50 flex flex-col items-start gap-3 md:bottom-6 md:start-6">
      {open && (
        <div className="w-64 rounded-2xl border bg-card p-4 shadow-lifted">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold leading-relaxed">{message}</p>
            <button
              type="button"
              aria-label="إغلاق"
              onClick={() => setOpen(false)}
              className="shrink-0 cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Button variant="whatsapp" size="sm" className="mt-3 w-full" asChild>
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-4 w-4" />
              فتح واتساب
            </a>
          </Button>
        </div>
      )}
      <button
        type="button"
        aria-label="الدعم عبر واتساب"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#1da851] text-white shadow-lifted transition-transform hover:scale-105 active:scale-95"
      >
        <WhatsAppIcon className="h-7 w-7" />
        {!live && !open && (
          <span className="absolute -end-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-amber-500" />
          </span>
        )}
      </button>
    </div>
  );
}
