"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  criarCliente,
  atualizarCliente,
  alternarAtivo,
  removerCliente,
} from "@/lib/actions/clientes";

type Cliente = {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  notas: string | null;
  ativo: boolean;
};

const inputCls =
  "w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-cocoa/35 focus:border-caramel focus:ring-2 focus:ring-caramel/20";

export function ClientesManager({
  clientesIniciais,
}: {
  clientesIniciais: Cliente[];
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
    const res = await criarCliente(formData);
    if (res.error) return setErro(res.error);
    (document.getElementById("form-novo") as HTMLFormElement | null)?.reset();
    refresh();
  }

  async function onAtualizar(id: string, formData: FormData) {
    setErro(null);
    const res = await atualizarCliente(id, formData);
    if (res.error) return setErro(res.error);
    setEditando(null);
    refresh();
  }

  async function onExcluir(id: string, nome: string) {
    if (!confirm(`Excluir ${nome}? Essa ação não tem volta.`)) return;
    await removerCliente(id);
    refresh();
  }

  async function onToggle(id: string, ativo: boolean) {
    await alternarAtivo(id, !ativo);
    refresh();
  }

  return (
    <div className="space-y-8">
      {erro && (
        <div className="rounded-2xl border border-bordo/20 bg-bordo/5 px-4 py-3 text-sm text-bordo">
          {erro}
        </div>
      )}

      {/* Adicionar cliente */}
      <form
        id="form-novo"
        action={onCriar}
        className="grid gap-3 rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_20px_44px_-30px_rgba(58,42,34,0.5)] backdrop-blur-sm sm:grid-cols-2"
      >
        <h2 className="font-serif text-lg text-ink sm:col-span-2">
          Adicionar cliente
        </h2>
        <input name="nome" placeholder="Nome" className={inputCls} required />
        <input
          name="telefone"
          placeholder="Telefone (ex: 5516988063501)"
          className={inputCls}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="E-mail (opcional)"
          className={inputCls}
        />
        <input name="notas" placeholder="Notas (opcional)" className={inputCls} />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-bordo px-5 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-bordo-deep active:scale-[0.98] disabled:opacity-50 sm:col-span-2"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </form>

      {/* Lista */}
      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/55 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cocoa/10 text-left text-[11px] uppercase tracking-[0.14em] text-caramel">
                <th className="px-5 py-3 font-medium">Nome</th>
                <th className="px-5 py-3 font-medium">Telefone</th>
                <th className="px-5 py-3 font-medium">E-mail</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa/10">
              {clientesIniciais.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-cocoa/40">
                    Nenhum cliente cadastrado ainda.
                  </td>
                </tr>
              )}

              {clientesIniciais.map((c) =>
                editando === c.id ? (
                  <tr key={c.id} className="bg-vanilla/40">
                    <td colSpan={5} className="px-5 py-4">
                      <form
                        action={(fd) => onAtualizar(c.id, fd)}
                        className="grid gap-2 sm:grid-cols-5 sm:items-center"
                      >
                        <input
                          name="nome"
                          defaultValue={c.nome}
                          className={inputCls}
                          required
                        />
                        <input
                          name="telefone"
                          defaultValue={c.telefone}
                          className={inputCls}
                          required
                        />
                        <input
                          name="email"
                          defaultValue={c.email ?? ""}
                          className={inputCls}
                        />
                        <input
                          name="notas"
                          defaultValue={c.notas ?? ""}
                          className={inputCls}
                        />
                        <div className="flex gap-2">
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
                        </div>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr key={c.id} className="transition-colors hover:bg-vanilla/30">
                    <td className="px-5 py-3 font-medium text-ink">{c.nome}</td>
                    <td className="px-5 py-3 text-cocoa/70">{c.telefone}</td>
                    <td className="px-5 py-3 text-cocoa/70">{c.email ?? "—"}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => onToggle(c.id, c.ativo)}
                        className={
                          c.ativo
                            ? "rounded-full bg-bordo/10 px-3 py-1 text-xs font-medium text-bordo"
                            : "rounded-full bg-cocoa/10 px-3 py-1 text-xs font-medium text-cocoa/50"
                        }
                      >
                        {c.ativo ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setEditando(c.id)}
                        aria-label="Editar"
                        className="mr-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-caramel transition-colors hover:bg-vanilla"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onExcluir(c.id, c.nome)}
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
