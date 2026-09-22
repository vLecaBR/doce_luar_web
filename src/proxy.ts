import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 renomeou a convenção "middleware" para "proxy".
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Roda só nas rotas que precisam de auth (não toca na landing nem em assets).
export const config = {
  matcher: ["/admin", "/admin/:path*", "/login"],
};
