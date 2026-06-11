"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { GalleryImage } from "@/lib/types";

export function Gallery({ images, businessName }: { images: GalleryImage[]; businessName: string }) {
  const [open, setOpen] = useState<GalleryImage | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpen(image)}
            className="group overflow-hidden rounded-xl border bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={businessName}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>
      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">{businessName}</DialogTitle>
          {open && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={open.url} alt={businessName} className="w-full rounded-lg object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
