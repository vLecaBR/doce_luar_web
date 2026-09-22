import { listarClientes } from "@/lib/actions/clientes";
import { ClientesManager } from "./clientes-manager";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await listarClientes();

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

      <ClientesManager clientesIniciais={clientes} />
    </div>
  );
}
