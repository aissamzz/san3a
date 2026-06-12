import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Toaster } from "sonner";

import { BRAND, SITE_URL } from "@/lib/config";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND} | صفحات احترافية للحرفيين في الجزائر`,
    template: `%s | ${BRAND}`,
  },
  description:
    "أنشئ صفحة احترافية لعرض أعمالك وخدماتك واستقبل حجوزات زبائنك عبر واتساب، مع فواتير جاهزة للطباعة ورمز QR. منصة صنعة للحرفيين في الجزائر.",
  keywords: [
    "صنعة",
    "حرفيين الجزائر",
    "صفحة احترافية للحرفي",
    "حجز مواعيد واتساب",
    "فواتير للحرفيين",
    "نجار",
    "دهان",
    "حلويات",
    "مصور",
    "san3apages",
  ],
  applicationName: BRAND,
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    siteName: BRAND,
    url: SITE_URL,
    title: `${BRAND} | صفحات احترافية للحرفيين في الجزائر`,
    description:
      "صفحة احترافية لعرض أعمالك مع حجز المواعيد عبر واتساب، فواتير PDF ورمز QR — اشتراك سنوي بـ 4500 دج دون بطاقة بنكية.",
  },
  twitter: {
    card: "summary",
    title: `${BRAND} | صفحات احترافية للحرفيين في الجزائر`,
    description:
      "صفحة احترافية لعرض أعمالك مع حجز المواعيد عبر واتساب، فواتير PDF ورمز QR.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="bottom-center" richColors dir="rtl" />
      </body>
    </html>
  );
}
