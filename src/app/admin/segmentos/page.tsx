import { listarSegmentos } from "@/lib/actions/segmentos";
import { SegmentosManager } from "./segmentos-manager";

export const dynamic = "force-dynamic";

export default async function SegmentosPage() {
  const segmentos = await listarSegmentos();

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-caramel">
          Clientes
        </p>
        <h1 className="mt-1.5 font-serif text-3xl text-ink md:text-4xl">
          Segmentos
        </h1>
        <p className="mt-2 text-sm text-cocoa/60">
          Categorias de cliente (ex: Condomínio, Academia) para disparar
          mensagens a grupos específicos.
        </p>
      </div>

      <SegmentosManager
        segmentosIniciais={segmentos.map((s) => ({
          id: s.id,
          nome: s.nome,
          clientesCount: s._count.clientes,
        }))}
      />
    </div>
  );
}
