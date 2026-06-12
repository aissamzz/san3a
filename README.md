# صنعة — san3apages.com

SaaS للحرفيين الجزائريين: صفحة بورتفوليو احترافية برابط واحد `san3apages.com/slug`، حجز مواعيد عبر واتساب، فواتير PDF، ورمز QR — بتفعيل سنوي بمفتاح يُباع نقداً (4500 دج/سنة).

## التشغيل

يحتاج المشروع مشروع Supabase (قاعدة بيانات + Auth + Storage).

1. أنشئ مشروع على [supabase.com](https://supabase.com)
2. نفّذ محتوى `supabase/schema.sql` في SQL Editor للمشروع — ينشئ الجداول، RLS، الدوال، والـ bucket العام `media`
3. أنشئ ملف `.env.local` (انظر `.env.local.example`) واملأ:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
4. ثبّت الاعتماديات وشغّل المشروع:
   ```bash
   npm install
   npm run dev   # http://localhost:3000
   ```

### إنشاء أول حساب مسؤول

التسجيل العادي عبر `/signup` ينشئ دائماً حساب حرفي (`role = 'user'`). لترقية حساب إلى مسؤول، نفّذ في SQL Editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

## البنية

- **Next.js (App Router) + TypeScript + Tailwind CSS v4** — مكونات UI بأسلوب shadcn/ui في `src/components/ui`
- **عربية بالكامل، RTL، خط Cairo**
- `src/lib/types.ts` — الأنواع، تطابق مخطط جداول Supabase في `supabase/schema.sql`
- `src/lib/store.ts` — **طبقة البيانات الوحيدة**: كل القراءة/الكتابة تمر من هنا عبر `supabase-js`
- `src/lib/supabase/client.ts` و `src/lib/supabase/server.ts` — عميل Supabase للمتصفح والخادم
- `src/proxy.ts` — تحديث جلسة المصادقة وحماية `/dashboard` و `/admin`

### الخريطة

| المسار | الوصف |
| --- | --- |
| `/` | صفحة الهبوط التسويقية |
| `/[slug]` | صفحة الحرفي العمومية (خدمات، معرض، حجز واتساب، اتصال) |
| `/login` · `/signup` | المصادقة (Supabase Auth) |
| `/dashboard` | لوحة الحرفي: نظرة عامة + رابط الصفحة + QR |
| `/dashboard/edit` | تعديل الصفحة: معلومات، خدمات، معرض، أوقات العمل |
| `/dashboard/appointments` | المواعيد (حجوزات الصفحة + إضافة يدوية) |
| `/dashboard/invoices` | الفواتير + إنشاء + طباعة/PDF |
| `/dashboard/settings` | التفعيل بالمفتاح + الحساب |
| `/admin` | لوحة المسؤول: إحصائيات |
| `/admin/users` | إدارة المستخدمين (بحث، إيقاف) |
| `/admin/keys` | توليد وإدارة مفاتيح التفعيل |
| `/admin/settings` | إعدادات المنصة |
| `/privacy` · `/refund` · `/terms` | الصفحات القانونية |

ملاحظة SEO: صفحات الحرفيين `/[slug]` تُعرض حالياً من المتصفح، لذا عنوان الصفحة يُضبط من الواجهة فقط. الـ SEO الكامل (metadata + sitemap ديناميكي من قاعدة البيانات) خطوة قادمة.
