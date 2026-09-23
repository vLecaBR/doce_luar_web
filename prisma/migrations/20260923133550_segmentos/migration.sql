-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "segmentoId" TEXT;

-- AlterTable
ALTER TABLE "disparos" ADD COLUMN     "descricaoDestino" TEXT,
ADD COLUMN     "destinatarios" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "segmentos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "segmentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "segmentos_nome_key" ON "segmentos"("nome");

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_segmentoId_fkey" FOREIGN KEY ("segmentoId") REFERENCES "segmentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
