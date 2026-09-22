"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, RefreshCw, Trash2, ImageIcon } from "lucide-react";
import {
  criarDisparo,
  reenviarCampanha,
  removerCampanha,
} from "@/lib/actions/disparos";

type Disparo = {
  id: string;
  mensagem: string;
  imagemUrl: string | null;
  status: string;
  total: number;
  enviados: number;
  falhas: number;
  criadoEm: string | Date;
};

type Campanha = {
  id: string;
  titulo: string;
  mensagem: string;
  imagemUrl: string | null;
  criadoEm: string | Date;
};

const inputCls =
  "w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-cocoa/35 focus:border-caramel focus:ring-2 focus:ring-caramel/20";

const fileCls =
  "w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-2.5 text-sm text-cocoa/70 outline-none file:mr-3 file:rounded-full file:border-0 file:bg-vanilla file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-bordo";

function statusInfo(status: string): { label: string; cls: string } {
  switch (status) {
    case "pendente":
      return { label: "Na fila", cls: "bg-cocoa/10 text-cocoa/60" };
    case "enviando":
      return { label: "Enviando…", cls: "bg-caramel/15 text-caramel-deep" };
    case "concluido":
      return { label: "Concluído", cls: "bg-bordo/10 text-bordo" };
    case "erro":
      return { label: "Erro", cls: "bg-red-100 text-red-700" };
    default:
      return { label: status, cls: "bg-cocoa/10 text-cocoa/60" };
  }
}

function fmtData(d: string | Date) {
  return new Date(d).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DisparosManager({
  disparosIniciais,
  campanhas,
}: {
  disparosIniciais: Disparo[];
  campanhas: Campanha[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [salvarCampanha, setSalvarCampanha] = useState(false);

  // Atualiza a página sozinha enquanto houver disparo na fila / em andamento.
  useEffect(() => {
    const ativo = disparosIniciais.some(
      (d) => d.status === "pendente" || d.status === "enviando",
    );
    if (!ativo) return;
    const t = setInterval(() => startTransition(() => router.refresh()), 4000);
    return () => clearInterval(t);
  }, [disparosIniciais, router]);

  async function onDisparar(formData: FormData) {
    setErro(null);
    setEnviando(true);
    const res = await criarDisparo(formData);
    setEnviando(false);
    if (res.error) return setErro(res.error);
    (document.getElementById("form-disparo") as HTMLFormElement | null)?.reset();
    setSalvarCampanha(false);
    startTransition(() => router.refresh());
  }

  async function onReenviar(id: string) {
    setErro(null);
    const res = await reenviarCampanha(id);
    if (res.error) return setErro(res.error);
    startTransition(() => router.refresh());
  }

  async function onExcluirCampanha(id: string, titulo: string) {
    if (!confirm(`Excluir a campanha "${titulo}"?`)) return;
    await removerCampanha(id);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-8">
      {erro && (
        <div className="rounded-2xl border border-bordo/20 bg-bordo/5 px-4 py-3 text-sm text-bordo">
          {erro}
        </div>
      )}

      {/* Compor disparo */}
      <form
        id="form-disparo"
        action={onDisparar}
        className="rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_20px_44px_-30px_rgba(58,42,34,0.5)] backdrop-blur-sm"
      >
        <h2 className="mb-3 font-serif text-lg text-ink">Nova mensagem</h2>
        <textarea
          name="mensagem"
          rows={4}
          placeholder="Escreva a mensagem que vai para todos os clientes ativos…"
          className={inputCls}
          required
        />
        <div className="mt-3 flex items-center gap-2 text-cocoa/60">
          <ImageIcon size={16} />
          <span className="text-xs">Imagem (opcional)</span>
        </div>
        <input
          type="file"
          name="imagem"
          accept="image/*"
          className={`${fileCls} mt-1`}
        />

        <label className="mt-4 flex items-center gap-2 text-sm text-cocoa/70">
          <input
            type="checkbox"
            name="salvar"
            checked={salvarCampanha}
            onChange={(e) => setSalvarCampanha(e.target.checked)}
            className="h-4 w-4 rounded border-cocoa/30 accent-bordo"
          />
          Salvar como campanha (para reenviar depois)
        </label>
        {salvarCampanha && (
          <input
            name="titulo"
            placeholder="Título da campanha (ex: Promo de sexta)"
            className={`${inputCls} mt-3`}
          />
        )}

        <button
          type="submit"
          disabled={enviando || isPending}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-bordo px-5 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-bordo-deep active:scale-[0.98] disabled:opacity-50 sm:w-auto"
        >
          <Send size={16} />
          {enviando ? "Enfileirando…" : "Disparar agora"}
        </button>
        <p className="mt-3 text-xs text-cocoa/50">
          O envio começa em alguns segundos e respeita um intervalo entre cada
          cliente (anti-bloqueio). Acompanhe no histórico abaixo.
        </p>
      </form>

      {/* Histórico de disparos */}
      <div>
        <h2 className="mb-3 font-serif text-lg text-ink">Histórico</h2>
        {disparosIniciais.length === 0 ? (
          <p className="rounded-3xl border border-white/60 bg-white/55 p-6 text-sm text-cocoa/50 backdrop-blur-sm">
            Nenhum disparo ainda.
          </p>
        ) : (
          <ul className="space-y-3">
            {disparosIniciais.map((d) => {
              const info = statusInfo(d.status);
              return (
                <li
                  key={d.id}
                  className="rounded-2xl border border-white/60 bg-white/55 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-2 flex-1 text-sm text-ink">
                      {d.imagemUrl && "🖼️ "}
                      {d.mensagem}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${info.cls}`}
                    >
                      {info.label}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-cocoa/50">
                    <span>{fmtData(d.criadoEm)}</span>
                    <span>
                      {d.status === "concluido"
                        ? `${d.enviados} enviados · ${d.falhas} falhas`
                        : d.status === "enviando"
                          ? `${d.enviados}/${d.total}`
                          : d.status === "erro"
                            ? "falhou"
                            : "aguardando"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Campanhas salvas */}
      <div>
        <h2 className="mb-3 font-serif text-lg text-ink">Campanhas salvas</h2>
        {campanhas.length === 0 ? (
          <p className="rounded-3xl border border-white/60 bg-white/55 p-6 text-sm text-cocoa/50 backdrop-blur-sm">
            Nenhuma campanha salva. Marque “Salvar como campanha” ao disparar
            para reutilizar depois.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {campanhas.map((c) => (
              <li
                key={c.id}
                className="flex flex-col rounded-2xl border border-white/60 bg-white/55 p-4 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  {c.imagemUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.imagemUrl}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {c.titulo}
                    </p>
                    <p className="line-clamp-2 text-xs text-cocoa/60">
                      {c.mensagem}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => onReenviar(c.id)}
                    disabled={isPending}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-bordo px-4 py-2 text-xs font-medium text-cream transition-colors hover:bg-bordo-deep disabled:opacity-50"
                  >
                    <RefreshCw size={14} />
                    Reenviar
                  </button>
                  <button
                    onClick={() => onExcluirCampanha(c.id, c.titulo)}
                    aria-label="Excluir campanha"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-bordo transition-colors hover:bg-bordo/10"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
