import { prisma } from "@/lib/prisma";
import { Landing } from "./landing";

// Sempre busca o estado atual do cardápio.
export const dynamic = "force-dynamic";

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function Home() {
  const [categoriasDb, produtosDb] = await Promise.all([
    prisma.categoria.findMany({ orderBy: [{ ordem: "asc" }, { nome: "asc" }] }),
    prisma.produto.findMany({
      where: { ativo: true },
      orderBy: { criadoEm: "desc" },
    }),
  ]);

  const produtos = produtosDb.map((p) => ({
    id: p.id,
    name: p.nome,
    note: p.descricao ?? "",
    price: brl(Number(p.preco)),
    categoryId: p.categoriaId,
    img: p.imagemUrl,
  }));

  // Só mostra categorias que têm ao menos 1 produto ativo, com o preço "a partir de".
  const categorias = categoriasDb
    .map((c) => {
      const daCat = produtosDb.filter((p) => p.categoriaId === c.id);
      const min = daCat.length
        ? Math.min(...daCat.map((p) => Number(p.preco)))
        : null;
      return {
        id: c.id,
        label: c.nome,
        priceLabel: min !== null ? brl(min) : "",
        temProdutos: daCat.length > 0,
      };
    })
    .filter((c) => c.temProdutos)
    .map(({ id, label, priceLabel }) => ({ id, label, priceLabel }));

  const precosAtivos = produtosDb.map((p) => Number(p.preco));
  const precoMinimo = precosAtivos.length
    ? brl(Math.min(...precosAtivos))
    : null;

  return (
    <Landing
      categorias={categorias}
      produtos={produtos}
      precoMinimo={precoMinimo}
    />
  );
}
