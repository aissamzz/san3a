"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PageQrCode({ url, slug }: { url: string; slug: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const download = () => {
    const canvas = wrapperRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `san3apages-${slug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={wrapperRef} className="rounded-xl border bg-white p-4">
        <QRCodeCanvas value={url} size={180} level="M" marginSize={2} />
      </div>
      <Button variant="outline" size="sm" onClick={download}>
        <Download />
        تحميل رمز QR
      </Button>
    </div>
  );
}
