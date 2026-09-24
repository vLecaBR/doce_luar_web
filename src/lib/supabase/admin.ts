import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client ADMIN do Supabase (service role) — SOMENTE no servidor.
// Criado sob demanda (lazy) para não ser instanciado durante o build do Next.
let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase admin não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SECRET_KEY.",
    );
  }

  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}
