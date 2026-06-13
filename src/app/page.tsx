import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  Hammer,
  KeyRound,
  MapPin,
  Paintbrush,
  QrCode,
  ReceiptText,
  Sparkles,
  Star,
  UserPlus,
  CakeSlice,
} from "lucide-react";

import { BRAND, PRICE_DZD, SITE_URL, SUPPORT_EMAIL } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { WhatsAppIcon } from "@/components/public/whatsapp-icon";

export const metadata: Metadata = {
  title: "صنعة | صفحات احترافية للحرفيين في الجزائر",
  description:
    "أنشئ صفحة احترافية لعرض أعمالك وخدماتك مع حجز المواعيد عبر واتساب، فواتير جاهزة للطباعة ورمز QR. منصة صنعة للحرفيين في الجزائر — اشتراك سنوي بـ 4500 دج.",
  alternates: { canonical: "/" },
};

const features = [
  {
    icon: Sparkles,
    title: "صفحة احترافية باسمك",
    description:
      "اعرض خدماتك وأسعارك وصور أعمالك في رابط واحد يسهل مشاركته مع زبائنك: san3apages.com/اسمك",
  },
  {
    icon: WhatsAppIcon,
    title: "حجز المواعيد عبر واتساب",
    description:
      "يطّلع زبائنك على أوقات عملك المتاحة، يختارون اليوم والساعة، ويحجزون مباشرة عبر واتساب.",
  },
  {
    icon: CalendarDays,
    title: "تنظيم المواعيد",
    description:
      "تُسجَّل حجوزات صفحتك تلقائياً في لوحة التحكم، ويمكنك إضافة مواعيدك يدوياً لتفادي أي تعارض.",
  },
  {
    icon: ReceiptText,
    title: "فواتير جاهزة للطباعة",
    description:
      "أنشئ فواتير احترافية باسم نشاطك خلال ثوانٍ، ثم حمّلها بصيغة PDF أو اطبعها مباشرة.",
  },
  {
    icon: QrCode,
    title: "رمز QR لصفحتك",
    description:
      "حمّل رمز QR الخاص بصفحتك وضعه في محلك أو على بطاقة زيارتك، ليصل إليك الزبون بمسحة واحدة.",
  },
  {
    icon: KeyRound,
    title: "تفعيل دون بطاقة بنكية",
    description:
      "ادفع نقداً لدى أقرب نقطة بيع واحصل على مفتاح تفعيل، أدخله في حسابك لتُنشر صفحتك فوراً.",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "سجّل مجاناً",
    description: "أنشئ حسابك وجهّز صفحتك: معلومات نشاطك، خدماتك، وصور أعمالك.",
  },
  {
    icon: KeyRound,
    title: "فعّل بمفتاح",
    description: `اشترِ مفتاح تفعيل بـ ${PRICE_DZD} دج للسنة من نقاط البيع المعتمدة وأدخله في إعداداتك.`,
  },
  {
    icon: Sparkles,
    title: "انشر واستقبل الزبائن",
    description: "شارك رابط صفحتك أو رمز QR واستقبل الحجوزات مباشرة على واتساب.",
  },
];

const demoPages = [
  { slug: "najjar-mohamed", name: "ورشة النجار محمد", craft: "نجّار", city: "الجزائر", icon: Hammer },
  { slug: "dahane-karim", name: "دهان وديكور كريم", craft: "دهّان", city: "وهران", icon: Paintbrush },
  { slug: "halawiyat-sara", name: "حلويات سارة", craft: "صانعة حلويات", city: "قسنطينة", icon: CakeSlice },
];

