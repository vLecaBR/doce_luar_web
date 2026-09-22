import Link from "next/link";
import { Cake, Tags, Users, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [produtosCount, categoriasCount, clientesCount, clientesRecentes] =
    await Promise.all([
      prisma.produto.count(),
      prisma.categoria.count(),
      prisma.cliente.count(),
      prisma.cliente.findMany({ orderBy: { criadoEm: "desc" }, take: 4 }),
    ]);

  const stats = [
    { label: "Produtos no site", value: produtosCount, icon: Cake, to: "/admin/produtos" },
    { label: "Categorias", value: categoriasCount, icon: Tags, to: "/admin/categorias" },
    { label: "Clientes", value: clientesCount, icon: Users, to: "/admin/clientes" },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-caramel">
          Visão geral
        </p>
        <h1 className="mt-1.5 font-serif text-3xl text-ink md:text-4xl">
          Bem-vinda de volta 🌙
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            href={to}
            className="group rounded-3xl border border-white/60 bg-white/55 p-6 shadow-[0_20px_44px_-30px_rgba(58,42,34,0.5)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-vanilla text-bordo">
                <Icon size={20} />
              </span>
              <ArrowUpRight
                size={18}
                className="text-cocoa/30 transition-colors group-hover:text-caramel"
              />
            </div>
            <p className="mt-5 font-serif text-4xl text-ink">{value}</p>
            <p className="mt-1 text-sm text-cocoa/60">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Últimos produtos (vazio até o CRUD de produtos) */}
        <div className="rounded-3xl border border-white/60 bg-white/55 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-ink">Últimos produtos</h2>
            <Link
              href="/admin/produtos"
              className="text-[12px] font-medium text-caramel hover:text-caramel-deep"
            >
              Gerenciar
            </Link>
          </div>
          <p className="text-sm text-cocoa/50">
            Nenhum produto cadastrado ainda. Em breve o cadastro com imagens.
          </p>
        </div>

        {/* Clientes recentes (do banco) */}
        <div className="rounded-3xl border border-white/60 bg-white/55 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-ink">Clientes recentes</h2>
            <Link
              href="/admin/clientes"
              className="text-[12px] font-medium text-caramel hover:text-caramel-deep"
            >
              Gerenciar
            </Link>
          </div>
          {clientesRecentes.length === 0 ? (
            <p className="text-sm text-cocoa/50">Nenhum cliente cadastrado ainda.</p>
          ) : (
            <ul className="space-y-3">
              {clientesRecentes.map((c) => (
                <li key={c.id} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-vanilla font-serif text-bordo">
                    {c.nome.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {c.nome}
                    </p>
                    <p className="text-[11px] text-cocoa/50">{c.telefone}</p>
                  </div>
                  <span className="text-[11px] text-cocoa/40">
                    {c.criadoEm.toLocaleDateString("pt-BR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
