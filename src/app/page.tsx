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
  UserPlus,
  Camera,
  CakeSlice,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WhatsAppIcon } from "@/components/public/whatsapp-icon";

const features = [
  {
    icon: Sparkles,
    title: "صفحة احترافية بإسمك",
    description: "اعرض خدماتك، أسعارك وصور أعمالك في رابط واحد سهل المشاركة: san3apages.com/إسمك",
  },
  {
    icon: WhatsAppIcon,
    title: "حجوزات عبر واتساب",
    description: "زبائنك يشوفون أوقات فراغك، يختارون اليوم والساعة ويحجزون مباشرة عبر واتساب.",
  },
  {
    icon: CalendarDays,
    title: "تنظيم المواعيد",
    description: "كل الحجوزات تتسجل في لوحة تحكمك، وتقدر تزيد مواعيد زبائنك يدوياً باش ما يصراش تضارب.",
  },
  {
    icon: ReceiptText,
    title: "فواتير جاهزة للطباعة",
    description: "أنشئ فواتير احترافية بإسم نشاطك في ثواني وحمّلها PDF أو اطبعها مباشرة.",
  },
  {
    icon: QrCode,
    title: "رمز QR لصفحتك",
    description: "حمّل رمز QR والصقه في محلك أو بطاقة زيارتك، الزبون يسكانيه ويوصل لصفحتك مباشرة.",
  },
  {
    icon: KeyRound,
    title: "تفعيل بدون بطاقة بنكية",
    description: "ادفع عند أقرب نقطة بيع واستلم مفتاح تفعيل، أدخله في حسابك وصفحتك تولي مباشرة على النت.",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "سجّل مجاناً",
    description: "أنشئ حسابك وجهّز صفحتك: معلوماتك، خدماتك وصور أعمالك.",
  },
  {
    icon: KeyRound,
    title: "فعّل بمفتاح",
    description: "اشترِ مفتاح تفعيل بـ 4500 دج للسنة من نقاط البيع وأدخله في إعداداتك.",
  },
  {
    icon: Sparkles,
    title: "انشر واستقبل الزبائن",
    description: "شارك رابطك أو رمز QR واستقبل الحجوزات مباشرة في واتسابك.",
  },
];

const demoPages = [
  { slug: "najjar-mohamed", name: "ورشة النجار محمد", craft: "نجّار", city: "الجزائر", icon: Hammer },
  { slug: "dahane-karim", name: "دهان وديكور كريم", craft: "دهّان", city: "وهران", icon: Paintbrush },
  { slug: "halawiyat-sara", name: "حلويات سارة", craft: "صانعة حلويات", city: "قسنطينة", icon: CakeSlice },
];

