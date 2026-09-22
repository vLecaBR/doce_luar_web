"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Smartphone, CheckCircle2, WifiOff } from "lucide-react";
import { lerBotStatus } from "@/lib/actions/disparos";

type Status = { estado: string; qr: string | null };

export function StatusWhatsapp({ inicial }: { inicial: Status }) {
  const [status, setStatus] = useState<Status>(inicial);

  useEffect(() => {
    const t = setInterval(async () => {
      try {
        setStatus(await lerBotStatus());
      } catch {
        // ignora falha pontual de rede
      }
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-3xl border border-white/60 bg-white/55 p-6 backdrop-blur-sm">
      <h2 className="mb-4 font-serif text-lg text-ink">Status do WhatsApp</h2>

      {status.estado === "conectado" && (
        <div className="flex items-center gap-3 rounded-2xl bg-bordo/5 px-4 py-4 text-bordo">
          <CheckCircle2 size={22} />
          <div>
            <p className="text-sm font-medium">Conectado</p>
            <p className="text-xs text-cocoa/60">
              O bot está pronto para disparar.
            </p>
          </div>
        </div>
      )}

      {status.estado === "qr" && status.qr && (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="rounded-2xl bg-white p-3">
            <QRCode value={status.qr} size={168} />
          </div>
          <div className="text-center sm:text-left">
            <div className="mb-1 flex items-center justify-center gap-2 text-caramel sm:justify-start">
              <Smartphone size={18} />
              <p className="text-sm font-medium">Escaneie para conectar</p>
            </div>
            <p className="text-xs text-cocoa/60">
              No celular: WhatsApp → Aparelhos conectados → Conectar um
              aparelho, e aponte para este QR.
            </p>
          </div>
        </div>
      )}

      {status.estado === "desconectado" && (
        <div className="flex items-center gap-3 rounded-2xl bg-cocoa/5 px-4 py-4 text-cocoa/70">
          <WifiOff size={22} />
          <div>
            <p className="text-sm font-medium">Desconectado</p>
            <p className="text-xs text-cocoa/60">
              Verifique se o bot está rodando no computador. O QR aparece aqui
              quando ele precisar reconectar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