const testimonials = [
  {
    name: "محمد",
    craft: "نجّار، الجزائر",
    avatar: "https://i.pravatar.cc/120?img=12",
    quote:
      "صار زبائني يشاهدون أعمالي كاملة قبل أن يتصلوا بي. صفحتي أعطتني مصداقية كنت أحتاجها منذ سنوات.",
  },
  {
    name: "كريم",
    craft: "دهّان، وهران",
    avatar: "https://i.pravatar.cc/120?img=33",
    quote:
      "وضعت رمز QR على واجهة المحل، والزبائن يحجزون مواعيدهم عبر واتساب مباشرة. وفّر علي مكالمات كثيرة.",
  },
  {
    name: "سارة",
    craft: "صانعة حلويات، قسنطينة",
    avatar: "https://i.pravatar.cc/120?img=47",
    quote:
      "الفواتير الجاهزة للطباعة أعطت طلباتي طابعاً احترافياً. والسعر معقول جداً مقارنة بما كنت أتوقعه.",
  },
  {
    name: "يوسف",
    craft: "حلاق، عنابة",
    avatar: "https://i.pravatar.cc/120?img=8",
    quote:
      "التسجيل كان سهلاً جداً، وفي أقل من نصف ساعة كانت صفحتي جاهزة وأرسلتها لكل زبائني على واتساب.",
  },
];

