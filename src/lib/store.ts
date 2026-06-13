// Supabase-backed data layer.
// This module is the single integration point with Supabase: every
// function here maps to a query/mutation against the tables and RPCs
// defined in supabase/schema.sql.

import { createClient } from "./supabase/client";
import { getDemoPageBySlug, isDemoPageId } from "./demo-pages";
import type {
  ActivationKey,
  Appointment,
  AppointmentStatus,
  Invoice,
  InvoiceItem,
  Page,
  Profile,
} from "./types";

const supabase = createClient();

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function formatDZD(amount: number) {
  return `${amount.toLocaleString("ar-DZ")} دج`;
}

export function invoiceTotal(items: InvoiceItem[]) {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

// ---------- Row <-> app type mapping ----------

function rowToProfile(row: Record<string, unknown>): Profile {
  return {
    id: row.id as string,
    email: row.email as string,
    name: row.name as string,
    role: row.role as Profile["role"],
    createdAt: row.created_at as string,
  };
}

function rowToPage(row: Record<string, unknown>): Page {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    slug: row.slug as string,
    businessName: row.business_name as string,
    craft: row.craft as string,
    city: row.city as string,
    description: row.description as string,
    phone: row.phone as string,
    whatsapp: row.whatsapp as string,
    avatarUrl: row.avatar_url as string,
    coverUrl: row.cover_url as string,
    services: (row.services as Page["services"]) ?? [],
    gallery: (row.gallery as Page["gallery"]) ?? [],
    hours: (row.hours as Page["hours"]) ?? {},
    activated: row.activated as boolean,
    activatedUntil: (row.activated_until as string | null) ?? null,
    suspended: row.suspended as boolean,
    createdAt: row.created_at as string,
  };
}

function pageToRow(page: Page) {
  return {
    slug: page.slug,
    business_name: page.businessName,
    craft: page.craft,
    city: page.city,
    description: page.description,
    phone: page.phone,
    whatsapp: page.whatsapp,
    avatar_url: page.avatarUrl,
    cover_url: page.coverUrl,
    services: page.services,
    gallery: page.gallery,
    hours: page.hours,
  };
}

function rowToAppointment(row: Record<string, unknown>): Appointment {
  return {
    id: row.id as string,
    pageId: row.page_id as string,
    clientName: row.client_name as string,
    clientPhone: row.client_phone as string,
    serviceName: row.service_name as string,
    date: row.date as string,
    time: row.time as string,
    status: row.status as Appointment["status"],
    source: row.source as Appointment["source"],
    createdAt: row.created_at as string,
  };
}

function rowToInvoice(row: Record<string, unknown>): Invoice {
  return {
    id: row.id as string,
    pageId: row.page_id as string,
    number: row.number as string,
    clientName: row.client_name as string,
    clientPhone: row.client_phone as string,
    clientAddress: row.client_address as string,
    items: (row.items as InvoiceItem[]) ?? [],
    date: row.date as string,
    notes: row.notes as string,
  };
}

function rowToKey(row: Record<string, unknown>): ActivationKey {
  return {
    id: row.id as string,
    code: row.code as string,
    status: row.status as ActivationKey["status"],
    usedByPageId: (row.used_by_page_id as string | null) ?? null,
    usedAt: (row.used_at as string | null) ?? null,
    createdAt: row.created_at as string,
  };
}

// ---------- Auth ----------

export async function login(email: string, password: string): Promise<Profile | null> {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) return null;
  return getSession();
}

export async function signup(
  name: string,
  email: string,
  password: string
): Promise<{ ok: boolean; message: string; needsConfirmation?: boolean }> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { name: name.trim() } },
  });
  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { ok: false, message: "هذا البريد الإلكتروني مسجّل من قبل" };
    }
    return { ok: false, message: error.message };
  }
  if (!data.session) {
    return {
      ok: true,
      message: "تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد التسجيل",
      needsConfirmation: true,
    };
  }
  return { ok: true, message: "تم إنشاء الحساب بنجاح" };
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Profile | null> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userData.user.id).single();
  if (error || !data) return null;
  return rowToProfile(data);
}

// ---------- Pages ----------

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const demo = getDemoPageBySlug(slug);
  if (demo) return demo;
  const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return rowToPage(data);
}

export async function getPageByUserId(userId: string): Promise<Page | null> {
  const { data, error } = await supabase.from("pages").select("*").eq("user_id", userId).maybeSingle();
  if (error || !data) return null;
  return rowToPage(data);
}

