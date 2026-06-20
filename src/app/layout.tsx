import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";

import { BRAND, META_PIXEL_ID, SITE_URL } from "@/lib/config";
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

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
