import { createClient } from "@supabase/supabase-js";

// Client ADMIN do Supabase (service role) — SOMENTE no servidor.
// Bypassa RLS; usado para upload de imagens no Storage.
// A SUPABASE_SECRET_KEY nunca tem prefixo NEXT_PUBLIC (não vai pro navegador).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
