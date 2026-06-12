"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Eye, Hammer, MapPin, Phone, Share2 } from "lucide-react";
import { toast } from "sonner";

import { formatDZD, getPageBySlug, isPageLive } from "@/lib/store";
import type { Page } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingWidget } from "@/components/public/booking-widget";
import { Gallery } from "@/components/public/gallery";
import { WhatsAppIcon } from "@/components/public/whatsapp-icon";

export default function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [isPreview, setIsPreview] = useState(false);
  const [page, setPage] = useState<Page | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setIsPreview(new URLSearchParams(window.location.search).get("preview") === "1");
    void getPageBySlug(slug).then((found) => {
      setPage(found);
      setLoaded(true);
      if (found) {
        document.title = `${found.businessName}${found.craft ? ` – ${found.craft}` : ""} في ${found.city} | صنعة`;
      }
    });
  }, [slug]);

  const share = async () => {
    const url = window.location.origin + window.location.pathname;
    const title = page ? page.businessName : "صنعة";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("تم نسخ رابط الصفحة");
  };

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        جاري التحميل...
      </div>
    );
  }

  if (!page || (!isPageLive(page) && !isPreview)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <Hammer className="h-12 w-12 text-muted-foreground" />
        <h1 className="text-2xl font-extrabold">هذه الصفحة غير متوفرة</h1>
        <p className="max-w-md text-muted-foreground">
          الصفحة التي تبحث عنها غير موجودة أو غير مفعّلة حالياً.
        </p>
        <Button asChild>
          <Link href="/">العودة إلى منصة صنعة</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {isPreview && !isPageLive(page) && (
        <div className="flex items-center justify-center gap-2 bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
          <Eye className="h-4 w-4" />
          وضع المعاينة — هذه الصفحة غير منشورة للعموم بعد
        </div>
      )}

      {/* Cover */}
      <div className="relative h-44 w-full overflow-hidden bg-accent sm:h-56">
        {page.coverUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={page.coverUrl} alt="" className="h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-12">
        {/* Header */}
        <div className="relative z-10 -mt-12 mb-8 flex flex-col items-center text-center">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-background bg-card shadow-md">
            {page.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={page.avatarUrl} alt={page.businessName} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-primary">
                <Hammer className="h-10 w-10" />
              </div>
            )}
          </div>
          <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">{page.businessName}</h1>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {page.craft && <Badge variant="secondary">{page.craft}</Badge>}
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {page.city}
            </span>
          </div>
          {page.description && (
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{page.description}</p>
          )}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button asChild>
              <a href="#booking">
                <CalendarDays className="h-4 w-4" />
                احجز موعد
              </a>
            </Button>
            <Button variant="whatsapp" asChild>
              <a href={`https://wa.me/${page.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-4 w-4" />
                واتساب
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`tel:${page.phone}`}>
                <Phone className="h-4 w-4" />
                اتصل الآن
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-11 w-11" onClick={share} aria-label="مشاركة الصفحة">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Services */}
          {page.services.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>الخدمات والأسعار</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {page.services.map((service) => (
                    <li key={service.id} className="flex items-center justify-between gap-3 py-3">
                      <span className="font-semibold">{service.name}</span>
                      <span className="shrink-0 text-sm text-muted-foreground">
                        ابتداءً من{" "}
                        <span className="font-bold text-primary">{formatDZD(service.startingPrice)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Gallery */}
          {page.gallery.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>معرض الأعمال</CardTitle>
              </CardHeader>
              <CardContent>
                <Gallery images={page.gallery} businessName={page.businessName} />
              </CardContent>
            </Card>
          )}

          {/* Booking */}
          <BookingWidget page={page} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-5 pb-24 text-center text-sm text-muted-foreground sm:pb-5">
        <Link href="/" className="transition-colors hover:text-primary">
          صُنع بواسطة <span className="font-bold">san3apages</span>
        </Link>
      </footer>

      {/* Sticky mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 p-3 pb-safe backdrop-blur sm:hidden">
        <div className="flex gap-2">
          <Button variant="whatsapp" className="flex-1" asChild>
            <a href="#booking">
              <WhatsAppIcon className="h-4 w-4" />
              احجز عبر واتساب
            </a>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <a href={`tel:${page.phone}`}>
              <Phone className="h-4 w-4" />
              اتصل الآن
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
