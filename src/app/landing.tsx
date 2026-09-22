"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HERO_IMG } from "@/lib/site-data";

type Categoria = { id: string; label: string; priceLabel: string };
type Produto = {
  id: string;
  name: string;
  note: string;
  price: string;
  categoryId: string;
  img: string | null;
};

const MAPS_QUERY = encodeURIComponent(
  "Rua Abraão Caixe, 786, Ribeirão Preto, SP, 14020-630",
);
const MAPS_EMBED = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${seen ? "in" : ""} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function Landing({
  categorias,
  produtos,
  precoMinimo,
}: {
  categorias: Categoria[];
  produtos: Produto[];
  precoMinimo: string | null;
}) {
  const [parallax, setParallax] = useState(0);
  const [activeCat, setActiveCat] = useState<string>(categorias[0]?.id ?? "");

  useEffect(() => {
    const onScroll = () => setParallax(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Garante que a aba ativa exista (ex: após mudanças no cardápio).
  useEffect(() => {
    if (categorias.length && !categorias.some((c) => c.id === activeCat)) {
      setActiveCat(categorias[0].id);
    }
  }, [categorias, activeCat]);

  const visible = produtos.filter((p) => p.categoryId === activeCat);
  const gallery = produtos.filter((p) => p.img).slice(0, 6);

  return (
    <div className="min-h-screen w-full bg-cream text-ink">
      {/* Top bar */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-6 pb-2 md:px-10 md:pt-8">
        <span className="font-serif text-lg tracking-tight text-bordo md:text-2xl">
          Doce Luar<span className="hidden md:inline"> Confeitaria</span>
        </span>
        <nav className="hidden items-center gap-8 text-[13px] tracking-wide text-cocoa/70 md:flex">
          <a href="#vitrine" className="transition-colors hover:text-caramel">
            Vitrine
          </a>
          <a href="#comunidade" className="transition-colors hover:text-caramel">
            Comunidade
          </a>
          <a href="#local" className="transition-colors hover:text-caramel">
            Onde estamos
          </a>
        </nav>
        <a
          href="#"
          className="rounded-full bg-caramel px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-caramel-deep md:px-5 md:py-2.5 md:text-xs md:tracking-[0.14em] md:normal-case"
        >
          <span className="md:hidden">Confeitaria</span>
          <span className="hidden md:inline">Pedir no iFood</span>
        </a>
      </header>

      {/* ── HERO ────────────────────────────────── */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-4 px-6 pt-6 pb-14 md:grid-cols-2 md:gap-12 md:px-10 md:pt-14 md:pb-24">
        <div className="md:order-1">
          <p className="mb-5 text-[11px] uppercase tracking-[0.32em] text-caramel md:text-xs">
            Doce Luar Confeitaria · Ribeirão Preto
          </p>

          <h1 className="font-serif text-[42px] leading-[0.98] tracking-[-0.01em] text-ink sm:text-6xl lg:text-7xl">
            Doçura que
            <br />
            <span className="italic text-bordo">nasce à noite,</span>
            <br />
            feita à mão.
          </h1>

          <p className="mt-5 max-w-[15rem] text-[13px] leading-relaxed text-cocoa/70 md:max-w-md md:text-base">
            Bolos no pote, bolos gelados e outras delícias artesanais, feitos em
            pequenas fornadas com ingredientes de verdade e um cuidado que se
            sente na primeira colherada.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-11">
            <a
              href="#"
              className="group flex items-center justify-center gap-3 rounded-full bg-caramel px-6 py-4 text-sm font-medium tracking-wide text-cream shadow-[0_16px_30px_-12px_rgba(182,118,60,0.8)] transition-all duration-300 hover:bg-caramel-deep hover:shadow-[0_18px_34px_-10px_rgba(154,95,44,0.9)] active:scale-[0.98]"
            >
              Pedir agora no iFood
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#vitrine"
              className="hidden items-center justify-center rounded-full border border-cocoa/15 px-6 py-4 text-sm tracking-wide text-cocoa transition-colors hover:border-caramel hover:text-caramel sm:flex"
            >
              Ver a vitrine
            </a>
          </div>
        </div>

        <div className="relative mt-9 h-[340px] md:order-2 md:mt-0 md:h-[560px]">
          <div className="absolute right-0 top-6 h-[300px] w-[236px] overflow-hidden rounded-[999px_999px_28px_28px] bg-vanilla shadow-[0_30px_60px_-24px_rgba(110,39,57,0.45)] md:top-10 md:h-[500px] md:w-[380px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMG}
              alt="Trio de bolos no pote da Doce Luar Confeitaria"
              className="h-full w-full object-cover"
              style={{ transform: `translateY(${parallax * 0.08}px) scale(1.12)` }}
            />
          </div>

          <div className="absolute left-2 top-0 h-[190px] w-[150px] rounded-[24px] border border-caramel/40 md:left-0 md:h-[340px] md:w-[260px]" />

          {precoMinimo && (
            <div className="absolute left-1 bottom-2 rounded-2xl bg-bordo px-4 py-3 text-cream shadow-lg md:left-0 md:bottom-10 md:px-6 md:py-4">
              <p className="font-serif text-2xl leading-none md:text-4xl">
                {precoMinimo}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-cream/70 md:text-[10px]">
                a partir de
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── VITRINE / CARROSSEL ─────────────────── */}
      <section id="vitrine" className="pb-16 md:pb-28">
        <div className="mx-auto flex w-full max-w-6xl items-end justify-between px-6 md:px-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-caramel md:text-xs">
              A vitrine
            </p>
            <h2 className="mt-2 font-serif text-3xl leading-tight md:text-5xl">
              Sabores da <span className="italic">estação</span>
            </h2>
          </div>
          {categorias.length > 0 && (
            <span className="pb-1 text-[11px] tracking-wide text-cocoa/50 lg:hidden">
              arraste →
            </span>
          )}
        </div>

        {categorias.length === 0 ? (
          <p className="mx-auto mt-8 w-full max-w-6xl px-6 text-sm text-cocoa/50 md:px-10">
            Novos sabores chegando em breve 🍫
          </p>
        ) : (
          <>
            <div className="mx-auto mt-7 flex w-full max-w-6xl px-6 md:mt-10 md:px-10">
              <div className="inline-flex flex-wrap gap-1 rounded-full border border-cocoa/10 bg-white/50 p-1 backdrop-blur-sm">
                {categorias.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCat(c.id)}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                      activeCat === c.id
                        ? "bg-bordo text-cream"
                        : "text-cocoa/60 hover:text-caramel"
                    }`}
                  >
                    {c.label}
                    {c.priceLabel && (
                      <span
                        className={`ml-2 text-[11px] ${
                          activeCat === c.id ? "text-cream/70" : "text-cocoa/40"
                        }`}
                      >
                        {c.priceLabel}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="no-scrollbar mx-auto mt-6 flex w-full max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mt-8 md:gap-6 md:px-10 lg:grid lg:grid-cols-4 lg:overflow-visible">
              {visible.map((p, i) => (
                <Reveal
                  key={p.id}
                  delay={i * 90}
                  className="shrink-0 snap-start lg:shrink"
                >
                  <article className="group relative w-[214px] overflow-hidden rounded-[26px] border border-white/50 bg-white/45 p-3 shadow-[0_20px_44px_-26px_rgba(58,42,34,0.5)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 md:w-[260px] lg:w-full">
                    <div className="h-[210px] overflow-hidden rounded-[18px] bg-vanilla md:h-[280px]">
                      {p.img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.img}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-serif text-cocoa/30">
                          Doce Luar
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-between px-1 pt-4">
                      <div className="pr-2">
                        <h3 className="font-serif text-lg leading-tight md:text-xl">
                          {p.name}
                        </h3>
                        {p.note && (
                          <p className="mt-1 text-[11px] leading-snug text-cocoa/60 md:text-xs">
                            {p.note}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between px-1 pb-1">
                      <span className="font-serif text-xl text-bordo md:text-2xl">
                        {p.price}
                      </span>
                      <button
                        aria-label={`Adicionar ${p.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-caramel/50 text-lg text-caramel transition-colors duration-300 hover:bg-caramel hover:text-cream"
                      >
                        +
                      </button>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── COMUNIDADE / INSTAGRAM ──────────────── */}
      {gallery.length > 0 && (
        <section id="comunidade" className="bg-bordo py-16 text-cream md:py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 md:grid-cols-[1fr_1.4fr] md:items-center md:gap-16 md:px-10">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.3em] text-cream/60 md:text-xs">
                Comunidade
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">
                Feito para{" "}
                <span className="italic text-vanilla">dar água na boca</span>
              </h2>
              <a
                href="#"
                className="mt-4 inline-block text-sm tracking-wide text-vanilla underline decoration-vanilla/40 underline-offset-4 transition-colors hover:decoration-vanilla md:text-base"
              >
                @doceluarconfeitariarp
              </a>
            </Reveal>

            <div className="grid grid-cols-3 gap-2.5 md:gap-3">
              {gallery.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <div className="aspect-square overflow-hidden rounded-2xl bg-bordo-deep">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.img!}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LOCALIZAÇÃO & CONTATO ───────────────── */}
      <section id="local" className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-14">
          <Reveal>
            <div className="relative h-52 overflow-hidden rounded-[26px] border border-cocoa/10 bg-vanilla shadow-[0_20px_44px_-26px_rgba(58,42,34,0.5)] md:h-[420px] md:order-2">
              <iframe
                title="Mapa — Doce Luar Confeitaria"
                src={MAPS_EMBED}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 rounded-full bg-bordo px-4 py-2 text-[11px] font-medium tracking-wide text-cream shadow-lg transition-colors hover:bg-bordo-deep"
              >
                Abrir no Maps →
              </a>
            </div>
          </Reveal>

          <div className="md:order-1">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.3em] text-caramel md:text-xs">
                Retirada em Ribeirão
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">
                Só passar <span className="italic">e buscar</span>
              </h2>
              <p className="mt-4 max-w-md text-[13px] leading-relaxed text-cocoa/70 md:text-base">
                Não temos espaço físico para consumo — trabalhamos apenas com
                retirada. Faça seu pedido pelo WhatsApp ou iFood.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-6 border-l-2 border-caramel/50 pl-4 md:mt-8">
                <p className="font-serif text-lg leading-snug md:text-2xl">
                  Rua Abraão Caixe, 786
                </p>
                <p className="text-sm text-cocoa/60 md:text-base">
                  Ribeirão Preto, SP · CEP 14020-630
                </p>
                <p className="text-sm text-cocoa/60 md:text-base">
                  Ponto de retirada
                </p>
                <p className="mt-2 text-[12px] uppercase tracking-[0.2em] text-caramel">
                  Todos os dias · 10h às 23h45
                </p>
              </div>
            </Reveal>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
              <a
                href="#"
                className="flex items-center justify-center gap-2 rounded-full border border-cocoa/15 bg-white/50 py-3.5 text-sm font-medium text-cocoa transition-all duration-300 hover:border-caramel hover:text-caramel active:scale-[0.98]"
              >
                WhatsApp
              </a>
              <a
                href="#"
                className="flex items-center justify-center gap-2 rounded-full bg-bordo py-3.5 text-sm font-medium text-cream transition-all duration-300 hover:bg-bordo-deep active:scale-[0.98]"
              >
                iFood
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cocoa/10 px-6 py-10 text-center md:py-14">
        <p className="font-serif text-2xl text-bordo md:text-3xl">
          Doce Luar Confeitaria
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-caramel">
          Bolos no pote · bolos gelados · doces artesanais
        </p>
        <p className="mt-5 text-[11px] text-cocoa/40">
          © 2026 Doce Luar Confeitaria · feito com carinho ·{" "}
          <Link
            href="/admin"
            className="underline decoration-cocoa/20 underline-offset-2 transition-colors hover:text-caramel"
          >
            Área administrativa
          </Link>
        </p>
      </footer>
    </div>
  );
}
