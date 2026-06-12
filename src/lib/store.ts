import { getSupabase } from "./supabase";
import type {
  ActivationKey,
  Appointment,
  AppointmentStatus,
  Invoice,
  InvoiceItem,
  Page,
  Profile,
  WeeklyHours,
} from "./types";

type PageRow = {
  id: string;
  user_id: string;
  slug: string;
  business_name: string;
  craft: string | null;
  city: string | null;
  description: string | null;
  phone: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  services: Page["services"] | null;
  gallery: Page["gallery"] | null;
  hours: WeeklyHours | null;
  activated: boolean;
  activated_until: string | null;
  suspended: boolean;
  created_at: string;
};

type ProfileRow = {
  id: string;
  email: string;
  name: string;
  role: Profile["role"];
  created_at: string;
};

type AppointmentRow = {
  id: string;
  page_id: string;
  client_name: string;
  client_phone: string | null;
  service_name: string | null;
  date: string;
  time: string;
  status: AppointmentStatus;
  source: Appointment["source"];
  created_at: string;
};

type InvoiceRow = {
  id: string;
  page_id: string;
  number: string;
  client_name: string;
  client_phone: string | null;
  client_address: string | null;
  items: InvoiceItem[];
  date: string;
  notes: string | null;
};

type ActivationKeyRow = {
  id: string;
  code: string;
  status: ActivationKey["status"];
  used_by_page_id: string | null;
  used_at: string | null;
  created_at: string;
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

export function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function formatDZD(amount: number) {
  return `${amount.toLocaleString("ar-DZ")} دج`;
}

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    password: "",
    name: row.name,
    role: row.role,
    createdAt: row.created_at,
  };
}

function toPage(row: PageRow): Page {
  return {
    id: row.id,
    userId: row.user_id,
    slug: row.slug,
    businessName: row.business_name,
    craft: row.craft ?? "",
    city: row.city ?? "",
    description: row.description ?? "",
    phone: row.phone ?? "",
    whatsapp: row.whatsapp ?? "",
    avatarUrl: row.avatar_url ?? "",
    coverUrl: row.cover_url ?? "",
    services: row.services ?? [],
    gallery: row.gallery ?? [],
    hours: row.hours ?? defaultHours,
    activated: row.activated,
    activatedUntil: row.activated_until,
    suspended: row.suspended,
    createdAt: row.created_at,
  };
}

function fromPage(page: Page) {
  return {
    id: page.id,
    user_id: page.userId,
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
    activated: page.activated,
    activated_until: page.activatedUntil,
    suspended: page.suspended,
    created_at: page.createdAt,
  };
}

function toAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    pageId: row.page_id,
    clientName: row.client_name,
    clientPhone: row.client_phone ?? "",
    serviceName: row.service_name ?? "",
    date: row.date,
    time: row.time,
    status: row.status,
    source: row.source,
    createdAt: row.created_at,
  };
}

function toInvoice(row: InvoiceRow): Invoice {
  return {
    id: row.id,
    pageId: row.page_id,
    number: row.number,
    clientName: row.client_name,
    clientPhone: row.client_phone ?? "",
    clientAddress: row.client_address ?? "",
    items: row.items ?? [],
    date: row.date,
    notes: row.notes ?? "",
  };
}

function toKey(row: ActivationKeyRow): ActivationKey {
  return {
    id: row.id,
    code: row.code,
    status: row.status,
    usedByPageId: row.used_by_page_id,
    usedAt: row.used_at,
    createdAt: row.created_at,
  };
}

// ---------- Auth ----------

export async function login(email: string, password: string): Promise<Profile | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error || !data.user) return null;
  return getProfile(data.user.id);
}

export async function signup(name: string, email: string, password: string): Promise<{ ok: boolean; message: string }> {
  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });
  if (error || !data.user) {
    return { ok: false, message: error?.message ?? "تعذّر إنشاء الحساب" };
  }

  const now = new Date().toISOString();
  const profile = {
    id: data.user.id,
    email: email.trim(),
    name: name.trim(),
    role: "user" as const,
    created_at: now,
  };
  const slug = await uniqueSlug(name);
  const page = {
    id: uid(),
    user_id: data.user.id,
    slug,
    business_name: name.trim(),
    craft: "",
    city: "الجزائر",
    description: "",
    phone: "",
    whatsapp: "",
    avatar_url: "",
    cover_url: "",
    services: [],
    gallery: [],
    hours: defaultHours,
    activated: false,
    activated_until: null,
    suspended: false,
    created_at: now,
  };

  const { error: profileError } = await supabase.from("profiles").insert(profile);
  const { error: pageError } = await supabase.from("pages").insert(page);

  if (profileError || pageError) {
    return { ok: false, message: profileError?.message ?? pageError?.message ?? "تعذّر إنشاء الصفحة" };
  }

  return { ok: true, message: "تم إنشاء الحساب بنجاح" };
}

