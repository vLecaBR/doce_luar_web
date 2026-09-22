'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
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
  return {
    estado: s?.estado ?? 'desconectado',
    qr: s?.qr ?? null,
  };
}

export async function listarDisparos() {
  return prisma.disparo.findMany({ orderBy: { criadoEm: 'desc' }, take: 15 });
}

export async function listarCampanhas() {
  return prisma.campanha.findMany({ orderBy: { criadoEm: 'desc' } });
}

export async function criarDisparo(formData: FormData): Promise<AcaoResultado> {
  await requireUser();
  const mensagem = String(formData.get('mensagem') ?? '').trim();
  const salvar = formData.get('salvar') === 'on';
  const titulo = String(formData.get('titulo') ?? '').trim();
  if (!mensagem) return { error: 'Escreva a mensagem.' };

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
    data: { mensagem, imagemUrl, status: 'pendente', campanhaId },
  });
  revalidatePath(PATH);
  return { ok: true };
}

export async function reenviarCampanha(id: string): Promise<AcaoResultado> {
  await requireUser();
  const camp = await prisma.campanha.findUnique({ where: { id } });
  if (!camp) return { error: 'Campanha não encontrada.' };
  await prisma.disparo.create({
    data: {
      mensagem: camp.mensagem,
      imagemUrl: camp.imagemUrl,
      status: 'pendente',
      campanhaId: camp.id,
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
