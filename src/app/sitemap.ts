import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/login", "/signup", "/privacy", "/refund", "/terms"];
  // Craftsmen page URLs (/[slug]) will be added once pages are served
  // from the database (Supabase migration).
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.5,
  }));
}