export async function logout() {
  await getSupabase().auth.signOut();
}

export async function getSession(): Promise<Profile | null> {
  const { data } = await getSupabase().auth.getUser();
  if (!data.user) return null;
  return getProfile(data.user.id);
}

async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await getSupabase()
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle<ProfileRow>();
  if (error || !data) return null;
  return toProfile(data);
}

async function uniqueSlug(name: string) {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9؀-ۿ]+/g, "-")
      .replace(/^-+|-+$/g, "") || "page";
  let slug = base;
  let i = 1;

  while (await slugExists(slug)) {
    slug = `${base}-${++i}`;
  }
  return slug;
}

async function slugExists(slug: string) {
  const { data } = await getSupabase().from("pages").select("id").eq("slug", slug).maybeSingle();
  return !!data;
}

// ---------- Pages ----------

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const { data, error } = await getSupabase()
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<PageRow>();
  if (error || !data) return null;
  return toPage(data);
}

export async function getPageByUserId(userId: string): Promise<Page | null> {
  const { data, error } = await getSupabase()
    .from("pages")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle<PageRow>();
  if (error || !data) return null;
  return toPage(data);
}

export async function updatePage(page: Page): Promise<{ ok: boolean; message: string }> {
  const { data: existing } = await getSupabase()
    .from("pages")
    .select("id")
    .eq("slug", page.slug)
    .neq("id", page.id)
    .maybeSingle();
  if (existing) {
    return { ok: false, message: "هذا الرابط مستعمل من طرف صفحة أخرى" };
  }

  const { error } = await getSupabase().from("pages").update(fromPage(page)).eq("id", page.id);
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "تم حفظ التغييرات" };
}

// ---------- Appointments ----------

export async function getAppointments(pageId: string): Promise<Appointment[]> {
  const { data, error } = await getSupabase()
    .from("appointments")
    .select("*")
    .eq("page_id", pageId)
    .order("date", { ascending: true })
    .order("time", { ascending: true })
    .returns<AppointmentRow[]>();
  if (error || !data) return [];
  return data.map(toAppointment);
}

export async function addAppointment(data: Omit<Appointment, "id" | "createdAt">): Promise<Appointment | null> {
  const { data: created, error } = await getSupabase()
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
    .single<AppointmentRow>();
  if (error || !created) return null;
  return toAppointment(created);
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  await getSupabase().from("appointments").update({ status }).eq("id", id);
}

export async function updateAppointment(
  id: string,
  data: Partial<Omit<Appointment, "id" | "pageId" | "createdAt">>
) {
  await getSupabase()
    .from("appointments")
    .update({
      client_name: data.clientName,
      client_phone: data.clientPhone,
      service_name: data.serviceName,
      date: data.date,
      time: data.time,
      status: data.status,
      source: data.source,
    })
    .eq("id", id);
}

export async function deleteAppointment(id: string) {
  await getSupabase().from("appointments").delete().eq("id", id);
}

/** Times already taken (pending or confirmed) for a page on a given day. */
export async function getBookedTimes(pageId: string, date: string): Promise<string[]> {
  const { data, error } = await getSupabase()
    .rpc("get_booked_times", { p_page_id: pageId, p_date: date })
    .returns<Array<{ time: string }>>();
  if (error || !data) return [];
  return (data as Array<{ time: string }>).map((row) => row.time);
}

// ---------- Invoices ----------

export async function getInvoices(pageId: string): Promise<Invoice[]> {
  const { data, error } = await getSupabase()
    .from("invoices")
    .select("*")
    .eq("page_id", pageId)
    .order("date", { ascending: false })
    .returns<InvoiceRow[]>();
  if (error || !data) return [];
  return data.map(toInvoice);
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const { data, error } = await getSupabase()
    .from("invoices")
    .select("*")
    .eq("id", id)
    .maybeSingle<InvoiceRow>();
  if (error || !data) return null;
  return toInvoice(data);
}

export async function nextInvoiceNumber(pageId: string): Promise<string> {
  const year = new Date().getFullYear();
  const { count } = await getSupabase()
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .eq("page_id", pageId)
    .like("number", `INV-${year}-%`);
  return `INV-${year}-${String((count ?? 0) + 1).padStart(3, "0")}`;
}

export async function addInvoice(
  data: Omit<Invoice, "id" | "number"> & { number?: string }
): Promise<Invoice | null> {
  const number = data.number ?? (await nextInvoiceNumber(data.pageId));
  const { data: created, error } = await getSupabase()
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
    .single<InvoiceRow>();
  if (error || !created) return null;
  return toInvoice(created);
}

export async function updateInvoice(
  id: string,
  data: Partial<Pick<Invoice, "clientName" | "clientPhone" | "clientAddress" | "items" | "date" | "notes">>
): Promise<Invoice | null> {
  const { data: updated, error } = await getSupabase()
    .from("invoices")
    .update({
      client_name: data.clientName,
      client_phone: data.clientPhone,
      client_address: data.clientAddress,
      items: data.items,
      date: data.date,
      notes: data.notes,
    })
    .eq("id", id)
    .select("*")
    .maybeSingle<InvoiceRow>();
  if (error || !updated) return null;
  return toInvoice(updated);
}

