// Mock data layer backed by localStorage.
// This module is the single integration point for the future Supabase
// migration: every function here maps to a query/mutation on a table
// (see src/lib/types.ts), and auth functions map to Supabase Auth.

import { buildSeed } from "./seed";
import type {
  ActivationKey,
  Appointment,
  AppointmentStatus,
  Database,
  Invoice,
  InvoiceItem,
  Page,
  Profile,
  WeeklyHours,
} from "./types";

// Bump the version when the seed shape changes — old browser data is discarded.
const DB_KEY = "san3a_db_v2";
const SESSION_KEY = "san3a_session_v1";

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function formatDZD(amount: number) {
  return `${amount.toLocaleString("ar-DZ")} دج`;
}

function loadDb(): Database {
  if (typeof window === "undefined") return buildSeed();
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const seed = buildSeed();
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as Database;
  } catch {
    const seed = buildSeed();
    localStorage.setItem(DB_KEY, JSON.stringify(seed));
    return seed;
  }
}

function saveDb(db: Database) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function resetDemoData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DB_KEY);
  loadDb();
}

// ---------- Auth ----------

export function login(email: string, password: string): Profile | null {
  const db = loadDb();
  const profile = db.profiles.find(
    (p) => p.email.toLowerCase() === email.trim().toLowerCase() && p.password === password
  );
  if (!profile) return null;
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: profile.id }));
  return profile;
}

export function signup(name: string, email: string, password: string): { ok: boolean; message: string } {
  const db = loadDb();
  if (db.profiles.some((p) => p.email.toLowerCase() === email.trim().toLowerCase())) {
    return { ok: false, message: "هذا البريد الإلكتروني مسجّل من قبل" };
  }
  const userId = uid();
  const profile: Profile = {
    id: userId,
    email: email.trim(),
    password,
    name: name.trim(),
    role: "user",
    createdAt: new Date().toISOString(),
  };
  const defaultHours: WeeklyHours = {
    0: { enabled: true, from: "09:00", to: "17:00" },
    1: { enabled: true, from: "09:00", to: "17:00" },
    2: { enabled: true, from: "09:00", to: "17:00" },
    3: { enabled: true, from: "09:00", to: "17:00" },
    4: { enabled: true, from: "09:00", to: "17:00" },
    5: { enabled: false, from: "09:00", to: "17:00" },
    6: { enabled: false, from: "09:00", to: "17:00" },
  };
  const page: Page = {
    id: uid(),
    userId,
    slug: uniqueSlug(db, name),
    businessName: name.trim(),
    craft: "",
    city: "الجزائر",
    description: "",
    phone: "",
    whatsapp: "",
    avatarUrl: "",
    coverUrl: "",
    services: [],
    gallery: [],
    hours: defaultHours,
    activated: false,
    activatedUntil: null,
    suspended: false,
    createdAt: new Date().toISOString(),
  };
  db.profiles.push(profile);
  db.pages.push(page);
  saveDb(db);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }));
  return { ok: true, message: "تم إنشاء الحساب بنجاح" };
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): Profile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const { userId } = JSON.parse(raw) as { userId: string };
    return loadDb().profiles.find((p) => p.id === userId) ?? null;
  } catch {
    return null;
  }
}

function uniqueSlug(db: Database, name: string) {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9؀-ۿ]+/g, "-")
      .replace(/^-+|-+$/g, "") || "page";
  let slug = base;
  let i = 1;
  while (db.pages.some((p) => p.slug === slug)) {
    slug = `${base}-${++i}`;
  }
  return slug;
}

// ---------- Pages ----------

export function getPageBySlug(slug: string): Page | null {
  return loadDb().pages.find((p) => p.slug === slug) ?? null;
}

export function getPageByUserId(userId: string): Page | null {
  return loadDb().pages.find((p) => p.userId === userId) ?? null;
}

export function updatePage(page: Page): { ok: boolean; message: string } {
  const db = loadDb();
  if (db.pages.some((p) => p.slug === page.slug && p.id !== page.id)) {
    return { ok: false, message: "هذا الرابط مستعمل من طرف صفحة أخرى" };
  }
  const idx = db.pages.findIndex((p) => p.id === page.id);
  if (idx === -1) return { ok: false, message: "الصفحة غير موجودة" };
  db.pages[idx] = page;
  saveDb(db);
  return { ok: true, message: "تم حفظ التغييرات" };
}

// ---------- Appointments ----------

