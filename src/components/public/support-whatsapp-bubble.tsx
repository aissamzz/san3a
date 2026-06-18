"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { BRAND, SUPPORT_WHATSAPP } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/public/whatsapp-icon";

const MESSAGE = `السلام عليكم، أريد الاستفسار عن منصة ${BRAND}.`;
const WA_LINK = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(MESSAGE)}`;

export function SupportWhatsAppBubble() {
  const [open, setOpen] = useState(false);

  return (
    <div className="no-print fixed bottom-6 start-4 z-50 flex flex-col items-start gap-3 md:start-6">
      {open && (
        <div className="w-64 rounded-2xl border bg-card p-4 shadow-lifted">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold leading-relaxed">
              لديك سؤال؟ تواصل معنا عبر واتساب
            </p>
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
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
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
        className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-[#1da851] text-white shadow-lifted transition-transform hover:scale-105 active:scale-95"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </button>
    </div>
  );
}
