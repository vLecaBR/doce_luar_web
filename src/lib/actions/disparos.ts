'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

const PATH = '/admin/disparos';
const BUCKET = 'campanhas';

export type AcaoResultado = { ok?: boolean; error?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autorizado.');
}

async function uploadImagem(imagem: File): Promise<string> {
  const supabaseAdmin = getSupabaseAdmin();
  const ext = (imagem.name.split('.').pop() || 'jpg').toLowerCase();
  const nome = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(nome, imagem, {
    contentType: imagem.type || 'image/jpeg',
    upsert: false,
  });
  if (error) throw new Error('upload');
  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(nome);
  return data.publicUrl;
}

export async function lerBotStatus() {
  const s = await prisma.botStatus.findUnique({ where: { id: 'whatsapp' } });
  return { estado: s?.estado ?? 'desconectado', qr: s?.qr ?? null };
}

export async function listarDisparos() {
  return prisma.disparo.findMany({ orderBy: { criadoEm: 'desc' }, take: 15 });
}

export async function listarCampanhas() {
  return prisma.campanha.findMany({ orderBy: { criadoEm: 'desc' } });
}

// Resolve para quem o disparo vai, a partir do modo escolhido na tela.
async function resolverDestino(
  formData: FormData,
): Promise<
  { destinatarios: string[]; descricao: string; total: number } | { error: string }
> {
  const modo = String(formData.get('modo') ?? 'todos');

  if (modo === 'segmento') {
    const segmentoId = String(formData.get('segmentoId') ?? '');
    if (!segmentoId) return { error: 'Escolha um segmento.' };
    const seg = await prisma.segmento.findUnique({ where: { id: segmentoId } });
    const clientes = await prisma.cliente.findMany({
      where: { segmentoId, ativo: true },
      select: { id: true },
    });
    if (clientes.length === 0)
      return { error: 'Esse segmento não tem clientes ativos.' };
    return {
      destinatarios: clientes.map((c) => c.id),
      descricao: `Segmento: ${seg?.nome ?? '—'} (${clientes.length})`,
      total: clientes.length,
    };
  }

  if (modo === 'pessoas') {
    const pessoas = formData.getAll('pessoas').map(String).filter(Boolean);
    if (pessoas.length === 0)
      return { error: 'Selecione ao menos um cliente.' };
    return {
      destinatarios: pessoas,
      descricao: `${pessoas.length} cliente(s) selecionado(s)`,
      total: pessoas.length,
    };
  }

  // todos
  const total = await prisma.cliente.count({ where: { ativo: true } });
  if (total === 0) return { error: 'Não há clientes ativos.' };
  return {
    destinatarios: [], // vazio = todos os ativos (o bot resolve na hora do envio)
    descricao: `Todos os clientes ativos (${total})`,
    total,
  };
}

export async function criarDisparo(formData: FormData): Promise<AcaoResultado> {
  await requireUser();
  const mensagem = String(formData.get('mensagem') ?? '').trim();
  const salvar = formData.get('salvar') === 'on';
  const titulo = String(formData.get('titulo') ?? '').trim();
  if (!mensagem) return { error: 'Escreva a mensagem.' };

  const destino = await resolverDestino(formData);
  if ('error' in destino) return { error: destino.error };

  const imagem = formData.get('imagem') as File | null;
  let imagemUrl: string | null = null;
  try {
    if (imagem && imagem.size > 0) imagemUrl = await uploadImagem(imagem);
  } catch {
    return { error: 'Falha no upload da imagem. Confira se o bucket "campanhas" existe e é público.' };
  }

  let campanhaId: string | null = null;
  if (salvar) {
    const camp = await prisma.campanha.create({
      data: { titulo: titulo || mensagem.slice(0, 40), mensagem, imagemUrl },
    });
    campanhaId = camp.id;
  }

  await prisma.disparo.create({
    data: {
      mensagem,
      imagemUrl,
      status: 'pendente',
      campanhaId,
      destinatarios: destino.destinatarios,
      descricaoDestino: destino.descricao,
      total: destino.total,
    },
  });
  revalidatePath(PATH);
  return { ok: true };
}

export async function reenviarCampanha(id: string): Promise<AcaoResultado> {
  await requireUser();
  const camp = await prisma.campanha.findUnique({ where: { id } });
  if (!camp) return { error: 'Campanha não encontrada.' };
  const total = await prisma.cliente.count({ where: { ativo: true } });
  await prisma.disparo.create({
    data: {
      mensagem: camp.mensagem,
      imagemUrl: camp.imagemUrl,
      status: 'pendente',
      campanhaId: camp.id,
      destinatarios: [],
      descricaoDestino: `Todos os clientes ativos (${total})`,
      total,
    },
  });
  revalidatePath(PATH);
  return { ok: true };
}

export async function removerCampanha(id: string): Promise<void> {
  await requireUser();
  await prisma.campanha.delete({ where: { id } });
  revalidatePath(PATH);
}
