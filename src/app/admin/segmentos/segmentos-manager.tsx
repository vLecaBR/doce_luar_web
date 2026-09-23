"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  criarSegmento,
  atualizarSegmento,
  removerSegmento,
} from "@/lib/actions/segmentos";

type Segmento = { id: string; nome: string; clientesCount: number };

const inputCls =
  "w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-cocoa/35 focus:border-caramel focus:ring-2 focus:ring-caramel/20";

export function SegmentosManager({
  segmentosIniciais,
}: {
  segmentosIniciais: Segmento[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [editando, setEditando] = useState<string | null>(null);

  function refresh() {
    startTransition(() => router.refresh());
  }

  async function onCriar(formData: FormData) {
    setErro(null);
    const res = await criarSegmento(formData);
    if (res.error) return setErro(res.error);
    (document.getElementById("form-novo-seg") as HTMLFormElement | null)?.reset();
    refresh();
  }

  async function onAtualizar(id: string, formData: FormData) {
    setErro(null);
    const res = await atualizarSegmento(id, formData);
    if (res.error) return setErro(res.error);
    setEditando(null);
    refresh();
  }

  async function onExcluir(id: string, nome: string, count: number) {
    const aviso =
      count > 0
        ? `Excluir "${nome}"? Os ${count} cliente(s) desse segmento ficarão sem segmento (não serão apagados).`
        : `Excluir o segmento "${nome}"?`;
    if (!confirm(aviso)) return;
    await removerSegmento(id);
    refresh();
  }

  return (
    <div className="space-y-8">
      {erro && (
        <div className="rounded-2xl border border-bordo/20 bg-bordo/5 px-4 py-3 text-sm text-bordo">
          {erro}
        </div>
      )}

      <form
        id="form-novo-seg"
        action={onCriar}
        className="grid gap-3 rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_20px_44px_-30px_rgba(58,42,34,0.5)] backdrop-blur-sm sm:grid-cols-[1fr_auto]"
      >
        <h2 className="font-serif text-lg text-ink sm:col-span-2">
          Adicionar segmento
        </h2>
        <input
          name="nome"
          placeholder="Nome (ex: Condomínio, Academia)"
          className={inputCls}
          required
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-bordo px-5 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-bordo-deep active:scale-[0.98] disabled:opacity-50"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </form>

      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/55 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cocoa/10 text-left text-[11px] uppercase tracking-[0.14em] text-caramel">
                <th className="px-5 py-3 font-medium">Nome</th>
                <th className="px-5 py-3 font-medium">Clientes</th>
                <th className="px-5 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa/10">
              {segmentosIniciais.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-cocoa/40">
                    Nenhum segmento cadastrado ainda.
                  </td>
                </tr>
              )}

              {segmentosIniciais.map((s) =>
                editando === s.id ? (
                  <tr key={s.id} className="bg-vanilla/40">
                    <td colSpan={3} className="px-5 py-4">
                      <form
                        action={(fd) => onAtualizar(s.id, fd)}
                        className="flex flex-wrap items-center gap-2"
                      >
                        <input
                          name="nome"
                          defaultValue={s.nome}
                          className={`${inputCls} flex-1`}
                          required
                        />
                        <button
                          disabled={isPending}
                          className="rounded-full bg-bordo px-4 py-2.5 text-sm font-medium text-cream hover:bg-bordo-deep disabled:opacity-50"
                        >
                          Salvar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditando(null)}
                          className="rounded-full border border-cocoa/15 px-4 py-2.5 text-sm text-cocoa transition-colors hover:border-caramel hover:text-caramel"
                        >
                          Cancelar
                        </button>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr key={s.id} className="transition-colors hover:bg-vanilla/30">
                    <td className="px-5 py-3 font-medium text-ink">{s.nome}</td>
                    <td className="px-5 py-3 text-cocoa/70">{s.clientesCount}</td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setEditando(s.id)}
                        aria-label="Editar"
                        className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-caramel transition-colors hover:bg-vanilla"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onExcluir(s.id, s.nome, s.clientesCount)}
                        aria-label="Excluir"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-bordo transition-colors hover:bg-bordo/10"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
