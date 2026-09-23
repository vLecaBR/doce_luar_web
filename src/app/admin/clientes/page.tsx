import { listarClientes } from "@/lib/actions/clientes";
import { listarSegmentos } from "@/lib/actions/segmentos";
import { ClientesManager } from "./clientes-manager";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const [clientes, segmentos] = await Promise.all([
    listarClientes(),
    listarSegmentos(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-caramel">
          Cadastro
        </p>
        <h1 className="mt-1.5 font-serif text-3xl text-ink md:text-4xl">
          Clientes
        </h1>
        <p className="mt-2 text-sm text-cocoa/60">
          Contatos que recebem os disparos do WhatsApp.
        </p>
      </div>

      <ClientesManager
        clientesIniciais={clientes.map((c) => ({
          id: c.id,
          nome: c.nome,
          telefone: c.telefone,
          email: c.email,
          notas: c.notas,
          ativo: c.ativo,
          segmentoId: c.segmentoId,
          segmentoNome: c.segmento?.nome ?? null,
        }))}
        segmentos={segmentos.map((s) => ({ id: s.id, nome: s.nome }))}
      />
    </div>
  );
}
