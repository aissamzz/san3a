# صنعةبيدجز — san3apages.com

SaaS للحرفيين الجزائريين: صفحة بورتفوليو احترافية برابط واحد `san3apages.com/slug`، حجز مواعيد عبر واتساب، فواتير PDF، ورمز QR — بتفعيل سنوي بمفتاح يُباع نقداً (4500 دج/سنة).

## النسخة الحالية (Frontend demo)

واجهة كاملة قابلة للنشر والتجربة، **ببيانات تجريبية مخزنة في المتصفح** (localStorage). لا تحتاج أي إعداد خلفي.

### حسابات تجريبية

| الدور | البريد | كلمة السر |
| --- | --- | --- |
| حرفي | `demo@san3apages.com` | `demo1234` |
| مسؤول | `admin@san3apages.com` | `admin1234` |

(توجد أزرار دخول سريع في صفحة `/login`)

مفتاح تفعيل تجريبي: `SP-2026-DEMO-0001`

### صفحات تجريبية

- `/najjar-mohamed` — نجّار (الجزائر)
- `/dahane-karim` — دهّان (وهران)
- `/halawiyat-sara` — صانعة حلويات (قسنطينة)
- `/photo-amine` — مصوّر (عنابة، غير مفعّلة — لمعاينة حالة عدم التفعيل)

## التشغيل

```bash
npm install
npm run dev   # http://localhost:3000
```

النشر: يعمل مباشرة على Vercel بدون متغيرات بيئة.

## البنية

- **Next.js (App Router) + TypeScript + Tailwind CSS v4** — مكونات UI بأسلوب shadcn/ui في `src/components/ui`
- **عربية بالكامل، RTL، خط Cairo**
- `src/lib/types.ts` — الأنواع، تطابق مخطط جداول Supabase المستقبلي
- `src/lib/store.ts` — **طبقة البيانات الوحيدة**: كل القراءة/الكتابة تمر من هنا (localStorage حالياً). ترحيل Supabase = إعادة كتابة هذا الملف فقط (+ auth)
- `src/lib/seed.ts` — البيانات التجريبية

### الخريطة

| المسار | الوصف |
| --- | --- |
| `/` | صفحة الهبوط التسويقية |
| `/[slug]` | صفحة الحرفي العمومية (خدمات، معرض، حجز واتساب، اتصال) |
| `/login` · `/signup` | المصادقة (تجريبية) |
| `/dashboard` | لوحة الحرفي: نظرة عامة + رابط الصفحة + QR |
| `/dashboard/edit` | تعديل الصفحة: معلومات، خدمات، معرض، أوقات العمل |
| `/dashboard/appointments` | المواعيد (حجوزات الصفحة + إضافة يدوية) |
| `/dashboard/invoices` | الفواتير + إنشاء + طباعة/PDF |
| `/dashboard/settings` | التفعيل بالمفتاح + الحساب |
| `/admin` | لوحة المسؤول: إحصائيات |
| `/admin/users` | إدارة المستخدمين (بحث، إيقاف) |
| `/admin/keys` | توليد وإدارة مفاتيح التفعيل |
| `/admin/settings` | إعدادات المنصة |

## الخطوة القادمة: Supabase

1. جداول: `profiles`, `pages`, `services`, `gallery`, `appointments`, `invoices`, `activation_keys` (المخطط جاهز في `src/lib/types.ts`)
2. Supabase Auth بدل المصادقة التجريبية + RLS حسب الدور (`user`/`admin`)
3. Supabase Storage لصور المعرض بدل data URLs
4. إعادة تنفيذ دوال `src/lib/store.ts` بـ `supabase-js`