const faqs = [
  {
    q: "كيفاش نخلص الاشتراك؟",
    a: "ما تحتاجش بطاقة بنكية. تشري مفتاح تفعيل من نقاط البيع المعتمدة أو من موزعينا بـ 4500 دج، تدخله في إعدادات حسابك وصفحتك تتفعل لمدة سنة كاملة.",
  },
  {
    q: "واش يصرا كي يحجز زبون من صفحتي؟",
    a: "الزبون يختار اليوم والساعة من أوقات عملك، يكتب اسمه ويضغط على \"احجز عبر واتساب\". تجيك رسالة واتساب فيها كل التفاصيل، والموعد يتسجل تلقائياً في لوحة تحكمك باش ما يتحجزش نفس الوقت مرتين.",
  },
  {
    q: "نقدر نجرب قبل ما نخلص؟",
    a: "نعم، التسجيل مجاني وتقدر تجهز صفحتك كاملة وتشوفها. المفتاح تحتاجه غير باش تنشر الصفحة للعموم.",
  },
  {
    q: "واش نحتاج باش نبدا؟",
    a: "غير هاتفك! اسم نشاطك، وصف قصير، أسعار خدماتك وشوية صور من أعمالك. في 10 دقائق صفحتك جاهزة.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Link href="/" className="flex items-center gap-2">
            <Hammer className="h-6 w-6 text-primary" />
            <span className="text-xl font-extrabold">
              صنعة<span className="text-primary">بيدجز</span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Button variant="ghost" size="sm" className="sm:h-11 sm:px-5" asChild>
              <Link href="/login">دخول</Link>
            </Button>
            <Button size="sm" className="sm:h-11 sm:px-5" asChild>
              <Link href="/signup">أنشئ صفحتك</Link>
            </Button>
          </div>
        </div>
      </header>

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
            <h1 className="animate-rise-in mx-auto max-w-3xl text-balance text-3xl font-extrabold leading-[1.25] sm:text-4xl md:text-5xl md:leading-[1.2]" style={{ animationDelay: "80ms" }}>
              صنعتك تستاهل صفحة <span className="text-primary">باسمك</span> على الإنترنت
            </h1>
            <p className="animate-rise-in mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg" style={{ animationDelay: "160ms" }}>
              نجّار، دهّان، حلواني، مصوّر... أيّاً كانت صنعتك، أنشئ صفحة احترافية تعرض فيها أعمالك
              وخدماتك، واستقبل حجوزات زبائنك مباشرة عبر واتساب.
            </p>
            <div className="animate-rise-in mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "240ms" }}>
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/signup">أنشئ صفحتك مجاناً</Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/najjar-mohamed">شاهد صفحة تجريبية</Link>
              </Button>
            </div>
            <p className="animate-rise-in mt-6 inline-block rounded-full bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-soft" dir="ltr" style={{ animationDelay: "320ms" }}>
              san3apages.com/<span className="font-extrabold text-primary">إسم-صنعتك</span>
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-extrabold">كل ما يحتاجه الحرفي في مكان واحد</h2>
          <p className="mt-3 text-center text-muted-foreground">
            بدون تعقيد، بدون مصاريف زائدة. أدوات بسيطة تخدمك كل يوم.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
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
            <h2 className="text-center text-3xl font-extrabold">كيفاش تخدم؟</h2>
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
          <h2 className="text-center text-3xl font-extrabold">سعر واحد، بدون مفاجآت</h2>
          <Card className="mx-auto mt-10 max-w-md border-2 border-primary shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-sm font-bold uppercase text-primary">الاشتراك السنوي</div>
              <div className="mt-3 flex items-baseline justify-center gap-2">
                <span className="text-5xl font-extrabold">4500</span>
                <span className="text-xl font-bold text-muted-foreground">دج / سنة</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">أقل من 400 دج في الشهر</p>
              <ul className="mt-6 space-y-3 text-start text-sm">
                {[
                  "صفحة احترافية برابط خاص بك",
                  "حجوزات غير محدودة عبر واتساب",
                  "فواتير PDF غير محدودة",
                  "رمز QR لصفحتك",
                  "تعديل صفحتك وقتما تشاء",
                  "دفع نقدي عبر مفتاح تفعيل — بدون بطاقة بنكية",
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
            <p className="mt-3 text-center text-muted-foreground">شوف كيفاش تبان صفحتك للزبائن</p>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {demoPages.map((demo) => (
                <Link key={demo.slug} href={`/${demo.slug}`}>
                  <Card className="h-full transition-shadow hover:shadow-md">
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
            <Camera className="mx-auto mb-4 h-10 w-10 opacity-80" />
            <h2 className="text-3xl font-extrabold">جاهز باش توصل صنعتك لزبائن أكثر؟</h2>
            <p className="mx-auto mt-3 max-w-xl opacity-90">
              سجّل اليوم، جهّز صفحتك في دقائق، وخلي زبائنك يحجزو عندك بضغطة زر.
            </p>
            <Button size="lg" variant="secondary" className="mt-7" asChild>
              <Link href="/signup">أنشئ صفحتك الآن</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-foreground">
            <Hammer className="h-5 w-5 text-primary" />
            صنعة<span className="text-primary">بيدجز</span>
          </Link>
          <p>منصة الحرفيين الجزائريين — san3apages.com</p>
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
