'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const PATH = '/admin/clientes';

export type AcaoResultado = { ok?: boolean; error?: string };

// Defesa em profundidade: server action é um endpoint chamável direto,
// então validamos a sessão antes de qualquer escrita (além do middleware).
async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autorizado.');
}

function limparTelefone(t: string) {
  return t.replace(/\D/g, '');
}

function validar(nome: string, telefone: string): string | null {
  if (!nome) return 'Nome é obrigatório.';
  if (telefone.length < 12 || telefone.length > 13) {
    return 'Telefone inválido. Use o formato internacional, ex: 5516988063501.';
  }
  return null;
}

export async function listarClientes() {
  return prisma.cliente.findMany({ orderBy: { nome: 'asc' } });
}

export async function criarCliente(formData: FormData): Promise<AcaoResultado> {
  await requireUser();

  const nome = String(formData.get('nome') ?? '').trim();
  const telefone = limparTelefone(String(formData.get('telefone') ?? ''));
  const email = String(formData.get('email') ?? '').trim() || null;
  const notas = String(formData.get('notas') ?? '').trim() || null;

  const erro = validar(nome, telefone);
  if (erro) return { error: erro };

  try {
    await prisma.cliente.create({ data: { nome, telefone, email, notas } });
    revalidatePath(PATH);
    return { ok: true };
  } catch (e: any) {
    if (e?.code === 'P2002') return { error: 'Já existe um cliente com esse telefone.' };
    return { error: 'Erro ao criar cliente.' };
  }
}

export async function atualizarCliente(
  id: string,
  formData: FormData,
): Promise<AcaoResultado> {
  await requireUser();

  const nome = String(formData.get('nome') ?? '').trim();
  const telefone = limparTelefone(String(formData.get('telefone') ?? ''));
  const email = String(formData.get('email') ?? '').trim() || null;
  const notas = String(formData.get('notas') ?? '').trim() || null;

  const erro = validar(nome, telefone);
  if (erro) return { error: erro };

  try {
    await prisma.cliente.update({
      where: { id },
      data: { nome, telefone, email, notas },
    });
    revalidatePath(PATH);
    return { ok: true };
  } catch (e: any) {
    if (e?.code === 'P2002') return { error: 'Já existe um cliente com esse telefone.' };
    return { error: 'Erro ao atualizar cliente.' };
  }
}

export async function alternarAtivo(id: string, ativo: boolean): Promise<void> {
  await requireUser();
  await prisma.cliente.update({ where: { id }, data: { ativo } });
  revalidatePath(PATH);
}

export async function removerCliente(id: string): Promise<void> {
  await requireUser();
  await prisma.cliente.delete({ where: { id } });
  revalidatePath(PATH);
}
