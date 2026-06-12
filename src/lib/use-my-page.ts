"use client";

import { useCallback, useEffect, useState } from "react";

import { getPageByUserId, getSession } from "./store";
import type { Page, Profile } from "./types";

/** Loads the logged-in user's profile and page from the store (client-side). */
export function useMyPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [page, setPage] = useState<Page | null>(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const session = await getSession();
    setProfile(session);
    setPage(session ? await getPageByUserId(session.id) : null);
    setLoaded(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, page, setPage, refresh, loaded };
}