export async function updatePage(page: Page): Promise<{ ok: boolean; message: string }> {
  const { error } = await supabase.from("pages").update(pageToRow(page)).eq("id", page.id);
  if (error) {
    if (error.code === "23505") {
      return { ok: false, message: "هذا الرابط مستعمل من طرف صفحة أخرى" };
    }
    return { ok: false, message: "حدث خطأ أثناء الحفظ" };
  }
  return { ok: true, message: "تم حفظ التغييرات" };
}

// ---------- Appointments ----------

export async function getAppointments(pageId: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("page_id", pageId)
    .order("date", { ascending: true })
    .order("time", { ascending: true });
  if (error || !data) return [];
  return data.map(rowToAppointment);
}

export async function addAppointment(data: Omit<Appointment, "id" | "createdAt">): Promise<Appointment | null> {
  // Demo pages have no DB row — return a synthetic appointment so the public
  // booking flow (which opens WhatsApp) still works on the demos.
  if (isDemoPageId(data.pageId)) {
    return { ...data, id: uid(), createdAt: new Date().toISOString() };
  }
  const { data: row, error } = await supabase
    .from("appointments")
    .insert({
      page_id: data.pageId,
      client_name: data.clientName,
      client_phone: data.clientPhone,
      service_name: data.serviceName,
      date: data.date,
      time: data.time,
      status: data.status,
      source: data.source,
    })
    .select("*")
    .single();
  if (error || !row) return null;
  return rowToAppointment(row);
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  await supabase.from("appointments").update({ status }).eq("id", id);
}

export async function updateAppointment(
  id: string,
  data: Partial<Omit<Appointment, "id" | "pageId" | "createdAt">>
) {
  const patch: Record<string, unknown> = {};
  if (data.clientName !== undefined) patch.client_name = data.clientName;
  if (data.clientPhone !== undefined) patch.client_phone = data.clientPhone;
  if (data.serviceName !== undefined) patch.service_name = data.serviceName;
  if (data.date !== undefined) patch.date = data.date;
  if (data.time !== undefined) patch.time = data.time;
  if (data.status !== undefined) patch.status = data.status;
  if (data.source !== undefined) patch.source = data.source;
  await supabase.from("appointments").update(patch).eq("id", id);
}

export async function deleteAppointment(id: string) {
  await supabase.from("appointments").delete().eq("id", id);
}

/** Times already taken (pending or confirmed) for a page on a given day. */
export async function getBookedTimes(pageId: string, date: string): Promise<string[]> {
  if (isDemoPageId(pageId)) return [];
  const { data, error } = await supabase
    .from("appointments")
    .select("time")
    .eq("page_id", pageId)
    .eq("date", date)
    .neq("status", "cancelled");
  if (error || !data) return [];
  return data.map((row) => row.time as string);
}

// ---------- Invoices ----------

export async function getInvoices(pageId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("page_id", pageId)
    .order("date", { ascending: false });
  if (error || !data) return [];
  return data.map(rowToInvoice);
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const { data, error } = await supabase.from("invoices").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return rowToInvoice(data);
}

async function nextInvoiceNumber(pageId: string): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .eq("page_id", pageId)
    .like("number", `%-${year}-%`);
  return `INV-${year}-${String((count ?? 0) + 1).padStart(3, "0")}`;
}

export async function addInvoice(data: Omit<Invoice, "id" | "number"> & { number?: string }): Promise<Invoice | null> {
  const number = data.number ?? (await nextInvoiceNumber(data.pageId));
  const { data: row, error } = await supabase
    .from("invoices")
    .insert({
      page_id: data.pageId,
      number,
      client_name: data.clientName,
      client_phone: data.clientPhone,
      client_address: data.clientAddress,
      items: data.items,
      date: data.date,
      notes: data.notes,
    })
    .select("*")
    .single();
  if (error || !row) return null;
  return rowToInvoice(row);
}

export async function updateInvoice(
  id: string,
  data: Partial<Pick<Invoice, "clientName" | "clientPhone" | "clientAddress" | "items" | "date" | "notes">>
) {
  const patch: Record<string, unknown> = {};
  if (data.clientName !== undefined) patch.client_name = data.clientName;
  if (data.clientPhone !== undefined) patch.client_phone = data.clientPhone;
  if (data.clientAddress !== undefined) patch.client_address = data.clientAddress;
  if (data.items !== undefined) patch.items = data.items;
  if (data.date !== undefined) patch.date = data.date;
  if (data.notes !== undefined) patch.notes = data.notes;
  await supabase.from("invoices").update(patch).eq("id", id);
}

