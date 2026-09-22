export default function ProdutosPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-caramel">
          Cardápio
        </p>
        <h1 className="mt-1.5 font-serif text-3xl text-ink md:text-4xl">
          Produtos
        </h1>
      </div>
      <div className="rounded-3xl border border-white/60 bg-white/55 p-10 text-center backdrop-blur-sm">
        <p className="font-serif text-xl text-ink">Em breve 🍰</p>
        <p className="mt-2 text-sm text-cocoa/60">
          Cadastro de produtos com upload de imagem (Supabase Storage) na próxima
          etapa.
        </p>
      </div>
    </div>
  );
}
