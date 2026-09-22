"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Cake,
  Tags,
  Users,
  ExternalLink,
  Moon,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/admin", exact: true, label: "Painel", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Cake },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen w-full bg-cream text-ink md:flex">
      {/* Sidebar (desktop) / top bar (mobile) */}
      <aside className="border-b border-cocoa/10 bg-white/60 backdrop-blur-md md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
        <div className="flex items-center gap-2 px-6 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bordo text-cream">
            <Moon size={16} />
          </span>
          <div className="leading-tight">
            <p className="font-serif text-lg text-bordo">Doce Luar</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-caramel">
              Administração
            </p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:px-3 md:pb-0">
          {nav.map(({ href, exact, label, icon: Icon }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-bordo text-cream"
                    : "text-cocoa/70 hover:bg-vanilla hover:text-bordo"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden px-3 md:block md:pb-6 md:pt-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-cocoa/70 transition-colors hover:bg-vanilla hover:text-caramel"
          >
            <ExternalLink size={18} />
            Ver site
          </Link>
          <button
            onClick={sair}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-cocoa/70 transition-colors hover:bg-bordo/10 hover:text-bordo"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="w-full px-6 py-8 md:px-10 md:py-12">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
