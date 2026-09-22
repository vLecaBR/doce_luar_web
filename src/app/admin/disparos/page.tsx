import {
  lerBotStatus,
  listarDisparos,
  listarCampanhas,
} from "@/lib/actions/disparos";
import { StatusWhatsapp } from "./status-whatsapp";
import { DisparosManager } from "./disparos-manager";

export const dynamic = "force-dynamic";

export default async function DisparosPage() {
  const [status, disparos, campanhas] = await Promise.all([
    lerBotStatus(),
    listarDisparos(),
    listarCampanhas(),
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
          Envie uma mensagem (com imagem, se quiser) para todos os clientes
          ativos, quando você quiser.
        </p>
      </div>

      <div className="space-y-8">
        <StatusWhatsapp inicial={status} />
        <DisparosManager
          disparosIniciais={disparos}
          campanhas={campanhas}
        />
      </div>
    </div>
  );
}