export async function deleteInvoice(id: string) {
  await getSupabase().from("invoices").delete().eq("id", id);
}

export function invoiceTotal(items: InvoiceItem[]) {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

// ---------- Activation ----------

export async function activateWithKey(pageId: string, code: string): Promise<{ ok: boolean; message: string }> {
  const supabase = getSupabase();
  const { data: key, error: keyError } = await supabase
    .from("activation_keys")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle<ActivationKeyRow>();
  if (keyError || !key) return { ok: false, message: "مفتاح التفعيل غير صحيح" };
  if (key.status === "used") return { ok: false, message: "هذا المفتاح مستعمل من قبل" };

  const page = await getPageById(pageId);
  if (!page) return { ok: false, message: "الصفحة غير موجودة" };

  const base =
    page.activated && page.activatedUntil && new Date(page.activatedUntil) > new Date()
      ? new Date(page.activatedUntil)
      : new Date();
  base.setFullYear(base.getFullYear() + 1);
  const activatedUntil = base.toISOString().slice(0, 10);

  const { error: pageError } = await supabase
    .from("pages")
    .update({ activated: true, activated_until: activatedUntil })
    .eq("id", pageId);
  const { error: updateKeyError } = await supabase
    .from("activation_keys")
    .update({
      status: "used",
      used_by_page_id: pageId,
      used_at: new Date().toISOString(),
    })
    .eq("id", key.id)
    .eq("status", "unused");

  if (pageError || updateKeyError) {
    return { ok: false, message: pageError?.message ?? updateKeyError?.message ?? "تعذّر تفعيل الصفحة" };
  }
  return { ok: true, message: `تم تفعيل صفحتك حتى ${activatedUntil}` };
}

// ---------- Admin ----------

export interface AdminUserRow {
  profile: Profile;
  page: Page | null;
}

export async function getAllUsers(): Promise<AdminUserRow[]> {
  const { data: profiles, error } = await getSupabase()
    .from("profiles")
    .select("*")
    .eq("role", "user")
    .order("created_at", { ascending: false })
    .returns<ProfileRow[]>();
  if (error || !profiles) return [];

  const { data: pages } = await getSupabase().from("pages").select("*").returns<PageRow[]>();
  const pagesByUser = new Map((pages ?? []).map((page) => [page.user_id, toPage(page)]));
  return profiles.map((profile) => ({
    profile: toProfile(profile),
    page: pagesByUser.get(profile.id) ?? null,
  }));
}

export async function getAllKeys(): Promise<ActivationKey[]> {
  const { data, error } = await getSupabase()
    .from("activation_keys")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<ActivationKeyRow[]>();
  if (error || !data) return [];
  return data.map(toKey);
}

export async function getPageById(id: string): Promise<Page | null> {
  const { data, error } = await getSupabase()
    .from("pages")
    .select("*")
    .eq("id", id)
    .maybeSingle<PageRow>();
  if (error || !data) return null;
  return toPage(data);
}

export async function generateKeys(count: number): Promise<ActivationKey[]> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ123456789";
  const block = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const rows = Array.from({ length: count }, () => ({
    code: `SP-${block()}-${block()}-${block()}`,
    status: "unused" as const,
  }));
  const { data, error } = await getSupabase()
    .from("activation_keys")
    .insert(rows)
    .select("*")
    .returns<ActivationKeyRow[]>();
  if (error || !data) return [];
  return data.map(toKey);
}

export async function toggleSuspend(pageId: string) {
  const page = await getPageById(pageId);
  if (!page) return;
  await getSupabase().from("pages").update({ suspended: !page.suspended }).eq("id", pageId);
}

export async function getAdminStats() {
  const supabase = getSupabase();
  const today = new Date().toISOString().slice(0, 10);
  const [{ count: users }, { data: pages }, { count: keysUsed }, { count: totalKeys }] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "user"),
      supabase.from("pages").select("activated,activated_until,suspended").returns<
        Array<{ activated: boolean; activated_until: string | null; suspended: boolean }>
      >(),
      supabase.from("activation_keys").select("id", { count: "exact", head: true }).eq("status", "used"),
      supabase.from("activation_keys").select("id", { count: "exact", head: true }),
    ]);

  const active =
    pages?.filter((p) => p.activated && p.activated_until && p.activated_until >= today && !p.suspended).length ?? 0;
  const inactive = (pages?.length ?? 0) - active;
  return {
    users: users ?? 0,
    active,
    inactive,
    keysUsed: keysUsed ?? 0,
    keysUnused: (totalKeys ?? 0) - (keysUsed ?? 0),
    totalKeys: totalKeys ?? 0,
  };
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
