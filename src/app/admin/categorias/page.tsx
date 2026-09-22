import { listarCategorias } from "@/lib/actions/categorias";
import { CategoriasManager } from "./categorias-manager";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const categorias = await listarCategorias();

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-caramel">
          Organização
        </p>
        <h1 className="mt-1.5 font-serif text-3xl text-ink md:text-4xl">
          Categorias
        </h1>
        <p className="mt-2 text-sm text-cocoa/60">
          Grupos que organizam os produtos na vitrine (ex: Bolo de Pote, Bolo
          Gelado).
        </p>
      </div>

      <CategoriasManager
        categoriasIniciais={categorias.map((c) => ({
          id: c.id,
          nome: c.nome,
          ordem: c.ordem,
          produtosCount: c._count.produtos,
        }))}
      />
    </div>
  );
}
