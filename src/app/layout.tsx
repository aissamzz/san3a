import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "صنعة بيدجز | صفحتك المهنية في دقائق",
  description:
    "أنشئ صفحة احترافية لعرض خدماتك وأعمالك واستقبل حجوزات زبائنك عبر واتساب. منصة الحرفيين في الجزائر.",
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