export async function deleteInvoice(id: string) {
  await supabase.from("invoices").delete().eq("id", id);
}

// ---------- Activation ----------

export async function activateWithKey(pageId: string, code: string): Promise<{ ok: boolean; message: string }> {
  const { data, error } = await supabase.rpc("activate_page_with_key", { p_page_id: pageId, p_code: code });
  if (error) return { ok: false, message: "حدث خطأ أثناء التفعيل" };
  return { ok: Boolean(data?.ok), message: data?.message as string };
}

// ---------- Storage ----------

/** Uploads a file to the public "media" bucket under the current user's folder and returns its public URL. */
export async function uploadMedia(userId: string, file: Blob, path: string): Promise<string | null> {
  const filePath = `${userId}/${path}`;
  const { error } = await supabase.storage.from("media").upload(filePath, file, {
    upsert: true,
    contentType: file.type || "image/jpeg",
  });
  if (error) return null;
  const { data } = supabase.storage.from("media").getPublicUrl(filePath);
  return data.publicUrl;
}

// ---------- Admin ----------

export interface AdminUserRow {
  profile: Profile;
  page: Page | null;
}

export async function getAllUsers(): Promise<AdminUserRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, pages(*)")
    .eq("role", "user")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => {
    const pages = (row.pages as Record<string, unknown>[]) ?? [];
    return {
      profile: rowToProfile(row),
      page: pages.length > 0 ? rowToPage(pages[0]) : null,
    };
  });
}

export async function getAllKeys(): Promise<ActivationKey[]> {
  const { data, error } = await supabase.from("activation_keys").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(rowToKey);
}

export async function getPageById(id: string): Promise<Page | null> {
  const { data, error } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return rowToPage(data);
}

export async function generateKeys(count: number): Promise<ActivationKey[]> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
  const block = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const rows = Array.from({ length: count }, () => ({ code: `SP-${block()}-${block()}-${block()}` }));
  const { data, error } = await supabase.from("activation_keys").insert(rows).select("*");
  if (error || !data) return [];
  return data.map(rowToKey);
}

export async function toggleSuspend(pageId: string) {
  const page = await getPageById(pageId);
  if (!page) return;
  await supabase.from("pages").update({ suspended: !page.suspended }).eq("id", pageId);
}

export async function getAdminStats() {
  const today = new Date().toISOString().slice(0, 10);

  const [{ count: users }, { count: totalPages }, { count: active }, { count: keysUsed }, { count: totalKeys }] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "user"),
      supabase.from("pages").select("id", { count: "exact", head: true }),
      supabase
        .from("pages")
        .select("id", { count: "exact", head: true })
        .eq("activated", true)
        .eq("suspended", false)
        .gte("activated_until", today),
      supabase.from("activation_keys").select("id", { count: "exact", head: true }).eq("status", "used"),
      supabase.from("activation_keys").select("id", { count: "exact", head: true }),
    ]);

  const activeCount = active ?? 0;
  const totalKeysCount = totalKeys ?? 0;
  const keysUsedCount = keysUsed ?? 0;

  return {
    users: users ?? 0,
    active: activeCount,
    inactive: (totalPages ?? 0) - activeCount,
    keysUsed: keysUsedCount,
    keysUnused: totalKeysCount - keysUsedCount,
    totalKeys: totalKeysCount,
  };
}

// ---------- Availability helpers ----------

export function isPageLive(page: Page): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return page.activated && !page.suspended && !!page.activatedUntil && page.activatedUntil >= today;
}

/** Hourly slots for a page on a given date (YYYY-MM-DD), excluding booked ones. */
export async function getAvailableSlots(page: Page, date: string): Promise<string[]> {
  const day = new Date(date + "T00:00:00").getDay();
  const hours = page.hours[day];
  if (!hours || !hours.enabled) return [];
  const fromH = parseInt(hours.from.slice(0, 2), 10);
  const toH = parseInt(hours.to.slice(0, 2), 10);
  const booked = new Set(await getBookedTimes(page.id, date));
  const slots: string[] = [];
  for (let h = fromH; h < toH; h++) {
    const t = `${String(h).padStart(2, "0")}:00`;
    if (!booked.has(t)) slots.push(t);
  }
  return slots;
}
