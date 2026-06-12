# صنعة — san3apages.com

SaaS للحرفيين الجزائريين: صفحة بورتفوليو احترافية برابط واحد، حجز مواعيد عبر واتساب، فواتير PDF، ورمز QR — بتفعيل سنوي بمفتاح يُباع نقداً.

## التشغيل المحلي

انسخ متغيرات البيئة واربط المشروع بـ Supabase:

```bash
cp .env.example .env.local
npm install
npm run dev
```

المتغيرات المطلوبة:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

قبل تشغيل التطبيق، نفّذ المخطط الموجود في `supabase/schema.sql` داخل Supabase SQL Editor.

## Supabase

- المصادقة تتم عبر Supabase Auth.
- البيانات مخزنة في جداول `profiles`, `pages`, `appointments`, `invoices`, و `activation_keys`.
- سياسات RLS موجودة في `supabase/schema.sql`.
- أول مسؤول يجب إنشاؤه بتحديث صف `profiles.role` إلى `admin` من Supabase dashboard أو باستخدام service role في بيئة آمنة.
- للحصول على تجربة تسجيل مباشرة، عطّل تأكيد البريد الإلكتروني في Supabase Auth أو أضف تدفق تأكيد بريد قبل تحويل المستخدم للوحة التحكم.

## Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key" \
  -t san3a .

docker run -p 3000:3000 san3a
```

## البنية

- Next.js App Router + TypeScript + Tailwind CSS v4
- واجهة عربية RTL
- `src/lib/store.ts` هو مدخل البيانات الوحيد ويستخدم `@supabase/supabase-js`
- `src/lib/supabase.ts` ينشئ Supabase client من متغيرات البيئة
- `supabase/schema.sql` يحتوي الجداول والسياسات

## المسارات

| المسار | الوصف |
| --- | --- |
| `/` | صفحة الهبوط |
| `/[slug]` | صفحة الحرفي العمومية |
| `/login` · `/signup` | المصادقة |
| `/dashboard` | لوحة الحرفي |
| `/dashboard/edit` | تعديل الصفحة |
| `/dashboard/appointments` | إدارة المواعيد |
| `/dashboard/invoices` | الفواتير |
| `/dashboard/settings` | التفعيل والحساب |
| `/admin` | لوحة المسؤول |
| `/admin/users` | إدارة المستخدمين |
| `/admin/keys` | توليد مفاتيح التفعيل |
| `/admin/settings` | إعدادات المنصة |
| `/privacy` · `/refund` · `/terms` | الصفحات القانونية |