const faqs = [
  {
    q: "كيف أدفع قيمة الاشتراك؟",
    a: `لا تحتاج إلى بطاقة بنكية. اشترِ مفتاح تفعيل من نقاط البيع المعتمدة أو من موزعينا بـ ${PRICE_DZD} دج، ثم أدخله في إعدادات حسابك لتُفعَّل صفحتك لمدة سنة كاملة.`,
  },
  {
    q: "ماذا يحدث عندما يحجز زبون من صفحتي؟",
    a: 'يختار الزبون اليوم والساعة من أوقات عملك المتاحة، ثم يضغط على "احجز عبر واتساب". تصلك رسالة واتساب بكل التفاصيل، ويُسجَّل الموعد تلقائياً في لوحة التحكم حتى لا يُحجز الوقت نفسه مرتين.',
  },
  {
    q: "هل يمكنني التجربة قبل الدفع؟",
    a: "نعم، التسجيل مجاني ويمكنك تجهيز صفحتك كاملة ومعاينتها. لا تحتاج إلى مفتاح التفعيل إلا لنشر الصفحة للعموم.",
  },
  {
    q: "ماذا أحتاج لأبدأ؟",
    a: "هاتفك فقط: اسم نشاطك، وصف قصير، أسعار خدماتك، وبعض صور أعمالك. خلال دقائق تكون صفحتك جاهزة.",
  },
  {
    q: "هل يمكنني استرجاع أموالي؟",
    a: "نعم، يمكنك طلب استرجاع كامل للمبلغ خلال 7 أيام من تاريخ تفعيل المفتاح. راجع سياسة الاسترجاع للتفاصيل.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: BRAND,
      url: SITE_URL,
      email: SUPPORT_EMAIL,
      description: "منصة جزائرية تتيح للحرفيين إنشاء صفحات احترافية لعرض أعمالهم واستقبال حجوزات الزبائن عبر واتساب.",
      areaServed: "DZ",
    },
    {
      "@type": "WebSite",
      name: BRAND,
      url: SITE_URL,
      inLanguage: "ar",
    },
    {
      "@type": "Product",
      name: `اشتراك ${BRAND} السنوي`,
      description: "صفحة احترافية للحرفي مع حجز المواعيد عبر واتساب، فواتير PDF ورمز QR.",
      offers: {
        "@type": "Offer",
        price: String(PRICE_DZD),
        priceCurrency: "DZD",
        availability: "https://schema.org/InStock",
        url: SITE_URL,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent/70 via-background to-background" />
          <div className="pointer-events-none absolute -start-24 top-16 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -end-24 top-40 -z-10 h-72 w-72 rounded-full bg-secondary blur-3xl" />
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20 md:py-28">
            <div className="animate-rise-in mx-auto mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-bold text-muted-foreground shadow-soft">
              <Sparkles className="h-4 w-4 text-primary" />
              منصة الحرفيين في الجزائر
            </div>
            <h1
              className="animate-rise-in mx-auto max-w-3xl text-balance text-3xl font-extrabold leading-[1.25] sm:text-4xl md:text-5xl md:leading-[1.2]"
              style={{ animationDelay: "80ms" }}
            >
              صنعتك تستحق صفحة <span className="text-primary">باسمك</span> على الإنترنت
            </h1>
            <p
              className="animate-rise-in mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              نجّار، دهّان، حلواني، مصوّر... أيّاً كانت صنعتك، أنشئ صفحة احترافية تعرض فيها أعمالك
              وخدماتك، واستقبل حجوزات زبائنك مباشرة عبر واتساب.
            </p>
            <div
              className="animate-rise-in mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/signup">أنشئ صفحتك مجاناً</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/najjar-mohamed">شاهد صفحة تجريبية</Link>
              </Button>
            </div>
            <p
              className="animate-rise-in mt-6 inline-block rounded-full bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-soft"
              dir="ltr"
              style={{ animationDelay: "320ms" }}
            >
              san3apages.com/<span className="font-extrabold text-primary">اسم-صنعتك</span>
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-extrabold">كل ما يحتاجه الحرفي في مكان واحد</h2>
          <p className="mt-3 text-center text-muted-foreground">
            دون تعقيد ودون مصاريف زائدة — أدوات بسيطة تخدمك كل يوم.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lifted"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-xl bg-accent p-3 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1.5 font-bold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-y bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-center text-3xl font-extrabold">كيف تعمل المنصة؟</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <div key={step.title} className="relative text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <div className="mb-1 text-sm font-bold text-primary">الخطوة {i + 1}</div>
                  <h3 className="mb-1.5 text-lg font-bold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-extrabold">سعر واحد، دون مفاجآت</h2>
          <Card className="mx-auto mt-10 max-w-md border-2 border-primary shadow-lifted">
            <CardContent className="p-8 text-center">
              <div className="text-sm font-bold text-primary">الاشتراك السنوي</div>
              <div className="mt-3 flex items-baseline justify-center gap-2">
                <span className="text-5xl font-extrabold">{PRICE_DZD}</span>
                <span className="text-xl font-bold text-muted-foreground">دج / سنة</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">أقل من 400 دج في الشهر</p>
              <ul className="mt-6 space-y-3 text-start text-sm">
                {[
                  "صفحة احترافية برابط خاص بك",
                  "حجوزات غير محدودة عبر واتساب",
                  "فواتير PDF غير محدودة",
                  "رمز QR لصفحتك",
                  "تعديل صفحتك في أي وقت",
                  "دفع نقدي عبر مفتاح تفعيل — دون بطاقة بنكية",
                  "إمكانية استرجاع المبلغ خلال 7 أيام",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-8 w-full" asChild>
                <Link href="/signup">ابدأ الآن مجاناً</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Demo pages */}
        <section className="border-y bg-card">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 className="text-center text-3xl font-extrabold">صفحات تجريبية</h2>
            <p className="mt-3 text-center text-muted-foreground">
              شاهد كيف تظهر صفحتك لزبائنك
            </p>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {demoPages.map((demo) => (
                <Link key={demo.slug} href={`/${demo.slug}`}>
                  <Card className="h-full transition-shadow hover:shadow-lifted">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                        <demo.icon className="h-7 w-7" />
                      </div>
                      <h3 className="font-bold">{demo.name}</h3>
                      <p className="text-sm text-muted-foreground">{demo.craft}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {demo.city}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-extrabold">ماذا يقول الحرفيون؟</h2>
          <p className="mt-3 text-center text-muted-foreground">
            تجارب حقيقية من حرفيين بدأوا باستخدام صنعة
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t) => (
              <Card key={t.name} className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lifted">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-1 flex gap-0.5 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    “{t.quote}”
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.craft}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-center text-3xl font-extrabold">أسئلة شائعة</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-xl border bg-card p-5">
                <summary className="cursor-pointer list-none font-bold marker:hidden">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center">
            <Hammer className="mx-auto mb-4 h-10 w-10 opacity-80" />
            <h2 className="text-3xl font-extrabold">جاهز لتصل صنعتك إلى زبائن أكثر؟</h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">
              سجّل اليوم، جهّز صفحتك خلال دقائق، ودع زبائنك يحجزون لديك بضغطة زر.
            </p>
            <Button size="lg" variant="secondary" className="mt-7" asChild>
              <Link href="/signup">أنشئ صفحتك الآن</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
