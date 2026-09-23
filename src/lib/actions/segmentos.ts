'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const PATH = '/admin/segmentos';

export type AcaoResultado = { ok?: boolean; error?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autorizado.');
}

export async function listarSegmentos() {
  return prisma.segmento.findMany({
    orderBy: { nome: 'asc' },
    include: { _count: { select: { clientes: true } } },
  });
}

export async function criarSegmento(
  formData: FormData,
): Promise<AcaoResultado> {
  await requireUser();
  const nome = String(formData.get('nome') ?? '').trim();
  if (!nome) return { error: 'Nome é obrigatório.' };
  try {
    await prisma.segmento.create({ data: { nome } });
    revalidatePath(PATH);
    return { ok: true };
  } catch (e: any) {
    if (e?.code === 'P2002') return { error: 'Já existe um segmento com esse nome.' };
    return { error: 'Erro ao criar segmento.' };
  }
}

export async function atualizarSegmento(
  id: string,
  formData: FormData,
): Promise<AcaoResultado> {
  await requireUser();
  const nome = String(formData.get('nome') ?? '').trim();
  if (!nome) return { error: 'Nome é obrigatório.' };
  try {
    await prisma.segmento.update({ where: { id }, data: { nome } });
    revalidatePath(PATH);
    return { ok: true };
  } catch (e: any) {
    if (e?.code === 'P2002') return { error: 'Já existe um segmento com esse nome.' };
    return { error: 'Erro ao atualizar segmento.' };
  }
}

// Ao excluir, os clientes ficam sem segmento (onDelete: SetNull no schema).
export async function removerSegmento(id: string): Promise<void> {
  await requireUser();
  await prisma.segmento.delete({ where: { id } });
  revalidatePath(PATH);
}