export function getAppointments(pageId: string): Appointment[] {
  return loadDb()
    .appointments.filter((a) => a.pageId === pageId)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function addAppointment(
  data: Omit<Appointment, "id" | "createdAt">
): Appointment {
  const db = loadDb();
  const appointment: Appointment = {
    ...data,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  db.appointments.push(appointment);
  saveDb(db);
  return appointment;
}

export function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const db = loadDb();
  const a = db.appointments.find((x) => x.id === id);
  if (a) {
    a.status = status;
    saveDb(db);
  }
}

export function updateAppointment(id: string, data: Partial<Omit<Appointment, "id" | "pageId" | "createdAt">>) {
  const db = loadDb();
  const a = db.appointments.find((x) => x.id === id);
  if (a) {
    Object.assign(a, data);
    saveDb(db);
  }
}

export function deleteAppointment(id: string) {
  const db = loadDb();
  db.appointments = db.appointments.filter((a) => a.id !== id);
  saveDb(db);
}

/** Times already taken (pending or confirmed) for a page on a given day. */
export function getBookedTimes(pageId: string, date: string): string[] {
  return loadDb()
    .appointments.filter(
      (a) => a.pageId === pageId && a.date === date && a.status !== "cancelled"
    )
    .map((a) => a.time);
}

// ---------- Invoices ----------

export function getInvoices(pageId: string): Invoice[] {
  return loadDb()
    .invoices.filter((i) => i.pageId === pageId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getInvoice(id: string): Invoice | null {
  return loadDb().invoices.find((i) => i.id === id) ?? null;
}

export function nextInvoiceNumber(pageId: string): string {
  const year = new Date().getFullYear();
  const count = loadDb().invoices.filter(
    (i) => i.pageId === pageId && i.number.includes(`-${year}-`)
  ).length;
  return `INV-${year}-${String(count + 1).padStart(3, "0")}`;
}

export function addInvoice(
  data: Omit<Invoice, "id" | "number"> & { number?: string }
): Invoice {
  const db = loadDb();
  const invoice: Invoice = {
    ...data,
    number: data.number ?? nextInvoiceNumber(data.pageId),
    id: uid(),
  };
  db.invoices.push(invoice);
  saveDb(db);
  return invoice;
}

export function updateInvoice(
  id: string,
  data: Partial<Pick<Invoice, "clientName" | "clientPhone" | "clientAddress" | "items" | "date" | "notes">>
) {
  const db = loadDb();
  const invoice = db.invoices.find((i) => i.id === id);
  if (invoice) {
    Object.assign(invoice, data);
    saveDb(db);
  }
  return invoice ?? null;
}

export function deleteInvoice(id: string) {
  const db = loadDb();
  db.invoices = db.invoices.filter((i) => i.id !== id);
  saveDb(db);
}

export function invoiceTotal(items: InvoiceItem[]) {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

// ---------- Activation ----------

export function activateWithKey(pageId: string, code: string): { ok: boolean; message: string } {
  const db = loadDb();
  const key = db.keys.find((k) => k.code.trim().toUpperCase() === code.trim().toUpperCase());
  if (!key) return { ok: false, message: "مفتاح التفعيل غير صحيح" };
  if (key.status === "used") return { ok: false, message: "هذا المفتاح مستعمل من قبل" };
  const page = db.pages.find((p) => p.id === pageId);
  if (!page) return { ok: false, message: "الصفحة غير موجودة" };

  const base =
    page.activated && page.activatedUntil && new Date(page.activatedUntil) > new Date()
      ? new Date(page.activatedUntil)
      : new Date();
  base.setFullYear(base.getFullYear() + 1);

  page.activated = true;
  page.activatedUntil = base.toISOString().slice(0, 10);
  key.status = "used";
  key.usedByPageId = page.id;
  key.usedAt = new Date().toISOString();
  saveDb(db);
  return { ok: true, message: `تم تفعيل صفحتك حتى ${page.activatedUntil}` };
}

// ---------- Admin ----------

export interface AdminUserRow {
  profile: Profile;
  page: Page | null;
}

export function getAllUsers(): AdminUserRow[] {
  const db = loadDb();
  return db.profiles
    .filter((p) => p.role === "user")
    .map((profile) => ({
      profile,
      page: db.pages.find((pg) => pg.userId === profile.id) ?? null,
    }));
}

export function getAllKeys(): ActivationKey[] {
  return [...loadDb().keys].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPageById(id: string): Page | null {
  return loadDb().pages.find((p) => p.id === id) ?? null;
}

export function generateKeys(count: number): ActivationKey[] {
  const db = loadDb();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
  const block = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const created: ActivationKey[] = [];
  for (let i = 0; i < count; i++) {
    created.push({
      id: uid(),
      code: `SP-${block()}-${block()}-${block()}`,
      status: "unused",
      usedByPageId: null,
      usedAt: null,
      createdAt: new Date().toISOString(),
    });
  }
  db.keys.push(...created);
  saveDb(db);
  return created;
}

export function toggleSuspend(pageId: string) {
  const db = loadDb();
  const page = db.pages.find((p) => p.id === pageId);
  if (page) {
    page.suspended = !page.suspended;
    saveDb(db);
  }
}

export function getAdminStats() {
  const db = loadDb();
  const users = db.profiles.filter((p) => p.role === "user").length;
  const today = new Date().toISOString().slice(0, 10);
  const active = db.pages.filter(
    (p) => p.activated && p.activatedUntil && p.activatedUntil >= today && !p.suspended
  ).length;
  const inactive = db.pages.length - active;
  const keysUsed = db.keys.filter((k) => k.status === "used").length;
  const keysUnused = db.keys.length - keysUsed;
  return { users, active, inactive, keysUsed, keysUnused, totalKeys: db.keys.length };
}

// ---------- Availability helpers ----------

export function isPageLive(page: Page): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return (
    page.activated &&
    !page.suspended &&
    !!page.activatedUntil &&
    page.activatedUntil >= today
  );
}

/** Hourly slots for a page on a given date (YYYY-MM-DD), excluding booked ones. */
export function getAvailableSlots(page: Page, date: string): string[] {
  const day = new Date(date + "T00:00:00").getDay();
  const hours = page.hours[day];
  if (!hours || !hours.enabled) return [];
  const fromH = parseInt(hours.from.slice(0, 2), 10);
  const toH = parseInt(hours.to.slice(0, 2), 10);
  const booked = new Set(getBookedTimes(page.id, date));
  const slots: string[] = [];
  for (let h = fromH; h < toH; h++) {
    const t = `${String(h).padStart(2, "0")}:00`;
    if (!booked.has(t)) slots.push(t);
  }
  return slots;
}
