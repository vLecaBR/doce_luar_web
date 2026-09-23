import {
  lerBotStatus,
  listarDisparos,
  listarCampanhas,
} from "@/lib/actions/disparos";
import { listarClientes } from "@/lib/actions/clientes";
import { listarSegmentos } from "@/lib/actions/segmentos";
import { StatusWhatsapp } from "./status-whatsapp";
import { DisparosManager } from "./disparos-manager";

export const dynamic = "force-dynamic";

export default async function DisparosPage() {
  const [status, disparos, campanhas, clientes, segmentos] = await Promise.all([
    lerBotStatus(),
    listarDisparos(),
    listarCampanhas(),
    listarClientes(),
    listarSegmentos(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-caramel">
          WhatsApp
        </p>
        <h1 className="mt-1.5 font-serif text-3xl text-ink md:text-4xl">
          Disparos
        </h1>
        <p className="mt-2 text-sm text-cocoa/60">
          Envie uma mensagem (com imagem, se quiser) para todos, um segmento ou
          pessoas específicas.
        </p>
      </div>

      <div className="space-y-8">
        <StatusWhatsapp inicial={status} />
        <DisparosManager
          disparosIniciais={disparos}
          campanhas={campanhas}
          clientes={clientes.map((c) => ({
            id: c.id,
            nome: c.nome,
            telefone: c.telefone,
            ativo: c.ativo,
            segmentoNome: c.segmento?.nome ?? null,
          }))}
          segmentos={segmentos.map((s) => ({
            id: s.id,
            nome: s.nome,
            clientesCount: s._count.clientes,
          }))}
        />
      </div>
    </div>
  );
}
