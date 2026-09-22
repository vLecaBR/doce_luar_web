import { listarProdutos } from "@/lib/actions/produtos";
import { listarCategorias } from "@/lib/actions/categorias";
import { ProdutosManager } from "./produtos-manager";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const [produtos, categorias] = await Promise.all([
    listarProdutos(),
    listarCategorias(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-caramel">
          Cardápio
        </p>
        <h1 className="mt-1.5 font-serif text-3xl text-ink md:text-4xl">
          Produtos
        </h1>
        <p className="mt-2 text-sm text-cocoa/60">
          Os itens que aparecem na vitrine do site.
        </p>
      </div>

      <ProdutosManager
        produtosIniciais={produtos}
        categorias={categorias.map((c) => ({ id: c.id, nome: c.nome }))}
      />
    </div>
  );
}
