// Types mirroring the future Supabase schema.
// When migrating, each interface maps to a table and the store functions
// in src/lib/store.ts get reimplemented with supabase-js calls.

export type Role = "user" | "admin";

export interface Profile {
  id: string;
  email: string;
  password: string; // mock only — real auth moves to Supabase Auth
  name: string;
  role: Role;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  startingPrice: number; // DZD
}

export interface GalleryImage {
  id: string;
  url: string;
}

export interface DayHours {
  enabled: boolean;
  from: string; // "09:00"
  to: string; // "17:00"
}

// keys are JS getDay() values: 0 = Sunday ... 6 = Saturday
export type WeeklyHours = Record<number, DayHours>;

export interface Page {
  id: string;
  userId: string;
  slug: string;
  businessName: string;
  craft: string; // e.g. نجّار، دهّان...
  city: string;
  description: string;
  phone: string; // for "call now" — e.g. 0550123456
  whatsapp: string; // international format without + e.g. 213550123456
  avatarUrl: string;
  coverUrl: string;
  services: Service[];
  gallery: GalleryImage[];
  hours: WeeklyHours;
  activated: boolean;
  activatedUntil: string | null; // ISO date
  suspended: boolean;
  createdAt: string;
}

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";
export type AppointmentSource = "web" | "manual";

export interface Appointment {
  id: string;
  pageId: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  status: AppointmentStatus;
  source: AppointmentSource;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  price: number; // DZD per unit
}

export interface Invoice {
  id: string;
  pageId: string;
  number: string; // INV-2026-001
  clientName: string;
  clientPhone: string;
  items: InvoiceItem[];
  date: string; // ISO
}

export type KeyStatus = "unused" | "used";

export interface ActivationKey {
  id: string;
  code: string; // SP-XXXX-XXXX-XXXX
  status: KeyStatus;
  usedByPageId: string | null;
  usedAt: string | null;
  createdAt: string;
}

export interface Database {
  profiles: Profile[];
  pages: Page[];
  appointments: Appointment[];
  invoices: Invoice[];
  keys: ActivationKey[];
}
