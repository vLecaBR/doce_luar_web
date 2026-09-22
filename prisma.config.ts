// Config da CLI do Prisma.
// A CLI (migrate, db pull) usa a conexão DIRETA (DIRECT_URL, porta 5432).
// O runtime do app usa a DATABASE_URL (pooler 6543) definida no schema.prisma.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DIRECT_URL"),
  },
});
