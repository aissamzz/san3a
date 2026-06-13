// Hardcoded demo pages used on the landing page ("شاهد صفحة تجريبية").
// These are NOT stored in Supabase — they are served directly by the store
// (see getPageBySlug) so the demos work on a fresh install with an empty
// database. Phone / WhatsApp all point at the platform support number.
//
// Images use picsum.photos (free, stable, no-auth placeholders) so the demos
// always render. To use real craft photos, replace the URLs below — each is a
// single constant per image.

import type { Page } from "./types";
import { SUPPORT_WHATSAPP } from "./config";

const PHONE = "0553756663";
const WHATSAPP = SUPPORT_WHATSAPP; // 213553756663

// Standard week: Sunday–Thursday open, Friday closed, Saturday open.
function week(from = "09:00", to = "17:00"): Page["hours"] {
  return {
    0: { enabled: true, from, to }, // Sunday
    1: { enabled: true, from, to },
    2: { enabled: true, from, to },
    3: { enabled: true, from, to },
    4: { enabled: true, from, to }, // Thursday
    5: { enabled: false, from, to }, // Friday
    6: { enabled: true, from, to }, // Saturday
  };
}

const FAR_FUTURE = "2099-12-31";

export const DEMO_PAGES: Page[] = [
  {
    id: "demo-najjar-mohamed",
    userId: "demo",
    slug: "najjar-mohamed",
    businessName: "ورشة النجار محمد",
    craft: "نجّار",
    city: "الجزائر",
    description:
      "نجارة عصرية وكلاسيكية على المقاس: مطابخ، خزائن، أبواب وديكورات خشبية. خبرة تتجاوز خمسة عشر عاماً في خدمة عائلات العاصمة، مع التزام بالمواعيد وجودة التشطيب.",
    phone: PHONE,
    whatsapp: WHATSAPP,
    avatarUrl: "https://picsum.photos/seed/sanaa-najjar-avatar/400/400",
    coverUrl: "https://picsum.photos/seed/sanaa-najjar-cover/1200/400",
    services: [
      { id: "s1", name: "مطبخ خشب على المقاس", startingPrice: 120000 },
      { id: "s2", name: "خزانة ملابس مدمجة", startingPrice: 65000 },
      { id: "s3", name: "باب خشب داخلي", startingPrice: 22000 },
      { id: "s4", name: "مكتبة أو رفوف حائط", startingPrice: 18000 },
    ],
    gallery: [
      { id: "g1", url: "https://picsum.photos/seed/sanaa-najjar-1/800/800" },
      { id: "g2", url: "https://picsum.photos/seed/sanaa-najjar-2/800/800" },
      { id: "g3", url: "https://picsum.photos/seed/sanaa-najjar-3/800/800" },
      { id: "g4", url: "https://picsum.photos/seed/sanaa-najjar-4/800/800" },
      { id: "g5", url: "https://picsum.photos/seed/sanaa-najjar-5/800/800" },
      { id: "g6", url: "https://picsum.photos/seed/sanaa-najjar-6/800/800" },
    ],
    hours: week("08:30", "17:30"),
    activated: true,
    activatedUntil: FAR_FUTURE,
    suspended: false,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "demo-dahane-karim",
    userId: "demo",
    slug: "dahane-karim",
    businessName: "دهان وديكور كريم",
    craft: "دهّان",
    city: "وهران",
    description:
      "خدمات دهن وتشطيب احترافية للمنازل والمحلات: دهن جدران، جبس بلاكو، ديكورات وأصباغ حديثة. عمل نظيف، أسعار واضحة، ونتيجة تليق بمنزلك.",
    phone: PHONE,
    whatsapp: WHATSAPP,
    avatarUrl: "https://picsum.photos/seed/sanaa-dahane-avatar/400/400",
    coverUrl: "https://picsum.photos/seed/sanaa-dahane-cover/1200/400",
    services: [
      { id: "s1", name: "دهن شقة كاملة", startingPrice: 45000 },
      { id: "s2", name: "دهن الغرفة الواحدة", startingPrice: 9000 },
      { id: "s3", name: "ديكور جبس بلاكو", startingPrice: 15000 },
      { id: "s4", name: "دهن واجهة محل", startingPrice: 30000 },
    ],
    gallery: [
      { id: "g1", url: "https://picsum.photos/seed/sanaa-dahane-1/800/800" },
      { id: "g2", url: "https://picsum.photos/seed/sanaa-dahane-2/800/800" },
      { id: "g3", url: "https://picsum.photos/seed/sanaa-dahane-3/800/800" },
      { id: "g4", url: "https://picsum.photos/seed/sanaa-dahane-4/800/800" },
      { id: "g5", url: "https://picsum.photos/seed/sanaa-dahane-5/800/800" },
      { id: "g6", url: "https://picsum.photos/seed/sanaa-dahane-6/800/800" },
    ],
    hours: week("08:00", "18:00"),
    activated: true,
    activatedUntil: FAR_FUTURE,
    suspended: false,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "demo-halawiyat-sara",
    userId: "demo",
    slug: "halawiyat-sara",
    businessName: "حلويات سارة",
    craft: "صانعة حلويات",
    city: "قسنطينة",
    description:
      "حلويات تقليدية وعصرية محضّرة بمكوّنات طازجة: حلويات الأعراس، تورتات أعياد الميلاد، وطلبات المناسبات. نكهة قسنطينة الأصيلة بلمسة راقية.",
    phone: PHONE,
    whatsapp: WHATSAPP,
    avatarUrl: "https://picsum.photos/seed/sanaa-halawiyat-avatar/400/400",
    coverUrl: "https://picsum.photos/seed/sanaa-halawiyat-cover/1200/400",
    services: [
      { id: "s1", name: "صينية حلويات الأعراس (الكيلو)", startingPrice: 2800 },
      { id: "s2", name: "تورتة عيد ميلاد", startingPrice: 4500 },
      { id: "s3", name: "حلويات المناسبات (الكيلو)", startingPrice: 2200 },
      { id: "s4", name: "طلبات خاصة حسب الطلب", startingPrice: 3000 },
    ],
    gallery: [
      { id: "g1", url: "https://picsum.photos/seed/sanaa-halawiyat-1/800/800" },
      { id: "g2", url: "https://picsum.photos/seed/sanaa-halawiyat-2/800/800" },
      { id: "g3", url: "https://picsum.photos/seed/sanaa-halawiyat-3/800/800" },
      { id: "g4", url: "https://picsum.photos/seed/sanaa-halawiyat-4/800/800" },
      { id: "g5", url: "https://picsum.photos/seed/sanaa-halawiyat-5/800/800" },
      { id: "g6", url: "https://picsum.photos/seed/sanaa-halawiyat-6/800/800" },
    ],
    hours: week("09:00", "19:00"),
    activated: true,
    activatedUntil: FAR_FUTURE,
    suspended: false,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

const DEMO_SLUGS = new Set(DEMO_PAGES.map((p) => p.slug));
const DEMO_IDS = new Set(DEMO_PAGES.map((p) => p.id));

export function getDemoPageBySlug(slug: string): Page | null {
  return DEMO_PAGES.find((p) => p.slug === slug) ?? null;
}

export function isDemoSlug(slug: string): boolean {
  return DEMO_SLUGS.has(slug);
}

export function isDemoPageId(id: string): boolean {
  return DEMO_IDS.has(id);
}
