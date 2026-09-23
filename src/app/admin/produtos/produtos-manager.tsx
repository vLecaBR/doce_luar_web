"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ImageOff } from "lucide-react";
import {
  criarProduto,
  atualizarProduto,
  alternarAtivoProduto,
  removerProduto,
} from "@/lib/actions/produtos";

type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  imagemUrl: string | null;
  ativo: boolean;
  categoriaId: string;
  categoriaNome: string;
};

type Categoria = { id: string; nome: string };

const inputCls =
  "w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-cocoa/35 focus:border-caramel focus:ring-2 focus:ring-caramel/20";

const fileCls =
  "w-full rounded-xl border border-cocoa/15 bg-white/70 px-4 py-2.5 text-sm text-cocoa/70 outline-none file:mr-3 file:rounded-full file:border-0 file:bg-vanilla file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-bordo";

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function Campo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-caramel">
        {label}
      </span>
      {children}
    </label>
  );
}

export function ProdutosManager({
  produtosIniciais,
  categorias,
}: {
  produtosIniciais: Produto[];
  categorias: Categoria[];
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
    const res = await criarProduto(formData);
    if (res.error) return setErro(res.error);
    (document.getElementById("form-novo-prod") as HTMLFormElement | null)?.reset();
    refresh();
  }

  async function onAtualizar(id: string, formData: FormData) {
    setErro(null);
    const res = await atualizarProduto(id, formData);
    if (res.error) return setErro(res.error);
    setEditando(null);
    refresh();
  }

  async function onExcluir(id: string, nome: string) {
    if (!confirm(`Excluir o produto "${nome}"?`)) return;
    await removerProduto(id);
    refresh();
  }

  async function onToggle(id: string, ativo: boolean) {
    await alternarAtivoProduto(id, !ativo);
    refresh();
  }

  if (categorias.length === 0) {
    return (
      <div className="rounded-3xl border border-caramel/30 bg-vanilla/40 p-8 text-center">
        <p className="font-serif text-lg text-ink">Crie uma categoria primeiro</p>
        <p className="mt-2 text-sm text-cocoa/60">
          Todo produto precisa pertencer a uma categoria. Vá em{" "}
          <span className="font-medium text-bordo">Categorias</span> e crie ao
          menos uma.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {erro && (
        <div className="rounded-2xl border border-bordo/20 bg-bordo/5 px-4 py-3 text-sm text-bordo">
          {erro}
        </div>
      )}

      {/* Adicionar produto */}
      <form
        id="form-novo-prod"
        action={onCriar}
        className="grid gap-3 rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_20px_44px_-30px_rgba(58,42,34,0.5)] backdrop-blur-sm sm:grid-cols-2"
      >
        <h2 className="font-serif text-lg text-ink sm:col-span-2">
          Adicionar produto
        </h2>
        <input name="nome" placeholder="Nome" className={inputCls} required />
        <input
          name="preco"
          type="number"
          step="0.01"
          min="0"
          placeholder="Preço (ex: 15.00)"
          className={inputCls}
          required
        />
        <select name="categoriaId" className={inputCls} required defaultValue="">
          <option value="" disabled>
            Categoria...
          </option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <input type="file" name="imagem" accept="image/*" className={fileCls} />
        <textarea
          name="descricao"
          placeholder="Descrição (opcional)"
          rows={2}
          className={`${inputCls} sm:col-span-2`}
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-bordo px-5 py-3 text-sm font-medium text-cream transition-all duration-300 hover:bg-bordo-deep active:scale-[0.98] disabled:opacity-50 sm:col-span-2"
        >
          <Plus size={16} />
          Adicionar produto
        </button>
      </form>

      {/* Grade de produtos */}
      {produtosIniciais.length === 0 ? (
        <div className="rounded-3xl border border-white/60 bg-white/55 p-10 text-center backdrop-blur-sm">
          <p className="text-sm text-cocoa/50">
            Nenhum produto cadastrado ainda.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {produtosIniciais.map((p) =>
            editando === p.id ? (
              <form
                key={p.id}
                action={(fd) => onAtualizar(p.id, fd)}
                className="space-y-4 rounded-3xl border border-caramel/40 bg-vanilla/40 p-5 sm:col-span-2 lg:col-span-3"
              >
                <p className="font-serif text-base text-ink">
                  Editando: {p.nome}
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Campo label="Nome">
                    <input
                      name="nome"
                      defaultValue={p.nome}
                      className={inputCls}
                      required
                    />
                  </Campo>
                  <Campo label="Preço">
                    <input
                      name="preco"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={p.preco}
                      className={inputCls}
                      required
                    />
                  </Campo>
                  <Campo label="Categoria">
                    <select
                      name="categoriaId"
                      defaultValue={p.categoriaId}
                      className={inputCls}
                      required
                    >
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome}
                        </option>
                      ))}
                    </select>
                  </Campo>
                  <Campo label="Trocar imagem (opcional)">
                    <input
                      type="file"
                      name="imagem"
                      accept="image/*"
                      className={fileCls}
                    />
                  </Campo>
                  <div className="sm:col-span-2">
                    <Campo label="Descrição">
                      <textarea
                        name="descricao"
                        defaultValue={p.descricao ?? ""}
                        rows={2}
                        className={inputCls}
                      />
                    </Campo>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={isPending}
                    className="rounded-full bg-bordo px-5 py-2.5 text-sm font-medium text-cream hover:bg-bordo-deep disabled:opacity-50"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditando(null)}
                    className="rounded-full border border-cocoa/15 px-5 py-2.5 text-sm text-cocoa transition-colors hover:border-caramel hover:text-caramel"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <article
                key={p.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/55 shadow-[0_20px_44px_-30px_rgba(58,42,34,0.5)] backdrop-blur-sm"
              >
                <div className="relative h-44 bg-vanilla">
                  {p.imagemUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imagemUrl}
                      alt={p.nome}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-cocoa/30">
                      <ImageOff size={28} />
                    </div>
                  )}
                  <button
                    onClick={() => onToggle(p.id, p.ativo)}
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm ${
                      p.ativo
                        ? "bg-bordo/80 text-cream"
                        : "bg-cocoa/50 text-cream/80"
                    }`}
                  >
                    {p.ativo ? "Ativo" : "Inativo"}
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-caramel">
                    {p.categoriaNome}
                  </span>
                  <h3 className="mt-1 font-serif text-lg leading-tight text-ink">
                    {p.nome}
                  </h3>
                  {p.descricao && (
                    <p className="mt-1 line-clamp-2 text-xs text-cocoa/60">
                      {p.descricao}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-serif text-xl text-bordo">
                      {brl(p.preco)}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditando(p.id)}
                        aria-label="Editar"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-caramel transition-colors hover:bg-vanilla"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onExcluir(p.id, p.nome)}
                        aria-label="Excluir"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-bordo transition-colors hover:bg-bordo/10"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </div>
  );
}
