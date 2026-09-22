"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Moon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputCls =
  "w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-cocoa/35 focus:border-caramel focus:ring-2 focus:ring-caramel/20";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setCarregando(false);
    if (error) {
      setErro("E-mail ou senha inválidos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/60 bg-white/55 p-8 shadow-[0_20px_44px_-30px_rgba(58,42,34,0.5)] backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-2">
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

        <h1 className="font-serif text-2xl text-ink">Entrar</h1>
        <p className="mt-1 mb-6 text-sm text-cocoa/60">
          Acesso restrito à administração.
        </p>

        {erro && (
          <div className="mb-4 rounded-xl border border-bordo/20 bg-bordo/5 px-4 py-2.5 text-sm text-bordo">
            {erro}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={inputCls}
            required
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-full bg-bordo px-5 py-3 text-sm font-medium text-cream transition-all hover:bg-bordo-deep active:scale-[0.98] disabled:opacity-50"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
