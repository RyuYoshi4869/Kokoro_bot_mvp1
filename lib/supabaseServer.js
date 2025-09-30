// lib/supabaseServer.js
import { createClient } from "@supabase/supabase-js";

export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ← NEXT_PUBLICなし
  if (!url || !serviceKey) throw new Error("Missing Supabase server env vars");
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
