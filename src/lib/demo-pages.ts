// Hardcoded demo pages used on the landing page ("شاهد صفحة تجريبية").
// These are NOT stored in Supabase — they are served directly by the store
// (see getPageBySlug) so the demos work on a fresh install with an empty
// database. Phone / WhatsApp all point at the platform support number.
//
// Images are free/openly-licensed photos from Wikimedia Commons and Flickr.
// Each image is a single direct URL (avatarUrl / coverUrl / gallery[].url) and
// can be swapped independently.

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
    avatarUrl:
      "https://upload.wikimedia.org/wikipedia/commons/6/62/Carpenter_%2810424%29_-_The_Noun_Project.svg",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/Paris_-_Carpenter_workshop_-_4944.jpg",
    services: [
      { id: "s1", name: "مطبخ خشب على المقاس", startingPrice: 120000 },
      { id: "s2", name: "خزانة ملابس مدمجة", startingPrice: 65000 },
      { id: "s3", name: "باب خشب داخلي", startingPrice: 22000 },
      { id: "s4", name: "مكتبة أو رفوف حائط", startingPrice: 18000 },
    ],
    gallery: [
      { id: "g1", url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Paris_-_Carpenter_workshop_-_4951.jpg" },
      { id: "g2", url: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Paris_-_Carpenter_workshop_-_4965.jpg" },
      { id: "g3", url: "https://upload.wikimedia.org/wikipedia/commons/0/03/Paris_-_Carpenter_workshop_-_4980.jpg" },
      { id: "g4", url: "https://live.staticflickr.com/2511/4112389321_fd8dfffd47_b.jpg" },
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
    avatarUrl:
      "https://upload.wikimedia.org/wikipedia/commons/5/5e/Font_Awesome_5_solid_paint-roller.svg",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/commons/e/e0/A_home_painter_at_work.jpg",
    services: [
      { id: "s1", name: "دهن شقة كاملة", startingPrice: 45000 },
      { id: "s2", name: "دهن الغرفة الواحدة", startingPrice: 9000 },
      { id: "s3", name: "ديكور جبس بلاكو", startingPrice: 15000 },
      { id: "s4", name: "دهن واجهة محل", startingPrice: 30000 },
    ],
    gallery: [
      { id: "g1", url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/0086_wall_painting.jpg" },
      { id: "g2", url: "https://upload.wikimedia.org/wikipedia/commons/6/63/Fort_Kochi_-_Wall_Painters_on_ropes.jpg" },
      { id: "g3", url: "https://live.staticflickr.com/1233/3267421536_3050c57cc3_b.jpg" },
      { id: "g4", url: "https://live.staticflickr.com/2111/1813415211_59a7ced74a.jpg" },
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
    avatarUrl:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Confectioner%2C_pastry-cook.svg",
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/Algerian_pastries.jpg",
    services: [
      { id: "s1", name: "صينية حلويات الأعراس (الكيلو)", startingPrice: 2800 },
      { id: "s2", name: "تورتة عيد ميلاد", startingPrice: 4500 },
      { id: "s3", name: "حلويات المناسبات (الكيلو)", startingPrice: 2200 },
      { id: "s4", name: "طلبات خاصة حسب الطلب", startingPrice: 3000 },
    ],
    gallery: [
      { id: "g1", url: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Tcharek_el_ariane_%28algerian_pastry%29.jpg" },
      { id: "g2", url: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Algerian_Pastry.JPG" },
      { id: "g3", url: "https://upload.wikimedia.org/wikipedia/commons/4/40/Makrout_ellouz.jpg" },
      { id: "g4", url: "https://live.staticflickr.com/7035/6429963321_293fd4a55f.jpg" },
      { id: "g5", url: "https://live.staticflickr.com/3158/5738006754_9f71cc072c.jpg" },
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
