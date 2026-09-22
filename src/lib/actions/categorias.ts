'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const PATH = '/admin/categorias';

export type AcaoResultado = { ok?: boolean; error?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autorizado.');
}

export async function listarCategorias() {
  return prisma.categoria.findMany({
    orderBy: [{ ordem: 'asc' }, { nome: 'asc' }],
    include: { _count: { select: { produtos: true } } },
  });
}

export async function criarCategoria(
  formData: FormData,
): Promise<AcaoResultado> {
  await requireUser();
  const nome = String(formData.get('nome') ?? '').trim();
  const ordem = Number(formData.get('ordem') ?? 0) || 0;
  if (!nome) return { error: 'Nome é obrigatório.' };

  await prisma.categoria.create({ data: { nome, ordem } });
  revalidatePath(PATH);
  return { ok: true };
}

export async function atualizarCategoria(
  id: string,
  formData: FormData,
): Promise<AcaoResultado> {
  await requireUser();
  const nome = String(formData.get('nome') ?? '').trim();
  const ordem = Number(formData.get('ordem') ?? 0) || 0;
  if (!nome) return { error: 'Nome é obrigatório.' };

  await prisma.categoria.update({ where: { id }, data: { nome, ordem } });
  revalidatePath(PATH);
  return { ok: true };
}

export async function removerCategoria(id: string): Promise<AcaoResultado> {
  await requireUser();
  try {
    await prisma.categoria.delete({ where: { id } });
    revalidatePath(PATH);
    return { ok: true };
  } catch (e: any) {
    // P2003 = violação de foreign key (categoria com produtos vinculados)
    if (e?.code === 'P2003') {
      return {
        error:
          'Essa categoria tem produtos vinculados. Mova ou remova os produtos antes.',
      };
    }
    return { error: 'Erro ao remover categoria.' };
  }
}
